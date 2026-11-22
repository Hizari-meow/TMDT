import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentWebhookDto } from './dto/webhook-payload.dto';

@Controller('api/v1/payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() dto: PaymentWebhookDto,
    @Headers('x-signature-sha256') signature: string,
    @Headers('x-signature') fallbackSignature: string,
  ) {
    const rawSignature = signature || fallbackSignature;
    const rawBody = JSON.stringify(dto);

    // If signature header is provided, strictly enforce HMAC validation
    if (rawSignature && !this.paymentsService.verifySignature(rawBody, rawSignature)) {
      this.logger.warn('Unauthorized payment webhook request: Invalid HMAC SHA256 signature.');
      throw new HttpException(
        { code: 'INVALID_SIGNATURE', message: 'HMAC signature verification failed.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.paymentsService.handleWebhook(dto);
  }
}
