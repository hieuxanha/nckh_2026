import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="font-display bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white h-screen overflow-hidden flex"
    >
      <!-- Backdrop for mobile -->
      <div *ngIf="isMobileMenuOpen" (click)="isMobileMenuOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden"></div>

      <aside
        [class.translate-x-0]="isMobileMenuOpen"
        [class.-translate-x-full]="!isMobileMenuOpen"
        class="absolute md:relative z-40 h-full w-72 flex-shrink-0 border-r border-slate-200 dark:border-[#2A3441] bg-white dark:bg-[#111418] flex flex-col transition-transform duration-300 md:translate-x-0"
      >
        <div class="p-6 flex items-center gap-3">
          <div class="bg-[#137fec]/20 p-2 rounded-lg text-[#137fec]">
            <span class="material-symbols-outlined text-3xl"
              >medical_services</span
            >
          </div>
          <div>
            <h1 class="text-lg font-bold leading-tight">MedAI X-Ray</h1>
            <p class="text-[#9dabb9] text-xs font-medium">Phân tích phổi AI</p>
          </div>
        </div>

        <nav class="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
          <a
            routerLink="/user/dashboard"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">dashboard</span>
            <span class="text-sm font-semibold">Tổng quan</span>
          </a>

          <a
            routerLink="/user/analysis"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">history</span>
            <span class="text-sm font-medium">Phân tích</span>
          </a>

          <a
            routerLink="/user/history"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">history</span>
            <span class="text-sm font-medium">Lịch sử chuẩn đoán</span>
          </a>

          <a
            routerLink="/user/records"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">folder_shared</span>
            <span class="text-sm font-medium">Quản lý bệnh án</span>
          </a>

          <a
            routerLink="/user/chat"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">chat</span>
            <span class="text-sm font-medium">Chat Bot</span>
          </a>

          <a
            routerLink="/user/statistics"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">insights</span>
            <span class="text-sm font-medium">Thống kê</span>
          </a>

          <div class="h-px bg-slate-200 dark:bg-[#2A3441] my-2"></div>

          <a
            routerLink="/user/settings"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">settings</span>
            <span class="text-sm font-medium">Cài đặt</span>
          </a>

          <a
            routerLink="/user/reports"
            routerLinkActive="bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#1A222C] transition-colors"
            (click)="isMobileMenuOpen = false"
          >
            <span class="material-symbols-outlined">description</span>
            <span class="text-sm font-medium">Xuất báo cáo</span>
          </a>
        </nav>

        <div class="p-4 border-t border-slate-200 dark:border-[#2A3441]">
          <div
            class="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-[#1A222C]"
          >
            <div
              class="w-10 h-10 rounded-full bg-cover bg-center bg-slate-300"
              [style.background-image]="avatarUrl || 'url(https://ui-avatars.com/api/?name=User&background=137fec&color=fff)'"
            ></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate">{{ userName }}</p>
              <p class="text-xs text-[#9dabb9] truncate">
                Khoa Chẩn đoán hình ảnh
              </p>
            </div>
            <button
              (click)="logout()"
              class="text-[#9dabb9] hover:text-red-500 transition-colors"
            >
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <!-- Mobile Header -->
        <header class="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111418] border-b border-slate-200 dark:border-[#2A3441] z-20 sticky top-0">
          <div class="flex items-center gap-3">
            <div class="bg-[#137fec]/20 p-2 rounded-lg text-[#137fec]">
              <span class="material-symbols-outlined text-2xl">medical_services</span>
            </div>
            <h1 class="text-lg font-bold leading-tight">MedAI X-Ray</h1>
          </div>
          <button (click)="isMobileMenuOpen = true" class="text-slate-600 dark:text-[#9dabb9] p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A222C]">
            <span class="material-symbols-outlined text-2xl">menu</span>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');

      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
})
export class UserLayoutComponent implements OnInit {
  isMobileMenuOpen: boolean = false;
  userName: String = ' Bác sĩ';

  avatarUrl: String = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      this.userName = storedName;
      // Tạo avatar tự động dựa trên tên
      this.avatarUrl = `url('https://ui-avatars.com/api/?name=${encodeURIComponent(storedName)}&background=137fec&color=fff')`;
    }
  }

  logout() {
    const confirmLogout = confirm(
      'Bạn có muốn đăng xuất khỏi hệ thống chẩn đoán?',
    );

    if (confirmLogout) {
      // 1. Xóa toàn bộ thông tin phiên làm việc
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');

      console.log('Đã đăng xuất.');

      // 2. Quay về trang đăng nhập
      this.router.navigate(['/auth/login']);
    }
  }
}
