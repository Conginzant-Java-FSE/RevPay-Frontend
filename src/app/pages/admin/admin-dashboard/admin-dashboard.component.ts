import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Loan, LoanStatus } from '../../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);

  loans: Loan[] = [];
  loading = false;
  error = '';
  successMsg = '';

  showRejectModal = false;
  selectedLoan: Loan | null = null;
  rejectForm: FormGroup = this.fb.group({
    reason: ['', [Validators.required, Validators.minLength(3)]],
  });
  submitting = false;

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getAllLoans().subscribe({
      next: (res) => {
        this.loans = res.data?.content ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load loans.';
      },
    });
  }

  get pendingLoans(): Loan[] {
    return this.loans.filter((l) => l.status === 'PENDING');
  }

  get otherLoans(): Loan[] {
    return this.loans.filter((l) => l.status !== 'PENDING');
  }

  statusColor(status: LoanStatus): string {
    const map: Record<LoanStatus, string> = {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected',
      ACTIVE: 'active',
      CLOSED: 'closed',
    };
    return map[status] ?? 'pending';
  }

  approve(loan: Loan): void {
    this.submitting = true;
    this.error = '';
    this.adminService.approveLoan(loan.loanId).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = 'Loan approved successfully.';
        this.loadLoans();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.message || 'Failed to approve loan.';
      },
    });
  }

  openReject(loan: Loan): void {
    this.selectedLoan = loan;
    this.rejectForm.reset();
    this.showRejectModal = true;
  }

  closeReject(): void {
    this.showRejectModal = false;
    this.selectedLoan = null;
  }

  submitReject(): void {
    if (!this.selectedLoan || this.rejectForm.invalid) {
      this.rejectForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = '';
    this.adminService.rejectLoan(this.selectedLoan.loanId, this.rejectForm.value.reason).subscribe({
      next: () => {
        this.submitting = false;
        this.closeReject();
        this.successMsg = 'Loan rejected.';
        this.loadLoans();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.message || 'Failed to reject loan.';
      },
    });
  }
}
