import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, WalletBalance } from '../models';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private base = `${environment.apiBaseUrl}/wallet`;

  constructor(private http: HttpClient) {}

  getBalance(): Observable<ApiResponse<WalletBalance>> {
    return this.http.get<ApiResponse<WalletBalance>>(`${this.base}/balance`);
  }

  addFunds(cardId: number, amount: number, pin: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/add-funds`, { cardId, amount, pin });
  }

  withdraw(amount: number, pin: string, note?: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/withdraw`, { amount, pin, note });
  }

  getBankAccount(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/bank-account`);
  }

  updateBankAccount(payload: any): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/bank-account/update`, payload);
  }
}