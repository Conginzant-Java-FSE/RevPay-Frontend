import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, MoneyRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class MoneyRequestService {
  private base = `${environment.apiBaseUrl}/money/requests`;

  constructor(private http: HttpClient) {}

  send(payload: { recipient: string; amount: number; note: string; pin: string }): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/send`, payload);
  }

  requestMoney(payload: { recipient: string; amount: number; purpose: string }): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/request`, payload);
  }

  getIncoming(): Observable<ApiResponse<MoneyRequest[]>> {
    return this.http.get<ApiResponse<MoneyRequest[]>>(`${this.base}/incoming`);
  }

  getOutgoing(): Observable<ApiResponse<MoneyRequest[]>> {
    return this.http.get<ApiResponse<MoneyRequest[]>>(`${this.base}/outgoing`);
  }

  accept(requestId: number, pin: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${requestId}/accept`, { pin });
  }

  decline(requestId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${requestId}/decline`, {});
  }

  cancel(requestId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${requestId}/cancel`);
  }
}