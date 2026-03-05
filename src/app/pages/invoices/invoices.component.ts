import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice, InvoiceStatus, InvoiceSummary, InvoiceLineItem } from '../../core/models';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent, MatIconModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  summary: InvoiceSummary | null = null;
  loading = true;
  showCreateModal = false;
  showDetailModal = false;
  selectedInvoice: Invoice | null = null;
  submitting = false;
  error = '';
  successMsg = '';
  activeFilter: InvoiceStatus | '' = '';

  confirmVisible  = false;
  confirmTitle    = '';
  confirmMessage  = '';
  confirmIcon     = '⚠';
  confirmOkLabel  = 'Confirm';
  confirmOkClass: 'danger' | 'primary' = 'primary';
  private confirmCallback: (() => void) | null = null;

  createForm: FormGroup;

  statusOptions: Array<{ label: string; value: InvoiceStatus | '' }> = [
    { label: 'All', value: '' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Sent', value: 'SENT' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  constructor(private invoiceService: InvoiceService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      customer: this.fb.group({
        name:    ['', Validators.required],
        email:   ['', [Validators.required, Validators.email]],
        address: [''],
      }),
      paymentTerms: ['NET_30'],
      dueDate:      ['', Validators.required],
      notes:        [''],
      lineItems: this.fb.array([this.newLineItem()]),
    });
  }

  ngOnInit(): void { this.load(); this.loadSummary(); }

  load(): void {
    this.loading = true;
    this.invoiceService.getAll(this.activeFilter as InvoiceStatus || undefined).subscribe({
      next: (res) => { this.invoices = res.data?.content ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadSummary(): void {
    this.invoiceService.getSummary().subscribe({
      next: (res) => { this.summary = res.data ?? null; },
    });
  }

  filterBy(status: InvoiceStatus | ''): void {
    this.activeFilter = status;
    this.load();
  }

  // ── Line Items ────────────────────────────────────────────
  get lineItems(): FormArray { return this.createForm.get('lineItems') as FormArray; }

  newLineItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity:    [1, [Validators.required, Validators.min(1)]],
      unitPrice:   ['', [Validators.required, Validators.min(0)]],
      taxRate:     [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  addLineItem(): void { this.lineItems.push(this.newLineItem()); }

  removeLineItem(i: number): void {
    if (this.lineItems.length > 1) this.lineItems.removeAt(i);
  }

  lineTotal(i: number): number {
    const item = this.lineItems.at(i).value as InvoiceLineItem;
    const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
    return subtotal * (1 + (item.taxRate || 0) / 100);
  }

  get invoiceTotal(): number {
    return Array.from({ length: this.lineItems.length }, (_, i) => this.lineTotal(i))
      .reduce((sum, v) => sum + v, 0);
  }

  // ── Create ────────────────────────────────────────────────
  openCreate(): void { this.createForm.reset(); this.lineItems.clear(); this.lineItems.push(this.newLineItem()); this.showCreateModal = true; }
  closeCreate(): void { this.showCreateModal = false; this.error = ''; }

  submitCreate(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.invoiceService.create(this.createForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.closeCreate();
        this.successMsg = 'Invoice created!';
        this.load();
        this.loadSummary();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.submitting = false; },
    });
  }

  // ── Actions ───────────────────────────────────────────────
  openDetail(inv: Invoice): void { this.selectedInvoice = inv; this.showDetailModal = true; }
  closeDetail(): void { this.showDetailModal = false; this.selectedInvoice = null; }

  sendInvoice(inv: Invoice): void {
    this.showConfirm(
      'Send Invoice',
      `Send invoice to ${inv.customer?.email ?? inv.customerEmail}? They will receive a notification.`,
      'receipt', 'Send Invoice', 'primary',
      () => {
        this.invoiceService.send(inv.id).subscribe({
          next: () => { this.successMsg = 'Invoice sent!'; this.load(); this.loadSummary(); setTimeout(() => this.successMsg = '', 3000); },
          error: (err) => { this.error = err.error?.message ?? 'Failed to send.'; },
        });
      }
    );
  }

  markPaid(inv: Invoice): void {
    this.showConfirm(
      'Mark as Paid',
      `Mark invoice #${inv.id} as paid? This action confirms payment of ₹${inv.totalAmount.toFixed(2)}.`,
      'checkbox', 'Mark as Paid', 'primary',
      () => {
        this.invoiceService.markPaid(inv.id).subscribe({
          next: () => { this.successMsg = 'Invoice marked as paid!'; this.load(); this.loadSummary(); setTimeout(() => this.successMsg = '', 3000); },
          error: (err) => { this.error = err.error?.message ?? 'Failed.'; },
        });
      }
    );
  }

  cancelInvoice(inv: Invoice): void {
    this.showConfirm(
      'Cancel Invoice',
      `Cancel invoice #${inv.id}? This cannot be undone.`,
      'delete', 'Cancel Invoice', 'danger',
      () => {
        this.invoiceService.cancel(inv.id).subscribe({
          next: () => { this.successMsg = 'Invoice cancelled.'; this.load(); this.loadSummary(); setTimeout(() => this.successMsg = '', 3000); },
          error: (err) => { this.error = err.error?.message ?? 'Failed.'; },
        });
      }
    );
  }

  statusColor(status: InvoiceStatus): string {
    const m: Record<InvoiceStatus, string> = {
      DRAFT: 'draft', SENT: 'sent', PAID: 'paid', OVERDUE: 'overdue', CANCELLED: 'cancelled',
    };
    return m[status];
  }

  cf(n: string) { return this.createForm.get(n); }

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
    this.confirmVisible = false;
    this.confirmCallback = null;
  }

  
}
