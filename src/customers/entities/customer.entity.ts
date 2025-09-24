import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  ListID: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Name: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  FullName: string | null;

  @Column({ type: 'boolean', default: true })
  IsActive: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  CompanyName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Phone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  Email: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  BillAddr1: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  BillCity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  BillState: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  BillPostalCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  BillCountry: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  TimeModified: string | null;
}