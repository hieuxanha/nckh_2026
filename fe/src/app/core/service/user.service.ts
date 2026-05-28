import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Tạo interface để code có gợi ý (Intellisense) và ít lỗi
export interface UserResponse {
  id: string; // USR-2026-001
  db_id: number; // ID thật trong database
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  initials: string;
  roleClass: string;
  statusClass: string;
  dotClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Đường dẫn đến Blueprint auth trong Flask của Hiếu
  private readonly API_URL = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  /**
   * 1. Lấy danh sách tất cả người dùng
   */
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.API_URL}/users`);
  }

  /**
   * 2. Cập nhật trạng thái người dùng (Khóa/Mở khóa/Duyệt)
   * @param dbId ID số trong database
   * @param status 'active' | 'locked' | 'pending'
   */
  updateUserStatus(dbId: number, status: string): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${dbId}/status`, { status });
  }

  /**
   * 3. Xóa người dùng vĩnh viễn
   * @param dbId ID số trong database
   */
  deleteUser(dbId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${dbId}`);
  }
}
