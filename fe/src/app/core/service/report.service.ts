import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportFilter {
  from_date?: string;
  to_date?: string;
  result_type?: string; // 'pneumonia' | 'normal' | ''
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly API_URL = `${environment.apiUrl}/api/report`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private buildParams(filter: ReportFilter): HttpParams {
    let params = new HttpParams();
    if (filter.from_date) params = params.set('from_date', filter.from_date);
    if (filter.to_date) params = params.set('to_date', filter.to_date);
    if (filter.result_type)
      params = params.set('result_type', filter.result_type);
    return params;
  }

  /**
   * Đếm số bản ghi phù hợp với bộ lọc (để hiển thị "Dự kiến X bản ghi").
   */
  countRecords(filter: ReportFilter): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/count`, {
      headers: this.getHeaders(),
      params: this.buildParams(filter),
    });
  }

  /**
   * Gọi API xuất CSV – trả về Blob để trình duyệt tải file.
   */
  exportCsv(filter: ReportFilter): Observable<Blob> {
    return this.http.get(`${this.API_URL}/export/csv`, {
      headers: this.getHeaders(),
      params: this.buildParams(filter),
      responseType: 'blob',
    });
  }

  /**
   * Kích hoạt tải file từ Blob (dùng chung cho cả CSV lẫn PDF sau này).
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
