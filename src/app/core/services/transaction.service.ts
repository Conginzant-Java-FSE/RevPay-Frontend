import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionListResponse, Transaction } from '../models';

export interface TransactionFilters {
  page?:   number;
  size?:   number;
  type?:   string;
  status?: string;
  from?:   string;
  to?:     string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private base = `${environment.apiBaseUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAll(filters: TransactionFilters = {}): Observable<TransactionListResponse> {
    let params = new HttpParams();
    if (filters.page   !== undefined) params = params.set('page',   filters.page);
    if (filters.size   !== undefined) params = params.set('size',   filters.size);
    if (filters.type   && filters.type   !== 'ALL') params = params.set('type',   filters.type);
    if (filters.status && filters.status !== 'ALL') params = params.set('status', filters.status);
    if (filters.from)   params = params.set('from',   filters.from);
    if (filters.to)     params = params.set('to',     filters.to);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<TransactionListResponse>(this.base, { params });
  }

  export(format: 'CSV' | 'PDF'): Observable<Blob> {
    return this.http.get(`${this.base}/export`, {
      params:       new HttpParams().set('format', format),
      responseType: 'blob',
    });
  }
}