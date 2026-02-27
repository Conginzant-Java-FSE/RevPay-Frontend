import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, UserProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private base = `${environment.apiBaseUrl}/profile`;

  constructor(private http: HttpClient) {}

  getMe(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.base}/me`);
  }

  updatePersonal(payload: { fullName?: string; phone?: string; address?: string; dob?: string }): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.base}/personal/update`, payload);
  }

  updateBusiness(payload: { businessName?: string; businessType?: string; taxId?: string; contactPhone?: string; website?: string }): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.base}/business/update`, payload);
  }

  changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/change-password`, payload);
  }

  changePin(payload: { currentPin?: string; newPin: string; confirmPin: string }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/change-pin`, payload);
  }
}