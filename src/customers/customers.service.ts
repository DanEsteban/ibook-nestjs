import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  async upsertMany(records: any[]) {
    if (!records || records.length === 0) {
      console.log('⚠️ No hay registros para procesar');
      return { ok: true, saved: 0 };
    }

    console.log(`🔄 Procesando ${records.length} customers...`);

    try {
      const entities: Customer[] = [];

      for (let i = 0; i < records.length; i++) {
        const c = records[i];
        
        if (!c.ListID) {
          console.log(`⚠️ Customer sin ListID en índice ${i}, saltando...`);
          continue;
        }

        const entity = this.repo.create({
          ListID: c.ListID,
          Name: c.Name || null,
          FullName: c.FullName || null,
          IsActive: c.IsActive !== undefined ? !!c.IsActive : true,
          CompanyName: c.CompanyName || null,
          Phone: c.Phone || null,
          Email: c.Email || null,
          BillAddr1: c.BillAddress?.Addr1 || null,
          BillCity: c.BillAddress?.City || null,
          BillState: c.BillAddress?.State || null,
          BillPostalCode: c.BillAddress?.PostalCode || null,
          BillCountry: c.BillAddress?.Country || null,
          TimeModified: c.TimeModified || null,
        });

        entities.push(entity);
      }

      if (entities.length === 0) {
        console.log('⚠️ No hay entidades válidas para guardar');
        return { ok: true, saved: 0 };
      }

      await this.repo.save(entities);
      console.log(`✅ ${entities.length} customers guardados exitosamente`);
      
      return { ok: true, saved: entities.length };
    } catch (error) {
      console.error(`❌ Error guardando customers: ${error.message}`);
      throw error;
    }
  }
}