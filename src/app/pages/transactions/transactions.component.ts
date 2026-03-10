import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, TransactionFilters } from '../../core/services/transaction.service';
import { Transaction, TransactionPagination } from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  pagination: TransactionPagination = {
    currentPage: 0, pageSize: 10, totalRecords: 0,
    totalPages: 0, hasNext: false, hasPrevious: false,
  };

  loading  = false;
  exporting: 'CSV' | 'PDF' | null = null;

  selectedTransaction: Transaction | null = null;
  showDetail = false;

  // Filters (bound via ngModel)
  search    = '';
  typeFilter   = 'ALL';
  statusFilter = 'ALL';
  dateFrom  = '';
  dateTo    = '';

  typeOptions = [
    { value: 'ALL',          label: 'All Types' },
    { value: 'SEND',         label: 'Sent' },
    { value: 'RECEIVE',      label: 'Received' },
    { value: 'TOPUP',        label: 'Top-Up' },
    { value: 'WITHDRAWAL',   label: 'Withdrawal' },
    { value: 'LOAN_REPAYMENT', label: 'Loan Repayment' },
  ];

  statusOptions = [
    { value: 'ALL',       label: 'All Statuses' },
    { value: 'SUCCESS',   label: 'Success' },
    { value: 'PENDING',   label: 'Pending' },
    { value: 'FAILED',    label: 'Failed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  constructor(private txnService: TransactionService) {}

  ngOnInit(): void { this.load(); }

  load(page = 0): void {
    this.loading = true;
    const filters: TransactionFilters = {
      page, size: 10,
      search:   this.search     || undefined,
      type:     this.typeFilter   !== 'ALL' ? this.typeFilter   : undefined,
      status:   this.statusFilter !== 'ALL' ? this.statusFilter : undefined,
      from:     this.dateFrom   || undefined,
      to:       this.dateTo     || undefined,
    };

    this.txnService.getAll(filters).subscribe({
      next: (res) => {
        // API returns: { success, data: Transaction[], pagination: {...} }
        this.transactions = res.data ?? [];
        this.pagination   = res.pagination ?? this.pagination;
        this.loading      = false;
      },
      error: () => { this.loading = false; },
    });
  }

  applyFilters(): void { this.load(0); }

  clearFilters(): void {
    this.search = ''; this.typeFilter = 'ALL'; this.statusFilter = 'ALL';
    this.dateFrom = ''; this.dateTo = '';
    this.load(0);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.pagination.totalPages) return;
    this.load(page);
  }

  get pageArray(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i);
  }

  openDetail(t: Transaction): void {
    this.selectedTransaction = t;
    this.showDetail = true;
  }

  closeDetail(): void { this.showDetail = false; this.selectedTransaction = null; }

  exportFile(format: 'CSV' | 'PDF'): void {
    this.exporting = format;
    this.txnService.export(format).subscribe({
      next: (blob) => {
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href  = url;
        link.download = `revpay-transactions.${format.toLowerCase()}`;
        link.click();
        URL.revokeObjectURL(url);
        this.exporting = null;
      },
      error: () => { this.exporting = null; },
    });
  }

  // ── Display helpers ────────────────────────────────────────

  txnIcon(type: string): string {
    const m: Record<string, string> = {
      SEND: '↗', RECEIVE: '↙', TOPUP: '＋', WITHDRAWAL: '↓', LOAN_REPAYMENT: '🏦',
    };
    return m[type] ?? '•';
  }

  txnClass(type: string): string {
    const m: Record<string, string> = {
      SEND: 'sent', RECEIVE: 'received', TOPUP: 'topup',
      WITHDRAWAL: 'withdrawal', LOAN_REPAYMENT: 'loan',
    };
    return m[type] ?? '';
  }

  txnLabel(type: string): string {
    const m: Record<string, string> = {
      SEND: 'Sent', RECEIVE: 'Received', TOPUP: 'Top-Up',
      WITHDRAWAL: 'Withdrawal', LOAN_REPAYMENT: 'Loan Repayment',
    };
    return m[type] ?? type;
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      SUCCESS: 'completed', PENDING: 'pending',
      FAILED: 'failed', CANCELLED: 'failed',
    };
    return m[status] ?? '';
  }

  // Amount sign: SEND and WITHDRAWAL are negative for display
  displayAmount(t: Transaction): number {
    return ['SEND', 'WITHDRAWAL', 'LOAN_REPAYMENT'].includes(t.type)
      ? -Math.abs(t.amount)
      : Math.abs(t.amount);
  }

  counterpartyName(t: Transaction): string {
    return t.counterparty?.fullName ?? '—';
  }
}