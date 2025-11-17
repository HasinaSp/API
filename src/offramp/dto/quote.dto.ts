import { IsString, IsNumber } from 'class-validator';


export class CreateQuoteDto {
@IsString()
from: string;
@IsString()
to: string;
@IsNumber()
amount: number;
}