import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse, Invoice, InvoiceSummary, InvoiceStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private base = `${environment.apiBaseUrl}/invoices`;

  constructor(private http: HttpClient) {}

  getAll(status?: InvoiceStatus): Observable<PagedResponse<Invoice>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<PagedResponse<Invoice>>(this.base, { params });
  }

  getById(id: number): Observable<ApiResponse<Invoice>> {
    return this.http.get<ApiResponse<Invoice>>(`${this.base}/${id}`);
  }

  create(payload: Partial<Invoice>): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(`${this.base}/create`, payload);
  }

  update(id: number, payload: Partial<Invoice>): Observable<ApiResponse<Invoice>> {
    return this.http.put<ApiResponse<Invoice>>(`${this.base}/${id}/update`, payload);
  }

  send(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${id}/send`, {});
  }

  markPaid(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${id}/mark-paid`, {});
  }

  cancel(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}/cancel`);
  }

  getSummary(): Observable<ApiResponse<InvoiceSummary>> {
    return this.http.get<ApiResponse<InvoiceSummary>>(`${this.base}/summary`);
  }
}