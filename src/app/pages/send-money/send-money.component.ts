import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MoneyRequestService } from '../../core/services/money-request.service';
import { UserService } from '../../core/services/user.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss'],
})
export class SendMoneyComponent implements OnInit {
  form: FormGroup;
  step: 'details' | 'confirm' | 'success' = 'details';
  walletBalance = 0;
  loading = false;
  error = '';
  showPin = false;

  constructor(
    private fb: FormBuilder,
    private reqService: MoneyRequestService,
    private userService: UserService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      receiverEmailOrPhone: ['', Validators.required],
      amount:    ['', [Validators.required, Validators.min(1)]],
      note:      [''],
      pin:       ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => this.walletBalance = res.data?.walletBalance ?? 0,
    });
  }

  goToConfirm(): void {
    if (this.form.get('receiverEmailOrPhone')?.invalid || this.form.get('amount')?.invalid) {
      this.form.get('receiverEmailOrPhone')?.markAsTouched();
      this.form.get('amount')?.markAsTouched();
      return;
    }
    const amount = +this.form.value.amount;
    if (amount > this.walletBalance) {
      this.error = 'Insufficient wallet balance.';
      return;
    }
    this.error = '';
    this.step = 'confirm';
  }

  send(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.reqService.send(this.form.value).subscribe({
      next: () => { this.loading = false; this.step = 'success'; },
      error: (err) => { this.error = err.error?.message ?? 'Transaction failed.'; this.loading = false; },
    });
  }

  reset(): void { this.form.reset(); this.step = 'details'; this.error = ''; }
  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  f(n: string) { return this.form.get(n); }

  get pinControl(): FormControl {
    return this.form.get('pin') as FormControl;
  }
}
