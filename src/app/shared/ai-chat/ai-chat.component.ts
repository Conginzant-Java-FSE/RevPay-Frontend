import {
  Component, OnDestroy, OnInit, ViewChild,
  ElementRef, AfterViewChecked, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage } from '../../core/services/ai.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messageContainer') private msgContainer!: ElementRef;

  isOpen       = false;
  userInput    = '';
  loading      = false;
  showEmojis   = false;

  // Common emojis grouped by mood — useful for a fintech assistant
  emojiGroups = [
    { label: 'Mood',     emojis: ['😊','😍','🤔','😕','😔','😡','😭','😱','🥳','😎'] },
    { label: 'Money',    emojis: ['💰','💸','💳','🏦','📈','📉','🤑','💵','💴','🏧'] },
    { label: 'Actions',  emojis: ['✅','❌','⚠️','🔄','📤','📥','📧','📞','🔒','🔓'] },
    { label: 'Common',   emojis: ['👋','👍','👎','🙏','💡','🚀','⭐','❓','‼️','✨'] },
  ];

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: '👋 Hi! I\'m RevPay Assistant. I can help with your wallet, transactions, loans, invoices, and more. What would you like to know?',
    },
  ];

  private shouldScroll = false;

  constructor(private aiService: AiService) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  // Close emoji picker when clicking outside the chat widget
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.ai-fab-wrapper')) {
      this.showEmojis = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScroll = true;
    } else {
      this.showEmojis = false;
    }
  }

  closeChat(): void {
    this.isOpen     = false;
    this.showEmojis = false;
  }

  toggleEmojis(event: MouseEvent): void {
    event.stopPropagation();
    this.showEmojis = !this.showEmojis;
  }

  insertEmoji(emoji: string): void {
    this.userInput += emoji;
    this.showEmojis = false;
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.userInput    = '';
    this.loading      = true;
    this.showEmojis   = false;
    this.shouldScroll = true;

    this.aiService.sendMessage({ message: text, history: this.messages }).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res.response });
        this.loading      = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: '⚠️ Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
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
      {
        role: 'assistant',
        content: '👋 Hi! I\'m RevPay Assistant. How can I help you today?',
      },
    ];
    this.showEmojis = false;
  }

  private scrollToBottom(): void {
    try {
      const el = this.msgContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }

  ngOnDestroy(): void {}
}
