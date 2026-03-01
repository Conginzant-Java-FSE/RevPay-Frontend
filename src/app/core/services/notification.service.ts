import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private base = `${environment.apiBaseUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(this.base);
  }

  markRead(notificationId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${notificationId}/read`, {});
  }

  markAllRead(): Observable<ApiResponse<void>> {
    return this.http.get<ApiResponse<void>>(`${this.base}/read-all`);
  }

  getPreferences(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/preferences`);
  }

  updatePreferences(prefs: any): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/preferences`, prefs);
  }
}