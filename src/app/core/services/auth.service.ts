import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  accountType: 'PERSONAL' | 'BUSINESS';
  securityQuestion: string;
  securityAnswer: string;
  // Business-only fields
  businessName?: string;
  businessType?: string;
  taxId?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  accountType: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}`;

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload);
  }

  saveToken(token: string): void {
    localStorage.setItem('revpay_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('revpay_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem('revpay_token');
  }

  logout(): Observable<void> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}, { headers });
}

  verifyIdentity(emailOrPhone: string): Observable<{ securityQuestion: string }> {
    return this.http.post<{ securityQuestion: string }>(
      `${this.baseUrl}/auth/forgot-password/verify-identity`, { emailOrPhone }
    );
  }

  validateSecurity(payload: {
    emailOrPhone: string;
    securityQuestion: string;
    securityAnswer: string;
  }): Observable<{ resetToken: string }> {
    return this.http.post<{ resetToken: string }>(
      `${this.baseUrl}/auth/forgot-password/validate-security`, payload
    );
  }

  resetPassword(payload: {
    resetToken: string;
    newPassword: string;
  }): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/auth/forgot-password/reset`, payload
    );
  }

}
