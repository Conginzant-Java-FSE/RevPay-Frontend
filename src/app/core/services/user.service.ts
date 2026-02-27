import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  UserProfile,
  PersonalProfileRequest,
  BusinessProfileRequest
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.base}/user/me`);
  }

  createPersonalProfile(payload: PersonalProfileRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.base}/user/create-personal-user`, payload
    );
  }

  createBusinessProfile(payload: BusinessProfileRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.base}/user/create-business-profile`, payload
    );
  }
}
