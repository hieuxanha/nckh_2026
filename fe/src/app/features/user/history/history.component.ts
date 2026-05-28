import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalysisService } from '../../../core/service/analysis.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="flex-1 flex flex-col h-full overflow-hidden bg-[#f6f7f8] dark:bg-[#101922] font-['Manrope']"
    >
      <header
        class="flex items-center justify-between border-b border-slate-200 dark:border-[#283039] bg-white dark:bg-[#111418]/95 backdrop-blur px-8 py-4 z-10"
      >
        <h2
          class="text-slate-900 dark:text-white text-xl font-bold leading-tight uppercase tracking-tight"
        >
          Lịch sử
        </h2>
        <div class="flex items-center gap-4">
          <button
            class="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2530] text-[#9dabb9] transition-colors"
          >
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button
            class="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2530] text-[#9dabb9] transition-colors"
          >
            <span class="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div class="max-w-6xl mx-auto flex flex-col gap-8">
          <div class="flex flex-col gap-2">
            <h1
              class="text-slate-900 dark:text-white text-3xl font-black tracking-tight uppercase"
            >
              Dữ liệu Chẩn đoán
            </h1>
            <p class="text-[#9dabb9] text-base font-medium">
              Xem lại và quản lý tất cả các kết quả chẩn đoán từ hệ thống
              MediAI.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-blue-500/10 text-[#137fec]">
                  <span class="material-symbols-outlined">analytics</span>
                </div>
                <p
                  class="text-[#9dabb9] text-sm font-bold uppercase tracking-wide"
                >
                  Tổng số ca
                </p>
              </div>
              <p class="text-slate-900 dark:text-white text-3xl font-bold mt-2">
                {{ stats.total }}
              </p>
            </div>
            <div
              class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] shadow-sm"
            >
              <div class="flex items-center gap-3 text-red-500">
                <div class="p-2 rounded-lg bg-red-500/10">
                  <span class="material-symbols-outlined">coronavirus</span>
                </div>
                <p
                  class="text-[#9dabb9] text-sm font-bold uppercase tracking-wide"
                >
                  Viêm phổi
                </p>
              </div>
              <p class="text-slate-900 dark:text-white text-3xl font-bold mt-2">
                {{ stats.pneumonia }}
              </p>
            </div>
            <div
              class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] shadow-sm"
            >
              <div class="flex items-center gap-3 text-emerald-500">
                <div class="p-2 rounded-lg bg-emerald-500/10">
                  <span class="material-symbols-outlined">check_circle</span>
                </div>
                <p
                  class="text-[#9dabb9] text-sm font-bold uppercase tracking-wide"
                >
                  Bình thường
                </p>
              </div>
              <p class="text-slate-900 dark:text-white text-3xl font-bold mt-2">
                {{ stats.normal }}
              </p>
            </div>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between gap-4 items-center bg-white dark:bg-[#1a2530] p-4 rounded-xl border border-slate-200 dark:border-[#283039] shadow-sm"
          >
            <div class="w-full md:w-auto flex-1 min-w-[300px]">
              <div class="relative group">
                <span
                  class="absolute inset-y-0 left-0 pl-3 flex items-center text-[#9dabb9] group-focus-within:text-[#137fec]"
                >
                  <span class="material-symbols-outlined">search</span>
                </span>
                <input
                  (input)="onSearch($event)"
                  class="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-white border-none focus:ring-1 focus:ring-[#137fec] sm:text-sm transition-all"
                  placeholder="Tìm kiếm theo tên hoặc ID bệnh nhân..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] rounded-xl overflow-hidden shadow-sm"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead
                  class="bg-slate-50 dark:bg-[#111418] text-[#9dabb9] text-xs uppercase tracking-wider"
                >
                  <tr>
                    <th class="px-6 py-4 font-bold">Hình ảnh</th>
                    <th class="px-6 py-4 font-bold">Bệnh nhân / ID</th>
                    <th class="px-6 py-4 font-bold">Thời gian</th>
                    <th class="px-6 py-4 font-bold">Kết quả AI</th>
                    <th class="px-6 py-4 font-bold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-slate-100 dark:divide-[#283039] text-sm"
                >
                  <tr
                    *ngFor="let record of paginatedData"
                    class="group hover:bg-slate-50 dark:hover:bg-[#111418]/50 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <div
                        class="size-12 rounded-lg bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-700"
                      >
                        <img
                          [src]="record.thumbnail"
                          class="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                          onerror="this.src='assets/images/default-xray.png'"
                        />
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-slate-900 dark:text-white font-bold">
                        {{ record.displayName }}
                      </p>
                      <p class="text-[#9dabb9] text-xs font-medium">
                        ID: {{ record.displayId }}
                      </p>
                    </td>
                    <td class="px-6 py-4 text-[#9dabb9] font-medium italic">
                      {{ record.date }}
                    </td>
                    <td class="px-6 py-4">
                      <span
                        [ngClass]="record.statusClass"
                        class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border"
                      >
                        {{ record.result }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button
                        (click)="viewDetails(record)"
                        class="text-[#137fec] hover:bg-[#137fec] hover:text-white rounded-lg px-3 py-2 text-[10px] font-black uppercase transition-all inline-flex items-center gap-1 border border-[#137fec]"
                      >
                        Chi tiết
                        <span class="material-symbols-outlined text-sm"
                          >arrow_forward</span
                        >
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                *ngIf="historyData.length === 0"
                class="p-20 text-center flex flex-col items-center gap-4"
              >
                <span class="material-symbols-outlined text-6xl text-slate-200"
                  >folder_open</span
                >
                <p class="text-slate-400 font-bold">
                  Không tìm thấy dữ liệu chẩn đoán nào.
                </p>
              </div>
            </div>

            <!-- Phân trang -->
            <div
              *ngIf="totalPages > 1"
              class="border-t border-slate-200 dark:border-[#283039] p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <span class="text-sm text-slate-500 dark:text-[#9dabb9]">
                Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
                {{
                  currentPage * itemsPerPage > historyData.length
                    ? historyData.length
                    : currentPage * itemsPerPage
                }}
                trong số {{ historyData.length }} bản ghi
              </span>
              <div
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-white"
              >
                <button
                  [disabled]="currentPage === 1"
                  (click)="currentPage = currentPage - 1"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#283039] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#111418] transition-colors"
                >
                  Trước
                </button>
                <span class="px-2 font-medium"
                  >Trang {{ currentPage }} / {{ totalPages }}</span
                >
                <button
                  [disabled]="currentPage === totalPages"
                  (click)="currentPage = currentPage + 1"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#283039] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#111418] transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Chi Tiết -->
      <div
        *ngIf="selectedRecord"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
          (click)="closeDetails()"
        ></div>

        <div
          class="relative bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        >
          <div
            class="px-8 py-5 border-b border-slate-200 dark:border-[#283039] flex justify-between items-center bg-slate-50 dark:bg-[#111418]"
          >
            <div class="flex items-center gap-4">
              <div
                [class]="
                  selectedRecord.result.includes('Viêm phổi')
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-emerald-500 bg-emerald-500/10'
                "
                class="size-10 rounded-xl flex items-center justify-center border border-current/20"
              >
                <span class="material-symbols-outlined">{{
                  selectedRecord.result.includes('Viêm phổi')
                    ? 'coronavirus'
                    : 'verified'
                }}</span>
              </div>
              <div>
                <h3
                  class="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase"
                >
                  Chi tiết chẩn đoán
                </h3>
                <p class="text-xs font-bold text-[#9dabb9]">
                  Bệnh nhân: {{ selectedRecord.displayName }} (ID:
                  {{ selectedRecord.displayId }})
                </p>
              </div>
            </div>
            <button
              (click)="closeDetails()"
              class="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#283039] transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto p-8 bg-[#f6f7f8] dark:bg-[#101922]"
          >
            <div class="flex flex-wrap gap-4 mb-6 relative z-10">
              <div
                class="bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] px-5 py-3 rounded-xl flex-1 min-w-[200px] shadow-sm"
              >
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1"
                >
                  Kết quả AI
                </p>
                <p
                  [class]="
                    selectedRecord.result.includes('Viêm phổi')
                      ? 'text-red-500'
                      : 'text-emerald-500'
                  "
                  class="text-lg font-black uppercase"
                >
                  {{ selectedRecord.result }}
                </p>
              </div>
              <div
                class="bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] px-5 py-3 rounded-xl flex-1 min-w-[150px] shadow-sm"
              >
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1"
                >
                  Độ tin cậy
                </p>
                <p
                  [class]="
                    selectedRecord.result.includes('Viêm phổi')
                      ? 'text-red-500'
                      : 'text-emerald-500'
                  "
                  class="text-lg font-black"
                >
                  {{ selectedRecord.confidence || 'N/A' }}
                </p>
              </div>
              <div
                class="bg-white dark:bg-[#1a2530] border border-slate-200 dark:border-[#283039] px-5 py-3 rounded-xl flex-1 min-w-[150px] shadow-sm"
              >
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1"
                >
                  Thời gian test
                </p>
                <p class="text-slate-700 dark:text-gray-300 text-lg font-bold">
                  {{ selectedRecord.date }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex flex-col gap-3">
                <span
                  class="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >image</span
                  >
                  Ảnh gốc X-Ray
                </span>
                <div
                  class="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black relative shadow-lg border border-slate-200 dark:border-[#283039]"
                >
                  <img
                    [src]="selectedRecord.thumbnail"
                    class="w-full h-full object-contain"
                    onerror="this.src='assets/images/default-xray.png'"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <span
                  class="text-xs font-black text-[#137fec] uppercase tracking-widest flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[16px]"
                    >biotech</span
                  >
                  Bản đồ nhiệt AI
                </span>
                <div
                  class="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black relative shadow-lg border border-slate-200 dark:border-[#283039]"
                >
                  <img
                    *ngIf="!selectedRecord.heatmapImage"
                    [src]="selectedRecord.thumbnail"
                    class="w-full h-full object-contain grayscale opacity-30"
                  />
                  <img
                    *ngIf="selectedRecord.heatmapImage"
                    [src]="selectedRecord.heatmapImage"
                    class="absolute inset-0 w-full h-full object-contain"
                  />
                  <div
                    *ngIf="!selectedRecord.heatmapImage"
                    class="absolute inset-0 flex items-center justify-center p-4"
                  >
                    <div
                      class="text-[#9dabb9] text-sm font-bold bg-[#1a2530]/90 px-4 py-2 rounded-lg backdrop-blur flex flex-col gap-2 max-w-full overflow-hidden"
                    >
                      <p class="text-center text-red-400">
                        Không có bản đồ nhiệt (Lỗi Backend?)
                      </p>
                      <p
                        class="text-[9px] font-mono break-all text-left text-gray-500 overflow-y-auto max-h-[150px]"
                      >
                        RAW DATA: {{ selectedRecord | json }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');
      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
})
export class HistoryComponent implements OnInit {
  historyData: any[] = [];
  allData: any[] = []; // Lưu lại bản gốc để search không cần gọi API liên tục
  readonly API_URL = `${environment.apiUrl}/`;

  stats = { total: 0, pneumonia: 0, normal: 0 };
  selectedRecord: any = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.historyData.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.historyData.length / this.itemsPerPage) || 1;
  }

  constructor(private analysisService: AnalysisService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(searchTerm: string = '') {
    this.analysisService.getRecentHistory(100).subscribe((res) => {
      if (res && res.length > 0) {
        console.log('Chi tiết 1 record từ Backend:', res[0]);
      }
      // 1. CHUẨN HÓA DỮ LIỆU (Đây là bước quan trọng nhất)
      const mappedData = res.map((item: any) => ({
        ...item,
        // Nối link ảnh
        thumbnail:
          item.image || item.thumbnail || item.image_path
            ? this.API_URL +
              (item.image || item.thumbnail || item.image_path).replace(
                /\\/g,
                '/',
              )
            : 'assets/images/no-image.png',
        // Ép kiểu ID về string để không bị lỗi .toLowerCase() khi search
        displayId: item.patientId || item.patient_id || item.id || 'N/A',
        displayName:
          item.patientName || item.patient_name || item.ten || 'Không tên',
        heatmapImage:
          item.heatmap ||
          item.heatmapUrl ||
          item.heatmap_path ||
          item.heatmapPath ||
          item.heatmap_url
            ? this.API_URL +
              (
                item.heatmap ||
                item.heatmapUrl ||
                item.heatmap_path ||
                item.heatmapPath ||
                item.heatmap_url
              ).replace(/\\/g, '/')
            : null,

        // Màu sắc cho kết quả
        statusClass: item.result.includes('Viêm phổi')
          ? 'text-red-500 border-red-500/20 bg-red-500/10'
          : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
      }));

      // Lưu lại bản gốc để search
      this.allData = mappedData;

      // 2. LỌC DỮ LIỆU (Search)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        this.historyData = mappedData.filter(
          (item) =>
            item.displayName.toLowerCase().includes(term) ||
            item.displayId.toString().toLowerCase().includes(term),
        );
      } else {
        // QUAN TRỌNG: Phải gán mappedData chứ không được gán res thô!
        this.historyData = mappedData;
      }

      // Cập nhật số lượng thống kê ở trên đầu
      this.updateStats(mappedData);
    });
  }

  updateStats(data: any[]) {
    this.stats.total = data.length;
    this.stats.pneumonia = data.filter((i) =>
      i.result.includes('Viêm phổi'),
    ).length;
    this.stats.normal = this.stats.total - this.stats.pneumonia;
  }

  onSearch(event: any) {
    this.currentPage = 1; // Reset trang khi tìm kiếm
    const term = event.target.value.toLowerCase();
    if (!term) {
      this.historyData = this.allData;
      return;
    }

    // Tìm kiếm trên mảng đã được nạp (không cần gọi lại server)
    this.historyData = this.allData.filter(
      (item) =>
        item.patientName?.toLowerCase().includes(term) ||
        item.patientId?.toLowerCase().includes(term),
    );
  }

  viewDetails(record: any) {
    this.selectedRecord = record;
  }

  closeDetails() {
    this.selectedRecord = null;
  }
}
