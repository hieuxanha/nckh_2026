import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-export',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div
      class="flex-1 flex flex-col bg-[#0a0f16] font-['Manrope'] text-white min-h-screen"
    >
      <header
        class="px-8 py-6 border-b border-gray-800 bg-[#0d121b]/80 backdrop-blur-md"
      >
        <div class="max-w-6xl mx-auto w-full">
          <h1
            class="text-2xl font-black tracking-tighter flex items-center gap-2 text-blue-500"
          >
            Xuất Báo cáo Hệ thống
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            Tạo và tải xuống báo cáo chi tiết về hoạt động chẩn đoán và người
            dùng.
          </p>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 custom-scroll">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div class="lg:col-span-8 flex flex-col gap-6">
            <div
              class="bg-[#131924] rounded-2xl border border-gray-800/50 p-6 shadow-sm"
            >
              <h3
                class="text-base font-bold text-white mb-6 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-blue-500 text-xl"
                  >filter_alt</span
                >
                Bộ lọc dữ liệu
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <span
                    class="text-xs text-gray-500 font-semibold uppercase tracking-wider"
                    >Từ ngày</span
                  >
                  <input
                    type="date"
                    class="px-4 py-2.5 rounded-xl bg-[#0d121b] border border-gray-800 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    value="2023-10-01"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <span
                    class="text-xs text-gray-500 font-semibold uppercase tracking-wider"
                    >Đến ngày</span
                  >
                  <input
                    type="date"
                    class="px-4 py-2.5 rounded-xl bg-[#0d121b] border border-gray-800 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    value="2023-10-31"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <span
                    class="text-xs text-gray-500 font-semibold uppercase tracking-wider"
                    >Loại người dùng</span
                  >
                  <select
                    class="px-4 py-2.5 rounded-xl bg-[#0d121b] border border-gray-800 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                  >
                    <option>Tất cả người dùng</option>
                    <option>Admin</option>
                    <option>Bác sĩ</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <span
                    class="text-xs text-gray-500 font-semibold uppercase tracking-wider"
                    >Kết quả chẩn đoán</span
                  >
                  <select
                    class="px-4 py-2.5 rounded-xl bg-[#0d121b] border border-gray-800 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                  >
                    <option>Tất cả kết quả</option>
                    <option>Viêm phổi</option>
                    <option>Bình thường</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              class="bg-[#131924] rounded-2xl border border-gray-800/50 p-6 shadow-sm"
            >
              <h3
                class="text-base font-bold text-white mb-6 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-blue-500 text-xl"
                  >file_download</span
                >
                Định dạng xuất file
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="group relative bg-blue-600/5 border border-blue-500/30 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:bg-blue-600/10 transition-all"
                >
                  <span class="material-symbols-outlined text-4xl text-blue-500"
                    >picture_as_pdf</span
                  >
                  <div class="text-center">
                    <p class="font-bold text-white text-sm">Tài liệu PDF</p>
                    <p class="text-[10px] text-gray-500 mt-1">
                      Thích hợp để in ấn và lưu trữ
                    </p>
                  </div>
                </div>
                <div
                  class="group relative bg-[#0d121b] border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                >
                  <span
                    class="material-symbols-outlined text-4xl text-emerald-500"
                    >grid_on</span
                  >
                  <div class="text-center">
                    <p class="font-bold text-white text-sm">Excel (CSV)</p>
                    <p class="text-[10px] text-gray-500 mt-1">
                      Dữ liệu thô để phân tích thêm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-[#131924] rounded-2xl border border-gray-800/50 p-5 flex items-center justify-between shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-blue-500"
                    >bar_chart</span
                  >
                </div>
                <div>
                  <p
                    class="text-[10px] text-gray-500 uppercase font-bold tracking-widest"
                  >
                    Dự kiến kết quả
                  </p>
                  <p class="text-sm font-bold text-white">
                    Tìm thấy <span class="text-blue-500">1,240</span> bản ghi
                  </p>
                </div>
              </div>
              <div class="flex gap-3">
                <button
                  class="px-5 py-2.5 rounded-xl border border-gray-800 bg-[#0d121b] text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Làm mới
                </button>
                <button
                  class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                >
                  <span class="material-symbols-outlined text-sm font-bold"
                    >download</span
                  >
                  Tạo báo cáo
                </button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 flex flex-col gap-6 h-full">
            <div
              class="bg-[#131924] rounded-2xl border border-gray-800/50 p-6 flex flex-col h-full shadow-sm"
            >
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-base font-bold text-white italic">
                  Lịch sử xuất báo cáo
                </h3>
                <button
                  class="text-[11px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider"
                >
                  Xem tất cả
                </button>
              </div>

              <div class="flex flex-col gap-3">
                <div
                  *ngFor="let i of [1, 2, 3, 4, 5]"
                  class="flex items-center gap-3 bg-[#0d121b] hover:bg-gray-800/50 rounded-xl p-3 border border-gray-800/30 transition-colors cursor-pointer group"
                >
                  <span
                    class="material-symbols-outlined text-red-500/80 group-hover:text-red-500 transition-colors"
                    >picture_as_pdf</span
                  >
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-gray-200 truncate">
                      Report_Oct2023_v{{ i }}.pdf
                    </p>
                    <p class="text-[10px] text-gray-500">
                      2 giờ trước • 2.4 MB
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="mt-8 border border-gray-800/50 border-dashed rounded-2xl p-6 text-center bg-[#0d121b]/30"
              >
                <span
                  class="material-symbols-outlined text-3xl text-gray-700 mb-2"
                  >cloud_upload</span
                >
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-tight"
                >
                  Lưu trữ đám mây
                </p>
                <p
                  class="text-[10px] text-gray-600 mt-2 leading-relaxed italic"
                >
                  Các báo cáo cũ hơn 30 ngày sẽ tự động chuyển vào kho lưu trữ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
      :host {
        display: block;
        height: 100vh;
      }
      .custom-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: #1a222c;
        border-radius: 10px;
      }
    `,
  ],
})
export class ReportExportComponent implements OnInit {
  ngOnInit(): void {}
}
