import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('idempotency_keys')
export class IdempotencyKey {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  key: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scope?: string;
}