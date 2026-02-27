import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse, Transaction, TransactionFilters } from '../models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private base = `${environment.apiBaseUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAll(filters: TransactionFilters = {}): Observable<PagedResponse<Transaction>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<PagedResponse<Transaction>>(this.base, { params });
  }

  getById(transactionId: string): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.base}/${transactionId}`);
  }

  export(format: 'CSV' | 'PDF'): Observable<Blob> {
    return this.http.get(`${this.base}/export`, {
      params: { format },
      responseType: 'blob',
    });
  }
}