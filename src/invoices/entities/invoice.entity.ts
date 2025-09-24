import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { InvoiceLine } from './invoice-line.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  TxnID: string;

  @Column({ type: 'date', nullable: true })
  TxnDate: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  RefNumber: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  CustomerListID: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  CustomerFullName: string | null;

  @Column({ type: 'real', default: 0 })
  Subtotal: number;

  @Column({ type: 'real', default: 0 })
  SalesTaxTotal: number;

  @Column({ type: 'real', default: 0 })
  TotalAmount: number;

  @Column({ type: 'real', default: 0 })
  BalanceRemaining: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  Memo: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  TimeModified: string | null;

  @OneToMany(() => InvoiceLine, (l) => l.invoice, { cascade: true })
  Lines: InvoiceLine[];
}