import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateOffRampDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  walletAddress: string;

  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0.01' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string; // ex: "EUR"

  @IsUUID()
  @IsNotEmpty()
  bankAccountId: string;
}
