import {
  Component, OnDestroy, OnInit, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LiveMarketService,
  MetalPrice,
  NormalizedCrypto,
  NormalizedStock,
  FxRateResponse,
} from '../../core/services/live-market.service';
import { forkJoin } from 'rxjs';

// ── Stock symbols tracked via Alpha Vantage (free demo key works for IBM only)
// Add your own key at alphavantage.co to unlock all symbols
const STOCK_SYMBOLS = ['IBM', 'AAPL', 'MSFT', 'GOOGL'];
const ALPHA_KEY = 'F0F8K7LN9CHTYJD3'; // replace with your real key

@Component({
  selector: 'app-live-market',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-market.component.html',
  styleUrls: ['./live-market.component.scss'],
})
export class LiveMarketComponent implements OnInit, OnDestroy {
  // ── Loading states ────────────────────────────────────────────────────────
  readonly loadingMetals = signal(true);
  readonly loadingCrypto = signal(true);
  readonly loadingFx = signal(true);
  readonly loadingStocks = signal(true);

  // ── Data ─────────────────────────────────────────────────────────────────
  readonly metals = signal<MetalPrice[]>([]);
  readonly cryptos = signal<NormalizedCrypto[]>([]);
  readonly fxRates = signal<{ currency: string; rate: number }[]>([]);
  readonly fxDate = signal<string | null>(null);
  readonly stocks = signal<NormalizedStock[]>([]);

  // ── Misc ─────────────────────────────────────────────────────────────────
  readonly lastRefresh = signal<Date | null>(null);
  readonly error = signal<string | null>(null);

  readonly anyLoading = computed(() =>
    this.loadingMetals() || this.loadingCrypto() || this.loadingFx() || this.loadingStocks()
  );

  private refreshHandle?: ReturnType<typeof setInterval>;
  private readonly REFRESH_MS = 60_000; // 60 s

  constructor(private svc: LiveMarketService) { }

  ngOnInit(): void {
    this.refresh();
    this.refreshHandle = setInterval(() => this.refresh(), this.REFRESH_MS);
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) clearInterval(this.refreshHandle);
  }

  // ── Public helpers ────────────────────────────────────────────────────────
  changeClass(val: number | null): string {
    if (val === null || val === undefined) return '';
    return val > 0 ? 'pos' : val < 0 ? 'neg' : 'flat';
  }

  sign(val: number | null): string {
    if (!val) return '';
    return val > 0 ? '+' : '';
  }

  formatMarketCap(val: number): string {
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    return val.toFixed(0);
  }

  formatVolume(val: number): string {
    return this.formatMarketCap(val);
  }

  // ── Max FX rate for bar chart ─────────────────────────────────────────────
  readonly maxFxRate = computed(() => {
    const rows = this.fxRates();
    return rows.length ? Math.max(...rows.map(r => r.rate), 1) : 1;
  });

  barWidth(rate: number): number {
    return Math.round((rate / this.maxFxRate()) * 100);
  }

  manualRefresh(): void {
    this.refresh();
  }

  // ── Internal: orchestrate API calls ──────────────────────────────────────
  private refresh(): void {
    this.error.set(null);
    this.lastRefresh.set(new Date());
    this.loadMetals();
    this.loadCrypto();
    this.loadFx();
    this.loadStocks();
  }

  private loadMetals(): void {
    this.loadingMetals.set(true);
    this.svc.getMetalPrices().subscribe({
      next: data => {
        this.metals.set(data);
        this.loadingMetals.set(false);
      },
      error: () => {
        this.loadingMetals.set(false);
        this.error.set('Unable to load metal prices. APIs may have CORS restrictions.');
      },
    });
  }

  private loadCrypto(): void {
    this.loadingCrypto.set(true);
    this.svc.getCryptoPrices().subscribe({
      next: data => {
        this.cryptos.set(data);
        this.loadingCrypto.set(false);
      },
      error: () => {
        this.loadingCrypto.set(false);
        this.error.set('Unable to load crypto prices.');
      },
    });
  }

  private loadFx(): void {
    this.loadingFx.set(true);
    this.svc.getFxRates('USD').subscribe({
      next: (res: FxRateResponse) => {
        const rows = Object.entries(res.rates)
          .map(([currency, rate]) => ({ currency, rate }))
          .sort((a, b) => a.currency.localeCompare(b.currency));
        this.fxRates.set(rows);
        this.fxDate.set(res.date ?? null);
        this.loadingFx.set(false);
      },
      error: () => {
        this.loadingFx.set(false);
        this.error.set('Unable to load FX rates.');
      },
    });
  }

  private loadStocks(): void {
    this.loadingStocks.set(true);
    // Alpha Vantage free = 25 req/day; demo key works only for IBM
    // Use only IBM for demo; user can replace ALPHA_KEY to get all symbols
    this.svc.getStockQuote('IBM', ALPHA_KEY).subscribe({
      next: q => {
        if (q) this.stocks.set([q]);
        else this.stocks.set([]);
        this.loadingStocks.set(false);
      },
      error: () => {
        this.loadingStocks.set(false);
      },
    });
  }
}