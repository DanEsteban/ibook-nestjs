import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ImportInvoicesDto } from './dto/invoice.dto';

@Controller('import')
@UseGuards(ApiKeyGuard)
@UseInterceptors(IdempotencyInterceptor)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('invoices')
  @HttpCode(HttpStatus.OK)
  async importInvoices(@Body() dto: ImportInvoicesDto) {
    console.log(`📥 Recibiendo batch de invoices: ${dto.records.length} registros`);
    console.log(`📋 Meta: ticket=${dto.meta.ticket}, seq=${dto.meta.seq}`);
    
    try {
      const result = await this.invoicesService.upsertMany(dto.records);
      console.log(`✅ Invoices procesados: ${result.saved} registros`);
      return result;
    } catch (error) {
      console.error(`❌ Error procesando invoices: ${error.message}`);
      throw error;
    }
  }

  @Post('invoices/done')
  @HttpCode(HttpStatus.OK)
  async invoicesComplete(@Body() dto: Pick<ImportInvoicesDto, 'meta' | 'done'>) {
    console.log(`🎯 Importación de invoices completada para ticket: ${dto.meta.ticket}`);
    return { ok: true, message: 'Invoices import completed' };
  }
}
