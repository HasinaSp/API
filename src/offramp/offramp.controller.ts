/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
<<<<<<< HEAD
import { OfframpService } from './offramp.service';
import { InitiateOfframpDto } from './dto/initiate-offramp.dto';
import { CreateQuoteDto } from './dto/quote.dto';

=======
>>>>>>> feature/circle-service

import { OfframpService } from './offramp.service';
import { CreateOffRampDto } from './dto/create-offramp.dto';

@Controller('v1/offramp')
export class OfframpController {
constructor(private readonly offrampService: OfframpService) {}

<<<<<<< HEAD
@Get('circle/configuration')
async getCircleConfig() {
  return this.offrampService.getCircleConfiguration();
=======
  /**
   * 🔵 Circle: Debug – récupérer les configurations actuelles
   * (Rate limits, Webhooks, Exchange config etc.)
   */
  @Get('circle/config')
  async getCircleConfig() {
    return this.offrampService.getCircleConfiguration();
  }

  /**
   * 1. Vérifie la config Circle
   * 2. Crée une quote USDC → EURC
   * 3. Accepte le trade (exchange)
   * 4. Effectue le transfert bancaire
   * 5. Retourne un résultat consolidé
   */
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  // eslint-disable-next-line @typescript-eslint/require-await
  async createOfframp(@Body() body: CreateOffRampDto) {
    // Exemple de retour:
    // {
    //   quoteId,
    //   tradeId,
    //   transferId,
    //   finalStatus
    // }
    return this.offrampService.processOffRamp(body);
  }

  /**
   * 🟢 Endpoint pour tester chaque étape
   */

  @Post('exchange/quote')
  async createQuote() {
    return this.offrampService.testQuote();
  }

  @Post('exchange/trade')
  async acceptTrade() {
    return this.offrampService.testTrade();
  }

  @Post('transfer/bank')
  async transfer() {
    return this.offrampService.testBankTransfer();
  }
>>>>>>> feature/circle-service
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