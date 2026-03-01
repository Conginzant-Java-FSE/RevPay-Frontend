import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Loan, PagedResponse, RepaymentSchedule } from '../models';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private base = `${environment.apiBaseUrl}/loans`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PagedResponse<Loan>> {
    return this.http.get<PagedResponse<Loan>>(this.base);
  }

  getById(loanId: number): Observable<ApiResponse<Loan>> {
    return this.http.get<ApiResponse<Loan>>(`${this.base}/${loanId}`);
  }

  apply(payload: {
    loanAmount: number;
    purpose: string;
    tenureMonths: number;
    annualRevenue: number;
    yearsInBusiness: number;
    employeeCount: number;
    collateral?: string;
  }): Observable<ApiResponse<Loan>> {
    return this.http.post<ApiResponse<Loan>>(`${this.base}/apply`, payload);
  }

  getRepaymentSchedule(loanId: number): Observable<ApiResponse<RepaymentSchedule[]>> {
    return this.http.get<ApiResponse<RepaymentSchedule[]>>(`${this.base}/${loanId}/repayment-schedule`);
  }

  repay(loanId: number, amount: number, pin: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/${loanId}/repay`, { amount, pin });
  }
}