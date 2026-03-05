import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../core/services/analytics.service';
import {
  AnalyticsSummary, RevenuePoint, TopCustomer, PaymentTrend, InvoiceSummary
} from '../../core/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  summary: AnalyticsSummary | null = null;
  revenue: RevenuePoint[] = [];
  topCustomers: TopCustomer[] = [];
  trends: PaymentTrend[] = [];
  invoiceSummary: InvoiceSummary | null = null;

  loading = true;
  revenuePeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY';

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading = true;
    let done = 0;
    const check = () => { if (++done >= 5) this.loading = false; };

    this.analyticsService.getSummary().subscribe({ next: (r) => { this.summary = r.data ?? null; check(); }, error: check });
    this.analyticsService.getRevenue(this.revenuePeriod).subscribe({ next: (r) => { this.revenue = r.data ?? []; check(); }, error: check });
    this.analyticsService.getTopCustomers().subscribe({ next: (r) => { this.topCustomers = r.data ?? []; check(); }, error: check });
    this.analyticsService.getPaymentTrends().subscribe({ next: (r) => { this.trends = r.data ?? []; check(); }, error: check });
    this.analyticsService.getInvoiceSummary().subscribe({ next: (r) => { this.invoiceSummary = r.data ?? null; check(); }, error: check });
  }

  changePeriod(p: 'DAILY' | 'WEEKLY' | 'MONTHLY'): void {
    this.revenuePeriod = p;
    this.analyticsService.getRevenue(p).subscribe({
      next: (r) => { this.revenue = r.data ?? []; },
    });
  }

  get maxRevenue(): number {
    return Math.max(...this.revenue.map(r => r.revenue), 1);
  }

  barHeight(point: RevenuePoint): number {
    return Math.round((point.revenue / this.maxRevenue) * 100);
  }

  get maxTrend(): number {
    return Math.max(...this.trends.map(t => Math.max(t.incoming, t.outgoing)), 1);
  }
}
