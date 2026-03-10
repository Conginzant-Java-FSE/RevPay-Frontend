import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from '../../core/services/wallet.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent implements OnInit {
  walletBalance = 0;
  bankAccount: any = null;
  loading = true;
  submitting = false;
  step: 'form' | 'confirm' | 'success' = 'form';
  error = '';
  withdrawnAmount = 0;
  showPin = false;

  form: FormGroup;
  quickAmounts = [500, 1000, 2000, 5000];

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private userService: UserService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      note:   [''],
      pin:    ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.walletBalance = res.data?.walletBalance ?? 0;
        this.bankAccount   = res.data?.bankAccount ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  setAmount(amt: number): void { this.form.patchValue({ amount: amt }); }

  goToConfirm(): void {
    if (this.form.get('amount')?.invalid) { this.form.get('amount')?.markAsTouched(); return; }
    const amount = +this.form.value.amount;
    if (amount > this.walletBalance) {
      this.error = `Amount exceeds your wallet balance of ₹${this.walletBalance.toFixed(2)}.`;
      return;
    }
    this.error = '';
    this.step = 'confirm';
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.withdrawnAmount = +this.form.value.amount;

    this.walletService.withdraw(
      this.form.value.amount,
      this.form.value.pin,
      this.form.value.note
    ).subscribe({
      next: () => { this.submitting = false; this.step = 'success'; },
      error: (err) => {
        this.error = err.error?.message ?? 'Withdrawal failed. Please check your PIN.';
        this.submitting = false;
      },
    });
  }

  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  goToAddBank(): void { this.router.navigate(['/settings']); }
  f(n: string) { return this.form.get(n); }
}