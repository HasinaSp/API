import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { OfframpService } from './offramp.service';
import { InitiateOfframpDto } from './dto/initiate-offramp.dto';
import { CreateQuoteDto } from './dto/quote.dto';
import { CreateTradeDto } from './dto/trade.dto';

@Controller('v1')
export class OfframpController {
  constructor(private readonly offrampService: OfframpService) {}

  /**
   * GET Circle configuration
   */
  @Get('circle/configuration')
  async getCircleConfig() {
    return this.offrampService.getCircleConfiguration();
  }

  /**
   * STEP 1 : Start offramp flow
   * Converts USDC -> EURC using quotes + trade
   */
  @Post('offramp/USDC')
  @HttpCode(HttpStatus.ACCEPTED)
  async initiate(@Body() body: InitiateOfframpDto) {
    return this.offrampService.startOfframpFlow(body);
  }

  /**
   * STEP 2 : Create Exchange Quote (optional)
   */
  @Post('exchange/quotes')
  async createQuote(@Body() body: CreateQuoteDto) {
    return this.offrampService.createQuote(body);
  }

  /**
   * STEP 3 : Create Trade
   */
  @Post('exchange/trades')
  async createTrade(@Body() body: CreateTradeDto) {
    return this.offrampService.createTrade(body);
  }
}
