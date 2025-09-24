import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { IdempotencyKey } from '../common/entities/idempotency-key.entity';
import { ItemsService } from './items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Item, 
      IdempotencyKey
    ])
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
