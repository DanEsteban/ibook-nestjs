import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceLine } from './entities/invoice-line.entity';
import { IdempotencyKey } from 'src/common/entities/idempotency-key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice, 
      InvoiceLine, 
      IdempotencyKey,
    ])
  ],

  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
