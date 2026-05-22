import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header
      class="h-20 flex-shrink-0 bg-white dark:bg-[#111418] border-b border-slate-200 dark:border-[#2A3441] px-8 flex items-center z-10 transition-colors duration-300"
    >
      <div>
        <h2 class="text-2xl font-bold dark:text-slate-100 text-slate-800">Cài đặt hệ thống</h2>
        <p class="text-sm text-slate-500 dark:text-[#9dabb9]">
          Cấu hình giao diện và tài khoản người dùng
        </p>
      </div>
    </header>

    <div class="p-8 h-[calc(100vh-5rem)] overflow-y-auto bg-slate-50 dark:bg-transparent transition-colors duration-300">
      <div
        class="max-w-3xl mx-auto bg-white dark:bg-[#0f1417] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2A3441] p-8 transition-colors duration-300"
      >
        <h3 class="text-lg font-semibold mb-6 dark:text-slate-200 text-slate-800 border-b border-slate-100 dark:border-[#2A3441] pb-3">
          Tùy chỉnh giao diện
        </h3>
        
        <div class="flex items-center justify-between mb-8 p-4 bg-slate-50 dark:bg-[#161d22] rounded-xl border border-slate-100 dark:border-[#2A3441]">
          <div>
            <h4 class="font-medium dark:text-slate-200 text-slate-800">Chế độ màn hình</h4>
            <p class="text-sm text-slate-500 dark:text-[#9dabb9] mt-1">Chuyển đổi giữa giao diện Sáng (Trắng) và Tối (Đen)</p>
          </div>
          
          <button 
            (click)="toggleTheme()"
            class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none"
            [ngClass]="isDarkMode ? 'bg-[#137fec]' : 'bg-slate-300'"
          >
            <span 
              class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform"
              [ngClass]="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
        </div>

        <h3 class="text-lg font-semibold mb-6 dark:text-slate-200 text-slate-800 border-b border-slate-100 dark:border-[#2A3441] pb-3">
          Thông tin cá nhân
        </h3>
        
        <form (ngSubmit)="save()" class="flex flex-col gap-6">
          <label class="flex flex-col">
            <span class="text-sm font-medium text-slate-700 dark:text-[#9dabb9] mb-1.5">Tên hiển thị</span>
            <input
              [(ngModel)]="userName"
              name="userName"
              class="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161d22] border border-slate-200 dark:border-[#2A3441] focus:ring-2 focus:ring-[#137fec] focus:outline-none dark:text-slate-200 text-slate-800 transition-colors"
            />
          </label>

          <label class="flex flex-col">
            <span class="text-sm font-medium text-slate-700 dark:text-[#9dabb9] mb-1.5">Địa chỉ Email</span>
            <input
              [(ngModel)]="email"
              name="email"
              type="email"
              class="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161d22] border border-slate-200 dark:border-[#2A3441] focus:ring-2 focus:ring-[#137fec] focus:outline-none dark:text-slate-200 text-slate-800 transition-colors"
            />
          </label>

          <label class="flex items-center gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="notifications"
              name="notifications"
              class="w-5 h-5 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec] bg-slate-50 dark:bg-[#161d22] dark:border-[#2A3441]"
            />
            <span class="text-sm font-medium dark:text-slate-300 text-slate-700">Nhận thông báo cập nhật hệ thống</span>
          </label>

          <div class="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-[#2A3441]">
            <button
              type="submit"
              class="bg-[#137fec] hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Lưu cấu hình
            </button>
            <button
              type="button"
              (click)="reset()"
              class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A3441] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161d22] transition-colors"
            >
              Phục hồi
            </button>
            <span 
              class="text-sm font-medium ml-4 transition-opacity duration-300" 
              [ngClass]="saveMessage ? 'opacity-100 text-emerald-600 dark:text-emerald-400' : 'opacity-0'"
            >
              {{ saveMessage || 'Đã lưu' }}
            </span>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class SettingsComponent implements OnInit {
  userName: string = '';
  email: string = '';
  notifications: boolean = true;
  saveMessage: string = '';
  isDarkMode: boolean = true;

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || '';
    this.email = localStorage.getItem('user_email') || '';
    this.notifications = localStorage.getItem('user_notifications') !== 'false';
    
    // Check current theme
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  save() {
    localStorage.setItem('user_name', this.userName);
    localStorage.setItem('user_email', this.email);
    localStorage.setItem('user_notifications', String(this.notifications));
    this.saveMessage = 'Cập nhật cài đặt thành công!';
    setTimeout(() => (this.saveMessage = ''), 3000);
  }

  reset() {
    this.userName = localStorage.getItem('user_name') || '';
    this.email = localStorage.getItem('user_email') || '';
    this.notifications = localStorage.getItem('user_notifications') !== 'false';
  }
}
