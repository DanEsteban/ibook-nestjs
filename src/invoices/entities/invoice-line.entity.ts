import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('invoice_lines')
export class InvoiceLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  TxnLineID: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ItemListID: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ItemFullName: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  Desc: string | null;

  @Column({ type: 'real', nullable: true })
  Quantity: number | null;

  @Column({ type: 'real', nullable: true })
  Rate: number | null;

  @Column({ type: 'real', nullable: true })
  Amount: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  UnitOfMeasure: string | null;

  // Clave foránea para la relación
  @Column({ type: 'varchar', length: 50 })
  invoiceTxnID: string;

  @ManyToOne(() => Invoice, (inv) => inv.Lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceTxnID' })
  invoice: Invoice;
}