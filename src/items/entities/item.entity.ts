import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  ListID: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Name: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  FullName: string | null;

  @Column({ type: 'boolean', default: true })
  IsActive: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ManufacturerPartNumber: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  SalesDesc: string | null;

  @Column({ type: 'real', default: 0 })
  SalesPrice: number;

  @Column({ type: 'real', default: 0 })
  QuantityOnHand: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  TimeModified: string | null;
}
