import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalysisService } from '../../../core/service/analysis.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-[#0a0f16] font-['Manrope'] text-slate-800 dark:text-white transition-colors duration-300"
    >
      <header
        class="px-8 py-6 border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-[#0d121b]/80 backdrop-blur-md flex justify-between items-center transition-colors duration-300"
      >
        <div>
          <h1
            class="text-2xl font-black tracking-tighter flex items-center gap-2 text-blue-600 dark:text-blue-500"
          >
            <span class="material-symbols-outlined text-3xl"
              >clinical_notes</span
            >
            MEDIRECORDS
            <span class="text-slate-800 dark:text-white transition-colors"
              >AI</span
            >
          </h1>
          <p
            class="text-slate-500 dark:text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] mt-1"
          >
            Hệ thống Quản lý Bệnh án Thông minh
          </p>
        </div>
        <button
          routerLink="/user/analysis"
          class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
        >
          <span class="material-symbols-outlined text-sm">add_box</span> Phân
          tích mới
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-8 custom-scroll">
        <div class="max-w-7xl mx-auto">
          <div
            class="bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-gray-800/50 overflow-hidden shadow-lg dark:shadow-2xl transition-colors duration-300"
          >
            <div
              class="px-8 py-6 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center"
            >
              <h2
                class="font-black text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400"
              >
                Danh sách Bệnh nhân (Mới nhất)
              </h2>
              <span class="text-[10px] text-slate-500 dark:text-gray-500 italic"
                >* Bấm vào biểu tượng lịch sử để xem các lần khám cũ</span
              >
            </div>
            <table class="w-full text-left">
              <thead>
                <tr
                  class="text-slate-500 dark:text-gray-600 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100 dark:border-gray-800/50"
                >
                  <th class="px-8 py-6">Phim mới nhất</th>
                  <th class="px-8 py-6">Bệnh nhân / Mã số</th>
                  <th class="px-8 py-6 text-center">Chẩn đoán</th>
                  <th class="px-8 py-6">Độ tin cậy</th>
                  <th class="px-8 py-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-gray-800/30">
                <tr
                  *ngFor="let record of paginatedRecords"
                  class="hover:bg-slate-50 dark:hover:bg-[#1a222c] transition-colors group"
                >
                  <td class="px-8 py-5">
                    <div
                      class="size-14 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-black"
                    >
                      <img
                        [src]="record.thumbnail"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td class="px-8 py-5">
                    <p
                      class="font-black text-sm text-slate-800 dark:text-gray-200"
                    >
                      {{ record.displayName }}
                    </p>
                    <p
                      class="text-blue-600/70 dark:text-blue-500/60 text-[10px] font-mono mt-1 uppercase"
                    >
                      ID: {{ record.displayId }}
                    </p>
                  </td>
                  <td class="px-8 py-5 text-center">
                    <span
                      [ngClass]="record.statusClass"
                      class="px-4 py-2 rounded-xl text-[10px] font-black uppercase border"
                    >
                      {{ record.result }}
                    </span>
                  </td>
                  <td class="px-8 py-5">
                    <span
                      class="text-[11px] font-black font-mono text-slate-500 dark:text-gray-400"
                      >{{ record.confidence }}</span
                    >
                  </td>
                  <td class="px-8 py-5 text-right">
                    <div class="flex justify-end gap-3">
                      <button
                        (click)="openHistory(record.displayId)"
                        class="size-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all"
                        title="Xem lịch sử khám"
                      >
                        <span class="material-symbols-outlined text-lg"
                          >history</span
                        >
                      </button>
                      <button
                        (click)="deleteRecord(record.id)"
                        class="size-10 rounded-xl bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-500 transition-all"
                      >
                        <span class="material-symbols-outlined text-lg"
                          >delete</span
                        >
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Phân trang -->
            <div
              *ngIf="totalPages > 1"
              class="border-t border-slate-200 dark:border-gray-800/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#131924]"
            >
              <span
                class="text-sm text-slate-500 dark:text-gray-500 font-medium"
              >
                Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
                {{
                  currentPage * itemsPerPage > latestRecords.length
                    ? latestRecords.length
                    : currentPage * itemsPerPage
                }}
                trong số {{ latestRecords.length }} bản ghi
              </span>
              <div
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300"
              >
                <button
                  [disabled]="currentPage === 1"
                  (click)="currentPage = currentPage - 1"
                  class="px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors font-bold"
                >
                  Trước
                </button>
                <span class="px-3 font-black"
                  >Trang {{ currentPage }} / {{ totalPages }}</span
                >
                <button
                  [disabled]="currentPage === totalPages"
                  (click)="currentPage = currentPage + 1"
                  class="px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors font-bold"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
          (click)="closeHistory()"
        ></div>

        <div
          class="relative bg-white dark:bg-[#0d121b] border border-slate-200 dark:border-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors"
        >
          <div
            class="px-8 py-6 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50 dark:bg-[#131924]"
          >
            <div>
              <h3
                class="text-xl font-black text-blue-600 dark:text-blue-500 uppercase tracking-tighter"
              >
                Lịch sử phân tích
              </h3>
              <p class="text-xs text-slate-500 dark:text-gray-500">
                Bệnh nhân: {{ selectedPatientName }} ({{ selectedPatientId }})
              </p>
            </div>
            <button
              (click)="closeHistory()"
              class="text-slate-400 hover:text-slate-800 dark:text-gray-500 dark:hover:text-white transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 custom-scroll">
            <div class="space-y-4">
              <div
                *ngFor="let h of selectedHistory"
                class="bg-slate-50 dark:bg-[#1a222c] border border-slate-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-5 hover:border-slate-300 dark:hover:border-gray-600 transition-all"
              >
                <img
                  [src]="h.thumbnail"
                  class="size-20 rounded-xl object-cover border border-slate-200 dark:border-gray-700"
                />
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <span
                      [ngClass]="h.statusClass"
                      class="px-2 py-1 rounded-lg text-[9px] font-black uppercase border"
                    >
                      {{ h.result }}
                    </span>
                    <span
                      class="text-[10px] font-mono text-slate-500 dark:text-gray-500"
                      >{{ h.date }}</span
                    >
                  </div>
                  <div class="mt-2 flex items-center gap-4">
                    <p
                      class="text-sm font-bold text-slate-700 dark:text-gray-300"
                    >
                      Độ tin cậy:
                      <span class="text-blue-600 dark:text-blue-400">{{
                        h.confidence
                      }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex-shrink-0">
                  <button
                    (click)="deleteHistoryEntry(h.dbId)"
                    class="size-10 rounded-xl bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-500 transition-all"
                    title="Xóa bản ghi này"
                  >
                    <span class="material-symbols-outlined text-lg"
                      >delete</span
                    >
                  </button>
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
      .custom-scroll::-webkit-scrollbar {
        width: 5px;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 10px;
      }
      :host-context(.dark) .custom-scroll::-webkit-scrollbar-thumb {
        background: #1a222c;
      }
    `,
  ],
})
export class MedicalRecordsComponent implements OnInit {
  allData: any[] = []; // Toàn bộ record để lọc lịch sử
  latestRecords: any[] = []; // Chỉ lưu ca mới nhất của mỗi BN để hiện ở bảng

  // Pagination
  currentPage = 1;
  itemsPerPage = 7;

  get paginatedRecords() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.latestRecords.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.latestRecords.length / this.itemsPerPage) || 1;
  }

  // Biến cho Modal
  showModal = false;
  selectedHistory: any[] = [];
  selectedPatientName = '';
  selectedPatientId = '';

  readonly API_URL = 'http://localhost:5000/';
  stats = { total: 0, pneumonia: 0, normal: 0 };

  constructor(private analysisService: AnalysisService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.analysisService.getRecentHistory(100).subscribe({
      next: (res: any) => {
        console.log('Dữ liệu thực tế từ Flask:', res);

        const mappedData = res.map((item: any) => {
          const rawPath = item.image || item.thumbnail || '';
          const cleanPath = rawPath.replace(/\\/g, '/');

          return {
            ...item,
            displayName: item.ten || 'Chưa có tên',
            displayId: item.id || 'N/A',
            dbId: item.id_db,
            thumbnail: cleanPath
              ? this.API_URL + cleanPath
              : 'assets/images/default.jpg',
            date: item.date || '---',
            statusClass: item.result?.includes('Viêm phổi')
              ? 'text-red-600 dark:text-red-500 border-red-500/20 bg-red-50 dark:bg-red-500/10'
              : 'text-emerald-600 dark:text-emerald-500 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10',
            confidence: item.confidence || '0%',
          };
        });

        this.allData = mappedData;

        const uniquePatients = new Map();
        mappedData.forEach((record: any) => {
          if (!uniquePatients.has(record.displayId)) {
            uniquePatients.set(record.displayId, record);
          }
        });

        this.latestRecords = Array.from(uniquePatients.values());
        this.updateStats(mappedData);
      },
      error: (err) => console.error('Lỗi:', err),
    });
  }

  openHistory(patientId: string) {
    this.selectedPatientId = patientId;
    this.selectedHistory = this.allData.filter(
      (item) => item.displayId === patientId,
    );
    this.selectedPatientName =
      this.selectedHistory[0]?.displayName || 'Bệnh nhân';
    this.showModal = true;
  }

  closeHistory() {
    this.showModal = false;
  }

  updateStats(data: any[]) {
    this.stats.total = data.length;
    this.stats.pneumonia = data.filter((i) =>
      i.result?.includes('Viêm phổi'),
    ).length;
    this.stats.normal = this.stats.total - this.stats.pneumonia;
  }

  deleteRecord(id: any) {
    if (confirm('Xóa bản ghi này?')) {
      this.analysisService.deleteAnalysis(id).subscribe(() => {
        this.loadHistory();
      });
    }
  }

  deleteHistoryEntry(id: any) {
    if (!id) return;
    if (!confirm('Xóa bản ghi lịch sử này?')) return;

    this.analysisService.deleteAnalysis(id).subscribe({
      next: () => {
        this.allData = this.allData.filter((a) => a.dbId !== id);
        this.selectedHistory = this.selectedHistory.filter(
          (h) => h.dbId !== id,
        );
        this.latestRecords = this.latestRecords.filter((r) => r.dbId !== id);
        this.updateStats(this.allData);

        if (this.selectedHistory.length === 0) {
          this.closeHistory();
        }
      },
      error: (err) => {
        console.error('Lỗi khi xóa lịch sử:', err);
        alert('Xóa không thành công. Vui lòng thử lại.');
      },
    });
  }

  onSearch(event: any) {
    this.currentPage = 1;
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.latestRecords = this.allData.filter(
      (i) =>
        i.displayName?.toLowerCase().includes(term) ||
        i.displayId?.toString().toLowerCase().includes(term),
    );
    if (!term) {
      this.loadHistory();
    }
  }
}
