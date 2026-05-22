import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Định nghĩa cấu trúc dữ liệu mô hình
export interface ModelInfo {
  id_db: number;
  name: string;
  architecture: string;
  version: string;
  accuracy: string;
  f1Score: string;
  trainDate: string;
  status: string;
  dataset: string;
  statusClass?: string; // Dùng để render màu sắc ở FE
}

// 2. Định nghĩa kết quả đánh giá chi tiết
export interface EvaluationResult {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ModelEvaluationService {
  // Đường dẫn đến Flask API (Hiếu nhớ đăng ký Blueprint 'model' trong Flask nhé)
  private readonly API_URL = 'http://localhost:5000/api/models';

  constructor(private http: HttpClient) {}

  /**
   * 1. Lấy danh sách tất cả các phiên bản mô hình đã lưu
   */
  getModels(): Observable<ModelInfo[]> {
    return this.http.get<ModelInfo[]>(`${this.API_URL}/list`);
  }

  /**
   * 2. Chạy đánh giá thực tế trên tập dữ liệu Test
   * Backend sẽ load model và chạy inference để trả về các chỉ số
   */
  evaluateModel(modelId: number): Observable<EvaluationResult> {
    return this.http.post<EvaluationResult>(
      `${this.API_URL}/evaluate/${modelId}`,
      {},
    );
  }

  /**
   * 3. So sánh hiệu suất giữa các mô hình
   */
  compareModels(modelIds: number[]): Observable<any> {
    return this.http.post(`${this.API_URL}/compare`, { ids: modelIds });
  }

  /**
   * 4. Kích hoạt quá trình huấn luyện mô hình mới (Training)
   */
  startTraining(params: any): Observable<any> {
    return this.http.post(`${this.API_URL}/train`, params);
  }

  /**
   * 5. Chuyển đổi trạng thái Active cho model (Để chọn model nào sẽ dùng chẩn đoán)
   */
  setActiveModel(modelId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/set-active/${modelId}`, {});
  }

  /**
   * 6. Xóa mô hình (File .h5 hoặc .pth)
   */
  deleteModel(modelId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/delete/${modelId}`);
  }
}
