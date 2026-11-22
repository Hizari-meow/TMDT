import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ActionTokenGuard implements CanActivate {
  private readonly logger = new Logger(ActionTokenGuard.name);

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const headers = request.headers;
    const body = (request.body as any) || {};

    const actionToken = (headers['x-action-token'] as string) || body.actionToken;
    const userId = (headers['x-user-id'] as string) || body.userId;
    const flashSaleId = (request.params as any)?.id || body.flashSaleId;

    if (!actionToken) {
      throw new HttpException(
        {
          code: 'ACTION_TOKEN_REQUIRED',
          message: 'Header "X-Action-Token" is required for flash sale checkout.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!userId || !flashSaleId) {
      throw new HttpException(
        {
          code: 'INVALID_REQUEST',
          message: 'userId and flashSaleId are required to validate action token.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid = await this.redisService.validateAndConsumeActionToken(
      userId,
      flashSaleId,
      actionToken,
    );

    if (!isValid) {
      throw new HttpException(
        {
          code: 'ACTION_TOKEN_EXPIRED_OR_INVALID',
          message: 'Action token has expired or has already been used.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
