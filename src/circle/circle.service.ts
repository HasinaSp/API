/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CircleService {
  private readonly logger = new Logger(CircleService.name);

  private base = process.env.CIRCLE_BASE_URL || 'https://api-sandbox.circle.com';
  private apiKey = process.env.CIRCLE_API_KEY || 'REPLACE_ME';

  constructor(private readonly http: HttpService) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  //----------------------------------------
  // 1️⃣ GET CONFIGURATION
  //----------------------------------------
  async getConfiguration() {
    const url = `${this.base}/v1/configuration`;

    this.logger.debug(`GET ${url}`);
    
    const res = await firstValueFrom(
      this.http.get(url, { headers: this.headers() })
    );

    return res.data;
  }

  //----------------------------------------
  // 2️⃣ CREATE QUOTE (USDC → EURC)
  //----------------------------------------
  async createQuote(payload: {
    idempotencyKey: string;
    sourceAssetId: string;
    destinationAssetId: string;
    amount: number;
  }) {
    const url = `${this.base}/v1/exchange/quotes`;
    this.logger.debug(`POST ${url} \nPayload: ${JSON.stringify(payload)}`);

    const res = await firstValueFrom(
      this.http.post(url, payload, { headers: this.headers() })
    );

    this.logger.debug(`Quote Response: ${JSON.stringify(res.data)}`);
    return res.data;
  }

  //----------------------------------------
  // 3️⃣ ACCEPT TRADE
  //----------------------------------------
  async createTrade(payload: { idempotencyKey: string; quoteId: string }) {
    const url = `${this.base}/v1/exchange/trades`;
    this.logger.debug(`POST ${url} \nPayload: ${JSON.stringify(payload)}`);

    const res = await firstValueFrom(
      this.http.post(url, payload, { headers: this.headers() })
    );

    this.logger.debug(`Trade Response: ${JSON.stringify(res.data)}`);
    return res.data;
  }
}
