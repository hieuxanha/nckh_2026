import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AnalysisService } from '../../../core/service/analysis.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-20 flex-shrink-0 bg-white dark:bg-[#111418]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#2A3441] px-8 flex items-center justify-between z-10 sticky top-0">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Xin chào, {{userName}} 👋</h2>
        <p class="text-[#9dabb9] text-sm">Hệ thống AI đã sẵn sàng chẩn đoán cho các ca chụp hôm nay.</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative hidden md:block">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9dabb9] text-xl">search</span>
          <input class="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#1A222C] border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#137fec] text-slate-900 dark:text-white placeholder:text-[#9dabb9]" placeholder="Tìm ID bệnh nhân..." type="text"/>
        </div>
        <button (click)="onLogout()" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
          <span class="material-symbols-outlined">logout</span>
          <span class="hidden md:inline">Đăng xuất</span>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8 scroll-smooth">
      <div class="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-[#1A222C] p-5 rounded-xl border border-slate-200 dark:border-[#2A3441] shadow-sm">
            <div class="flex justify-between items-start mb-4">
              <div class="p-2 bg-blue-500/10 rounded-lg text-[#137fec]"><span class="material-symbols-outlined">imagesmode</span></div>
              <span class="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p class="text-[#9dabb9] text-sm font-medium">Tổng số ảnh đã quét</p>
            <h3 class="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{{stats.total}}</h3>
          </div>

          <div class="bg-white dark:bg-[#1A222C] p-5 rounded-xl border border-slate-200 dark:border-[#2A3441] shadow-sm">
            <div class="flex justify-between items-start mb-4">
              <div class="p-2 bg-red-500/10 rounded-lg text-red-500"><span class="material-symbols-outlined">coronavirus</span></div>
              <span class="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">+5%</span>
            </div>
            <p class="text-[#9dabb9] text-sm font-medium">Phát hiện Viêm phổi</p>
            <h3 class="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{{stats.pneumonia}}</h3>
          </div>

          <div class="bg-white dark:bg-[#1A222C] p-5 rounded-xl border border-slate-200 dark:border-[#2A3441] shadow-sm">
            <div class="flex justify-between items-start mb-4 text-orange-500">
              <div class="p-2 bg-orange-500/10 rounded-lg"><span class="material-symbols-outlined">pie_chart</span></div>
            </div>
            <p class="text-[#9dabb9] text-sm font-medium">Tỷ lệ dương tính</p>
            <h3 class="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{{stats.positive_rate}}</h3>
          </div>

          <div class="bg-white dark:bg-[#1A222C] p-5 rounded-xl border border-slate-200 dark:border-[#2A3441] shadow-sm">
            <div class="flex justify-between items-start mb-4 text-purple-500">
              <div class="p-2 bg-purple-500/10 rounded-lg"><span class="material-symbols-outlined">model_training</span></div>
            </div>
            <p class="text-[#9dabb9] text-sm font-medium">Phiên bản AI Model</p>
            <h3 class="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{{stats.ai_version}}</h3>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 flex flex-col gap-6">
            <div class="bg-white dark:bg-[#1A222C] rounded-xl border border-slate-200 dark:border-[#2A3441] p-6 flex flex-col h-full">
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                <span class="material-symbols-outlined text-[#137fec]">cloud_upload</span> Tải lên ảnh X-quang
              </h3>
              <div class="flex-1 border-2 border-dashed border-slate-300 dark:border-[#2A3441] rounded-xl bg-slate-50 dark:bg-[#111418] flex flex-col items-center justify-center p-8 text-center transition-colors hover:border-[#137fec]/50 group cursor-pointer">
                <div class="w-16 h-16 bg-slate-200 dark:bg-[#2A3441] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#137fec]/10 transition-colors">
                  <span class="material-symbols-outlined text-3xl text-[#9dabb9] group-hover:text-[#137fec]">upload_file</span>
                </div>
                <p class="text-sm font-medium text-slate-900 dark:text-white mb-2">Kéo thả file DICOM hoặc ảnh vào đây</p>
                <p class="text-xs text-[#9dabb9] mb-6">Hỗ trợ JPG, PNG (Max 50MB)</p>
                <button class="bg-[#137fec] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors w-full shadow-lg shadow-blue-500/20">Chọn từ máy tính</button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-[#1A222C] rounded-xl border border-slate-200 dark:border-[#2A3441] flex flex-col overflow-hidden h-full shadow-sm">
              <div class="p-6 border-b border-slate-200 dark:border-[#2A3441] flex justify-between items-center">
                <h3 class="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <span class="material-symbols-outlined text-[#9dabb9]">format_list_bulleted</span> Phân tích gần đây
                </h3>
                <button routerLink="/user/history" class="text-[#137fec] text-sm font-bold hover:underline">Xem tất cả</button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-slate-50 dark:bg-[#151b23] text-xs uppercase text-[#9dabb9] font-semibold">
                    <tr>
                      <th class="p-4 pl-6">ID Bệnh nhân</th>
                      <th class="p-4">Tên Bệnh nhân</th>
                      <th class="p-4">Kết quả AI</th>
                      <th class="p-4 text-right">Độ tin cậy</th>
                      <th class="p-4 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-[#2A3441] text-sm">
                    <tr *ngFor="let item of recentAnalyses" class="hover:bg-slate-50 dark:hover:bg-[#202a36] transition-colors group">
                      <td class="p-4 pl-6 font-medium text-slate-900 dark:text-white">{{item.id}}</td>
                      <td class="p-4 text-slate-900 dark:text-white">{{item.ten}}</td>
                      <td class="p-4">
                        <span [ngClass]="item.statusClass" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border">
                          <span class="w-1.5 h-1.5 rounded-full" [ngClass]="item.dotClass"></span>
                          {{item.result}}
                        </span>
                      </td>
                      <td class="p-4 text-right font-bold text-slate-900 dark:text-white">{{item.confidence}}</td>
                      <td class="p-4 text-center">
                        <button class="text-[#9dabb9] hover:text-[#137fec] transition-colors p-1">
                          <span class="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>

                    <tr *ngIf="recentAnalyses.length === 0">
                      <td colspan="5" class="p-12 text-center text-[#9dabb9]">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-20">cloud_off</span>
                        <p>Đang tải dữ liệu hoặc chưa có ca phân tích nào...</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  userName = localStorage.getItem('user_name') || 'Bác sĩ';
  stats = { total: 0, pneumonia: 0, positive_rate: '0%', ai_version: 'v2.4.1' };
  recentAnalyses: any[] = [];

  constructor(private analysisService: AnalysisService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.analysisService.getDashboardStats().subscribe({
      next: (res) => this.stats = res,
      error: (err) => console.error("Lỗi stats:", err)
    });

    this.analysisService.getRecentHistory(5).subscribe({
      next: (res) => this.recentAnalyses = res,
      error: (err) => console.error("Lỗi list:", err)
    });
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}