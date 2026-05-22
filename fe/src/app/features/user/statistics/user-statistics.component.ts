import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { StatisticsService } from '../../../core/service/statistics.service';

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [CommonModule],
  providers: [DecimalPipe],
  template: `
    <div
      class="p-8 bg-slate-50 dark:bg-[#0a0f16] min-h-screen text-slate-800 dark:text-gray-200 transition-colors duration-300 font-['Inter']"
    >
      <header class="flex flex-wrap justify-between items-center gap-6 mb-8">
        <div>
          <h1
            class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors"
          >
            Thống kê chẩn đoán
          </h1>
          <p class="text-slate-500 dark:text-gray-400 transition-colors">
            Phân bố kết quả dự đoán Viêm phổi và Bình thường
          </p>
        </div>
        <div class="flex items-center">
          <div
            class="flex bg-white dark:bg-[#131924] rounded-full p-1 shadow-sm border border-slate-200 dark:border-gray-800 transition-colors"
          >
            <button
              class="px-5 py-2 rounded-full font-semibold text-sm cursor-pointer transition-all"
              [ngClass]="
                selectedFilter === 'day'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              "
              (click)="setFilter('day')"
            >
              Ngày
            </button>
            <button
              class="px-5 py-2 rounded-full font-semibold text-sm cursor-pointer transition-all"
              [ngClass]="
                selectedFilter === 'week'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              "
              (click)="setFilter('week')"
            >
              Tuần
            </button>
            <button
              class="px-5 py-2 rounded-full font-semibold text-sm cursor-pointer transition-all"
              [ngClass]="
                selectedFilter === 'month'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              "
              (click)="setFilter('month')"
            >
              Tháng
            </button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white dark:bg-[#131924] rounded-2xl p-6 flex items-center gap-5 shadow-sm dark:shadow-xl border border-slate-200 dark:border-gray-800 transition-colors"
        >
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-white bg-blue-500 shadow-lg shadow-blue-500/30"
          >
            <svg viewBox="0 0 24 24" class="w-7 h-7 fill-current">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <span
              class="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors"
              >{{ totalTests | number }}</span
            >
            <span
              class="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1"
              >Tổng ca xét nghiệm</span
            >
          </div>
        </div>
        <div
          class="bg-white dark:bg-[#131924] rounded-2xl p-6 flex items-center gap-5 shadow-sm dark:shadow-xl border border-slate-200 dark:border-gray-800 transition-colors"
        >
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-white bg-red-500 shadow-lg shadow-red-500/30"
          >
            <svg viewBox="0 0 24 24" class="w-7 h-7 fill-current">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <span
              class="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors"
              >{{ pneumoniaCases | number }}</span
            >
            <span
              class="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1"
              >Ca bị viêm phổi</span
            >
          </div>
        </div>
        <div
          class="bg-white dark:bg-[#131924] rounded-2xl p-6 flex items-center gap-5 shadow-sm dark:shadow-xl border border-slate-200 dark:border-gray-800 transition-colors"
        >
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-white bg-emerald-500 shadow-lg shadow-emerald-500/30"
          >
            <svg viewBox="0 0 24 24" class="w-7 h-7 fill-current">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span
              class="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors"
              >{{ normalCases | number }}</span
            >
            <span
              class="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1"
              >Ca bình thường</span
            >
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Bar Chart -->
        <div
          class="lg:col-span-2 bg-white dark:bg-[#131924] rounded-2xl p-6 shadow-sm dark:shadow-xl border border-slate-200 dark:border-gray-800 transition-colors"
        >
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Xu hướng chẩn đoán
          </h3>
          <div class="w-full relative" (mouseleave)="hideTooltip()">
            <!-- Custom tooltip -->
            <div
              class="pointer-events-none absolute z-20 px-4 py-3 rounded-xl shadow-2xl border text-xs
                     bg-white/95 dark:bg-[#1a222c]/95 backdrop-blur-sm
                     border-slate-200 dark:border-[#2A3441]
                     transition-all duration-200 ease-out min-w-[160px]"
              [style.left.px]="tooltip.x"
              [style.top.px]="tooltip.y"
              [style.opacity]="tooltip.visible ? 1 : 0"
              [style.visibility]="tooltip.visible ? 'visible' : 'hidden'"
              [style.transform]="
                tooltip.visible ? 'translateY(0)' : 'translateY(10px)'
              "
            >
              <!-- Tooltip Arrow -->
              <div
                class="absolute -top-1.5 left-4 w-3 h-3 bg-white dark:bg-[#1a222c] border-l border-t border-slate-200 dark:border-[#2A3441] rotate-45"
              ></div>

              <p
                class="font-bold text-slate-900 dark:text-white mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800 text-sm"
              >
                {{ tooltip.label }}
              </p>

              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    ></span>
                    <span class="text-slate-600 dark:text-slate-400 font-medium"
                      >Bình thường</span
                    >
                  </div>
                  <span class="font-bold text-slate-900 dark:text-white">{{
                    tooltip.normal
                  }}</span>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                    ></span>
                    <span class="text-slate-600 dark:text-slate-400 font-medium"
                      >Viêm phổi</span
                    >
                  </div>
                  <span class="font-bold text-slate-900 dark:text-white">{{
                    tooltip.pneumonia
                  }}</span>
                </div>

                <div
                  class="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    ></div>
                    <span class="text-slate-900 dark:text-slate-200 font-bold"
                      >Tổng cộng</span
                    >
                  </div>
                  <span
                    class="font-bold text-blue-600 dark:text-blue-400 text-sm"
                    >{{ tooltip.normal + tooltip.pneumonia }}</span
                  >
                </div>
              </div>
            </div>
            <svg
              viewBox="0 0 700 350"
              preserveAspectRatio="xMidYMid meet"
              class="w-full h-auto"
            >
              <defs>
                <linearGradient id="gradNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#34d399" />
                  <stop offset="100%" stop-color="#059669" />
                </linearGradient>
                <linearGradient id="gradPneumonia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f87171" />
                  <stop offset="100%" stop-color="#dc2626" />
                </linearGradient>
              </defs>

              <g class="grid-lines">
                <line
                  *ngFor="let y of [0, 1, 2, 3, 4]"
                  x1="40"
                  [attr.y1]="300 - y * 60"
                  x2="680"
                  [attr.y2]="300 - y * 60"
                  class="stroke-slate-200 dark:stroke-gray-800 stroke-1"
                  stroke-dasharray="4 4"
                />
              </g>

              <g class="y-labels">
                <text
                  *ngFor="let y of [0, 1, 2, 3, 4]"
                  x="30"
                  [attr.y]="300 - y * 60 + 5"
                  text-anchor="end"
                  font-size="11"
                  fill="#64748b"
                >
                  {{ (maxBarValue / 4) * y | number: '1.0-0' }}
                </text>
              </g>

              <g *ngFor="let item of barData; let i = index" class="bar-group">
                <!-- Normal Bar -->
                <rect
                  class="bar cursor-pointer transition-all duration-300 transform-origin-bottom hover:brightness-110 hover:scale-y-105"
                  style="transform-origin: center bottom;"
                  [attr.x]="60 + i * barGroupWidth"
                  [attr.y]="300 - (item.normal / maxBarValue) * 240"
                  [attr.width]="barWidth"
                  [attr.height]="(item.normal / maxBarValue) * 240"
                  rx="4"
                  fill="url(#gradNormal)"
                  (mouseenter)="showTooltip($event, item)"
                />

                <!-- Pneumonia Bar -->
                <rect
                  class="bar cursor-pointer transition-all duration-300 transform-origin-bottom hover:brightness-110 hover:scale-y-105"
                  style="transform-origin: center bottom;"
                  [attr.x]="60 + i * barGroupWidth + barWidth + 5"
                  [attr.y]="300 - (item.pneumonia / maxBarValue) * 240"
                  [attr.width]="barWidth"
                  [attr.height]="(item.pneumonia / maxBarValue) * 240"
                  rx="4"
                  fill="url(#gradPneumonia)"
                  (mouseenter)="showTooltip($event, item)"
                />

                <text
                  font-size="11"
                  fill="#64748b"
                  [attr.x]="60 + i * barGroupWidth + barWidth + 2.5"
                  y="330"
                  text-anchor="middle"
                >
                  {{ item.label }}
                </text>
              </g>

              <g transform="translate(480, 20)">
                <rect
                  x="0"
                  y="0"
                  width="12"
                  height="12"
                  rx="2"
                  fill="url(#gradNormal)"
                ></rect>
                <text
                  x="20"
                  y="10"
                  font-size="12"
                  class="fill-slate-500 dark:fill-gray-400"
                >
                  Bình thường
                </text>

                <rect
                  x="120"
                  y="0"
                  width="12"
                  height="12"
                  rx="2"
                  fill="url(#gradPneumonia)"
                ></rect>
                <text
                  x="140"
                  y="10"
                  font-size="12"
                  class="fill-slate-500 dark:fill-gray-400"
                >
                  Viêm phổi
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Donut Chart Card -->
        <div
          class="bg-white dark:bg-[#131924] rounded-2xl p-6 shadow-sm dark:shadow-xl border border-slate-200 dark:border-gray-800 transition-colors flex flex-col items-center"
        >
          <h3
            class="text-lg font-bold text-slate-900 dark:text-white mb-6 self-start"
          >
            Tỷ lệ tổng quan
          </h3>
          <div
            class="w-full relative flex-1 flex flex-col items-center justify-center gap-8"
          >
            <svg
              viewBox="0 0 300 300"
              preserveAspectRatio="xMidYMid meet"
              class="w-full max-w-[250px] h-auto"
            >
              <g transform="translate(150,150)">
                <ng-container *ngFor="let seg of pieSegments; let i = index">
                  <path
                    class="pie-segment cursor-pointer transition-transform duration-300 hover:scale-105 origin-center"
                    [attr.d]="seg.path"
                    [attr.fill]="seg.color"
                    [attr.stroke]="isDarkMode ? '#131924' : '#ffffff'"
                    stroke-width="4"
                  >
                    <title>{{ seg.label }}: {{ seg.value }}</title>
                  </path>
                </ng-container>
                <circle
                  cx="0"
                  cy="0"
                  r="65"
                  [attr.fill]="isDarkMode ? '#131924' : '#ffffff'"
                  class="transition-colors duration-300"
                ></circle>
                <text
                  x="0"
                  y="-5"
                  text-anchor="middle"
                  font-size="26"
                  font-weight="900"
                  [attr.fill]="isDarkMode ? '#ffffff' : '#0f172a'"
                >
                  {{ totalTests | number }}
                </text>
                <text
                  x="0"
                  y="15"
                  text-anchor="middle"
                  font-size="11"
                  font-weight="600"
                  [attr.fill]="isDarkMode ? '#9ca3af' : '#64748b'"
                >
                  T&#7893;ng ca
                </text>
              </g>
            </svg>

            <div class="flex flex-col w-full gap-3 mt-4">
              <div
                class="flex items-center px-4 py-3 bg-slate-50 dark:bg-[#1a222c] rounded-xl transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-gray-800"
                *ngFor="let seg of pieSegments"
              >
                <span
                  class="w-3 h-3 rounded-full mr-3"
                  [style.backgroundColor]="seg.color"
                ></span>
                <span
                  class="flex-1 text-sm font-semibold text-slate-600 dark:text-gray-300"
                  >{{ seg.label }}</span
                >
                <span class="text-sm font-black text-slate-900 dark:text-white"
                  >{{
                    totalTests > 0
                      ? ((seg.value / totalTests) * 100 | number: '1.0-1')
                      : 0
                  }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
      .bar {
        animation: growUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      @keyframes growUp {
        from {
          transform: scaleY(0);
        }
        to {
          transform: scaleY(1);
        }
      }
    `,
  ],
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
  selectedFilter: 'day' | 'week' | 'month' = 'month';

  // Các biến dùng trong template (giữ nguyên tên gốc)
  totalTests = 0;
  pneumoniaCases = 0;
  normalCases = 0;

  barData: Array<{ label: string; normal: number; pneumonia: number }> = [];
  maxBarValue = 200;
  barGroupWidth = 96;
  barWidth = 26;

  pieSegments: Array<any> = [];

  // Custom tooltip
  tooltip = { visible: false, x: 0, y: 0, label: '', normal: 0, pneumonia: 0 };

  private destroy$ = new Subject<void>();

  get isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    // Lấy tổng quan (thẻ stat + donut)
    this.loadOverview();
    // Lấy dữ liệu bar chart theo kỳ mặc định
    this.loadChart('month');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Người dùng chọn kỳ ───────────────────────────────────────────

  setFilter(filter: 'day' | 'week' | 'month'): void {
    this.selectedFilter = filter;
    this.loadChart(filter);
  }

  // ── Tooltip ──────────────────────────────────────────────────────

  showTooltip(
    event: MouseEvent,
    item: { label: string; normal: number; pneumonia: number },
  ): void {
    const container = (event.currentTarget as SVGElement).closest(
      '.relative',
    ) as HTMLElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const tooltipW = 170;
    let x = event.clientX - rect.left + 12;
    // Không để tooltip bị tràn phải
    if (x + tooltipW > rect.width) x = event.clientX - rect.left - tooltipW - 8;

    this.tooltip = {
      visible: true,
      x,
      y: event.clientY - rect.top - 10,
      label: item.label,
      normal: item.normal,
      pneumonia: item.pneumonia,
    };
  }

  hideTooltip(): void {
    this.tooltip.visible = false;
  }

  // ── Gọi API tổng quan → cập nhật thẻ stat + donut ───────────────

  private loadOverview(): void {
    this.statisticsService
      .getOverview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.totalTests = data.total;
          this.pneumoniaCases = data.pneumonia;
          this.normalCases = data.normal;
          this.buildPie();
        },
        error: (err) => console.error('Overview API error:', err),
      });
  }

  // ── Gọi API chart → cập nhật bar chart ──────────────────────────

  private loadChart(period: 'day' | 'week' | 'month'): void {
    this.statisticsService
      .getChart(period)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.barData = res.data;

          // Tính maxBarValue tự động từ dữ liệu thật
          const maxVal = Math.max(
            ...res.data.map((d) => Math.max(d.normal, d.pneumonia)),
            1,
          );
          this.maxBarValue = maxVal * 1.2;

          // Điều chỉnh độ rộng cột theo số điểm dữ liệu
          const n = res.data.length || 6;
          this.barGroupWidth = Math.floor(640 / n);
          this.barWidth = Math.max(10, this.barGroupWidth / 2 - 5);
        },
        error: (err) => console.error('Chart API error:', err),
      });
  }

  // ── Tính toán donut chart ────────────────────────────────────────

  private buildPie(): void {
    const data = [
      { label: 'Bình thường', value: this.normalCases, color: '#10b981' },
      { label: 'Viêm phổi', value: this.pneumoniaCases, color: '#ef4444' },
    ];

    const pieTotal = this.totalTests || 1;
    let angle = -Math.PI / 2;
    const r = 100;

    this.pieSegments = data.map((item) => {
      const portion = item.value / pieTotal;
      const nextAngle = angle + portion * Math.PI * 2;
      const x1 = Math.cos(angle) * r;
      const y1 = Math.sin(angle) * r;
      const x2 = Math.cos(nextAngle) * r;
      const y2 = Math.sin(nextAngle) * r;
      const large = portion > 0.5 ? 1 : 0;

      const path = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      angle = nextAngle;

      return { ...item, path };
    });
  }
}
