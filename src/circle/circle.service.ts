/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface CreateQuotePayload {
  sourceAssetId: string;
  destinationAssetId: string;
  amount: number | string;
  idempotencyKey?: string;
  [k: string]: any;
}

interface CreateTradePayload {
  quoteId: string;
  idempotencyKey?: string;
  [k: string]: any;
}

interface CreateBankWireAccountPayload {
  name?: string;
  iban?: string;
  country?: string;
  billingDetails?: Record<string, any>;
  bankAddress?: Record<string, any>;
  [k: string]: any;
}

interface CreatePayoutPayload {
  destination: {
    type?: string;
    id?: string;
    iban?: string;
    [k: string]: any;
  };
  amount: number | string;
  currency?: string;
  idempotencyKey?: string;
  [k: string]: any;
}

@Injectable()
export class CircleService {
  private readonly logger = new Logger(CircleService.name);
  private readonly apiKey?: string;
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('CIRCLE_API_KEY') ?? process.env.CIRCLE_API_KEY;
    this.baseUrl = this.config.get<string>('CIRCLE_BASE_URL') ?? process.env.CIRCLE_BASE_URL ?? 'https://api-sandbox.circle.com';
    if (!this.apiKey) {
      this.logger.warn('CIRCLE_API_KEY not found in env/config — requests will fail without it.');
    }
  }

  private get headers() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  /** DEBUG: récupérer la config / info */
  async getConfiguration(): Promise<any> {
    try {
      const url = `${this.baseUrl}/v1/configuration`;
      const resp = await firstValueFrom(this.http.get(url, { headers: this.headers }));
      return resp.data;
    } catch (err) {
      this.logger.error('getConfiguration failed', err);
      throw new InternalServerErrorException('Failed to fetch Circle configuration');
    }
  }

  /**
   * Create a quote (USDC -> EURC)
   * returns full response from Circle
   */
  async createQuote(payload: CreateQuotePayload): Promise<any> {
    try {
      const url = `${this.baseUrl}/v1/exchange/quotes`;
      const body = { ...payload };
      const resp = await firstValueFrom(this.http.post(url, body, { headers: this.headers }));
      return resp.data;
    } catch (err) {
      this.logger.error('createQuote failed', err);
      // bubble up useful info when possible
      const message = (err?.response?.data) ? err.response.data : 'createQuote error';
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Create/accept a trade immediately using the quoteId
   * returns full response from Circle
   */
  async createTrade(payload: CreateTradePayload): Promise<any> {
    try {
      const url = `${this.baseUrl}/v1/exchange/trades`;
      const body = { ...payload };
      const resp = await firstValueFrom(this.http.post(url, body, { headers: this.headers }));
      return resp.data;
    } catch (err) {
      this.logger.error('createTrade failed', err);
      const message = (err?.response?.data) ? err.response.data : 'createTrade error';
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Create a bankwire/business account for payouts (Circle "bank wire" / business account)
   * Adapt payload to what your Circle tier expects.
   * returns the resource (account id etc)
   */
  async createBankWireAccount(payload: CreateBankWireAccountPayload): Promise<any> {
    try {
      // endpoint name used in your diagram: /v1/businessAccount/bankWires
      const url = `${this.baseUrl}/v1/businessAccount/bankWires`;
      const body = { ...payload };
      const resp = await firstValueFrom(this.http.post(url, body, { headers: this.headers }));
      return resp.data;
    } catch (err) {
      this.logger.error('createBankWireAccount failed', err);
      const message = (err?.response?.data) ? err.response.data : 'createBankWireAccount error';
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Create a payout to a destination account/IBAN (business payouts)
   * returns payout result (or pending response)
   */
  async createPayout(payload: CreatePayoutPayload): Promise<any> {
    try {
      const url = `${this.baseUrl}/v1/businessAccount/payouts`;
      const body = { ...payload };
      const resp = await firstValueFrom(this.http.post(url, body, { headers: this.headers }));
      return resp.data;
    } catch (err) {
      this.logger.error('createPayout failed', err);
      const message = (err?.response?.data) ? err.response.data : 'createPayout error';
      throw new InternalServerErrorException(message);
    }
  }
}
