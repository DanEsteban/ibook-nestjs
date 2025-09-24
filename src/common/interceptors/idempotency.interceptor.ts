import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdempotencyKey } from '../entities/idempotency-key.entity';
import { Observable, from, switchMap } from 'rxjs';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly repo: Repository<IdempotencyKey>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const key =
      req.headers['idempotency-key'] || req.headers['Idempotency-Key'];

    if (!key) {
      console.log('No se encontró Idempotency-Key, continuando...');
      return next.handle();
    }

    console.log(`🔄 Verificando idempotency key: ${key}`);

    try {
      // Verificar si ya existe
      const found = await this.repo.findOne({ where: { key } });

      if (found) {
        console.log(`⚠️ Duplicate idempotency key: ${key}`);
        throw new ConflictException('Duplicate idempotency key');
      }

      // Crear y guardar nueva key
      const scope = req.route?.path?.toString() || 'unknown';
      const rec = this.repo.create({ key, scope });
      await this.repo.save(rec);

      console.log(`✅ Idempotency key guardada: ${key}`);
      return next.handle();
    } catch (error) {
      console.error(`❌ Error en IdempotencyInterceptor: ${error.message}`);
      throw error;
    }
  }
}
