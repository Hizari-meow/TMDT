import { IsString, IsInt, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  flashSaleId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @Min(1)
  @Max(2)
  quantity: number = 1;

  @IsOptional()
  actionToken?: string;

  @IsOptional()
  idempotencyKey?: string;
}

export class CheckoutResponseDto {
  orderTrackingId: string;
  status: string;
  message: string;
  flashSaleId: string;
  productId: string;
  quantity: number;
  estimatedWaitSeconds: number;
}
