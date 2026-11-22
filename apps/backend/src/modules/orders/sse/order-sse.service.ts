import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { FastifyReply } from 'fastify';
import { RedisService } from '../../../redis/redis.service';
import { REDIS_KEYS } from '../../../common/constants/redis-keys.constant';

@Injectable()
export class OrderSseService {
  private readonly logger = new Logger(OrderSseService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Streams real-time order status updates via Server-Sent Events (SSE).
   */
  async streamOrderStatus(trackingId: string, reply: FastifyReply) {
    const rawRes = reply.raw;

    // Set standard SSE headers
    rawRes.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable proxy buffering (Nginx/Cloudflare)
    });

    const sendEvent = (eventName: string, data: any) => {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      rawRes.write(`event: ${eventName}\ndata: ${payload}\n\n`);
    };

    // 1. Send current initial snapshot
    const currentStatus = await this.redisService.getOrderStatus(trackingId);
    if (currentStatus) {
      sendEvent('status_update', {
        trackingId,
        status: currentStatus.status,
        ...currentStatus,
      });

      // If already in terminal state, finish immediately
      if (['PAID', 'CANCELLED', 'FAILED'].includes(currentStatus.status)) {
        rawRes.end();
        return;
      }
    } else {
      sendEvent('status_update', {
        trackingId,
        status: 'QUEUED',
        message: 'Order is queued for verification',
      });
    }

    // 2. Setup dedicated subscriber client for Pub/Sub
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const password = this.configService.get<string>('REDIS_PASSWORD', 'redis_secure_password');

    const sub = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    });

    const channel = REDIS_KEYS.ORDER_EVENTS(trackingId);

    sub.subscribe(channel, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to SSE channel ${channel}: ${err.message}`);
        rawRes.end();
      }
    });

    sub.on('message', (chan, message) => {
      if (chan === channel) {
        try {
          const parsed = JSON.parse(message);
          sendEvent('status_update', parsed);

          // Close stream if terminal state reached
          if (['PAID', 'CANCELLED', 'FAILED'].includes(parsed.status)) {
            cleanup();
            rawRes.end();
          }
        } catch {
          sendEvent('status_update', { raw: message });
        }
      }
    });

    // 3. Heartbeat keep-alive every 15 seconds
    const heartbeatTimer = setInterval(() => {
      rawRes.write(': ping\n\n');
    }, 15000);

    const cleanup = () => {
      clearInterval(heartbeatTimer);
      sub.unsubscribe(channel).catch(() => {});
      sub.quit().catch(() => {});
    };

    // Clean up when client disconnects
    rawRes.on('close', () => {
      cleanup();
    });
  }
}
