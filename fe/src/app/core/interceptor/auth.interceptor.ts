// ✅ Quan trọng nhất là dòng import này này Hiếu!
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Lấy token từ LocalStorage
  const token = localStorage.getItem('access_token');

  // Kiểm tra token để tránh gửi "null" lên Backend gây lỗi 422
  if (token && token !== 'null' && token !== 'undefined') {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // Nếu không có token, gửi request gốc đi
  return next(req);
};
