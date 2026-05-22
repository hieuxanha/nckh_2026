import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex min-h-screen w-full font-['Manrope'] bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white transition-colors duration-200"
    >
      <div
        class="relative hidden w-1/2 lg:flex flex-col justify-end bg-cover bg-center overflow-hidden"
        style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMsecZ5fKnIPJZghB3knk0nxXaG15wiruQ2lIvUdgZK4OAPH_LQxRiC4wd1wcLn5lUyncrIoDsqFHSfU5AAGz41dGP4I2hnHbpXXblFoLtXs6FNZUYR4MeRFsm3D835km7PBaZknWlFA2Igy6bsO2NGUpvSuOgdpkuBk3ry3Twtfyv19GLJS2ZTIB-mT6itQM13ADIH5uCi3XRW57yA81nV2rGKJQTBUBcfzvv43Rg_Q3ksFPJ7qL4mq5DoAll7C-QZtCtA8UVUg');"
      >
        <div class="absolute inset-0 bg-[#137fec]/30 mix-blend-multiply"></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#101922] via-[#101922]/50 to-transparent"
        ></div>

        <div class="relative z-10 p-16">
          <div
            class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#137fec]/20 backdrop-blur-sm border border-[#137fec]/30 text-[#137fec] shadow-[0_0_15px_rgba(19,127,236,0.3)]"
          >
            <span class="material-symbols-outlined text-4xl">radiology</span>
          </div>
          <h1
            class="text-4xl font-extrabold leading-tight text-white mb-4 tracking-tight"
          >
            Chẩn đoán thông minh.<br />
            Kết quả chính xác.
          </h1>
          <p class="text-lg text-slate-300 max-w-lg leading-relaxed">
            Hệ thống phân tích ảnh X-quang phổi sử dụng Deep Learning để hỗ trợ
            bác sĩ phát hiện sớm các dấu hiệu bất thường.
          </p>
        </div>
      </div>

      <div
        class="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 bg-[#f6f7f8] dark:bg-[#101922] overflow-y-auto"
      >
        <div class="w-full max-w-[440px] flex flex-col">
          <div class="lg:hidden flex items-center gap-3 mb-8">
            <div
              class="size-10 text-[#137fec] bg-[#137fec]/10 rounded-lg flex items-center justify-center"
            >
              <span class="material-symbols-outlined">radiology</span>
            </div>
            <h2 class="text-slate-900 dark:text-white text-xl font-bold">
              X-Ray AI Analysis
            </h2>
          </div>

          <div class="mb-10">
            <h2
              class="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2"
            >
              Chào mừng trở lại
            </h2>
            <p class="text-slate-500 dark:text-[#9dabb9] text-base">
              Đăng nhập để truy cập kho dữ liệu và công cụ chẩn đoán.
            </p>
          </div>

          <form (submit)="onLogin()" class="flex flex-col gap-5">
            <div
              *ngIf="errorMessage"
              class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-lg">error</span>
              {{ errorMessage }}
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-slate-700 dark:text-white text-sm font-semibold"
                for="email"
                >Email hoặc Tên đăng nhập</label
              >
              <div class="relative flex items-center">
                <span
                  class="absolute left-4 text-slate-400 dark:text-[#9dabb9] material-symbols-outlined"
                  >person</span
                >
                <input
                  [(ngModel)]="credentials.email"
                  name="email"
                  class="w-full rounded-xl bg-white dark:bg-[#1c2127]
                  border border-slate-200 dark:border-[#3b4754] text-slate-900
                   dark:text-white h-12 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#9dabb9] transition-all"
                  id="email"
                  name="email"
                  placeholder="user@benhvien.com"
                  type="text"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <label
                  class="text-slate-700 dark:text-white text-sm font-semibold"
                  for="password"
                  >Mật khẩu</label
                >
                <a
                  class="text-[#137fec] text-sm font-semibold hover:text-[#137fec]/80 transition-colors"
                  href="#"
                  >Quên mật khẩu?</a
                >
              </div>
              <div class="relative flex items-center group">
                <span
                  class="absolute left-4 text-slate-400 dark:text-[#9dabb9] material-symbols-outlined"
                  >lock</span
                >
                <input
                  [(ngModel)]="credentials.password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  class="w-full rounded-xl bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white h-12 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#9dabb9] transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                />
                <button
                  (click)="showPassword = !showPassword"
                  class="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-slate-400 dark:text-[#9dabb9] hover:text-[#137fec] transition-colors focus:outline-none"
                  type="button"
                >
                  <span class="material-symbols-outlined">{{
                    showPassword ? 'visibility_off' : 'visibility'
                  }}</span>
                </button>
              </div>
            </div>

            <button
              class="mt-4 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-[#137fec] hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold tracking-wide shadow-lg shadow-[#137fec]/25 transition-all transform active:scale-[0.98]"
              type="submit"
            >
              Đăng nhập
            </button>
          </form>

          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div
                class="w-full border-t border-slate-200 dark:border-[#3b4754]"
              ></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="bg-[#f6f7f8] dark:bg-[#101922] px-4 text-slate-500 dark:text-[#9dabb9] font-medium"
                >Hỗ trợ</span
              >
            </div>
          </div>

          <div class="flex flex-col items-center gap-4 text-sm text-center">
            <p class="text-slate-500 dark:text-[#9dabb9]">
              <a href="auth/register"> Chưa có tài khoản? </a>
              <a
                class="font-bold text-slate-900 dark:text-white hover:text-[#137fec] transition-colors ml-1"
                href="#"
                >Liên hệ quản trị viên</a
              >
            </p>
            <div class="flex gap-6 mt-2">
              <a
                class="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 text-xs transition-colors"
                href="#"
                >Điều khoản sử dụng</a
              >
              <a
                class="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 text-xs transition-colors"
                href="#"
                >Chính sách bảo mật</a
              >
            </div>
          </div>
          <p
            class="text-center text-[10px] text-slate-400 dark:text-slate-700 mt-8 font-mono"
          >
            X-Ray AI Analysis v2.4.0
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Đảm bảo Material Symbols được load */
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');

      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  showPassword = false;
  errorMessage = '';

  // Trong login.component.ts
  onLogin() {
    this.errorMessage = '';

    const email = this.credentials.email.trim();
    if (!email || !email.endsWith('@gmail.com')) {
      this.errorMessage = 'Email phải có định dạng @gmail.com';
      return;
    }

    if (!this.credentials.password || this.credentials.password.length < 5) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 5 ký tự';
      return;
    }

    // const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_+\-=\\[\];'\\/]/;
    // if (!specialCharRegex.test(this.credentials.password)) {
    //   this.errorMessage = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    //   return;
    // }

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        // 1. Lưu Token
        localStorage.setItem('access_token', res.access_token);

        // 2. Lưu thông tin User (Phải khớp với to_dict của Flask)
        // Nếu Flask trả về 'fullname' thì phải dùng res.user.fullname
        const userName = res.user.fullname || res.user.name;
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_role', res.user.role.toLowerCase());

        // 3. LOGIC CHUYỂN MÀN (Khắc phục việc "nhầm màn")
        const role = res.user.role.toLowerCase();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']); // Đá sang trang Admin
        } else {
          this.router.navigate(['/user/dashboard']); // Đá sang trang Bác sĩ
        }
      },
      error: (err) => alert('Sai tài khoản hoặc mật khẩu!'),
    });
  }
}
