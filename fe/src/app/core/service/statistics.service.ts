import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ── Response interfaces ──────────────────────────────────────────

export interface OverviewStats {
  total: number;
  pneumonia: number;
  normal: number;
  pneumonia_rate: number;
  normal_rate: number;
  avg_confidence: number;
}

export interface ChartDataItem {
  label: string;
  normal: number;
  pneumonia: number;
}

export interface ChartResponse {
  period: string;
  data: ChartDataItem[];
}

// ── Service ──────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly API_URL = `${environment.apiUrl}/api/statistics`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * GET /api/statistics/overview
   * Tổng ca, viêm phổi, bình thường, tỷ lệ %, độ tin cậy TB
   */
  getOverview(): Observable<OverviewStats> {
    return this.http.get<OverviewStats>(`${this.API_URL}/overview`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * GET /api/statistics/chart?period=month|week|day
   * Dữ liệu bar chart theo kỳ
   */
  getChart(period: 'month' | 'week' | 'day'): Observable<ChartResponse> {
    const params = new HttpParams().set('period', period);
    return this.http.get<ChartResponse>(`${this.API_URL}/chart`, {
      headers: this.getHeaders(),
      params,
    });
  }
}
