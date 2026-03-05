import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../core/services/loan.service';
import { Loan, RepaymentSchedule } from '../../core/models';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];
  loading = true;
  showApplyModal = false;
  showDetailModal = false;
  showRepayModal = false;
  selectedLoan: Loan | null = null;
  schedule: RepaymentSchedule[] = [];
  scheduleLoading = false;
  submitting = false;
  error = '';
  successMsg = '';

  applyForm: FormGroup;
  repayForm: FormGroup;

  purposeOptions = [
    'Working Capital', 'Equipment Purchase', 'Business Expansion',
    'Inventory', 'Marketing', 'Technology Upgrade', 'Other',
  ];

  tenureOptions = [6, 12, 18, 24, 36, 48, 60];

  constructor(private loanService: LoanService, private fb: FormBuilder) {
    this.applyForm = this.fb.group({
      loanAmount:       ['', [Validators.required, Validators.min(10000)]],
      purpose:          ['', Validators.required],
      tenureMonths:     [12, Validators.required],
      annualRevenue:    ['', [Validators.required, Validators.min(0)]],
      yearsInBusiness:  ['', [Validators.required, Validators.min(0)]],
      employeeCount:    ['', [Validators.required, Validators.min(1)]],
      collateral:       [''],
    });

    this.repayForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      pin:    ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
  this.loading = true;
  this.loanService.getAll().subscribe({
    next: (res) => {
      this.loans = res.data?.content ?? [];
      this.loading = false;
    },
    error: () => { this.loading = false; },
  });
}

  openApply(): void { this.applyForm.reset({ tenureMonths: 12 }); this.showApplyModal = true; }
  closeApply(): void { this.showApplyModal = false; this.error = ''; }

  submitApply(): void {
    if (this.applyForm.invalid) { this.applyForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.loanService.apply(this.applyForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.closeApply();
        this.successMsg = 'Loan application submitted!';
        this.load();
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.submitting = false; },
    });
  }

  openDetail(loan: Loan): void {
    this.selectedLoan = loan;
    this.showDetailModal = true;
    this.schedule = [];
    if (loan.status === 'ACTIVE' || loan.status === 'APPROVED') {
      this.scheduleLoading = true;
      this.loanService.getRepaymentSchedule(loan.loanId).subscribe({
        next: (res) => { this.schedule = res.data ?? []; this.scheduleLoading = false; },
        error: () => { this.scheduleLoading = false; },
      });
    }
  }

  closeDetail(): void { this.showDetailModal = false; this.selectedLoan = null; }

  openRepay(loan: Loan): void {
    this.selectedLoan = loan;
    this.repayForm.patchValue({ amount: loan.monthlyEmi });
    this.showRepayModal = true;
  }

  closeRepay(): void { this.showRepayModal = false; this.error = ''; }

  submitRepay(): void {
    if (!this.selectedLoan || this.repayForm.invalid) return;
    this.submitting = true;
    const { amount, pin } = this.repayForm.value;
    this.loanService.repay(this.selectedLoan.loanId, amount, pin).subscribe({
      next: () => {
        this.submitting = false;
        this.closeRepay();
        this.successMsg = 'Repayment successful!';
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Repayment failed.'; this.submitting = false; },
    });
  }

  statusColor(s: string): string {
    const m: Record<string, string> = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected', ACTIVE: 'active', CLOSED: 'closed' };
    return m[s] ?? '';
  }

  progressPercent(loan: Loan): number {
    if (!loan.totalRepayable) return 0;
    return Math.min(100, Math.round((loan.amountRepaid / loan.totalRepayable) * 100));
  }

  af(n: string) { return this.applyForm.get(n); }
  rf(n: string) { return this.repayForm.get(n); }
}

