import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../../redis/redis.service';
import { OrderQueueProducer } from '../../queues/producers/order-queue.producer';
import { CheckoutDto, CheckoutResponseDto } from './dto/checkout.dto';
import { REDIS_KEYS } from '../../common/constants/redis-keys.constant';

@Injectable()
export class FlashSaleService {
  private readonly logger = new Logger(FlashSaleService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly orderQueueProducer: OrderQueueProducer,
  ) {}

  /**
   * High-concurrency flash sale checkout handler.
   * Completely decoupled from PostgreSQL during traffic burst.
   */
  async checkout(dto: CheckoutDto, idempotencyKey: string): Promise<CheckoutResponseDto> {
    const quantity = dto.quantity || 1;

    // 1. Atomic Lua execution in Redis (Check & Decrement)
    const deduction = await this.redisService.deductStock(dto.flashSaleId, quantity);

    if (!deduction.success) {
      if (deduction.code === -1) {
        throw new HttpException(
          {
            code: 'SOLD_OUT',
            message: 'Flash sale item is completely sold out or remaining stock is insufficient.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          code: 'FLASH_SALE_NOT_FOUND',
          message: 'The requested flash sale is not currently active or found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. Generate unique tracking identifier
    const trackingId = uuidv4();
    const nowIso = new Date().toISOString();

    // 3. Set ephemeral state in Redis
    await this.redisService.setOrderStatus(trackingId, 'RESERVED', {
      userId: dto.userId,
      flashSaleId: dto.flashSaleId,
      productId: dto.productId,
      quantity: quantity.toString(),
      remainingStock: deduction.remainingStock.toString(),
    });

    // Assume standard flash sale price $499.00 (mirrored from seed)
    const unitPrice = 499.00;
    const totalAmount = unitPrice * quantity;

    // 4. Dispatch asynchronous BullMQ persistence job
    await this.orderQueueProducer.dispatchOrderProcessingJob({
      trackingId,
      userId: dto.userId,
      flashSaleId: dto.flashSaleId,
      productId: dto.productId,
      quantity,
      unitPrice,
      totalAmount,
      idempotencyKey,
      createdAt: nowIso,
    });

    // 5. Dispatch 15-minute compensation timeout job
    await this.orderQueueProducer.dispatchOrderTimeoutJob({
      trackingId,
      flashSaleId: dto.flashSaleId,
      productId: dto.productId,
      quantity,
    });

    // 6. Publish real-time state update to SSE channel
    await this.redisService.publishOrderEvent(trackingId, {
      event: 'STATUS_CHANGED',
      trackingId,
      status: 'RESERVED',
      timestamp: nowIso,
    });

    this.logger.log(`Stock reserved for trackingId ${trackingId}. Remaining Redis stock: ${deduction.remainingStock}`);

    return {
      orderTrackingId: trackingId,
      status: 'RESERVED',
      message: 'Stock successfully reserved. Order is queued for persistence.',
      flashSaleId: dto.flashSaleId,
      productId: dto.productId,
      quantity,
      estimatedWaitSeconds: 2,
    };
  }

  /**
   * Retrieves real-time stock from Redis.
   */
  async getStock(flashSaleId: string): Promise<{ flashSaleId: string; stock: number }> {
    const key = REDIS_KEYS.STOCK_FLASH_SALE(flashSaleId);
    const raw = await this.redisService.getClient().get(key);
    const stock = raw !== null ? parseInt(raw, 10) : 0;
    return {
      flashSaleId,
      stock: isNaN(stock) ? 0 : Math.max(0, stock),
    };
  }

  /**
   * Issues single-use 30s Action Token.
   */
  async issueActionToken(userId: string, flashSaleId: string): Promise<string> {
    return await this.redisService.createActionToken(userId, flashSaleId, 30);
  }
}
