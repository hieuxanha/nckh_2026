import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatService } from '../../../core/service/chat.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  safeContent?: SafeHtml;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex flex-col h-full bg-slate-50 dark:bg-[#0E1117] text-gray-800 dark:text-gray-200 font-['Manrope'] relative overflow-hidden transition-colors duration-300"
    >
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"
      ></div>

      <header
        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0E1117]/80 backdrop-blur-md z-10 transition-colors duration-300"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <span class="material-symbols-outlined text-white text-sm"
              >smart_toy</span
            >
          </div>
          <div>
            <h2
              class="text-sm font-black tracking-tight text-gray-900 dark:text-white uppercase transition-colors"
            >
              MediAI Assistant
            </h2>
            <div class="flex items-center gap-1.5">
              <span
                class="size-1.5 rounded-full bg-emerald-500 animate-pulse"
              ></span>
              <span
                class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest"
                >Hệ thống đang sẵn sàng</span
              >
            </div>
          </div>
        </div>
      </header>

      <div
        #scrollContainer
        class="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scroll z-10"
      >
        <div
          *ngIf="messages.length === 0"
          class="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6"
        >
          <h1
            class="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight"
          >
            Chào bác sĩ ...,<br />Tôi có thể giúp gì cho bạn này?
          </h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <button
              (click)="suggest('Phân tích kết quả X-quang mới nhất')"
              class="p-4 rounded-2xl bg-white dark:bg-[#1A1D23] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 text-left transition-all group dark:shadow-none shadow-sm"
            >
              <span
                class="material-symbols-outlined text-blue-500 dark:text-blue-400 mb-2"
                >image_search</span
              >
              <p
                class="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
              >
                Phân tích kết quả X-quang mới nhất
              </p>
            </button>
            <button
              (click)="suggest('Dấu hiệu nhận biết viêm phổi')"
              class="p-4 rounded-2xl bg-white dark:bg-[#1A1D23] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 text-left transition-all group dark:shadow-none shadow-sm"
            >
              <span
                class="material-symbols-outlined text-purple-500 dark:text-purple-400 mb-2"
                >clinical_notes</span
              >
              <p
                class="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
              >
                Dấu hiệu nhận biết viêm phổi
              </p>
            </button>
          </div>
        </div>

        <div
          *ngFor="let msg of messages"
          [ngClass]="{ 'items-end': msg.role === 'user' }"
          class="flex flex-col max-w-4xl mx-auto w-full group"
        >
          <div
            [ngClass]="{
              'bg-white dark:bg-[#1A1D23] text-gray-800 dark:text-gray-200 rounded-3xl px-6 py-4 border border-gray-200 dark:border-gray-800 self-start shadow-sm dark:shadow-none':
                msg.role === 'assistant',
              'bg-blue-600 text-white rounded-3xl px-6 py-4 self-end shadow-xl shadow-blue-600/20':
                msg.role === 'user',
            }"
            class="relative transition-all duration-300"
          >
            <div
              class="text-sm leading-relaxed whitespace-pre-wrap"
              [innerHTML]="msg.safeContent"
            ></div>
          </div>
          <span
            class="text-[10px] text-gray-500 dark:text-gray-600 font-bold mt-2 mx-2 uppercase tracking-widest"
          >
            {{ msg.role === 'assistant' ? 'MediAI' : 'Bác sĩ' }} •
            {{ msg.timestamp | date: 'HH:mm' }}
          </span>
        </div>

        <div
          *ngIf="isTyping"
          class="flex flex-col max-w-4xl mx-auto w-full animate-pulse"
        >
          <div
            class="bg-white dark:bg-[#1A1D23] rounded-3xl px-6 py-4 border border-gray-200 dark:border-gray-800 self-start flex gap-1 shadow-sm dark:shadow-none transition-colors"
          >
            <div
              class="size-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
            ></div>
            <div
              class="size-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"
            ></div>
            <div
              class="size-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="p-4 md:p-8 bg-gradient-to-t from-slate-50 dark:from-[#0E1117] via-slate-50 dark:via-[#0E1117] to-transparent z-20 transition-colors"
      >
        <div class="max-w-4xl mx-auto relative group">
          <textarea
            [(ngModel)]="currentInput"
            (keydown.enter)="sendMessage($event)"
            rows="1"
            placeholder="Nhập câu hỏi tại đây..."
            class="w-full bg-white dark:bg-[#1A1D23] border border-gray-300 dark:border-gray-700 rounded-[2rem] py-4 pl-6 pr-16 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-lg dark:shadow-2xl"
          ></textarea>
          <button
            (click)="sendMessage()"
            [disabled]="!currentInput.trim()"
            class="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 transition-all shadow-md"
          >
            <span class="material-symbols-outlined">arrow_upward</span>
          </button>
        </div>
        <p
          class="text-center text-[10px] text-gray-500 dark:text-gray-600 mt-3 font-medium uppercase tracking-widest"
        >
          MediAI có thể đưa ra sai sót. Hãy kiểm chứng thông tin quan trọng.
        </p>
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
        width: 4px;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 10px;
      }
      :host-context(.dark) .custom-scroll::-webkit-scrollbar-thumb {
        background: #334155;
      }
      .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
      :host-context(.dark) .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: #475569;
      }
    `,
  ],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: Message[] = [];
  currentInput: string = '';
  isTyping: boolean = false;

  constructor(private chatService: ChatService, private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  sendMessage(event?: any) {
    if (event) event.preventDefault();
    if (!this.currentInput.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: this.currentInput,
      timestamp: new Date(),
    };
    userMsg.safeContent = this.parseMessage(this.currentInput);
    this.messages.push(userMsg);
    const textToSend = this.currentInput;
    this.currentInput = '';
    this.scrollToBottom();

    // Chuẩn bị lịch sử trò chuyện gửi lên backend (chỉ chứa role và content)
    const chatHistory = this.messages
      .slice(0, -1) // loại bỏ tin nhắn user vừa thêm ở trên
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    this.isTyping = true;
    this.chatService.sendMessage(textToSend, chatHistory).subscribe({
      next: (res) => {
        this.isTyping = false;
        const aiMsg: Message = {
          role: 'assistant',
          content: res.reply,
          timestamp: new Date(),
        };
        aiMsg.safeContent = this.parseMessage(res.reply);
        this.messages.push(aiMsg);
        this.scrollToBottom();
      },
      error: (err) => {
        this.isTyping = false;
        const aiMsg: Message = {
          role: 'assistant',
          content: 'Xin lỗi bác sĩ, hiện tại hệ thống kết nối AI (Gemini API) đang gặp sự cố. Vui lòng thử lại sau hoặc kiểm tra lại khóa API của bạn.',
          timestamp: new Date(),
        };
        aiMsg.safeContent = this.parseMessage(aiMsg.content);
        this.messages.push(aiMsg);
        this.scrollToBottom();
      }
    });
  }

  suggest(text: string) {
    this.currentInput = text;
    this.sendMessage();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  private parseMessage(content: string): SafeHtml {
    if (!content) return '';
    let safeContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Parse markdown bold
    safeContent = safeContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Parse markdown images
    safeContent = safeContent.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<br/><img src="$2" alt="$1" class="max-w-full sm:max-w-sm rounded-xl my-3 shadow-md border border-gray-200 dark:border-gray-700 object-contain" />'
    );
    
    return this.sanitizer.bypassSecurityTrustHtml(safeContent);
  }
}
