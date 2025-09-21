import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { PackingService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [PackingService]
})
export class OrdersModule {}
