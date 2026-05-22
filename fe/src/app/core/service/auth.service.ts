import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Thay localhost bằng IP máy tính nếu chạy trên điện thoại thật
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(addData : any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,addData);
  }

}