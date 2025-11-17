import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';


export class InitiateOfframpDto {
@IsString()
@IsNotEmpty()
from: string; // e.g. 'X USDC'


@IsNumber()
amount: number;


@IsString()
to: string; // e.g. 'EURC'


@IsOptional()
@IsString()
iban?: string;


@IsOptional()
@IsString()
initiator_id?: string;
}