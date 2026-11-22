import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderSseService } from './sse/order-sse.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderSseService],
  exports: [OrdersService],
})
export class OrdersModule {}
