import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { ImportItemsDto } from './dto/items.dto';

@Controller('import')
@UseGuards(ApiKeyGuard)
@UseInterceptors(IdempotencyInterceptor)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('items')
  @HttpCode(HttpStatus.OK)
  async importItems(@Body() dto: ImportItemsDto) {
    console.log(`📥 Recibiendo batch de items: ${dto.records.length} registros`);
    console.log(`📋 Meta: ticket=${dto.meta.ticket}, seq=${dto.meta.seq}`);
    
    try {
      const result = await this.itemsService.upsertMany(dto.records);
      console.log(`✅ Items procesados: ${result.saved} registros`);
      return result;
    } catch (error) {
      console.error(`❌ Error procesando items: ${error.message}`);
      throw error;
    }
  }

  @Post('items/done')
  @HttpCode(HttpStatus.OK)
  async itemsComplete(@Body() dto: Pick<ImportItemsDto, 'meta' | 'done'>) {
    console.log(`🎯 Importación de items completada para ticket: ${dto.meta.ticket}`);
    return { ok: true, message: 'Items import completed' };
  }
}