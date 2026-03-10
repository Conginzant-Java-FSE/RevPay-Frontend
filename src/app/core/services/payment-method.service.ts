import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaymentCard } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private base = `${environment.apiBaseUrl}/payment-methods`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<PaymentCard[]>> {
    return this.http.get<ApiResponse<PaymentCard[]>>(this.base);
  }

  add(payload: {
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    cardHolderName: string;
    nickname: string;
    setAsDefault: boolean;
    billingAddress: string;
  }): Observable<ApiResponse<PaymentCard>> {
    return this.http.post<ApiResponse<PaymentCard>>(`${this.base}/add`, payload);
  }

  update(cardId: number, payload: { nickname: string; billingAddress: string }): Observable<ApiResponse<PaymentCard>> {
    return this.http.put<ApiResponse<PaymentCard>>(`${this.base}/${cardId}/update`, payload);
  }

  delete(cardId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${cardId}/delete`);
  }

  setDefault(cardId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${cardId}/set-default`, {});
  }
}