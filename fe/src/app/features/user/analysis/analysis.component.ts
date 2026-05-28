import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from '../../../core/service/analysis.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex-1 w-full max-w-[1360px] mx-auto p-4 lg:p-6 flex flex-col font-['Manrope'] bg-[#f6f7f8] dark:bg-[#101922] text-[#111418] dark:text-white transition-colors duration-200"
    >
      <div class="mb-6">
        <h1
          class="text-2xl md:text-3xl font-black leading-tight tracking-tight mb-1 uppercase"
        >
          Phân tích X-quang Lồng ngực
        </h1>
        <p
          class="text-gray-500 dark:text-[#9dabb9] text-sm font-normal max-w-2xl"
        >
          Hệ thống hỗ trợ chẩn đoán MediAI sử dụng mô hình DenseNet121 để phát
          hiện dấu hiệu viêm phổi và trực quan hóa vùng tổn thương.
        </p>
      </div>

      <div
        *ngIf="errorMessage"
        class="mb-5 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300"
      >
        <span class="material-symbols-outlined text-lg">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full flex-1">
        <div class="lg:col-span-4 xl:col-span-3 flex flex-col gap-5">
          <div
            class="bg-white dark:bg-[#1a242d] border border-gray-200 dark:border-[#283039] rounded-2xl p-6 flex flex-col h-full shadow-sm"
          >
            <h3
              class="text-base font-bold mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3"
            >
              <span class="material-symbols-outlined text-[#137fec] text-xl"
                >settings_suggest</span
              >
              Thiết lập Chẩn đoán
            </h3>

            <div class="mb-6 space-y-3">
              <label
                class="block text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >1. Thông tin bệnh nhân</label
              >
              <div class="space-y-2">
                <div class="relative group">
                  <span
                    class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137fec] text-lg transition-colors"
                    >fingerprint</span
                  >
                  <input
                    type="text"
                    [(ngModel)]="patientId"
                    placeholder="Mã định danh (ID)..."
                    class="w-full bg-gray-50 dark:bg-[#111418] border border-gray-200 dark:border-[#3b4754] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-[#137fec] outline-none transition-all placeholder:text-gray-400 font-mono"
                  />
                </div>
                <div class="relative group">
                  <span
                    class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137fec] text-lg transition-colors"
                    >person</span
                  >
                  <input
                    type="text"
                    [(ngModel)]="patientName"
                    placeholder="Họ và tên bệnh nhân..."
                    class="w-full bg-gray-50 dark:bg-[#111418] border border-gray-200 dark:border-[#3b4754] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-[#137fec] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div class="flex-1 flex flex-col">
              <label
                class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >2. Dữ liệu X-quang</label
              >
              <div
                (click)="fileInput.click()"
                class="flex-1 flex flex-col justify-center items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-[#3b4754] bg-gray-50/50 dark:bg-[#111418]/50 hover:border-[#137fec] hover:bg-blue-50/30 dark:hover:bg-[#137fec]/5 transition-all p-6 cursor-pointer group min-h-[160px]"
              >
                <input
                  #fileInput
                  type="file"
                  class="hidden"
                  (change)="onFileSelected($event)"
                  accept="image/*"
                />
                <div
                  class="size-12 rounded-full bg-white dark:bg-[#1a242d] border border-gray-100 dark:border-[#283039] shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <span
                    class="material-symbols-outlined text-2xl text-gray-400 group-hover:text-[#137fec]"
                    >add_a_photo</span
                  >
                </div>
                <div class="text-center">
                  <p class="text-xs font-bold dark:text-white">
                    Nhấp để tải ảnh
                  </p>
                  <p
                    class="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5"
                  >
                    DICOM, PNG, JPG (MAX 50MB)
                  </p>
                </div>
              </div>

              <div
                *ngIf="selectedFile"
                class="mt-4 animate-in fade-in slide-in-from-top-2"
              >
                <div
                  class="flex items-center gap-3 p-3 bg-white dark:bg-[#111418] rounded-xl border border-gray-200 dark:border-[#3b4754] shadow-sm"
                >
                  <div
                    class="size-10 bg-gray-100 dark:bg-[#1a242d] rounded-lg flex items-center justify-center text-[#137fec]"
                  >
                    <span class="material-symbols-outlined text-xl">image</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold truncate dark:text-white">
                      {{ selectedFile.name }}
                    </p>
                    <p
                      class="text-[11px] text-emerald-500 font-bold flex items-center gap-1"
                    >
                      <span class="material-symbols-outlined text-[12px]"
                        >check_circle</span
                      >
                      Sẵn sàng chẩn đoán
                    </p>
                  </div>
                  <button
                    (click)="removeFile($event)"
                    class="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <span class="material-symbols-outlined text-lg"
                      >delete</span
                    >
                  </button>
                </div>
              </div>
            </div>

            <div
              class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800"
            >
              <button
                [disabled]="!canStart"
                (click)="startAnalysis()"
                [class.opacity-50]="!canStart"
                class="w-full flex items-center justify-center gap-2 bg-[#137fec] hover:bg-blue-600 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <span
                  class="material-symbols-outlined text-xl"
                  *ngIf="!isAnalyzing"
                  >auto_fix_high</span
                >
                <div
                  *ngIf="isAnalyzing"
                  class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
                {{
                  isAnalyzing
                    ? 'AI đang quét dữ liệu...'
                    : 'Bắt đầu phân tích AI'
                }}
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-5">
          <div
            class="bg-white dark:bg-[#1a242d] border border-gray-200 dark:border-[#283039] rounded-2xl p-6 shadow-sm relative overflow-hidden"
          >
            <div
              [class]="
                resultStatus === 'Positive' ? 'bg-red-500' : 'bg-emerald-500'
              "
              class="absolute left-0 top-0 bottom-0 w-1.5"
            ></div>

            <p
              class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 pl-2 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[14px]"
                >analytics</span
              >
              Kết quả cho:
              <span class="text-slate-900 dark:text-white">{{
                patientName || 'Đang chờ...'
              }}</span>
            </p>

            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2"
            >
              <div class="flex items-center gap-3">
                <div
                  [class]="
                    resultStatus === 'Positive'
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-emerald-500 bg-emerald-500/10'
                  "
                  class="size-12 rounded-xl flex items-center justify-center border border-current/20 shadow-inner"
                >
                  <span class="material-symbols-outlined text-2xl">{{
                    resultStatus === 'Positive' ? 'coronavirus' : 'verified'
                  }}</span>
                </div>
                <div>
                  <h3
                    [class]="
                      resultStatus === 'Positive'
                        ? 'text-red-500'
                        : 'text-emerald-500'
                    "
                    class="text-2xl font-black leading-none uppercase"
                  >
                    {{ displayResult.prediction }}
                  </h3>
                  <p
                    class="text-[10px] font-bold text-gray-500 dark:text-[#9dabb9] mt-1.5"
                  >
                    MediAI Engine v2.4 • {{ displayResult.time }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700"
              >
                <div class="text-right">
                  <p
                    class="text-[9px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    Độ tin cậy
                  </p>
                  <p
                    [class]="
                      resultStatus === 'Positive'
                        ? 'text-red-500'
                        : 'text-emerald-500'
                    "
                    class="text-xl font-black"
                  >
                    {{ displayResult.confidence }}
                  </p>
                </div>
              </div>
            </div>

            <div
              *ngIf="resultStatus !== 'None'"
              class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 mx-2"
            >
              <div
                [class]="
                  resultStatus === 'Positive'
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-emerald-500/5 border-emerald-500/20'
                "
                class="p-4 rounded-2xl border relative overflow-hidden"
              >
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="size-8 rounded-lg bg-gradient-to-tr from-[#137fec] to-[#00d2ff] flex items-center justify-center shadow-lg shadow-blue-500/20"
                  >
                    <span class="material-symbols-outlined text-white text-sm"
                      >psychology</span
                    >
                  </div>
                  <h4
                    class="text-xs font-black uppercase tracking-widest text-[#137fec]"
                  >
                    Phân tích chuyên sâu từ MediAI-LLM
                  </h4>
                </div>

                <div class="relative min-h-[60px]">
                  <p
                    class="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 italic"
                  >
                    {{ aiExplanation || 'Đang khởi tạo bản tóm tắt y tế...' }}
                  </p>
                </div>

                <div class="mt-4 flex items-center gap-2 opacity-50">
                  <span class="material-symbols-outlined text-[14px]"
                    >verified_user</span
                  >
                  <span class="text-[10px] font-bold uppercase"
                    >Nội dung được tạo bởi mô hình ngôn ngữ lớn (LLM)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-[#1a242d] border border-gray-200 dark:border-[#283039] rounded-2xl p-6 shadow-sm flex-1"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <div class="flex flex-col gap-4">
                <span
                  class="text-xs font-black text-gray-400 uppercase tracking-widest"
                  >Ảnh gốc X-Ray</span
                >
                <div
                  class="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#0d1117] relative border border-gray-800 shadow-inner flex items-center justify-center"
                >
                  <div
                    class="relative w-full h-full flex items-center justify-center"
                  >
                    <img
                      *ngIf="imagePreview"
                      [src]="imagePreview"
                      [style.transform]="
                        'rotate(' +
                        imageRotation +
                        'deg) scale(' +
                        imageZoom +
                        ')'
                      "
                      class="object-cover transition-transform duration-300"
                    />
                  </div>
                  <div *ngIf="isAnalyzing" class="scanner-line"></div>
                  <div
                    *ngIf="!imagePreview"
                    class="w-full h-full flex flex-col items-center justify-center text-gray-700"
                  >
                    <span class="material-symbols-outlined text-5xl opacity-10"
                      >image_search</span
                    >
                  </div>
                </div>

                <div *ngIf="imagePreview" class="flex flex-col gap-2">
                  <div class="flex gap-2 justify-center">
                    <button
                      (click)="rotateImageLeft()"
                      class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a242d] hover:bg-gray-200 dark:hover:bg-[#283039] text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition-all border border-gray-200 dark:border-[#3b4754]"
                    >
                      <span class="material-symbols-outlined text-lg"
                        >rotate_left</span
                      >
                      Xoay Trái
                    </button>
                    <button
                      (click)="rotateImageRight()"
                      class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a242d] hover:bg-gray-200 dark:hover:bg-[#283039] text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition-all border border-gray-200 dark:border-[#3b4754]"
                    >
                      <span class="material-symbols-outlined text-lg"
                        >rotate_right</span
                      >
                      Xoay Phải
                    </button>
                  </div>
                  <div class="flex gap-2 justify-center">
                    <button
                      (click)="zoomOut()"
                      [disabled]="imageZoom <= 1"
                      class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a242d] hover:bg-gray-200 dark:hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition-all border border-gray-200 dark:border-[#3b4754]"
                    >
                      <span class="material-symbols-outlined text-lg"
                        >zoom_out</span
                      >
                      Thu Nhỏ
                    </button>
                    <div
                      class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-[#111418] text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs border border-gray-200 dark:border-[#3b4754]"
                    >
                      {{ (imageZoom * 100).toFixed(0) }}%
                    </div>
                    <button
                      (click)="zoomIn()"
                      [disabled]="imageZoom >= 3"
                      class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a242d] hover:bg-gray-200 dark:hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition-all border border-gray-200 dark:border-[#3b4754]"
                    >
                      <span class="material-symbols-outlined text-lg"
                        >zoom_in</span
                      >
                      Phóng Đại
                    </button>
                    <button
                      (click)="resetZoom()"
                      [disabled]="imageZoom === 1"
                      class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a242d] hover:bg-gray-200 dark:hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition-all border border-gray-200 dark:border-[#3b4754]"
                    >
                      <span class="material-symbols-outlined text-lg"
                        >fit_screen</span
                      >
                      Đặt lại
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-4">
                <span
                  class="text-xs font-black text-[#137fec] uppercase tracking-widest"
                  >Bản đồ nhiệt AI (Grad-CAM)</span
                >
                <div
                  class="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#0d1117] relative border border-gray-800 shadow-inner"
                >
                  <img
                    *ngIf="imagePreview && !serverHeatmapUrl"
                    [src]="imagePreview"
                    class="w-full h-full object-cover grayscale opacity-20"
                  />

                  <img
                    *ngIf="serverHeatmapUrl"
                    [src]="serverHeatmapUrl"
                    [style.transform]="
                      'rotate(' +
                      imageRotation +
                      'deg) scale(' +
                      imageZoom +
                      ')'
                    "
                    class="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-700 transition-transform"
                  />

                  <div
                    *ngIf="!imagePreview"
                    class="w-full h-full flex flex-col items-center justify-center text-gray-700"
                  >
                    <span class="material-symbols-outlined text-5xl opacity-10"
                      >biotech</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-6 mb-2 mx-auto max-w-3xl flex items-start sm:items-center justify-center gap-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded-xl text-[11px] font-semibold border border-amber-200 dark:border-amber-800/50"
      >
        <span class="material-symbols-outlined text-[20px]">info</span>
        <span>
          * Lưu ý: Trong thực tế, hệ thống không thay thế bác sĩ mà chỉ đóng vai
          trò hỗ trợ sàng lọc hoặc gợi ý ban đầu.
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');
      :host {
        display: block;
        width: 100%;
        height: auto;
        min-height: 100%;
      }

      .scanner-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: #137fec;
        box-shadow:
          0 0 15px #137fec,
          0 0 25px #137fec;
        animation: scan 2s ease-in-out infinite;
        z-index: 10;
      }

      @keyframes scan {
        0% {
          top: 0%;
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          top: 100%;
          opacity: 0;
        }
      }

      input::placeholder {
        font-family: 'Manrope', sans-serif;
        font-weight: 500;
      }
    `,
  ],
})
export class AnalysisComponent {
  // Đường dẫn trỏ chuẩn xác đến tiền tố Router phân vùng API
  readonly API_URL = `${environment.apiUrl}/api/analysis/`;

  patientId: string = '';
  patientName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  serverHeatmapUrl: string | null = null;
  imageRotation: number = 0;
  imageZoom: number = 1;

  aiExplanation: string = '';
  errorMessage: string = '';

  displayResult = {
    prediction: 'Chưa có kết quả',
    confidence: '---',
    time: '---',
  };

  isAnalyzing: boolean = false;
  resultStatus: 'Positive' | 'Normal' | 'None' = 'None';

  constructor(private analysisService: AnalysisService) {}

  get canStart(): boolean {
    return !!(
      this.patientId &&
      this.patientName &&
      this.selectedFile &&
      !this.isAnalyzing
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.serverHeatmapUrl = null;
      this.errorMessage = '';
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imagePreview = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    this.serverHeatmapUrl = null;
    this.resultStatus = 'None';
    this.imageRotation = 0;
    this.imageZoom = 1;
    this.errorMessage = '';
    this.displayResult = {
      prediction: 'Chưa có kết quả',
      confidence: '---',
      time: '---',
    };
  }

  rotateImageLeft() {
    this.imageRotation = (this.imageRotation - 90 + 360) % 360;
  }
  rotateImageRight() {
    this.imageRotation = (this.imageRotation + 90) % 360;
  }
  zoomIn() {
    if (this.imageZoom < 3) this.imageZoom += 0.5;
  }
  zoomOut() {
    if (this.imageZoom > 1) this.imageZoom -= 0.5;
  }
  resetZoom() {
    this.imageZoom = 1;
  }

  startAnalysis() {
    if (!this.canStart) return;
    this.isAnalyzing = true;
    this.aiExplanation = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('patientId', this.patientId);
    formData.append('patientName', this.patientName);
    formData.append('image', this.selectedFile!);

    this.analysisService.predict(formData).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isAnalyzing = false;
          this.resultStatus = res.result.includes('Viêm phổi')
            ? 'Positive'
            : 'Normal';

          this.displayResult = {
            prediction: res.result,
            confidence: res.confidence,
            time: res.analysisTime,
          };

          // Nối chuỗi chuẩn hóa: Không bị lặp lại cụm "api/analysis/"
          this.serverHeatmapUrl = this.API_URL + res.heatmapUrl;

          if (res.llm_explanation) {
            this.simulateTyping(res.llm_explanation);
          }
        }, 1200);
      },
      error: (err) => {
        this.isAnalyzing = false;
        this.resultStatus = 'None';
        this.errorMessage =
          err.error?.msg ||
          'Hệ thống gặp sự cố kết nối ngoài dự kiến. Vui lòng thử lại!';
        this.displayResult = {
          prediction: 'Phân tích thất bại',
          confidence: '---',
          time: '---',
        };
      },
    });
  }

  simulateTyping(text: string) {
    let index = 0;
    this.aiExplanation = '';
    const interval = setInterval(() => {
      this.aiExplanation += text[index];
      index++;
      if (index === text.length) clearInterval(interval);
    }, 20);
  }
}
