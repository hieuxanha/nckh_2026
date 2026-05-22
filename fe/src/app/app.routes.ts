import { Routes } from '@angular/router';
import { LoginComponent } from './features/user/auth/login/login.component';
import { RegisterComponent } from './features/user/auth/register/register.component';
import { UserLayoutComponent } from './features/layout/user-layout/user-layout.component';
import { DashboardComponent } from './features/user/dashboard/dashboard.component';
import { AnalysisComponent } from './features/user/analysis/analysis.component';
import { HistoryComponent } from './features/user/history/history.component'; // Import thêm History

import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './features/layout/admin-layout/admin-layout.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { ModelEvaluationComponent } from './features/admin/model-evaluation/model-evaluation.component';
import { ReportExportComponent } from './features/admin/report-export/report-export.component';

import { MedicalRecordsComponent } from './features/user/records/medical-records.component';
import { ChatComponent } from './features/user/chat/chat.component';
import { SettingsComponent } from './features/user/settings/settings.component';
import { UserReportExportComponent } from './features/user/report-export/user-report-export.component';
import { UserStatisticsComponent } from './features/user/statistics/user-statistics.component';
// Sửa lại trong file app.routes.ts

export const routes: Routes = [
  // 1. Điều hướng mặc định khi mở ứng dụng
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 2. Nhóm các route Xác thực (Không có Sidebar/Header chung)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Đăng nhập - X-Ray AI Analysis',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Đăng ký - X-Ray AI Analysis',
      },
    ],
  },

  // 3. Nhóm các route chức năng của Bác sĩ (Có Sidebar cố định)
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Tổng quan - MedAI Dashboard',
      },
      {
        path: 'analysis',
        component: AnalysisComponent,
        title: 'Phân tích X-quang - MedAI',
      },
      {
        path: 'history',
        component: HistoryComponent,
        title: 'Lịch sử chẩn đoán - MedAI',
      },
      {
        path: 'records',
        component: MedicalRecordsComponent,
        title: 'Lịch s - MedAI',
      },
      {
        path: 'chat',
        component: ChatComponent,
        title: 'Chat Bot - MedAI',
      },
      {
        path: 'settings',
        component: SettingsComponent,
        title: 'Cài đặt người dùng - MedAI',
      },
      {
        path: 'statistics',
        component: UserStatisticsComponent,
        title: 'Thống kê người dùng - MedAI',
      },
      {
        path: 'reports',
        component: UserReportExportComponent,
        title: 'Xuất báo cáo - MedAI',
      },
      // Tự động chuyển về dashboard nếu chỉ nhập /user
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        title: 'Admin Dashboard - MedAI',
      },
      {
        path: 'users',
        component: UserManagementComponent,
        title: 'Quản lý người dùng - MedAI',
      },
      {
        path: 'models',
        component: ModelEvaluationComponent,
        title: 'Quản lý & Đánh giá Mô hình DL - MedAI',
      },
      {
        path: 'reports',
        component: ReportExportComponent,
        title: 'Xuất Báo cáo Hệ thống - MedAI',
      },
    ],
  },

  // 4. Xử lý lỗi 404 - Chuyển hướng về Login nếu gõ sai URL
  { path: '**', redirectTo: 'auth/login' },
];
