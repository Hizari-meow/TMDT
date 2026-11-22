import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { FlashSaleService } from './flash-sale.service';
import { CheckoutDto, CheckoutResponseDto } from './dto/checkout.dto';
import { ActionTokenQueryDto, ActionTokenResponseDto } from './dto/action-token.dto';
import { ActionTokenGuard } from '../../common/guards/action-token.guard';
import { IdempotencyInterceptor } from '../../common/interceptors/idempotency.interceptor';

@Controller('api/v1/flash-sale')
export class FlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  /**
   * Generates a 30s single-use Action Token required before checkout.
   */
  @Get(':id/token')
  async getActionToken(
    @Param('id') flashSaleId: string,
    @Query() query: ActionTokenQueryDto,
  ): Promise<ActionTokenResponseDto> {
    const token = await this.flashSaleService.issueActionToken(query.userId, flashSaleId);
    return {
      actionToken: token,
      flashSaleId,
      userId: query.userId,
      expiresInSeconds: 30,
    };
  }

  /**
   * Retrieves real-time stock count with edge caching headers.
   */
  @Get(':id/stock')
  async getStock(
    @Param('id') flashSaleId: string,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    // Edge cache header: stale-while-revalidate for CDN/Cloudflare
    reply.header('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=5');
    return await this.flashSaleService.getStock(flashSaleId);
  }

  /**
   * High-concurrency checkout endpoint.
   * Guarded by Action Token and wrapped with Idempotency Interceptor.
   * Returns HTTP 202 Accepted.
   */
  @Post('checkout')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(ActionTokenGuard)
  @UseInterceptors(IdempotencyInterceptor)
  async checkout(
    @Body() dto: CheckoutDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<CheckoutResponseDto> {
    const key = idempotencyKey || dto.idempotencyKey!;
    return await this.flashSaleService.checkout(dto, key);
  }
}
