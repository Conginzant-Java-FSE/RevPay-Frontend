import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SplitService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/splits`;

  createSplit(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }

  getMySplits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getOwedSplits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/owed`);
  }

  payShare(splitId: number, pin: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${splitId}/pay`, { pin });
  }
}
