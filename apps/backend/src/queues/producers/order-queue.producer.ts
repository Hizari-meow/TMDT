import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES, QUEUE_SETTINGS } from '../../common/constants/queues.constant';

export interface ProcessOrderPayload {
  trackingId: string;
  userId: string;
  flashSaleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  idempotencyKey: string;
  createdAt: string;
}

export interface OrderTimeoutPayload {
  trackingId: string;
  flashSaleId: string;
  productId: string;
  quantity: number;
}

@Injectable()
export class OrderQueueProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderQueueProducer.name);
  private orderProcessingQueue: Queue<ProcessOrderPayload>;
  private orderTimeoutQueue: Queue<OrderTimeoutPayload>;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const password = this.configService.get<string>('REDIS_PASSWORD', 'redis_secure_password');

    const connection = {
      host,
      port,
      password,
    };

    // 1. Order Processing Queue (High-throughput persistence)
    this.orderProcessingQueue = new Queue<ProcessOrderPayload>(QUEUE_NAMES.ORDER_PROCESSING, {
      connection,
      defaultJobOptions: {
        attempts: QUEUE_SETTINGS.MAX_RETRIES,
        backoff: {
          type: 'exponential',
          delay: QUEUE_SETTINGS.BACKOFF_DELAY_MS,
        },
        removeOnComplete: {
          age: 3600, // keep 1 hour for audit
          count: 50000,
        },
        removeOnFail: false, // diverts to DLQ for manual inspection
      },
    });

    // 2. Order Timeout Delayed Queue (15-Minute compensation)
    this.orderTimeoutQueue = new Queue<OrderTimeoutPayload>(QUEUE_NAMES.ORDER_TIMEOUT, {
      connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'fixed',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    this.logger.log('BullMQ Queues initialized successfully');
  }

  async onModuleDestroy() {
    if (this.orderProcessingQueue) {
      await this.orderProcessingQueue.close();
    }
    if (this.orderTimeoutQueue) {
      await this.orderTimeoutQueue.close();
    }
  }

  /**
   * Dispatches order persistence job to background workers.
   */
  async dispatchOrderProcessingJob(payload: ProcessOrderPayload): Promise<string> {
    const job = await this.orderProcessingQueue.add(JOB_NAMES.PROCESS_ORDER, payload, {
      jobId: `proc-${payload.trackingId}`,
    });
    return job.id!;
  }

  /**
   * Dispatches delayed job to verify order payment after 15 minutes.
   */
  async dispatchOrderTimeoutJob(
    payload: OrderTimeoutPayload,
    delayMs = QUEUE_SETTINGS.DEFAULT_TIMEOUT_DELAY_MS,
  ): Promise<string> {
    const job = await this.orderTimeoutQueue.add(JOB_NAMES.ORDER_TIMEOUT, payload, {
      jobId: `timeout-${payload.trackingId}`,
      delay: delayMs,
    });
    return job.id!;
  }

  getOrderProcessingQueue(): Queue<ProcessOrderPayload> {
    return this.orderProcessingQueue;
  }

  getOrderTimeoutQueue(): Queue<OrderTimeoutPayload> {
    return this.orderTimeoutQueue;
  }
}
