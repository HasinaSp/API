/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateOffRampDto } from './dto/create-offramp.dto';
import { CircleService } from '../circle/circle.service';
// import { BankService } from '../bank/bank.service'; // si tu as une intégration bancaire

@Injectable()
export class OfframpService {
  private readonly logger = new Logger(OfframpService.name);

  constructor(
    private readonly circle: CircleService,
    // private readonly bank: BankService, // si tu ajoutes un module bancaire
  ) {}

  /**
   * - GET /v1/configuration (debug only)
   */
  async getCircleConfiguration() {
    return this.circle.getConfiguration();
  }

  /**
   *
   * 1. Create quote (USDC → EURC)
   * 2. Accept trade
   * 3. Execute bank transfer
   */
  async processOffRamp(body: CreateOffRampDto) {
    try {
      this.logger.debug('Starting OFFRAMP with payload: ' + JSON.stringify(body));

      const { userId, walletAddress, amount, currency, bankAccountId } = body;

      //
      // -----------------------------------------
      // Create Quote (USDC → EURC)
      // -----------------------------------------
      //
      const quotePayload = {
        sourceAssetId: 'USDC',     // tu peux les rendre dynamiques
        destinationAssetId: 'EURC', 
        amount,
        idempotencyKey: this.generateKey(),
      };

      this.logger.debug('Creating Quote: ' + JSON.stringify(quotePayload));

      const quoteRes = await this.circle.createQuote(quotePayload);

      const quoteId = quoteRes?.data?.id;
      if (!quoteId) {
        throw new BadRequestException('Circle did not return a quoteId');
      }

      this.logger.log(`Quote created successfully: ${quoteId}`);


      //
      // -----------------------------------------
      // Accept Trade
      // -----------------------------------------
      //
      const tradePayload = {
        idempotencyKey: this.generateKey(),
        quoteId,
      };

      this.logger.debug('Accepting Trade: ' + JSON.stringify(tradePayload));

      const tradeRes = await this.circle.createTrade(tradePayload);

      const tradeId = tradeRes?.data?.id;
      if (!tradeId) {
        throw new BadRequestException('Circle did not return a tradeId');
      }

      this.logger.log(`Trade executed successfully: ${tradeId}`);


      //
      // -----------------------------------------
      // Execute BANK Transfer
      // -----------------------------------------
      //
      // Ici tu appelles ton propre service bancaire
      //
      // const bankResult = await this.bank.sendFiat({
      //   bankAccountId,
      //   userId,
      //   amount,
      //   currency,
      // });
      //
      // For now, mock:
      const bankResult = {
        transferId: this.generateKey(),
        status: 'pending',
      };

      this.logger.log(`Bank transfer initiated: ${bankResult.transferId}`);


      //
      // -----------------------------------------
      // Build final response
      // -----------------------------------------
      //
      return {
        success: true,
        quoteId,
        tradeId,
        bankTransfer: bankResult,
        message: 'Offramp flow executed successfully',
      };

    } catch (err) {
      this.logger.error('Offramp flow failed', err);
      throw err;
    }
  }

  /**
   * Testing — create quote only
   */
  async testQuote() {
    return this.circle.createQuote({
      idempotencyKey: this.generateKey(),
      sourceAssetId: 'USDC',
      destinationAssetId: 'EURC',
      amount: 100,
    });
  }

  /**
   * Testing — accept trade
   */
  async testTrade() {
    return this.circle.createTrade({
      idempotencyKey: this.generateKey(),
      quoteId: 'REPLACE_WITH_REAL_QUOTE',
    });
  }

  /**
   * Testing — mock bank transfer
   */
  async testBankTransfer() {
    return {
      transferId: this.generateKey(),
      status: 'pending',
    };
  }

  /**
   * Generate idempotency keys
   */
  private generateKey(): string {
    return crypto.randomUUID();
  }
}
