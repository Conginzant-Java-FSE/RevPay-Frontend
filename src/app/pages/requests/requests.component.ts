import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyRequestService } from '../../core/services/money-request.service';
import { MoneyRequest } from '../../core/models';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {
  incoming: MoneyRequest[] = [];
  outgoing: MoneyRequest[] = [];
  loading = true;
  activeTab: 'incoming' | 'outgoing' | 'new' = 'incoming';
  actionLoading: number | null = null;
  error = '';
  successMsg = '';
  pinModalFor: MoneyRequest | null = null;
  pin = '';

  requestForm: FormGroup;
  submitting = false;

  // ── Confirm modal ─────────────────────────────────────────
  confirmVisible  = false;
  confirmTitle    = '';
  confirmMessage  = '';
  confirmIcon     = '⚠';
  confirmOkLabel  = 'Confirm';
  confirmOkClass: 'danger' | 'primary' = 'danger';
  private confirmCallback: (() => void) | null = null;

  // Track which row action is in progress (to show spinner per row)
  busyId: number | null = null;

  constructor(private reqService: MoneyRequestService, private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      recipient: ['', Validators.required],
      amount:    ['', [Validators.required, Validators.min(1)]],
      purpose:   ['', Validators.required],
    });
  }

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading = true;
    this.reqService.getIncoming().subscribe({ next: (r) => { this.incoming = (r.data as any)?.content ?? []; this.checkDone(); } });
    this.reqService.getOutgoing().subscribe({ next: (r) => { this.outgoing = (r.data as any)?.content ?? []; this.checkDone(); } });
  }

  private _loaded = 0;
  checkDone(): void { if (++this._loaded >= 2) { this.loading = false; this._loaded = 0; } }

  openAccept(req: MoneyRequest): void { this.pinModalFor = req; this.pin = ''; }
  closePin(): void { this.pinModalFor = null; }

  confirmAccept(): void {
    if (!this.pinModalFor || !this.pin) return;
    this.actionLoading = this.pinModalFor.requestId;
    this.reqService.accept(this.pinModalFor.requestId, this.pin).subscribe({
      next: () => {
        this.actionLoading = null;
        this.pinModalFor = null;
        this.successMsg = 'Request accepted!';
        this.loadAll();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed.';
        this.actionLoading = null;
      },
    });
  }

    decline(req: MoneyRequest): void {
      this.showConfirm(
        'Decline Request',
        `Decline the ₹${req.amount.toFixed(2)} request from ${req.from?.name ?? 'user'}?`,
        '✋', 'Decline', 'danger',
        () => {
          this.busyId = req.requestId;
          this.reqService.decline(req.requestId).subscribe({
            next:  () => { this.busyId = null; this.loadAll(); },
            error: () => { this.busyId = null; },
          });
        }
      );
    }

  cancel(req: MoneyRequest): void {
    this.showConfirm(
      'Confirm Cancellation',
      `Cancel the ₹${req.amount.toFixed(2)} request to ${req.to?.name ?? 'user'}?`,
      '🛑', 'Cancel Request', 'primary',
      () => { 
        this.actionLoading = req.requestId;
        this.reqService.cancel(req.requestId).subscribe({
          next: () => { this.actionLoading = null; this.loadAll(); },
          error: () => { this.actionLoading = null; },
        });
      }
    );
  }

  submitRequest(): void {
    if (this.requestForm.invalid) { this.requestForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.reqService.requestMoney(this.requestForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.requestForm.reset();
        this.successMsg = 'Money request sent!';
        this.activeTab = 'outgoing';
        this.loadAll();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.submitting = false; },
    });
  }

  pendingIncoming(): MoneyRequest[] { return this.incoming.filter(r => r.status === 'PENDING'); }
  f(n: string) { return this.requestForm.get(n); }

  // ── Confirm modal helpers ─────────────────────────────────

  private showConfirm(
    title: string, message: string, icon: string,
    okLabel: string, okClass: 'danger' | 'primary',
    callback: () => void,
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

  // ── Template helpers ──────────────────────────────────────

  rf(name: string) { return this.requestForm.get(name); }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      PENDING:   'pending',
      ACCEPTED:  'completed',
      DECLINED:  'failed',
      CANCELLED: 'failed',
      EXPIRED:   'failed',
    };
    return m[status] ?? '';
  }

}
