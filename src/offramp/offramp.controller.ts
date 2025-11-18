import {
Controller,
Post,
Body,
HttpCode,
HttpStatus,
Req,
Get,
Param,
} from '@nestjs/common';
import { OfframpService } from './offramp.service';
import { InitiateOfframpDto } from './dto/initiate-offramp.dto';
import { CreateQuoteDto } from './dto/quote.dto';


@Controller('v1')
export class OfframpController {
constructor(private readonly offrampService: OfframpService) {}

@Get('circle/configuration')
async getCircleConfig() {
  return this.offrampService.getCircleConfiguration();
}


// Step 1: Entry point from your app to start offramp
@Post('offramp/USDC')
@HttpCode(HttpStatus.ACCEPTED)
async initiate(@Body() body: InitiateOfframpDto) {
// returns { quoteId, tradeId, status }
return this.offrampService.startOfframpFlow(body);
}


// Optional: direct quote creation (step 2)
@Post('exchange/quotes')
async createQuote(@Body() body: CreateQuoteDto) {
return this.offrampService.createQuote(body);
}


// Step 3: create trade
@Post('exchange/trades')
async createTrade(@Body() body: { quoteId: string }) {
return this.offrampService.createTrade(body.quoteId);
}


// Webhook endpoint that Circle will call when trade completes
@Post('webhooks/circle')
async circleWebhook(@Body() payload: any, @Req() req: any) {
// validate signature in production
return this.offrampService.handleCircleWebhook(payload);
}


// Create business account (bank/wires)
@Post('businessAccount/banks/wires')
async createBusinessBank(@Body() body: any) {
return this.offrampService.createBusinessBank(body);
}


@Post('businessAccount/payouts')
async createPayout(@Body() body: any) {
return this.offrampService.createPayout(body);
}
}