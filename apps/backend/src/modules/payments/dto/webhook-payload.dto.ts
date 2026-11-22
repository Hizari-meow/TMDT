import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  status: string; // 'PAID', 'FAILED'
}
