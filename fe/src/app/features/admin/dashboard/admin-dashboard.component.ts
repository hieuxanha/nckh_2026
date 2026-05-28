import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { AnalysisService } from '../../../core/service/analysis.service';
import { StatisticsService } from '../../../core/service/statistics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="px-6 py-8 md:px-10 lg:px-12 max-w-[1440px] mx-auto flex flex-col gap-8"
    >
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div class="flex flex-col gap-1">
          <h1
            class="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]"
          >
            Dashboard Quản trị viên
          </h1>
          <p
            class="text-[#637588] dark:text-[#9dabb9] text-base font-normal leading-normal"
          >
            Tổng quan hệ thống và số liệu phân tích AI
          </p>
        </div>
        <div class="flex gap-3">
          <button
            class="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#1f262e] border border-[#e5e7eb] dark:border-[#22282f] text-[#111418] dark:text-white text-sm font-bold leading-normal shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a3441] transition-all"
          >
            <span class="material-symbols-outlined text-[20px] mr-2"
              >calendar_today</span
            >
            <span>Tháng này</span>
          </button>

          <button
            class="flex items-center justify-center rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold leading-normal hover:bg-[#137fec]/90 transition-colors shadow-md shadow-[#137fec]/20"
          >
            <span class="material-symbols-outlined text-[20px] mr-2"
              >download</span
            >
            <span class="truncate">Xuất báo cáo</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1d23] border border-[#e5e7eb] dark:border-[#22282f] shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div
              class="flex items-center justify-center size-10 rounded-full bg-[#137fec]/10 text-[#137fec]"
            >
              <span class="material-symbols-outlined text-[24px]"
                >image_search</span
              >
            </div>
            <span
              class="text-[#0bda5b] text-xs font-bold px-2 py-1 rounded-full bg-[#0bda5b]/10 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[14px]"
                >trending_up</span
              >
              +12%
            </span>
          </div>
          <p
            class="text-[#637588] dark:text-[#9dabb9] text-sm font-medium leading-normal"
          >
            Tổng ảnh đã phân tích
          </p>
          <p
            class="text-[#111418] dark:text-white text-3xl font-bold leading-tight"
          >
            {{ stats.total | number }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1d23] border border-[#e5e7eb] dark:border-[#22282f] shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div
              class="flex items-center justify-center size-10 rounded-full bg-[#fa6238]/10 text-[#fa6238]"
            >
              <span class="material-symbols-outlined text-[24px]"
                >pulmonology</span
              >
            </div>
            <span
              class="text-[#0bda5b] text-xs font-bold px-2 py-1 rounded-full bg-[#0bda5b]/10 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[14px]"
                >trending_up</span
              >
              +5%
            </span>
          </div>
          <p
            class="text-[#637588] dark:text-[#9dabb9] text-sm font-medium leading-normal"
          >
            Ca viêm phổi xác nhận
          </p>
          <p
            class="text-[#111418] dark:text-white text-3xl font-bold leading-tight"
          >
            {{ stats.pneumonia | number }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1d23] border border-[#e5e7eb] dark:border-[#22282f] shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div
              class="flex items-center justify-center size-10 rounded-full bg-[#0bda5b]/10 text-[#0bda5b]"
            >
              <span class="material-symbols-outlined text-[24px]"
                >check_circle</span
              >
            </div>
            <span
              class="text-[#fa6238] text-xs font-bold px-2 py-1 rounded-full bg-[#fa6238]/10 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[14px]"
                >trending_down</span
              >
              -2%
            </span>
          </div>
          <p
            class="text-[#637588] dark:text-[#9dabb9] text-sm font-medium leading-normal"
          >
            Ca bình thường
          </p>
          <p
            class="text-[#111418] dark:text-white text-3xl font-bold leading-tight"
          >
            {{ stats.normal | number }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1d23] border border-[#e5e7eb] dark:border-[#22282f] shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div
              class="flex items-center justify-center size-10 rounded-full bg-purple-500/10 text-purple-500"
            >
              <span class="material-symbols-outlined text-[24px]"
                >analytics</span
              >
            </div>
            <span
              class="text-[#0bda5b] text-xs font-bold px-2 py-1 rounded-full bg-[#0bda5b]/10 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[14px]"
                >trending_up</span
              >
              +1.2%
            </span>
          </div>
          <p
            class="text-[#637588] dark:text-[#9dabb9] text-sm font-medium leading-normal"
          >
            Tỷ lệ viêm phổi
          </p>
          <p
            class="text-[#111418] dark:text-white text-3xl font-bold leading-tight"
          >
            {{ stats.positive_rate }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          class="lg:col-span-2 rounded-xl bg-white dark:bg-[#1a1d23] border border-[#e5e7eb] dark:border-[#22282f] p-6 shadow-sm flex flex-col"
        >
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3
                class="text-[#111418] dark:text-white text-lg font-bold leading-tight"
              >
                Thống kê chẩn đoán
              </h3>
              <p class="text-[#637588] dark:text-[#9dabb9] text-sm font-normal">
                Số liệu phân tích trong 7 ngày qua
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-3 rounded-full bg-[#137fec]"></span>
              <span class="text-xs text-[#637588] dark:text-[#9dabb9] mr-2"
                >Tổng ảnh</span
              >
              <span class="size-3 rounded-full bg-[#fa6238]"></span>
              <span class="text-xs text-[#637588] dark:text-[#9dabb9]"
                >Viêm phổi</span
              >
            </div>
          </div>

          <div
            class="flex-1 w-full min-h-[300px] flex flex-col justify-end gap-2 relative px-2"
          >
            <div
              class="absolute inset-0 top-10 flex items-end justify-between px-4 pb-8 w-full h-full gap-2 md:gap-4"
            >
              <div
                *ngFor="let item of chartData"
                class="w-full flex flex-col justify-end gap-1 group relative"
                [style.height.%]="item.totalHeight"
              >
                <!-- Tooltip Overlay -->
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none"
                >
                  <div
                    class="bg-slate-900/95 dark:bg-[#0f172a] text-white text-[11px] rounded-lg p-3 shadow-2xl border border-white/10 min-w-[140px] backdrop-blur-sm"
                  >
                    <p
                      class="font-bold border-b border-white/10 pb-1.5 mb-2 text-slate-300"
                    >
                      {{ item.label }}
                    </p>
                    <div class="flex justify-between gap-4 mb-1.5">
                      <span
                        class="flex items-center gap-2 font-medium opacity-80"
                      >
                        <span class="size-2 rounded-full bg-[#fa6238]"></span>
                        Viêm phổi
                      </span>
                      <span class="font-bold text-[#fa6238]">{{
                        item.pneumoniaCount
                      }}</span>
                    </div>
                    <div class="flex justify-between gap-4 mb-1.5">
                      <span
                        class="flex items-center gap-2 font-medium opacity-80"
                      >
                        <span class="size-2 rounded-full bg-[#137fec]"></span>
                        Bình thường
                      </span>
                      <span class="font-bold text-[#137fec]">{{
                        item.normalCount
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between gap-4 pt-1.5 mt-1 border-t border-white/10"
                    >
                      <span class="font-medium opacity-60">Tổng cộng</span>
                      <span class="font-bold">{{ item.totalCount }}</span>
                    </div>
                    <!-- Arrow -->
                    <div
                      class="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900/95 dark:border-t-[#0f172a]"
                    ></div>
                  </div>
                </div>

                <div
                  class="w-full bg-[#fa6238] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-200"
                  [style.height.%]="item.pneumoniaRatio"
                ></div>
                <div
                  class="w-full bg-[#137fec] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-200"
                  [style.height.%]="item.normalRatio"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="flex justify-between px-4 mt-2 border-t border-gray-100 dark:border-gray-800 pt-2"
          >
            <p
              *ngFor="let label of chartLabels"
              class="text-[#637588] dark:text-[#9dabb9] text-xs font-bold w-full text-center"
            >
              {{ label }}
            </p>
          </div>
        </div>

        <div
          class="lg:col-span-1 rounded-xl bg-white dark:bg-[#1a1d23] border border-[#e5e7eb] dark:border-[#22282f] shadow-sm flex flex-col"
        >
          <div
            class="p-5 border-b border-[#e5e7eb] dark:border-[#22282f] flex justify-between items-center"
          >
            <h3 class="text-[#111418] dark:text-white text-lg font-bold">
              Hoạt động gần đây
            </h3>
            <button class="text-[#137fec] text-sm font-medium hover:underline">
              Xem tất cả
            </button>
          </div>
          <div class="flex flex-col">
            <div
              *ngFor="let activity of recentActivities"
              class="flex items-center gap-4 p-4 hover:bg-[#f3f4f6] dark:hover:bg-[#1f262e] transition-colors border-b border-[#e5e7eb] dark:border-[#22282f] last:border-0"
            >
              <div
                class="rounded-lg w-12 h-12 shrink-0 overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-[#e5e7eb] dark:border-[#22282f]"
              >
                <img
                  *ngIf="activity.displayImage"
                  [src]="activity.displayImage"
                  class="w-full h-full object-cover"
                />
                <span
                  *ngIf="!activity.displayImage"
                  class="material-symbols-outlined text-slate-500"
                  >image</span
                >
              </div>
              <div class="flex flex-col flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <p
                    class="text-[#111418] dark:text-white text-sm font-bold truncate"
                  >
                    {{ activity.fileName }}
                  </p>
                  <span
                    *ngIf="activity.isPositive"
                    class="text-[#fa6238] text-[10px] font-bold px-2 py-0.5 rounded bg-[#fa6238]/10 border border-[#fa6238]/20"
                    >DƯƠNG TÍNH</span
                  >
                  <span
                    *ngIf="!activity.isPositive"
                    class="text-[#0bda5b] text-[10px] font-bold px-2 py-0.5 rounded bg-[#0bda5b]/10 border border-[#0bda5b]/20"
                    >BÌNH THƯỜNG</span
                  >
                </div>

                <div class="flex justify-between items-center">
                  <p class="text-[#637588] dark:text-[#9dabb9] text-xs">
                    Bệnh nhân: {{ activity.patientName }}
                  </p>
                  <p class="text-[#637588] dark:text-[#9dabb9] text-xs">
                    {{ activity.timeAgo }}
                  </p>
                </div>
              </div>
            </div>

            <div
              *ngIf="recentActivities.length === 0"
              class="p-8 text-center text-[#637588] dark:text-[#9dabb9] text-sm"
            >
              Không có hoạt động nào gần đây.
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 pb-2 border-t border-[#e5e7eb] dark:border-[#22282f] text-xs text-[#637588] dark:text-[#9dabb9]"
      >
        <p>© 2026 DeepX Ray Technology. All rights reserved.</p>
        <div class="flex gap-6 items-center">
          <div class="flex items-center gap-2">
            <div class="size-2 rounded-full bg-[#0bda5b] animate-pulse"></div>
            <span>Hệ thống hoạt động: 99.9% uptime</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">memory</span>
            <span>Model v2.4.1 (Latency: 45ms)</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {
    total: 0,
    pneumonia: 0,
    normal: 0,
    positive_rate: '0%',
  };

  chartData: any[] = [];
  chartLabels: string[] = [];

  recentActivities: any[] = [];
  readonly API_URL = `${environment.apiUrl}/`;

  constructor(
    private analysisService: AnalysisService,
    private statisticsService: StatisticsService,
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecent();
    this.loadChart();
  }

  loadStats() {
    this.statisticsService.getOverview().subscribe({
      next: (res: any) => {
        this.stats.total = res.total ?? 0;
        this.stats.pneumonia = res.pneumonia ?? 0;
        this.stats.normal = res.normal ?? 0;
        this.stats.positive_rate =
          res.pneumonia_rate !== undefined
            ? res.pneumonia_rate.toFixed(1) + '%'
            : '0%';
      },
      error: (err) => console.error('Error fetching stats:', err),
    });
  }

  loadChart() {
    this.statisticsService.getChart('week').subscribe({
      next: (res: any) => {
        const data = res.data || [];
        const maxTotal =
          data.length > 0
            ? Math.max(...data.map((d: any) => d.normal + d.pneumonia))
            : 0;

        if (data.length > 0 && maxTotal > 0) {
          this.chartData = data.map((d: any) => {
            const total = d.normal + d.pneumonia;
            const totalHeight = (total / maxTotal) * 100;
            const pneumoniaRatio = total > 0 ? (d.pneumonia / total) * 100 : 0;
            const normalRatio = total > 0 ? (d.normal / total) * 100 : 0;

            return {
              label: d.label,
              totalHeight: totalHeight,
              pneumoniaRatio: pneumoniaRatio,
              normalRatio: normalRatio,
              pneumoniaCount: d.pneumonia,
              normalCount: d.normal,
              totalCount: total,
            };
          });

          this.chartLabels = data.map((d: any) => d.label);
        } else {
          this.chartData = [];
          this.chartLabels = [];
        }
      },
      error: (err) => console.error('Error fetching chart:', err),
    });
  }

  loadRecent() {
    this.analysisService.getRecentHistory(5).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.recentActivities = res.map((item) => {
            const rawPath = item.image || item.thumbnail || '';
            const cleanPath = rawPath.replace(/\\/g, '/');
            return {
              ...item,
              displayImage: cleanPath ? this.API_URL + cleanPath : null,
              fileName: item.id || 'Unknown',
              patientName: item.ten || 'Không xác định',
              isPositive: item.result?.toLowerCase().includes('viêm phổi'),
              timeAgo: item.date || 'Gần đây',
            };
          });
        } else {
          this.recentActivities = [];
        }
      },
      error: (err) => console.error('Error fetching recent:', err),
    });
  }
}
