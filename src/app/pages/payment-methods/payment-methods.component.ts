import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodService } from '../../core/services/payment-method.service';
import { PaymentCard } from '../../core/models';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
})
export class PaymentMethodsComponent implements OnInit {
  cards: PaymentCard[] = [];
  loading = true;
  showAddModal = false;
  showEditModal = false;
  submitting = false;
  error = '';
  successMsg = '';
  editingCard: PaymentCard | null = null;
  deletingId: number | null = null;

  addForm: FormGroup;
  editForm: FormGroup;

  confirmVisible  = false;
  confirmTitle    = '';
  confirmMessage  = '';
  confirmIcon     = '⚠';
  confirmOkLabel  = 'Confirm';
  confirmOkClass: 'danger' | 'primary' = 'danger';
  private confirmCallback: (() => void) | null = null;

  private showConfirm(
    title: string, message: string, icon: string,
    okLabel: string, okClass: 'danger' | 'primary',
    callback: () => void
  ): void {
    this.confirmTitle    = title;
    this.confirmMessage  = message;
    this.confirmIcon     = icon;
    this.confirmOkLabel  = okLabel;
    this.confirmOkClass  = okClass;
    this.confirmCallback = callback;
    this.confirmVisible  = true;
  }

  onConfirmOk(): void {
    this.confirmVisible = false;
    this.confirmCallback?.();
    this.confirmCallback = null;
  }

  onConfirmCancel(): void {
    this.confirmVisible  = false;
    this.confirmCallback = null;
  }

  constructor(private pmService: PaymentMethodService, private fb: FormBuilder) {
    this.addForm = this.fb.group({
      cardNumber:     ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth:    ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear:     ['', [Validators.required, Validators.min(new Date().getFullYear())]],
      cvv:            ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardHolderName: ['', Validators.required],
      nickname:       ['', Validators.required],
      billingAddress: ['', Validators.required],
      setAsDefault:   [false],
    });

    this.editForm = this.fb.group({
      nickname:       ['', Validators.required],
      billingAddress: ['', Validators.required],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.pmService.getAll().subscribe({
      next: (res) => { this.cards = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  openAdd(): void { this.addForm.reset({ setAsDefault: false }); this.showAddModal = true; }
  closeAdd(): void { this.showAddModal = false; this.error = ''; }

  submitAdd(): void {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.pmService.add(this.addForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.closeAdd();
        this.successMsg = 'Card added successfully.';
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed to add card.';
        this.submitting = false;
      },
    });
  }

  openEdit(card: PaymentCard): void {
    this.editingCard = card;
    this.editForm.patchValue({ nickname: card.nickname, billingAddress: card.billingAddress });
    this.showEditModal = true;
  }

  closeEdit(): void { this.showEditModal = false; this.editingCard = null; this.error = ''; }

  submitEdit(): void {
    if (!this.editingCard || this.editForm.invalid) return;
    this.submitting = true;
    this.pmService.update(this.editingCard.cardId, this.editForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.closeEdit();
        this.successMsg = 'Card updated.';
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Failed to update.'; this.submitting = false; },
    });
  }

  setDefault(cardId: number): void {
    this.pmService.setDefault(cardId).subscribe({
      next: () => { this.successMsg = 'Default card updated.'; this.load(); setTimeout(() => this.successMsg = '', 3000); },
    });
  }

  deleteCard(cardId: number, cardNickname: string): void {
    this.showConfirm(
      'Delete Card',
      `Remove "${cardNickname}" from your payment methods? This cannot be undone.`,
      '🗑', 'Delete Card', 'danger',
      () => {
        this.pmService.delete(cardId).subscribe({
          next:  () => { this.successMsg = 'Card removed.'; this.load(); setTimeout(() => this.successMsg = '', 3000); },
          error: (err) => { this.error = err.error?.message ?? 'Failed to delete card.'; },
        });
      }
    );
  }

  cardBrandIcon(type: string): string {
    const m: Record<string, string> = { VISA: '💳', MASTERCARD: '💳', RUPAY: '💳', AMEX: '💳', OTHER: '💳' };
    return m[type] ?? '💳';
  }

  f(name: string) { return this.addForm.get(name); }
  ef(name: string) { return this.editForm.get(name); }
}
