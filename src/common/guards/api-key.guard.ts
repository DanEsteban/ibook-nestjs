import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] || req.headers['X-API-Key'];
    const expected = process.env.API_KEY;
    
    console.log('🔑 API Key recibida:', apiKey);
    console.log('🔑 API Key esperada:', expected);
    
    if (!expected || !apiKey || apiKey !== expected) {
      console.error('❌ API Key inválida o faltante');
      throw new UnauthorizedException('Invalid API key');
    }
    
    console.log('✅ API Key válida');
    return true;
  }
}