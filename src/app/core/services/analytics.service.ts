import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AnalyticsSummary, RevenuePoint, TopCustomer, PaymentTrend, InvoiceSummary } from '../models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = `${environment.apiBaseUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSummary(from?: string, to?: string): Observable<ApiResponse<AnalyticsSummary>> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<ApiResponse<AnalyticsSummary>>(`${this.base}/summary`, { params });
  }

  getRevenue(period: 'DAILY' | 'WEEKLY' | 'MONTHLY', from?: string, to?: string): Observable<ApiResponse<RevenuePoint[]>> {
    let params = new HttpParams().set('period', period);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<ApiResponse<RevenuePoint[]>>(`${this.base}/revenue`, { params });
  }

  getTopCustomers(limit = 5): Observable<ApiResponse<TopCustomer[]>> {
    return this.http.get<ApiResponse<TopCustomer[]>>(`${this.base}/top-customers`, {
      params: new HttpParams().set('limit', limit),
    });
  }

  getPaymentTrends(): Observable<ApiResponse<PaymentTrend[]>> {
    return this.http.get<ApiResponse<PaymentTrend[]>>(`${this.base}/payment-trends`);
  }

  getInvoiceSummary(): Observable<ApiResponse<InvoiceSummary>> {
    return this.http.get<ApiResponse<InvoiceSummary>>(`${this.base}/invoices/summary`);
  }
}