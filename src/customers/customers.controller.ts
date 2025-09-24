import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { IdempotencyInterceptor } from 'src/common/interceptors/idempotency.interceptor';
import { ImportCustomersDto } from './dto/customer.dto';


@Controller('import')
@UseGuards(ApiKeyGuard)
@UseInterceptors(IdempotencyInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('customers')
  @HttpCode(HttpStatus.OK)
  async importCustomers(@Body() dto: ImportCustomersDto) {
    console.log(`📥 Recibiendo batch de customers: ${dto.records.length} registros`);
    console.log(`📋 Meta: ticket=${dto.meta.ticket}, seq=${dto.meta.seq}`);
    
    try {
      const result = await this.customersService.upsertMany(dto.records);
      console.log(`✅ Customers procesados: ${result.saved} registros`);
      return result;
    } catch (error) {
      console.error(`❌ Error procesando customers: ${error.message}`);
      throw error;
    }
  }

  @Post('customers/done')
  @HttpCode(HttpStatus.OK)
  async customersComplete(@Body() dto: Pick<ImportCustomersDto, 'meta' | 'done'>) {
    console.log(`🎯 Importación de customers completada para ticket: ${dto.meta.ticket}`);
    return { ok: true, message: 'Import completed' };
  }
}
