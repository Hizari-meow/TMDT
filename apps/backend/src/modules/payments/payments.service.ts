import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PaymentWebhookDto } from './dto/webhook-payload.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.webhookSecret = this.configService.get<string>(
      'WEBHOOK_SECRET',
      'whsec_super_secret_hmac_sha256_key_998877',
    );
  }

  /**
   * Validates HMAC SHA-256 signature from payment gateway.
   */
  verifySignature(rawBody: string, signature: string): boolean {
    if (!signature) {
      return false;
    }
    const computedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(computedSignature, 'hex'),
      );
    } catch {
      return false;
    }
  }

  /**
   * Processes payment webhook with strict database-level idempotency.
   */
  async handleWebhook(dto: PaymentWebhookDto) {
    const { transactionId, orderId, amount, status } = dto;

    this.logger.log(`Processing payment webhook: txn=${transactionId}, order=${orderId}, status=${status}`);

    // Check if payment was already recorded in processed_payments
    const existing = await this.prisma.processedPayment.findUnique({
      where: { transactionId },
    });

    if (existing) {
      this.logger.warn(`Duplicate payment webhook received for transaction ${transactionId}. Returning idempotent 200.`);
      return { success: true, message: 'ALREADY_PROCESSED', transactionId };
    }

    // Find target order across partitions
    const orders = await this.prisma.$queryRaw<Array<{ id: string; tracking_id: string; status: string }>>`
      SELECT id, tracking_id, status 
      FROM orders 
      WHERE id = ${orderId}::uuid
      LIMIT 1
    `;

    if (!orders || orders.length === 0) {
      throw new HttpException(
        { code: 'ORDER_NOT_FOUND', message: `Order ${orderId} does not exist.` },
        HttpStatus.NOT_FOUND,
      );
    }

    const order = orders[0];

    // Atomically persist processed payment and transition order state
    await this.prisma.$transaction(async (tx) => {
      // 1. Insert into processed_payments (guarded by UNIQUE constraint on transaction_id)
      await tx.processedPayment.create({
        data: {
          transactionId,
          orderId,
          amount,
          status,
        },
      });

      // 2. Transition order status if payment succeeded
      if (status.toUpperCase() === 'PAID' || status.toUpperCase() === 'SUCCESS') {
        await tx.$executeRaw`
          UPDATE orders 
          SET status = 'PAID', updated_at = NOW() 
          WHERE id = ${orderId}::uuid
        `;
      }
    });

    // 3. Update Redis status & broadcast SSE event
    await this.redisService.setOrderStatus(order.tracking_id, 'PAID', {
      orderId,
      transactionId,
    });

    await this.redisService.publishOrderEvent(order.tracking_id, {
      event: 'PAYMENT_CONFIRMED',
      trackingId: order.tracking_id,
      orderId,
      status: 'PAID',
      transactionId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Payment confirmed and order ${orderId} marked as PAID.`);
    return { success: true, message: 'PAYMENT_PROCESSED', transactionId, orderId };
  }
}
