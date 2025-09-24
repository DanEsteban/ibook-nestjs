import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InvoiceLine } from 'src/invoices/entities/invoice-line.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { DataSource } from 'typeorm/browser';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private repo: Repository<Item>,
  ) {}

  async upsertMany(records: any[]) {
    if (!records || records.length === 0) {
      console.log('⚠️ No hay items para procesar');
      return { ok: true, saved: 0 };
    }

    console.log(`🔄 Procesando ${records.length} items...`);

    try {
      const entities: Item[] = [];

      for (let i = 0; i < records.length; i++) {
        const item = records[i];
        
        if (!item.ListID) {
          console.log(`⚠️ Item sin ListID en índice ${i}, saltando...`);
          continue;
        }

        const entity = this.repo.create({
          ListID: item.ListID,
          Name: item.Name || null,
          FullName: item.FullName || null,
          IsActive: item.IsActive !== undefined ? !!item.IsActive : true,
          ManufacturerPartNumber: item.ManufacturerPartNumber || null,
          SalesDesc: item.SalesDesc || null,
          SalesPrice: parseFloat(item.SalesPrice) || 0,
          QuantityOnHand: parseFloat(item.QuantityOnHand) || 0,
          TimeModified: item.TimeModified || null,
        });

        entities.push(entity);
      }

      if (entities.length === 0) {
        console.log('⚠️ No hay items válidos para guardar');
        return { ok: true, saved: 0 };
      }

      await this.repo.save(entities);
      console.log(`✅ ${entities.length} items guardados exitosamente`);
      
      return { ok: true, saved: entities.length };
    } catch (error) {
      console.error(`❌ Error guardando items: ${error.message}`);
      throw error;
    }
  }
}