/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CircleService {
  private readonly logger = new Logger(CircleService.name);

  private base =
    process.env.CIRCLE_BASE_URL || 'https://api-sandbox.circle.com';
  private key = process.env.CIRCLE_API_KEY || 'REPLACE_ME';

  constructor(private readonly http: HttpService) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * GET /v1/configuration
   */
  async getConfiguration() {
    const url = `${this.base}/v1/configuration`;
    const res = await firstValueFrom(
      this.http.get(url, { headers: this.headers() }),
    );

    return res.data;
  }

  /**
   * POST /v1/exchange/quotes
   */
  async createQuote(payload: {
    idempotencyKey: string;
    source: { currency: string; amount: string };
    destination: { currency: string };
  }) {
    const url = `${this.base}/v1/exchange/quotes`;

    const res = await firstValueFrom(
      this.http.post(url, payload, { headers: this.headers() }),
    );

    this.logger.debug(
      'createQuote response: ' + JSON.stringify(res.data, null, 2),
    );

    return res.data;
  }

  /**
   * POST /v1/exchange/trades
   */
  async createTrade(body: { idempotencyKey: string; quoteId: string }) {
    const url = `${this.base}/v1/exchange/trades`;

    const res = await firstValueFrom(
      this.http.post(
        url,
        {
          idempotencyKey: body.idempotencyKey,
          quoteId: body.quoteId,
        },
        { headers: this.headers() },
      ),
    );

    return res.data;
  }
}
