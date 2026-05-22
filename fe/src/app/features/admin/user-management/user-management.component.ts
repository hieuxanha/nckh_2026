import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/service/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div
      class="flex-1 flex flex-col bg-[#0a0f16] font-['Manrope'] text-white min-h-screen"
    >
      <div class="px-8 pt-6 flex justify-between items-center">
        <nav class="text-xs text-gray-500 flex gap-1 items-center">
          <span class="hover:text-white cursor-pointer">Trang chủ</span>
          <span class="text-gray-700">/</span>
          <span class="text-gray-300">Quản lý Người dùng</span>
        </nav>
        <div class="flex items-center gap-4">
          <span
            class="material-symbols-outlined text-gray-400 text-xl cursor-pointer"
            >notifications</span
          >
          <span
            class="material-symbols-outlined text-gray-400 text-xl cursor-pointer"
            >settings</span
          >
          <div
            class="size-8 rounded-full bg-[#f3d3c1] flex items-center justify-center text-black text-xs font-bold overflow-hidden"
          >
            <span class="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>

      <header class="px-8 py-8 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-white">
            Quản lý Người dùng
          </h1>
          <p class="text-gray-500 text-sm mt-2">
            Xem danh sách, phân quyền và quản lý trạng thái hoạt động của tài
            khoản.
          </p>
        </div>
        <button
          class="bg-[#1e78f2] hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          Thêm người dùng mới
        </button>
      </header>

      <div class="flex-1 px-8 pb-8 flex flex-col">
        <div
          class="bg-[#131924]/40 rounded-3xl border border-gray-800/50 p-8 shadow-2xl flex flex-col gap-6"
        >
          <div class="flex items-center gap-4">
            <div class="relative flex-1">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
                >search</span
              >
              <input
                class="pl-12 pr-4 py-3 bg-[#0d121b] border border-gray-800 rounded-xl text-sm w-full focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder:text-gray-600"
                placeholder="Tìm kiếm theo tên, email hoặc ID..."
                type="text"
              />
            </div>
            <div class="relative min-w-[180px]">
              <select
                class="appearance-none w-full px-4 py-3 bg-[#0d121b] border border-gray-800 rounded-xl text-sm text-gray-300 outline-none"
              >
                <option>Tất cả vai trò</option>
              </select>
              <span
                class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                >expand_more</span
              >
            </div>
            <div class="relative min-w-[180px]">
              <select
                class="appearance-none w-full px-4 py-3 bg-[#0d121b] border border-gray-800 rounded-xl text-sm text-gray-300 outline-none"
              >
                <option>Tất cả trạng thái</option>
              </select>
              <span
                class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                >expand_more</span
              >
            </div>
            <button
              class="bg-[#0d121b] border border-gray-800 p-3 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              <span class="material-symbols-outlined">download</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr
                  class="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em]"
                >
                  <th class="px-6 py-4 border-b border-gray-800/50">
                    Người dùng
                  </th>
                  <th class="px-6 py-4 border-b border-gray-800/50">Email</th>
                  <th class="px-6 py-4 border-b border-gray-800/50 text-center">
                    Vai trò
                  </th>
                  <th class="px-6 py-4 border-b border-gray-800/50 text-center">
                    Ngày tham gia
                  </th>
                  <th class="px-6 py-4 border-b border-gray-800/50 text-center">
                    Trạng thái
                  </th>
                  <th class="px-6 py-4 border-b border-gray-800/50 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800/30">
                <tr
                  *ngFor="let user of users"
                  class="group transition-colors hover:bg-white/[0.02]"
                >
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div
                        class="size-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-sm font-bold border border-gray-700"
                      >
                        <img
                          *ngIf="user.avatar"
                          [src]="user.avatar"
                          class="w-full h-full object-cover"
                        />
                        <span *ngIf="!user.avatar" [style.color]="'white'">{{
                          user.initials
                        }}</span>
                      </div>
                      <div>
                        <p class="font-bold text-sm text-gray-200">
                          {{ user.name }}
                        </p>
                        <p class="text-gray-600 text-[10px] mt-0.5">
                          ID: #{{ user.id }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5 text-gray-400 text-sm italic">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-5 text-center">
                    <span
                      [ngClass]="{
                        'bg-blue-500/10 text-blue-500': user.role === 'Admin',
                        'bg-purple-500/10 text-purple-400':
                          user.role === 'Bác sĩ',
                        'bg-gray-500/10 text-gray-400': user.role === 'User',
                      }"
                      class="px-3 py-1 rounded-full text-[10px] font-bold border border-current/10"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-center text-gray-400 text-sm">
                    {{ user.joinDate }}
                  </td>
                  <td class="px-6 py-5 text-center">
                    <span
                      [ngClass]="{
                        'bg-green-500/10 text-green-500':
                          user.status === 'Hoạt động',
                        'bg-red-500/10 text-red-500': user.status === 'Đã khóa',
                        'bg-yellow-500/10 text-yellow-500':
                          user.status === 'Chờ duyệt',
                      }"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-current/5"
                    >
                      <span
                        *ngIf="user.status === 'Hoạt động'"
                        class="w-1.5 h-1.5 rounded-full bg-green-500"
                      ></span>
                      <span
                        *ngIf="user.status === 'Đã khóa'"
                        class="w-1.5 h-1.5 rounded-full bg-red-500"
                      ></span>
                      <span
                        *ngIf="user.status === 'Chờ duyệt'"
                        class="w-1.5 h-1.5 rounded-full bg-yellow-500"
                      ></span>
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        *ngIf="user.status === 'Chờ duyệt'"
                        class="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Duyệt"
                      >
                        <span class="material-symbols-outlined text-xl"
                          >check_circle</span
                        >
                      </button>
                      <button
                        class="p-2 text-gray-500 hover:text-white transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span class="material-symbols-outlined text-xl italic"
                          >edit</span
                        >
                      </button>
                      <button
                        *ngIf="user.status !== 'Đã khóa'"
                        class="p-2 text-gray-500 hover:text-white transition-colors"
                        title="Khóa"
                      >
                        <span class="material-symbols-outlined text-xl"
                          >lock</span
                        >
                      </button>
                      <button
                        *ngIf="user.status === 'Đã khóa'"
                        class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Đang bị khóa"
                      >
                        <span class="material-symbols-outlined text-xl"
                          >lock_open</span
                        >
                      </button>
                      <button
                        (click)="deleteUser(user.id)"
                        class="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <span class="material-symbols-outlined text-xl"
                          >delete</span
                        >
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            class="pt-6 border-t border-gray-800/50 flex justify-between items-center text-sm"
          >
            <p class="text-gray-500">
              Hiển thị <span class="text-white font-bold">1</span> đến
              <span class="text-white font-bold">5</span> trong số
              <span class="text-white font-bold">42</span> người dùng
            </p>
            <div class="flex items-center gap-1">
              <button
                class="size-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-800"
              >
                <span class="material-symbols-outlined text-sm"
                  >chevron_left</span
                >
              </button>
              <button
                class="size-8 rounded-lg bg-blue-600 text-white font-bold border border-blue-500"
              >
                1
              </button>
              <button
                class="size-8 rounded-lg border border-gray-800 text-gray-500 font-bold hover:bg-gray-800 transition-colors"
              >
                2
              </button>
              <button
                class="size-8 rounded-lg border border-gray-800 text-gray-500 font-bold hover:bg-gray-800 transition-colors"
              >
                3
              </button>
              <span class="px-2 text-gray-600 font-bold">...</span>
              <button
                class="size-8 rounded-lg border border-gray-800 text-gray-500 font-bold hover:bg-gray-800 transition-colors"
              >
                8
              </button>
              <button
                class="size-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-800"
              >
                <span class="material-symbols-outlined text-sm"
                  >chevron_right</span
                >
              </button>
            </div>
          </div>
        </div>

        <footer class="mt-auto pt-10 pb-4 text-center">
          <p
            class="text-gray-700 text-[10px] tracking-widest uppercase font-medium"
          >
            © 2024 Pneumonia AI Project. All rights reserved. Developed for
            medical research purposes.
          </p>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
      :host {
        display: block;
      }
      /* Custom scrollbar to match the dark aesthetic */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: #0a0f16;
      }
      ::-webkit-scrollbar-thumb {
        background: #1a222c;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #2563eb;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Đã tải danh sách người dùng thực tế!');
      },
      error: (err) => {
        alert('Không thể tải danh sách. Có thể bạn không có quyền Admin!');
      },
    });
  }

  deleteUser(dbId: number) {
    if (confirm('Xóa người dùng này?')) {
      this.userService.deleteUser(dbId).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
