import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateOffRampDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string; // ex: "EUR", "USD"

  @IsUUID()
  @IsNotEmpty()
  bankAccountId: string;
}
