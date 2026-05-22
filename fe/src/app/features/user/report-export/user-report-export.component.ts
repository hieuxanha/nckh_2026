import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ReportService,
  ReportFilter,
} from '../../../core/service/report.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-report-export',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <header
      class="h-20 flex-shrink-0 bg-white dark:bg-[#111418]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#2A3441] px-8 flex items-center justify-between z-10 sticky top-0"
    >
      <div class="flex flex-col">
        <h2
          class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Xuất báo cáo chẩn đoán
        </h2>
        <p class="text-[#9dabb9] text-sm">
          Tạo báo cáo chi tiết về các lần phân tích của bạn
        </p>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8 scroll-smooth">
      <div class="max-w-6xl mx-auto flex gap-8">
        <!-- Khu vực lọc và xuất báo cáo -->
        <div class="flex-1 flex flex-col gap-6">
          <!-- Bộ lọc dữ liệu -->
          <div
            class="bg-white dark:bg-[#1A222C] rounded-xl border border-slate-200 dark:border-[#2A3441] p-6"
          >
            <h3
              class="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[#137fec]"
                >filter_alt</span
              >
              Bộ lọc dữ liệu
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex flex-col">
                <span class="text-sm text-[#637588] dark:text-[#9dabb9] mb-2"
                  >Từ ngày</span
                >
                <input
                  type="date"
                  [(ngModel)]="fromDate"
                  name="fromDate"
                  (change)="onFilterChange()"
                  class="px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#0f1417] border border-slate-200 dark:border-[#2A3441] text-slate-900 dark:text-white"
                />
              </label>
              <label class="flex flex-col">
                <span class="text-sm text-[#637588] dark:text-[#9dabb9] mb-2"
                  >Đến ngày</span
                >
                <input
                  type="date"
                  [(ngModel)]="toDate"
                  name="toDate"
                  (change)="onFilterChange()"
                  class="px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#0f1417] border border-slate-200 dark:border-[#2A3441] text-slate-900 dark:text-white"
                />
              </label>
              <label class="flex flex-col">
                <span class="text-sm text-[#637588] dark:text-[#9dabb9] mb-2"
                  >Loại kết quả</span
                >
                <select
                  [(ngModel)]="resultType"
                  name="resultType"
                  (change)="onFilterChange()"
                  class="px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#0f1417] border border-slate-200 dark:border-[#2A3441] text-slate-900 dark:text-white"
                >
                  <option value="">Tất cả kết quả</option>
                  <option value="pneumonia">Viêm phổi</option>
                  <option value="normal">Bình thường</option>
                </select>
              </label>
              <!-- <label class="flex flex-col">
                <span class="text-sm text-[#637588] dark:text-[#9dabb9] mb-2"
                  >Trạng thái</span
                >
                <select
                  [(ngModel)]="status"
                  name="status"
                  (change)="onFilterChange()"
                  class="px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#0f1417] border border-slate-200 dark:border-[#2A3441] text-slate-900 dark:text-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="pending">Đang xử lý</option>
                </select>
              </label> -->
            </div>
          </div>

          <!-- Định dạng xuất file -->
          <div
            class="bg-white dark:bg-[#1A222C] rounded-xl border border-slate-200 dark:border-[#2A3441] p-6"
          >
            <h3
              class="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[#137fec]"
                >file_download</span
              >
              Định dạng xuất file
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div
                (click)="selectFormat('csv')"
                [ngClass]="{
                  'border-[#137fec] bg-blue-50 dark:bg-blue-500/10':
                    selectedFormat === 'csv',
                  'border-slate-200 dark:border-[#2A3441]':
                    selectedFormat !== 'csv',
                }"
                class="rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer border-2 transition-all hover:border-[#137fec]"
              >
                <span
                  class="material-symbols-outlined text-4xl text-emerald-500"
                  >grid_on</span
                >
                <p class="font-bold text-slate-900 dark:text-white">
                  Excel (CSV)
                </p>
                <p
                  class="text-xs text-[#637588] dark:text-[#9dabb9] text-center"
                >
                  Dữ liệu thô để phân tích
                </p>
              </div>
              <!-- PDF – coming soon -->
              <div
                class="rounded-xl p-4 flex flex-col items-center gap-3 border-2 border-dashed border-slate-200 dark:border-[#2A3441] opacity-50 cursor-not-allowed"
              >
                <span class="material-symbols-outlined text-4xl text-red-400"
                  >picture_as_pdf</span
                >
                <p class="font-bold text-slate-900 dark:text-white">
                  Tài liệu PDF
                </p>
                <p
                  class="text-xs text-[#637588] dark:text-[#9dabb9] text-center"
                >
                  Sắp ra mắt
                </p>
              </div>
            </div>
          </div>

          <!-- Nút tạo báo cáo -->
          <div
            class="bg-white dark:bg-[#1A222C] rounded-xl border border-slate-200 dark:border-[#2A3441] p-6 flex items-center justify-between"
          >
            <div>
              <p class="text-sm text-[#637588] dark:text-[#9dabb9]">
                Dự kiến kết quả
              </p>
              <p class="text-lg font-bold text-slate-900 dark:text-white mt-1">
                <ng-container *ngIf="!isCounting; else counting">
                  Tìm thấy
                  <span class="text-[#137fec]">{{ estimatedRecords }}</span> bản
                  ghi phù hợp
                </ng-container>
                <ng-template #counting>
                  <span class="text-[#9dabb9] text-base">Đang đếm...</span>
                </ng-template>
              </p>
            </div>
            <div class="flex gap-3">
              <button
                (click)="resetFilters()"
                [disabled]="isExporting"
                class="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#2A3441] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#0f1417] transition-colors disabled:opacity-50"
              >
                Làm mới
              </button>
              <button
                (click)="generateReport()"
                [disabled]="isExporting || estimatedRecords === 0"
                class="px-5 py-2.5 rounded-lg bg-[#137fec] hover:bg-blue-600 text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span class="material-symbols-outlined">
                  {{ isExporting ? 'hourglass_top' : 'download' }}
                </span>
                {{ isExporting ? 'Đang xuất...' : 'Xuất báo cáo' }}
              </button>
            </div>
          </div>

          <!-- Toast thông báo -->
          <div
            *ngIf="toastMessage"
            [ngClass]="
              toastType === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-red-500/10 border-red-500/30 text-red-500'
            "
            class="rounded-xl border px-4 py-3 flex items-center gap-3 text-sm font-medium"
          >
            <span class="material-symbols-outlined text-base">
              {{ toastType === 'success' ? 'check_circle' : 'error' }}
            </span>
            {{ toastMessage }}
          </div>
        </div>

        <!-- Lịch sử báo cáo -->
        <div
          class="w-80 flex-shrink-0 bg-white dark:bg-[#1A222C] rounded-xl border border-slate-200 dark:border-[#2A3441] p-6 flex flex-col gap-6 max-h-[480px]"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Báo cáo gần đây
            </h3>
            <button
              *ngIf="recentReports.length > 0"
              (click)="clearHistory()"
              class="text-xs text-[#637588] dark:text-[#9dabb9] hover:text-red-400 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>

          <div class="flex flex-col gap-3 overflow-y-auto">
            <ng-container *ngIf="recentReports.length > 0; else noHistory">
              <div
                *ngFor="let report of recentReports"
                class="flex items-center gap-3 bg-slate-50 dark:bg-[#0f1417] rounded-lg p-3"
              >
                <span
                  class="material-symbols-outlined"
                  [ngClass]="
                    report.format === 'csv'
                      ? 'text-emerald-500'
                      : 'text-red-500'
                  "
                >
                  {{ report.format === 'csv' ? 'grid_on' : 'picture_as_pdf' }}
                </span>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-bold text-slate-900 dark:text-white truncate"
                  >
                    {{ report.filename }}
                  </p>
                  <p class="text-xs text-[#637588] dark:text-[#9dabb9]">
                    {{ report.time }} • {{ report.records }} bản ghi
                  </p>
                </div>
              </div>
            </ng-container>
            <ng-template #noHistory>
              <div
                class="flex flex-col items-center justify-center py-8 text-center"
              >
                <span
                  class="material-symbols-outlined text-4xl text-slate-300 dark:text-[#2A3441] mb-2"
                  >folder_open</span
                >
                <p class="text-sm text-[#9dabb9]">Chưa có báo cáo nào</p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
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
export class UserReportExportComponent implements OnInit, OnDestroy {
  fromDate: string = '';
  toDate: string = '';
  resultType: string = '';
  status: string = '';
  selectedFormat: string = 'csv';
  estimatedRecords: number = 0;
  recentReports: any[] = [];

  // UI state
  isCounting = false;
  isExporting = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  private filterChange$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private toastTimer: any;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.initializeDates();
    this.loadHistoryFromStorage();

    // Debounce: gọi API đếm sau 400ms mỗi khi filter thay đổi
    this.filterChange$
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(() => this.fetchCount());

    // Đếm ngay lần đầu
    this.fetchCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Filter helpers ────────────────────────────────────────────────

  onFilterChange(): void {
    this.filterChange$.next();
  }

  initializeDates(): void {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );
    this.fromDate = this.formatDate(lastMonth);
    this.toDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  selectFormat(format: string): void {
    this.selectedFormat = format;
  }

  resetFilters(): void {
    this.initializeDates();
    this.resultType = '';
    this.status = '';
    this.selectedFormat = 'csv';
    this.fetchCount();
  }

  // ── API: đếm bản ghi ─────────────────────────────────────────────

  private fetchCount(): void {
    this.isCounting = true;
    const filter = this.buildFilter();

    this.reportService
      .countRecords(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.estimatedRecords = res.count;
          this.isCounting = false;
        },
        error: () => {
          this.isCounting = false;
        },
      });
  }

  // ── API: xuất báo cáo ────────────────────────────────────────────

  generateReport(): void {
    if (this.isExporting || this.estimatedRecords === 0) return;

    this.isExporting = true;
    const filter = this.buildFilter();
    const now = new Date();
    const ts = now
      .toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '');
    const filename = `BaoCao_ChanDoan_${ts}.csv`;

    this.reportService
      .exportCsv(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.reportService.downloadBlob(blob, filename);
          this.isExporting = false;
          this.addToHistory({
            filename,
            format: 'csv',
            records: this.estimatedRecords,
            time: this.relativeTime(now),
          });
          this.showToast('Xuất báo cáo thành công!', 'success');
        },
        error: (err) => {
          this.isExporting = false;
          this.showToast('Xuất thất bại. Vui lòng thử lại.', 'error');
          console.error('Export error:', err);
        },
      });
  }

  // ── Lịch sử báo cáo (localStorage) ───────────────────────────────

  private addToHistory(entry: {
    filename: string;
    format: string;
    records: number;
    time: string;
  }): void {
    this.recentReports.unshift(entry);
    if (this.recentReports.length > 10) this.recentReports.pop();
    localStorage.setItem('reportHistory', JSON.stringify(this.recentReports));
  }

  private loadHistoryFromStorage(): void {
    try {
      const saved = localStorage.getItem('reportHistory');
      this.recentReports = saved ? JSON.parse(saved) : [];
    } catch {
      this.recentReports = [];
    }
  }

  clearHistory(): void {
    this.recentReports = [];
    localStorage.removeItem('reportHistory');
  }

  // ── Tiện ích ─────────────────────────────────────────────────────

  private buildFilter(): ReportFilter {
    return {
      from_date: this.fromDate || undefined,
      to_date: this.toDate || undefined,
      result_type: this.resultType || undefined,
    };
  }

  private relativeTime(date: Date): string {
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.toastTimer = setTimeout(() => (this.toastMessage = ''), 4000);
  }
}
