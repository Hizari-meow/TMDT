import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderQueueProducer } from './producers/order-queue.producer';
import { OrderProcessingConsumer } from './consumers/order-processing.consumer';
import { OrderTimeoutConsumer } from './consumers/order-timeout.consumer';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [OrderQueueProducer, OrderProcessingConsumer, OrderTimeoutConsumer],
  exports: [OrderQueueProducer],
})
export class QueueModule {}
