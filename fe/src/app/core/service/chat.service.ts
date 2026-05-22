import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, { message, history });
  }
}
