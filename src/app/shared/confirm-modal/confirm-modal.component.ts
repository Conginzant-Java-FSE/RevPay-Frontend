import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="visible" (click)="onCancel()">
      <div class="modal sm confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <span class="confirm-icon">{{ icon }}</span>
          <h3>{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ message }}</p>
          <div class="modal-footer">
            <button class="btn-ghost" (click)="onCancel()">{{ cancelLabel }}</button>
            <button class="confirm-ok-btn" [class]="okClass" (click)="onConfirm()">
              {{ okLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .confirm-modal {
      background: #0d1117;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
      overflow: hidden;
    }

    .confirm-modal .modal-head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .confirm-modal .modal-head h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      font-family: 'Syne', sans-serif;
    }

    .confirm-icon { font-size: 1.4rem; }

    .modal-body { padding: 1.25rem 1.5rem; }

    .confirm-message {
      font-size: 0.9rem;
      color: #9ca3af;
      margin: 0 0 1.25rem;
      line-height: 1.6;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn-ghost {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #9ca3af;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #e8eaf0; }

    .confirm-ok-btn {
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      border: none;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .confirm-ok-btn.danger {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .confirm-ok-btn.danger:hover { background: rgba(239, 68, 68, 0.22); }
    .confirm-ok-btn.primary {
      background: linear-gradient(135deg, #4f8ef7, #3b7de8);
      color: #fff;
    }
    .confirm-ok-btn.primary:hover { box-shadow: 0 4px 14px rgba(79,142,247,0.4); }
  `],
})
export class ConfirmModalComponent {
  @Input() visible  = false;
  @Input() title    = 'Are you sure?';
  @Input() message  = '';
  @Input() icon     = '⚠';
  @Input() okLabel  = 'Confirm';
  @Input() okClass: 'danger' | 'primary' = 'primary';
  @Input() cancelLabel = 'Cancel';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void { this.confirmed.emit(); }
  onCancel():  void { this.cancelled.emit(); }
}