import { Injectable, Logger } from '@nestjs/common';
constructor(private readonly circle: CircleService) {}


async startOfframpFlow(dto: InitiateOfframpDto) {
// 1) Create quote
const quote = await this.createQuote({ from: dto.from, to: dto.to, amount: dto.amount });

async getCircleConfiguration() {
  return this.circle.getConfiguration();
}

// 2) Validate quote locally (business rules)
// -> In production, check limits, KYC, fees


// 3) Create trade
const trade = await this.createTrade(quote.id);


// 4) return pending status and trade/quote ids
return { quoteId: quote.id, tradeId: trade.id, status: 'pending_trade' };
}


async createQuote(body: CreateQuoteDto) {
// calls Circle API via CircleService
const payload = await this.circle.createQuote(body);
// map/validate before returning
return payload;
}


async createTrade(quoteId: string) {
const trade = await this.circle.createTrade({ quoteId });
return trade;
}


async handleCircleWebhook(payload: any) {
// Example payload contains tradeId and status
this.logger.debug('Received webhook: ' + JSON.stringify(payload));


if (payload.type === 'trade.completed' || payload.status === 'completed') {
// 1) fetch trade details
const trade = await this.circle.getTrade(payload.data?.tradeId || payload.data?.id);


// 2) create business account (if needed)
const bank = await this.circle.createBusinessBank({/* map from trade */});


// 3) create payout to destination account
const payout = await this.circle.createPayout({ destination: bank.id, amount: trade.amount });


return { ok: true, trade, bank, payout };
}


return { ok: true };
}


async createBusinessBank(body: any) {
return this.circle.createBusinessBank(body);
}


async createPayout(body: any) {
return this.circle.createPayout(body);
}
}