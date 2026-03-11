import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, FraudLog, Loan, PagedResponse } from '../models';

const ADMIN_TOKEN_KEY = 'revpay_admin_token';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/admin`;

  // ── Token ───────────────────────────────────────────────────
  setToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }

  isAdminLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearAdminSession(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }

  // ── Admin Auth ──────────────────────────────────────────────
  login(email: string, password: string): Observable<{ token: string; adminId: string; email: string }> {
    return this.http.post<{ token: string; adminId: string; email: string }>(
      `${this.base}/login`,
      { email, password }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/logout`, {});
  }

  // ── Admin Loans (approve/reject) ─────────────────────────────
  getAllLoans(): Observable<PagedResponse<Loan>> {
    return this.http.get<PagedResponse<Loan>>(`${this.base}/loans`);
  }

  approveLoan(loanId: number): Observable<ApiResponse<Loan>> {
    return this.http.patch<ApiResponse<Loan>>(`${this.base}/loans/${loanId}/approve`, {});
  }

  rejectLoan(loanId: number, reason: string): Observable<ApiResponse<Loan>> {
    return this.http.patch<ApiResponse<Loan>>(`${this.base}/loans/${loanId}/reject`, { reason });
  }

  // ── Fraud Logs ──────────────────────────────────────────────
  getFraudLogs(): Observable<ApiResponse<FraudLog[]>> {
    return this.http.get<ApiResponse<FraudLog[]>>(`${this.base}/fraud-logs`);
  }

  blockUser(fraudLogId: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.base}/fraud-logs/${fraudLogId}/block`, {});
  }
}
