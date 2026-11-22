import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import { QUEUE_NAMES, QUEUE_SETTINGS } from '../../common/constants/queues.constant';
import { OrderTimeoutPayload } from '../producers/order-queue.producer';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class OrderTimeoutConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderTimeoutConsumer.name);
  private worker: Worker<OrderTimeoutPayload>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const password = this.configService.get<string>('REDIS_PASSWORD', 'redis_secure_password');

    this.worker = new Worker<OrderTimeoutPayload>(
      QUEUE_NAMES.ORDER_TIMEOUT,
      async (job: Job<OrderTimeoutPayload>) => {
        return await this.handleOrderTimeout(job.data);
      },
      {
        connection: { host, port, password },
        concurrency: QUEUE_SETTINGS.ORDER_TIMEOUT_CONCURRENCY,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.debug(`Timeout check job ${job.id} for trackingId ${job.data.trackingId} completed`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Timeout check job ${job?.id} failed: ${err.message}`, err.stack);
    });

    this.logger.log(`OrderTimeoutConsumer started with concurrency ${QUEUE_SETTINGS.ORDER_TIMEOUT_CONCURRENCY}`);
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async handleOrderTimeout(data: OrderTimeoutPayload) {
    const { trackingId, flashSaleId, productId, quantity } = data;

    // 1. Query order status across partitions
    const existingOrders = await this.prisma.$queryRaw<Array<{ id: string; status: string; created_at: Date }>>`
      SELECT id, status, created_at 
      FROM orders 
      WHERE tracking_id = ${trackingId}::uuid
      LIMIT 1
    `;

    if (!existingOrders || existingOrders.length === 0) {
      this.logger.warn(`No persisted order found for trackingId ${trackingId} during timeout check.`);
      return;
    }

    const order = existingOrders[0];

    // If order was already paid or settled, do not roll back
    if (order.status === 'PAID') {
      this.logger.log(`Order ${order.id} is already PAID. No rollback necessary.`);
      return;
    }

    if (order.status === 'PENDING_PAYMENT') {
      this.logger.warn(`Order ${order.id} unpaid after deadline. Commencing distributed compensation rollback.`);

      // 1. Cancel in database and restore mirror stock
      await this.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          UPDATE orders 
          SET status = 'CANCELLED', updated_at = NOW() 
          WHERE id = ${order.id}::uuid AND status = 'PENDING_PAYMENT'
        `;

        await tx.$executeRaw`
          UPDATE products 
          SET stock = stock + ${quantity}, updated_at = NOW() 
          WHERE id = ${productId}::uuid
        `;
      });

      // 2. Re-increment Redis stock atomically via Lua
      const restoredStock = await this.redisService.rollbackStock(flashSaleId, quantity);
      this.logger.log(`Redis stock restored for flashSale ${flashSaleId}. Current in-memory stock: ${restoredStock}`);

      // 3. Update Redis state and emit notifications
      await this.redisService.setOrderStatus(trackingId, 'CANCELLED', {
        reason: 'PAYMENT_TIMEOUT_15M',
      });

      await this.redisService.publishOrderEvent(trackingId, {
        event: 'ORDER_CANCELLED',
        trackingId,
        orderId: order.id,
        status: 'CANCELLED',
        reason: 'PAYMENT_TIMEOUT',
        timestamp: new Date().toISOString(),
      });

      // 4. Emit notification for waiting queue users
      await this.redisService.publishStockRestored(flashSaleId, quantity);
    }
  }
}
