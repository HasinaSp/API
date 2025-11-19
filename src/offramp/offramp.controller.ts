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
  Get,
} from '@nestjs/common';

import { OfframpService } from './offramp.service';
import { CreateOffRampDto } from './dto/create-offramp.dto';

@Controller('v1/offramp')
export class OfframpController {
  constructor(private readonly offrampService: OfframpService) {}

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
}