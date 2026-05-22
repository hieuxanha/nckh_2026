import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="flex h-screen w-full overflow-hidden bg-white dark:bg-[#101922] transition-colors duration-200"
    >
      <aside
        class="flex w-72 flex-col border-r border-[#e5e7eb] dark:border-[#22282f] bg-white dark:bg-[#111418] transition-colors h-full"
      >
        <div class="p-6 flex items-center gap-3">
          <div
            class="rounded-lg p-2 bg-[#137fec]/20 flex items-center justify-center text-[#137fec]"
          >
            <span class="material-symbols-outlined text-[24px]">radiology</span>
          </div>
          <div class="flex flex-col">
            <h1
              class="text-[#111418] dark:text-white text-lg font-bold leading-tight"
            >
              DeepX Ray
            </h1>
            <p
              class="text-[#637588] dark:text-[#9dabb9] text-xs font-medium leading-normal"
            >
              Admin Panel
            </p>
          </div>
        </div>

        <nav class="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
          <a
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-[#637588] dark:text-[#9dabb9] hover:bg-[#f3f4f6] dark:hover:bg-[#1A222C] transition-colors group"
            routerLink="/admin/dashboard"
            routerLinkActive="bg-[#137fec] !text-white shadow-lg shadow-[#137fec]/20"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <span class="material-symbols-outlined text-[20px]">dashboard</span>
            <p class="text-sm font-semibold leading-normal">Dashboard</p>
          </a>

          <a
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-[#637588] dark:text-[#9dabb9] hover:bg-[#f3f4f6] dark:hover:bg-[#1A222C] transition-colors group"
            routerLink="/admin/users"
            routerLinkActive="bg-[#137fec] !text-white shadow-lg shadow-[#137fec]/20"
          >
            <span class="material-symbols-outlined text-[20px]">group</span>
            <p class="text-sm font-medium leading-normal">Quản lý Người dùng</p>
          </a>

          <a
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-[#637588] dark:text-[#9dabb9] hover:bg-[#f3f4f6] dark:hover:bg-[#1A222C] transition-colors group"
            routerLink="/admin/models"
            routerLinkActive="bg-[#137fec] !text-white shadow-lg shadow-[#137fec]/20"
          >
            <span class="material-symbols-outlined text-[20px]"
              >deployed_code</span
            >
            <p class="text-sm font-medium leading-normal">Quản lý Mô hình</p>
          </a>

          <a
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-[#637588] dark:text-[#9dabb9] hover:bg-[#f3f4f6] dark:hover:bg-[#1A222C] transition-colors group"
            routerLink="/admin/reports"
            routerLinkActive="bg-[#137fec] !text-white shadow-lg shadow-[#137fec]/20"
          >
            <span class="material-symbols-outlined text-[20px]"
              >description</span
            >
            <p class="text-sm font-medium leading-normal">Báo cáo Hệ thống</p>
          </a>
        </nav>

        <div class="p-4 border-t border-[#e5e7eb] dark:border-[#2A3441]">
          <div
            class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1A222C] border border-slate-100 dark:border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
              [style.background-image]="
                avatarUrl ||
                'url(https://ui-avatars.com/api/?name=Admin&background=137fec&color=fff)'
              "
            ></div>

            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <p
                class="text-sm font-bold text-slate-800 dark:text-white truncate"
                title="{{ userName }}"
              >
                {{ userName }}
              </p>
              <p
                class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate"
              >
                Quản trị viên
              </p>
            </div>

            <button
              (click)="logout()"
              class="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors shrink-0 flex items-center justify-center"
              title="Đăng xuất"
            >
              <span class="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto bg-[#f6f7f8] dark:bg-[#101922]">
        <div class="min-h-full">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      /* Hiệu ứng chuyển màu cho Icon khi Menu được Active */
      .bg-\\[\\#137fec\\] span {
        color: white !important;
      }
      :host {
        display: block;
      }
    `,
  ],
})
export class AdminLayoutComponent implements OnInit {
  userName: String = ' Admin';
  avatarUrl: String = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      this.userName = storedName;
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
