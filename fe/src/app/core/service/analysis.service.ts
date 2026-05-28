import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private apiUrl = `${environment.apiUrl}/api/analysis`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, {
      headers: this.getHeaders(),
    });
  }

  getRecentHistory(Limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list?limit=${Limit}`, {
      headers: this.getHeaders(),
    });
  }

  predict(formData: FormData): Observable<any> {
    // Không set Content-Type header, để HttpClient tự nhận diện multipart/form-data
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/predict`, formData, { headers });
  }

  // Trong AnalysisService
  deleteAnalysis(id: any) {
    // Đường dẫn giờ sẽ là: ${environment.apiUrl}/api/analysis/delete/PAT-xxx
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
