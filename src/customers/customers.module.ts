import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { IdempotencyKey } from '../common/entities/idempotency-key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer, 
      IdempotencyKey
    ])
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
