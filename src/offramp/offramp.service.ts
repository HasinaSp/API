/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateOffRampDto } from './dto/create-offramp.dto';
import { CircleService } from '../circle/circle.service';
import * as crypto from 'crypto';

@Injectable()
export class OfframpService {
  private readonly logger = new Logger(OfframpService.name);

  constructor(private readonly circle: CircleService) {}

  // ---------------------------------------------------------
  // PUBLIC METHODS (appelées par le controller)
  // ---------------------------------------------------------

  async getCircleConfiguration() {
    return this.circle.getConfiguration();
  }

  async processOffRamp(body: CreateOffRampDto) {
    try {
      this.logger.debug('Starting OFFRAMP with payload: ' + JSON.stringify(body));

      const amount = Number(body.amount);
      if (isNaN(amount)) {
        throw new BadRequestException('Amount must be a valid number');
      }
      // 1. Quote
      const quote = await this.circle.createQuote({
        sourceAssetId: 'USDC',
        destinationAssetId: 'EURC',
        amount: amount,
        idempotencyKey: this.generateKey(),
      });

      const trade = await this.circle.createTrade({
        quoteId: quote.data?.id ?? quote.id,
        idempotencyKey: this.generateKey(),
      });

      // create bank account (use destination billing / iban)
      const bankAccount = await this.circle.createBankWireAccount({
        name: body.destination?.billingDetails?.name,
        iban: body.destination?.iban,
        billingDetails: body.destination?.billingDetails,
        bankAddress: body.destination?.bankAddress,
      });

      // create payout
      const payout = await this.circle.createPayout({
        destination: { id: bankAccount.data?.id ?? bankAccount.id },
        amount: amount,
        currency: 'EUR',
        idempotencyKey: this.generateKey(),
      });

      return { quote, trade, bankAccount, payout };
      return { quote, trade, bankAccount, payout };

    } catch (error) {
      this.logger.error('Offramp flow failed', error);
      throw error;
    }
  }


  async testQuote() {
    return this.createQuoteInternal(100);
  }

  async testTrade() {
    return this.executeTradeInternal('REPLACE_WITH_QUOTE');
  }

  async testBankTransfer() {
  return this.executeBankTransferInternal({
    amount: "100",
    destination: {
      iban: "FR7612345678901234567890123",
      billingDetails: {
        name: "Test User",
        city: "Paris",
        country: "FR",
        line1: "1 test street",
      },
      bankAddress: {
        bankName: "Test Bank",
        city: "Paris",
        country: "FR",
      }
    }
  });
}

  // ---------------------------------------------------------
  // PRIVATE METHODS (logique interne)
  // ---------------------------------------------------------

  /** Step 1 – Create quote USDC → EURC */
  private async createQuoteInternal(amount: number): Promise<string> {
    const quotePayload = {
      sourceAssetId: 'USDC',
      destinationAssetId: 'EURC',
      amount,
      idempotencyKey: this.generateKey(),
    };

    this.logger.debug('Creating Quote: ' + JSON.stringify(quotePayload));

    const res = await this.circle.createQuote(quotePayload);

    const quoteId = res?.data?.id;
    if (!quoteId) {
      throw new BadRequestException('Circle did not return a quoteId');
    }

    this.logger.log(`Quote created successfully: ${quoteId}`);

    return quoteId;
  }

  /** Step 2 – Execute trade */
  private async executeTradeInternal(quoteId: string): Promise<string> {
    const payload = {
      idempotencyKey: this.generateKey(),
      quoteId,
    };

    this.logger.debug('Accepting Trade: ' + JSON.stringify(payload));

    const res = await this.circle.createTrade(payload);

    const tradeId = res?.data?.id;
    if (!tradeId) {
      throw new BadRequestException('Circle did not return a tradeId');
    }

    this.logger.log(`Trade executed successfully: ${tradeId}`);

    return tradeId;
  }

  /** Step 3 – Execute bank transfer (mock for now) */
  private async executeBankTransferInternal(body: CreateOffRampDto) {
    const { amount, destination } = body;

    // Ici tu vas brancher ton service bancaire réel
    // Exemple d’un payload nettoyé et prêt à être envoyé
    const bankPayload = {
      amount,
      iban: destination.iban,
      billingDetails: destination.billingDetails,
      bankAddress: destination.bankAddress,
      idempotencyKey: this.generateKey(),
    };

    this.logger.debug('Executing bank transfer with payload: ' + JSON.stringify(bankPayload));

  // TODO: remplacer par un appel réel à ton service bancaire :
  // const result = await this.bank.sendFiat(bankPayload);

    const mockResponse = {
      transferId: this.generateKey(),
      status: 'pending',
      payloadSent: bankPayload
    };

    this.logger.log(`Bank transfer initiated: ${mockResponse.transferId}`);

    return mockResponse;
  }


  /** Idempotency key generator */
  private generateKey(): string {
    return crypto.randomUUID();
  }
}
