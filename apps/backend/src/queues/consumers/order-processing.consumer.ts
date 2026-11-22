import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import { QUEUE_NAMES, QUEUE_SETTINGS } from '../../common/constants/queues.constant';
import { ProcessOrderPayload } from '../producers/order-queue.producer';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderProcessingConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderProcessingConsumer.name);
  private worker: Worker<ProcessOrderPayload>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const password = this.configService.get<string>('REDIS_PASSWORD', 'redis_secure_password');

    this.worker = new Worker<ProcessOrderPayload>(
      QUEUE_NAMES.ORDER_PROCESSING,
      async (job: Job<ProcessOrderPayload>) => {
        return await this.processOrder(job.data);
      },
      {
        connection: { host, port, password },
        concurrency: QUEUE_SETTINGS.ORDER_PROCESSING_CONCURRENCY,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.debug(`Order job ${job.id} for trackingId ${job.data.trackingId} completed`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Order job ${job?.id} failed with error: ${err.message}`, err.stack);
    });

    this.logger.log(`OrderProcessingConsumer worker started with concurrency ${QUEUE_SETTINGS.ORDER_PROCESSING_CONCURRENCY}`);
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async processOrder(data: ProcessOrderPayload) {
    const {
      trackingId,
      userId,
      flashSaleId,
      productId,
      quantity,
      unitPrice,
      totalAmount,
      idempotencyKey,
      createdAt,
    } = data;

    const orderId = uuidv4();
    const orderCreatedAt = new Date(createdAt);

    try {
      // Execute ACID database transaction across partitioned tables
      await this.prisma.$transaction(async (tx) => {
        // 1. Insert into orders (partitioned by created_at)
        await tx.order.create({
          data: {
            id: orderId,
            trackingId,
            userId,
            flashSaleId,
            status: 'PENDING_PAYMENT',
            totalAmount,
            createdAt: orderCreatedAt,
          },
        });

        // 2. Insert into order_items
        await tx.orderItem.create({
          data: {
            orderId,
            orderCreatedAt,
            productId,
            quantity,
            unitPrice,
            createdAt: orderCreatedAt,
          },
        });

        // 3. Mirror stock deduction in products table (CHECK constraint guarantees >= 0)
        await tx.$executeRaw`
          UPDATE products 
          SET stock = stock - ${quantity}, updated_at = NOW() 
          WHERE id = ${productId}::uuid
        `;

        // 4. Record idempotency key in DB
        await tx.idempotencyKey.upsert({
          where: { key: idempotencyKey },
          update: { orderId },
          create: {
            key: idempotencyKey,
            orderId,
            responsePayload: {
              orderId,
              trackingId,
              status: 'PENDING_PAYMENT',
            },
          },
        });
      });

      // Update Redis status and notify waiting clients via SSE
      await this.redisService.setOrderStatus(trackingId, 'PENDING_PAYMENT', {
        orderId,
        userId,
        totalAmount: totalAmount.toString(),
      });

      await this.redisService.publishOrderEvent(trackingId, {
        event: 'STATUS_CHANGED',
        trackingId,
        orderId,
        status: 'PENDING_PAYMENT',
        totalAmount,
        timestamp: new Date().toISOString(),
      });

      return { orderId, trackingId, status: 'PENDING_PAYMENT' };
    } catch (error: any) {
      this.logger.error(`Failed to persist order for trackingId ${trackingId}: ${error.message}`, error.stack);
      
      // If fatal error or DB constraint violation, trigger atomic Lua rollback
      await this.redisService.rollbackStock(flashSaleId, quantity);
      await this.redisService.setOrderStatus(trackingId, 'FAILED', {
        reason: error.message,
      });
      await this.redisService.publishOrderEvent(trackingId, {
        event: 'STATUS_CHANGED',
        trackingId,
        status: 'FAILED',
        reason: error.message,
      });

      throw error;
    }
  }
}
