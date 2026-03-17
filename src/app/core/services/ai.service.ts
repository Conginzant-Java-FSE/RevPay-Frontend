import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiBaseUrl}/ai/chat`;
  private publicApiUrl = `${environment.apiBaseUrl}/ai/public-chat`;

  constructor(private http: HttpClient) {}

  /** Authenticated chat — requires JWT (injected by HTTP interceptor) */
  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, request);
  }

  /** Public chat — no auth required, general RevPay FAQ only */
  sendPublicMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.publicApiUrl, request);
  }
}
