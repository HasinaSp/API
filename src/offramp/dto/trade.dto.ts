// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsString, IsUUID } from 'class-validator';

export class CreateTradeDto {
  @IsUUID()
  idempotencyKey: string;

  @IsUUID()
  quoteId: string;
}
