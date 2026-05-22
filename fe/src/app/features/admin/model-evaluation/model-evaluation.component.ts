import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ModelEvaluationService,
  EvaluationResult,
  ModelInfo,
} from '../../../core/service/model-evaluation.service';

@Component({
  selector: 'app-model-evaluation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="flex-1 flex flex-col bg-[#0a0f16] font-['Manrope'] text-white min-h-screen"
    >
      <header
        class="px-8 py-6 border-b border-gray-800 bg-[#0d121b]/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10"
      >
        <div>
          <h1
            class="text-2xl font-black tracking-tighter flex items-center gap-2 text-blue-500"
          >
            <span class="material-symbols-outlined">analytics</span>
            Đánh giá Mô hình DL
          </h1>
          <p class="text-gray-500 text-[13px] mt-1">
            Theo dõi hiệu suất và so sánh các phiên bản mô hình chẩn đoán.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="border border-gray-700 bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 text-gray-300"
          >
            <span class="material-symbols-outlined text-sm"
              >compare_arrows</span
            >
            So sánh
          </button>
          <button
            class="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <span class="material-symbols-outlined text-sm">add_box</span> Huấn
            luyện mới
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 custom-scroll">
        <div class="max-w-6xl mx-auto flex flex-col gap-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              class="lg:col-span-1 bg-[#131924] rounded-2xl border border-gray-800/50 p-6 flex items-center gap-4 shadow-sm"
            >
              <div
                class="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 relative"
              >
                <span class="material-symbols-outlined text-3xl"
                  >model_training</span
                >
                <span
                  class="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-[#131924] animate-pulse"
                ></span>
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1"
                >
                  Đang hoạt động
                </p>
                <h3 class="text-lg font-black text-white truncate">
                  {{ activeModel?.name || 'Chưa chọn' }}
                </h3>
                <p class="text-[11px] text-emerald-400 font-mono italic">
                  v{{ activeModel?.version || '0.0' }}
                </p>
              </div>
            </div>

            <div
              class="lg:col-span-2 bg-[#131924] rounded-2xl border border-gray-800/50 p-6 flex items-center justify-between shadow-sm"
            >
              <div class="flex flex-col">
                <p
                  class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2"
                >
                  Thông tin tập dữ liệu
                </p>
                <p class="text-sm text-gray-300 italic">
                  Dữ liệu đánh giá dựa trên tập Test của
                  <strong>ChestX-Ray-14</strong>
                </p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-black text-white">
                  {{ models.length }}
                </p>
                <p
                  class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter"
                >
                  Phiên bản lưu trữ
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div
              class="lg:col-span-8 bg-[#131924] rounded-2xl border border-gray-800/50 p-6 flex flex-col shadow-sm"
            >
              <h3
                class="text-base font-bold text-white mb-8 flex items-center gap-2"
              >
                <span class="size-1.5 bg-blue-500 rounded-full"></span> Hiệu
                suất chi tiết
              </h3>

              <div
                class="space-y-8 flex-1 flex flex-col justify-center"
                *ngIf="selectedEval"
              >
                <div class="space-y-3">
                  <div class="flex justify-between items-end">
                    <span
                      class="text-xs text-gray-400 font-bold uppercase tracking-wider"
                      >Accuracy (Độ chính xác)</span
                    >
                    <span class="text-xl font-black text-blue-400"
                      >{{ (selectedEval.accuracy * 100).toFixed(1) }}%</span
                    >
                  </div>
                  <div
                    class="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-[2px]"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                      [style.width.%]="selectedEval.accuracy * 100"
                    ></div>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between items-end">
                    <span
                      class="text-xs text-gray-400 font-bold uppercase tracking-wider"
                      >F1-Score (Cân bằng)</span
                    >
                    <span class="text-xl font-black text-emerald-400">{{
                      selectedEval.f1_score
                    }}</span>
                  </div>
                  <div
                    class="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-[2px]"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      [style.width.%]="selectedEval.f1_score * 100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="lg:col-span-4 bg-[#131924] rounded-2xl border border-gray-800/50 p-6 shadow-sm"
            >
              <h3
                class="text-base font-bold text-white mb-6 italic text-center"
              >
                Confusion Matrix
              </h3>
              <div class="grid grid-cols-2 gap-2" *ngIf="selectedEval">
                <div
                  class="bg-emerald-600/5 border border-emerald-500/10 rounded-xl p-4 text-center"
                >
                  <h4 class="text-xl font-black text-emerald-400">
                    {{ selectedEval.confusion_matrix.tn }}
                  </h4>
                  <p class="text-[9px] text-gray-500 uppercase font-bold mt-1">
                    True Normal
                  </p>
                </div>
                <div
                  class="bg-blue-600/5 border border-blue-500/10 rounded-xl p-4 text-center"
                >
                  <h4 class="text-xl font-black text-blue-400">
                    {{ selectedEval.confusion_matrix.fp }}
                  </h4>
                  <p class="text-[9px] text-gray-500 uppercase font-bold mt-1">
                    False Pneu
                  </p>
                </div>
                <div
                  class="bg-blue-600/5 border border-blue-500/10 rounded-xl p-4 text-center"
                >
                  <h4 class="text-xl font-black text-blue-400">
                    {{ selectedEval.confusion_matrix.fn }}
                  </h4>
                  <p class="text-[9px] text-gray-500 uppercase font-bold mt-1">
                    False Normal
                  </p>
                </div>
                <div
                  class="bg-red-600/5 border border-red-500/10 rounded-xl p-4 text-center"
                >
                  <h4 class="text-xl font-black text-red-400">
                    {{ selectedEval.confusion_matrix.tp }}
                  </h4>
                  <p class="text-[9px] text-gray-500 uppercase font-bold mt-1">
                    True Pneu
                  </p>
                </div>
              </div>
              <div
                class="mt-6 pt-6 border-t border-gray-800/50 flex justify-center gap-4"
              >
                <div class="flex items-center gap-1.5">
                  <span class="size-1.5 bg-emerald-500 rounded-full"></span
                  ><span class="text-[9px] text-gray-500 font-bold uppercase"
                    >Chính xác</span
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="size-1.5 bg-red-500 rounded-full"></span
                  ><span class="text-[9px] text-gray-500 font-bold uppercase"
                    >Sai lệch</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-[#131924] rounded-2xl border border-gray-800/50 overflow-hidden shadow-sm"
          >
            <table class="w-full text-left">
              <thead
                class="bg-gray-900/40 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800/50"
              >
                <tr>
                  <th class="px-8 py-5">Mô hình & Phiên bản</th>
                  <th class="px-8 py-5">Kiến trúc</th>
                  <th class="px-8 py-5 text-center">Độ chính xác</th>
                  <th class="px-8 py-5">Trạng thái</th>
                  <th class="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800/30">
                <tr
                  *ngFor="let model of models"
                  (click)="onViewDetail(model.id_db)"
                  class="hover:bg-blue-500/[0.03] transition-colors cursor-pointer group"
                >
                  <td class="px-8 py-4">
                    <p
                      class="font-black text-sm text-gray-200 group-hover:text-blue-400 transition-colors"
                    >
                      {{ model.name }}
                    </p>
                    <p
                      class="text-[10px] text-gray-600 font-mono mt-0.5 tracking-tighter"
                    >
                      VER: {{ model.version }}
                    </p>
                  </td>
                  <td
                    class="px-8 py-4 text-xs text-gray-400 font-medium italic"
                  >
                    {{ model.architecture }}
                  </td>
                  <td class="px-8 py-4">
                    <div class="flex justify-center">
                      <span
                        class="text-xs font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5"
                        >{{ model.accuracy }}</span
                      >
                    </div>
                  </td>
                  <td class="px-8 py-4">
                    <span
                      [ngClass]="model.statusClass"
                      class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight"
                    >
                      {{ model.status }}
                    </span>
                  </td>
                  <td class="px-8 py-4 text-right">
                    <button
                      class="size-9 rounded-xl text-gray-600 hover:text-white hover:bg-gray-800 transition-all"
                    >
                      <span class="material-symbols-outlined text-lg"
                        >analytics</span
                      >
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer class="text-center py-4">
            <p
              class="text-[9px] text-gray-700 uppercase tracking-[0.3em] font-bold"
            >
              Deep Learning Evaluation Module • 2026
            </p>
          </footer>
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
      .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: #3b82f6;
      }
    `,
  ],
})
export class ModelEvaluationComponent implements OnInit {
  // GIỮ NGUYÊN TOÀN BỘ LOGIC
  models: any[] = [];
  selectedEval: EvaluationResult | null = null;
  activeModel: any = null;

  constructor(private evalService: ModelEvaluationService) {}

  ngOnInit(): void {
    this.refreshModels();
  }

  refreshModels() {
    this.evalService.getModels().subscribe({
      next: (data) => {
        this.models = data.map((m) => ({
          ...m,
          statusClass: this.getStatusClass(m.status),
        }));
        this.activeModel = this.models.find((m) => m.status === 'Active');
        if (this.models.length > 0) this.onViewDetail(this.models[0].id_db);
      },
      error: (err) => console.error('Lỗi tải danh sách model:', err),
    });
  }

  onViewDetail(modelId: number) {
    this.evalService.evaluateModel(modelId).subscribe({
      next: (res) => (this.selectedEval = res),
      error: (err) => console.error('Lỗi đánh giá:', err),
    });
  }

  getStatusClass(status: string) {
    if (status === 'Active')
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (status === 'Testing')
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    return 'bg-gray-500/10 text-gray-500 border border-gray-500/10';
  }
}
