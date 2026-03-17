import {
  Component, OnDestroy, ViewChild,
  ElementRef, AfterViewChecked, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage } from '../../core/services/ai.service';

@Component({
  selector: 'app-public-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-ai-chat.component.html',
  styleUrls: ['./public-ai-chat.component.scss'],
})
export class PublicAiChatComponent implements OnDestroy, AfterViewChecked {

  @ViewChild('msgBox') private msgBox!: ElementRef;

  isOpen     = false;
  userInput  = '';
  loading    = false;
  showEmojis = false;

  emojiGroups = [
    { label: 'Mood',    emojis: ['😊','🤔','😕','😡','😭','🥳','😎','👋','👍','🙏'] },
    { label: 'Fintech', emojis: ['💰','💸','💳','🏦','📈','🤑','💵','🏧','✅','❓'] },
  ];

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: '👋 Hi! I\'m RevPay Assistant. I can answer questions about our platform — wallets, transfers, loans, invoices, and more. How can I help?',
    },
  ];

  private shouldScroll = false;

  constructor(private aiService: AiService) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      try {
        const el = this.msgBox?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      } catch {}
      this.shouldScroll = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.pub-ai-wrapper')) {
      this.showEmojis = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.shouldScroll = true;
    else this.showEmojis = false;
  }

  closeChat(): void {
    this.isOpen     = false;
    this.showEmojis = false;
  }

  toggleEmojis(e: MouseEvent): void {
    e.stopPropagation();
    this.showEmojis = !this.showEmojis;
  }

  insertEmoji(emoji: string): void {
    this.userInput  += emoji;
    this.showEmojis  = false;
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.userInput    = '';
    this.loading      = true;
    this.showEmojis   = false;
    this.shouldScroll = true;

    // Use the public (no-auth) endpoint
    this.aiService.sendPublicMessage({ message: text, history: this.messages }).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res.response });
        this.loading      = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: '⚠️ Something went wrong. Please try again in a moment.',
        });
        this.loading      = false;
        this.shouldScroll = true;
      },
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [
      { role: 'assistant', content: '👋 Hi! How can I help you with RevPay today?' },
    ];
    this.showEmojis = false;
  }

  ngOnDestroy(): void {}
}
