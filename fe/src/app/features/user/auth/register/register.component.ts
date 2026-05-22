import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service'; // Đảm bảo đúng đường dẫn tới service của bạn

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div
      class="flex min-h-screen w-full font-['Manrope'] bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white transition-colors duration-200"
    >
      <div
        class="relative hidden w-1/2 lg:flex flex-col justify-end bg-cover bg-center overflow-hidden"
        style="background-image: url('https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80');"
      >
        <div class="absolute inset-0 bg-[#137fec]/30 mix-blend-multiply"></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#101922] via-[#101922]/50 to-transparent"
        ></div>

        <div class="relative z-10 p-16">
          <div
            class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#137fec]/20 backdrop-blur-sm border border-[#137fec]/30 text-[#137fec] shadow-[0_0_15px_rgba(19,127,236,0.3)]"
          >
            <span class="material-symbols-outlined text-4xl">person_add</span>
          </div>
          <h1
            class="text-4xl font-extrabold leading-tight text-white mb-4 tracking-tight"
          >
            Gia nhập mạng lưới<br />
            Y tế kỹ thuật số.
          </h1>
          <p class="text-lg text-slate-300 max-w-lg leading-relaxed">
            Đăng ký tài khoản để bắt đầu sử dụng công cụ phân tích X-quang tiên
            tiến nhất, hỗ trợ chẩn đoán chính xác và nhanh chóng.
          </p>
        </div>
      </div>

      <div
        class="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 bg-[#f6f7f8] dark:bg-[#101922] overflow-y-auto"
      >
        <div class="w-full max-w-[480px] flex flex-col">
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

          <div class="mb-8">
            <h2
              class="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2"
            >
              Tạo tài khoản mới
            </h2>
            <p class="text-slate-500 dark:text-[#9dabb9] text-base">
              Cung cấp thông tin chuyên môn để đăng ký tham gia hệ thống.
            </p>
          </div>

          <form
            (submit)="onRegister($event)"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div
              *ngIf="errorMessage"
              class="md:col-span-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-lg">error</span>
              {{ errorMessage }}
            </div>

            <div class="flex flex-col gap-1.5 md:col-span-2">
              <label
                class="text-slate-700 dark:text-white text-sm font-semibold"
                >Họ và tên</label
              >
              <div class="relative flex items-center">
                <span
                  class="absolute left-4 text-slate-400 dark:text-[#9dabb9] material-symbols-outlined"
                  >badge</span
                >
                <input
                  [(ngModel)]="user.fullname"
                  name="fullname"
                  class="w-full rounded-xl bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white h-11 pl-12 focus:ring-2 focus:ring-[#137fec]/50 outline-none transition-all"
                  placeholder="BS. Nguyễn Văn A"
                  type="text"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 md:col-span-2">
              <label
                class="text-slate-700 dark:text-white text-sm font-semibold"
                >Email công tác</label
              >
              <div class="relative flex items-center">
                <span
                  class="absolute left-4 text-slate-400 dark:text-[#9dabb9] material-symbols-outlined"
                  >mail</span
                >
                <input
                  [(ngModel)]="user.email"
                  name="email"
                  class="w-full rounded-xl bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white h-11 pl-12 focus:ring-2 focus:ring-[#137fec]/50 outline-none transition-all"
                  placeholder="email@benhvien.com"
                  type="email"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                class="text-slate-700 dark:text-white text-sm font-semibold"
                >Mật khẩu</label
              >
              <div class="relative flex items-center">
                <span
                  class="absolute left-4 text-slate-400 dark:text-[#9dabb9] material-symbols-outlined"
                  >lock</span
                >
                <input
                  [(ngModel)]="user.password"
                  name="password"
                  class="w-full rounded-xl bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white h-11 pl-12 focus:ring-2 focus:ring-[#137fec]/50 outline-none transition-all"
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                class="text-slate-700 dark:text-white text-sm font-semibold"
                >Xác nhận</label
              >
              <div class="relative flex items-center">
                <span
                  class="absolute left-4 text-slate-400 dark:text-[#9dabb9] material-symbols-outlined"
                  >lock_reset</span
                >
                <input
                  [(ngModel)]="user.confirmPassword"
                  name="confirmPassword"
                  class="w-full rounded-xl bg-white dark:bg-[#1c2127] border border-slate-200 dark:border-[#3b4754] text-slate-900 dark:text-white h-11 pl-12 focus:ring-2 focus:ring-[#137fec]/50 outline-none transition-all"
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>
            </div>

            <button
              class="mt-4 md:col-span-2 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-[#137fec] hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-[#137fec]/25 transition-all active:scale-[0.98]"
              type="submit"
            >
              Đăng ký tài khoản
            </button>
          </form>

          <div
            class="mt-8 pt-6 border-t border-slate-200 dark:border-[#3b4754] text-center"
          >
            <p class="text-slate-500 dark:text-[#9dabb9] text-sm">
              Đã có tài khoản?
              <a
                routerLink="/auth/login"
                class="font-bold text-[#137fec] hover:underline ml-1 cursor-pointer"
                >Đăng nhập ngay</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');
      :host {
        display: block;
      }
    `,
  ],
})
export class RegisterComponent {
  // Đối tượng hứng dữ liệu từ Form
  user = {
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    const email = this.user.email.trim();
    if (!email || !email.endsWith('@gmail.com')) {
      this.errorMessage = 'Email phải có định dạng @gmail.com';
      return;
    }

    if (!this.user.password || this.user.password.length < 5) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 5 ký tự';
      return;
    }

    // const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_+\-=\\[\];'\\/]/;
    // if (!specialCharRegex.test(this.user.password)) {
    //   this.errorMessage = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    //   return;
    // }

    // 1. Kiểm tra mật khẩu xác nhận
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp!';
      return;
    }

    const dataToSubmit = {
      fullname: this.user.fullname,
      email: this.user.email,
      password: this.user.password,
      role: 'doctor', // Luôn mặc định là bác sĩ khi đăng ký qua form này
    };

    // 2. Gọi service để gửi dữ liệu sang Backend
    console.log('Đang gửi dữ liệu đăng ký:', this.user);

    this.authService.register(dataToSubmit).subscribe({
      next: (res) => {
        console.log('Đăng ký thành công:', res);
        // Lưu JWT vào LocalStorage (lưu ý: xóa dấu cách thừa trong key)
        localStorage.setItem('access_token', res.access_token);
        alert('Đăng ký thành công!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Lỗi đăng ký:', err);
        alert(err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      },
    });
  }
}
