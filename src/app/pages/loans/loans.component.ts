

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
      loanAmount: ['', [Validators.required, Validators.min(1000)]],
      purpose: ['', Validators.required],
      tenureMonths: [12, Validators.required],
      annualRevenue: ['', [Validators.required, Validators.min(0)]],
      yearsInBusiness: ['', [Validators.required, Validators.min(0)]],
      employeeCount: ['', [Validators.required, Validators.min(1)]],
      collateral: [''],
    });

    

    this.repayForm = this.fb.group({
  amount: ['', Validators.required],
  pin: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
});
  }

  ngOnInit(): void {
    this.load();
  }

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

  openApply(): void {
    this.applyForm.reset({ tenureMonths: 12 });
    this.showApplyModal = true;
  }

  closeApply(): void {
    this.showApplyModal = false;
    this.error = '';
  }

  submitApply(): void {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }
    this.submitting = true;

    // its Convert all numeric fields to proper types before sending
    const payload = {
      loanAmount: Number(this.applyForm.value.loanAmount),
      purpose: this.applyForm.value.purpose,
      tenureMonths: Number(this.applyForm.value.tenureMonths),
      annualRevenue: Number(this.applyForm.value.annualRevenue),
      yearsInBusiness: Number(this.applyForm.value.yearsInBusiness),
      employeeCount: Number(this.applyForm.value.employeeCount),
      collateral: this.applyForm.value.collateral || null,
    };

    this.loanService.apply(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.closeApply();
        this.successMsg = 'Loan application submitted!';
        this.load();
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed to submit loan.';
        this.submitting = false;
      },
    });
  }

  // openDetail(loan: Loan): void {
  //   this.selectedLoan = loan;
  //   this.showDetailModal = true;
  //   this.schedule = [];
  //   if (loan.status === 'ACTIVE' || loan.status === 'APPROVED') {
  //     this.scheduleLoading = true;
  //     this.loanService.getRepaymentSchedule(loan.loanId).subscribe({
  //       next: (res) => {
  //         this.schedule = res.data ?? [];
  //         this.scheduleLoading = false;
  //       },
  //       error: () => { this.scheduleLoading = false; },
  //     });
  //   }
  // }

  
openDetail(loan: Loan): void {
  this.selectedLoan = null;  // clear previous selection
  this.showDetailModal = true;
  this.schedule = [];

  this.loanService.getById(loan.loanId).subscribe({
    next: (res) => {
      this.selectedLoan = res.data ?? null;
      if (this.selectedLoan?.status === 'ACTIVE' || this.selectedLoan?.status === 'APPROVED') {
        this.loadRepaymentSchedule(this.selectedLoan.loanId);
      }
    },
    error: () => {
      this.selectedLoan = loan; // fallback to list data if detail API fails
    }
  });
} 
loadRepaymentSchedule(loanId: number): void {
  this.scheduleLoading = true;
  this.loanService.getRepaymentSchedule(loanId).subscribe({
    next: (res) => {
      this.schedule = res.data ?? [];
      this.scheduleLoading = false;
    },
    error: () => {
      this.scheduleLoading = false;
    },
  });
}

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedLoan = null;
  }

  // openRepay(loan: Loan): void {
  //   this.selectedLoan = loan;
  //   this.repayForm.patchValue({ amount: loan.monthlyEmi });
  //   this.showRepayModal = true;
  // }

  openRepay(loan: Loan): void {
  this.selectedLoan = loan;

  const emi = loan.monthlyEmi;
  const outstanding = loan.outstandingBalance ?? loan.totalRepayable;

  this.repayForm.patchValue({
    amount: emi,
    pin: ''
  });

  // Dynamic validation
  this.repayForm.get('amount')?.setValidators([
    Validators.required,
    Validators.min(emi),
    Validators.max(outstanding)
  ]);

  this.repayForm.get('amount')?.updateValueAndValidity();

  this.showRepayModal = true;
}

  // closeRepay(): void {
  //   this.showRepayModal = false;
  //   this.error = '';
  // }
closeRepay(): void {
  this.showRepayModal = false;
  this.error = '';
  this.repayForm.reset();
}
  submitRepay(): void {
    if (!this.selectedLoan || this.repayForm.invalid) return;
    this.submitting = true;

    const amount = Number(this.repayForm.value.amount);
    const pin = this.repayForm.value.pin;

    this.loanService.repay(this.selectedLoan.loanId, amount, pin).subscribe({
      next: () => {
        this.submitting = false;
        this.closeRepay();
        this.successMsg = 'Repayment successful!';
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Repayment failed.';
        this.submitting = false;
      },
    });
  }

  statusColor(s: string): string {
    const m: Record<string, string> = {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected',
      ACTIVE: 'active',
      CLOSED: 'closed'
    };
    return m[s] ?? '';
  }

  progressPercent(loan: Loan): number {
    if (!loan.totalRepayable) return 0;
    return Math.min(100, Math.round((loan.amountRepaid / loan.totalRepayable) * 100));
  }

  af(n: string) { return this.applyForm.get(n); }
  rf(n: string) { return this.repayForm.get(n); }
}