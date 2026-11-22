import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    const idempotencyKey = (request.headers['idempotency-key'] as string) || (request.body as any)?.idempotencyKey;

    if (!idempotencyKey) {
      throw new HttpException(
        {
          code: 'IDEMPOTENCY_KEY_REQUIRED',
          message: 'Header "Idempotency-Key" is mandatory for this request.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Try to acquire idempotency lock
    const { isNew, payload } = await this.redisService.checkAndSetIdempotency(
      idempotencyKey,
      { status: 'PROCESSING', startedAt: new Date().toISOString() },
    );

    if (!isNew && payload) {
      this.logger.log(`Idempotent replay detected for key: ${idempotencyKey}`);
      // If still processing or completed, return cached payload immediately
      if (payload.statusCode) {
        response.status(payload.statusCode);
      }
      return of(payload);
    }

    // Is a new request: proceed and cache output on completion
    return next.handle().pipe(
      tap(async (result) => {
        const statusCode = response.statusCode || HttpStatus.ACCEPTED;
        const cachedPayload = {
          ...result,
          statusCode,
          idempotentReplay: true,
        };
        await this.redisService.updateIdempotencyPayload(idempotencyKey, cachedPayload);
      }),
      catchError(async (err) => {
        // If operation failed before committing, delete key to allow clean retry
        await this.redisService.deleteIdempotencyKey(idempotencyKey);
        throw err;
      }),
    );
  }
}
