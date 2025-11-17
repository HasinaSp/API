import { Injectable, HttpService, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';


@Injectable()
export class CircleService {
private readonly logger = new Logger(CircleService.name);
private base = process.env.CIRCLE_BASE_URL || 'https://api-sandbox.circle.com';
private key = process.env.CIRCLE_API_KEY || 'REPLACE_ME';


constructor(private readonly http: HttpService) {}


private headers() {
return {
Authorization: `Bearer ${this.key}`,
'Content-Type': 'application/json',
'Accept': 'application/json',
};
}


async getConfiguration() {
  const url = `${this.base}/v1/configuration`;
  const res = await this.http.get(url, { headers: this.headers() }).toPromise();
  return res.data;
}



const url = `${this.base}/v1/exchange/quotes`;
const res: AxiosResponse = await this.http.post(url, payload, { headers: this.headers() }).toPromise();
this.logger.debug('createQuote response: ' + JSON.stringify(res.data));
return res.data;
}


async createTrade(body: { quoteId: string }) {
const url = `${this.base}/v1/exchange/trades`;
const res: AxiosResponse = await this.http.post(url, { quoteId: body.quoteId }, { headers: this.headers() }).toPromise();
this.logger.debug('createTrade response: ' + JSON.stringify(res.data));
return res.data;
}


async getTrade(tradeId: string) {
const url = `${this.base}/v1/exchange/trades/${tradeId}`;
const res: AxiosResponse = await this.http.get(url, { headers: this.headers() }).toPromise();
return res.data;
}


async createBusinessBank(body: any) {
const url = `${this.base}/v1/businessAccount/banks/wires`;
const res: AxiosResponse = await this.http.post(url, body, { headers: this.headers() }).toPromise();
return res.data;
}


async createPayout(body: any) {
const url = `${this.base}/v1/businessAccount/payouts`;
const res: AxiosResponse = await this.http.post(url, body, { headers: this.headers() }).toPromise();
return res.data;
}
}