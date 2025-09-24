import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceLine } from './entities/invoice-line.entity';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceLine)
    private lineRepo: Repository<InvoiceLine>,
    private dataSource: DataSource,
  ) {}

  // Helpers seguros
  private ensureArray<T>(value: unknown): T[] {
    if (value == null) return [];
    return Array.isArray(value) ? (value as T[]) : [value as T];
  }

  private getLinesFromRecord(inv: Record<string, any>): any[] {
    const candidates = [
      'InvoiceLineRet',
      'InvoiceLine',
      'Lines',
      'InvoiceLines',
      'LineItems',
      'items',
    ] as const;

    for (const field of candidates) {
      const found = inv[field];
      if (found != null) {
        return this.ensureArray<any>(found);
      }
    }
    return [];
  }

  async upsertMany(records: any[]) {
    if (!records || records.length === 0) {
      console.log('⚠️ No hay invoices para procesar');
      return { ok: true, saved: 0 };
    }

    console.log(`🔄 Procesando ${records.length} invoices...`);
    console.log('🔍 Estructura del primer invoice:', JSON.stringify(records[0], null, 2));

    return await this.dataSource.transaction(async (manager) => {
      let savedCount = 0;

      for (let i = 0; i < records.length; i++) {
        const inv = records[i] as Record<string, any>;

        if (!inv.TxnID) {
          console.log(`⚠️ Invoice sin TxnID en índice ${i}, saltando...`);
          continue;
        }

        try {
          // --- INVOICE ---
          const invoiceEntity = this.invoiceRepo.create({
            TxnID: inv.TxnID,
            TxnDate: inv.TxnDate ?? null,
            RefNumber: inv.RefNumber ?? null,
            CustomerListID: inv.CustomerRef?.ListID ?? null,
            CustomerFullName: inv.CustomerRef?.FullName ?? null,
            Subtotal: Number(inv.Subtotal ?? 0),
            SalesTaxTotal: Number(inv.SalesTaxTotal ?? 0),
            TotalAmount: Number(inv.TotalAmount ?? 0),
            BalanceRemaining: Number(inv.BalanceRemaining ?? 0),
            Memo: inv.Memo ?? null,
            TimeModified: inv.TimeModified ?? null,
          });

          await manager.save(Invoice, invoiceEntity);
          console.log(`✅ Invoice ${inv.TxnID} guardada`);

          console.log(`🔍 Propiedades del invoice ${inv.TxnID}:`, Object.keys(inv));

          // --- LÍNEAS (siempre array, nunca null) ---
          const lines = this.getLinesFromRecord(inv);
          console.log(
            `📋 Líneas detectadas para ${inv.TxnID}: ${lines.length}`,
          );

          if (lines.length === 0) {
            console.log(`⚠️ No se encontraron líneas para invoice ${inv.TxnID}`);
            savedCount++;
            continue;
          }

          console.log(`🔄 Procesando ${lines.length} líneas para invoice ${inv.TxnID}`);

          const lineEntities: InvoiceLine[] = [];

          for (let j = 0; j < lines.length; j++) {
            const line = lines[j] as Record<string, any>;
            console.log(`🔍 Línea ${j}:`, JSON.stringify(line, null, 2));

            const lineEntity = this.lineRepo.create({
              TxnLineID: line.TxnLineID ?? null,
              ItemListID: line.ItemRef?.ListID ?? line.ItemListID ?? null,
              ItemFullName: line.ItemRef?.FullName ?? line.ItemFullName ?? null,
              Desc: line.Desc ?? line.Description ?? null,
              Quantity: line.Quantity != null ? Number(line.Quantity) : null,
              Rate: line.Rate != null ? Number(line.Rate) : null,
              Amount: line.Amount != null ? Number(line.Amount) : null,
              UnitOfMeasure: line.UnitOfMeasure ?? null,
              invoiceTxnID: inv.TxnID, // FK
            });

            lineEntities.push(lineEntity);
            console.log(`✅ Línea ${j} preparada:`, lineEntity);
          }

          if (lineEntities.length > 0) {
            await manager.save(InvoiceLine, lineEntities);
            console.log(`✅ Guardadas ${lineEntities.length} líneas para invoice ${inv.TxnID}`);
          } else {
            console.log(`⚠️ No hay líneas válidas para guardar en invoice ${inv.TxnID}`);
          }

          savedCount++;
        } catch (error: any) {
          console.error(`❌ Error guardando invoice ${inv.TxnID}: ${error.message}`);
          console.error('Stack trace:', error.stack);
          throw error; // revienta la tx para mantener atomicidad
        }
      }

      console.log(`✅ ${savedCount} invoices guardados exitosamente`);
      return { ok: true, saved: savedCount };
    });
  }
}
