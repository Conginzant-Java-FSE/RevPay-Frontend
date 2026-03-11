import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// ─── Frankfurter (forex) ────────────────────────────────────────────────────
export interface FxRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// ─── CoinGecko (crypto) ─────────────────────────────────────────────────────
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

// ─── Precious Metals (via Frankfurter XAU/XAG — free, no key, CORS-safe) ────
export interface MetalPrice {
  metal: 'gold' | 'silver';
  price_usd: number;           // price per troy oz in USD
  price_inr: number;           // price per troy oz in INR
  price_inr_per_gram: number;  // price per gram in INR (1 troy oz = 31.1035 g)
  date: string;                // quote date from Frankfurter
  change_24h_pct: number | null;
}

// ─── Alpha Vantage (stocks) ─────────────────────────────────────────────────
export interface AlphaGlobalQuote {
  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '10. change percent': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '08. previous close': string;
    '07. latest trading day': string;
  };
}

export interface NormalizedStock {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  tradingDay: string;
}

export interface NormalizedCrypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  volume: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class LiveMarketService {
  private readonly http = inject(HttpClient);

  // ── Forex via Frankfurter (completely free, no key) ──────────────────────
  getFxRates(base = 'USD'): Observable<FxRateResponse> {
    return this.http.get<FxRateResponse>(
      `https://api.frankfurter.app/latest?from=${base}&to=INR,EUR,GBP,AUD,CAD,JPY,SGD,CHF`
    );
  }

  // ── Crypto via CoinGecko (free, no key required) ─────────────────────────
  getCryptoPrices(): Observable<NormalizedCrypto[]> {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets' +
      '?vs_currency=usd&ids=bitcoin,ethereum,ripple,binancecoin,solana' +
      '&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h';
    return this.http.get<CryptoPrice[]>(url).pipe(
      map(list =>
        list.map(c => ({
          id: c.id,
          symbol: c.symbol.toUpperCase(),
          name: c.name,
          price: c.current_price,
          change24h: c.price_change_percentage_24h,
          high24h: c.high_24h,
          low24h: c.low_24h,
          marketCap: c.market_cap,
          volume: c.total_volume,
          image: c.image,
        }))
      ),
      catchError(() => of([]))
    );
  }

  // ── Gold & Silver via Frankfurter XAU/XAG (free, no key, CORS-safe) ────────
  // XAU = ISO code for gold, XAG = ISO code for silver
  // 1 troy oz = 31.1035 grams (standard international unit)
  private readonly TROY_OZ_TO_GRAM = 31.1035;

  getMetalPrices(): Observable<MetalPrice[]> {
    const goldUrl = 'https://api.frankfurter.app/latest?from=XAU&to=INR,USD';
    const silverUrl = 'https://api.frankfurter.app/latest?from=XAG&to=INR,USD';

    const fallbackGold: FxRateResponse = { base: 'XAU', date: '', rates: { INR: 251000, USD: 2920 } };
    const fallbackSilver: FxRateResponse = { base: 'XAG', date: '', rates: { INR: 2900, USD: 32 } };

    return forkJoin([
      this.http.get<FxRateResponse>(goldUrl).pipe(catchError(() => of(fallbackGold))),
      this.http.get<FxRateResponse>(silverUrl).pipe(catchError(() => of(fallbackSilver))),
    ]).pipe(
      map(([goldResp, silverResp]) => {
        const goldUsd = goldResp.rates['USD'] ?? 0;
        const goldInr = goldResp.rates['INR'] ?? 0;
        const silverUsd = silverResp.rates['USD'] ?? 0;
        const silverInr = silverResp.rates['INR'] ?? 0;

        return [
          {
            metal: 'gold' as const,
            price_usd: goldUsd,
            price_inr: goldInr,
            price_inr_per_gram: goldInr / this.TROY_OZ_TO_GRAM,
            date: goldResp.date,
            change_24h_pct: null, // Frankfurter does not provide 24h change
          },
          {
            metal: 'silver' as const,
            price_usd: silverUsd,
            price_inr: silverInr,
            price_inr_per_gram: silverInr / this.TROY_OZ_TO_GRAM,
            date: silverResp.date,
            change_24h_pct: null,
          },
        ];
      })
    );
  }

  // ── Stocks via Alpha Vantage (free tier: 25 req/day) ─────────────────────
  // Use 'demo' key for IBM only; provide your own key for all symbols.
  getStockQuote(symbol: string, apiKey = 'demo'): Observable<NormalizedStock | null> {
    const url =
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE` +
      `&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
    return this.http.get<AlphaGlobalQuote>(url).pipe(
      map(res => {
        const q = res?.['Global Quote'];
        if (!q || !q['01. symbol']) return null;
        return {
          symbol: q['01. symbol'],
          price: parseFloat(q['05. price']),
          change: parseFloat(q['09. change']),
          changePct: parseFloat(q['10. change percent']),
          open: parseFloat(q['02. open']),
          high: parseFloat(q['03. high']),
          low: parseFloat(q['04. low']),
          prevClose: parseFloat(q['08. previous close']),
          tradingDay: q['07. latest trading day'],
        };
      }),
      catchError(() => of(null))
    );
  }
}