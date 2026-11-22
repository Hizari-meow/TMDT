import { IsString, IsNotEmpty } from 'class-validator';

export class ActionTokenQueryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class ActionTokenResponseDto {
  actionToken: string;
  flashSaleId: string;
  userId: string;
  expiresInSeconds: number;
}
