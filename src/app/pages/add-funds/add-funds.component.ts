import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentMethodService } from '../../core/services/payment-method.service';
import { WalletService } from '../../core/services/wallet.service';
import { PaymentCard } from '../../core/models';

@Component({
  selector: 'app-add-funds',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-funds.component.html',
  styleUrls: ['./add-funds.component.scss'],
})
export class AddFundsComponent implements OnInit {
  cards: PaymentCard[] = [];
  loading = true;
  submitting = false;
  step: 'form' | 'success' = 'form';
  error = '';
  addedAmount = 0;

  form: FormGroup;
  showPin = false;

  quickAmounts = [500, 1000, 2000, 5000];

  constructor(
    private fb: FormBuilder,
    private pmService: PaymentMethodService,
    private walletService: WalletService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      cardId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      pin:    ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
    });
  }

  ngOnInit(): void {
    this.pmService.getAll().subscribe({
      next: (res) => {
        this.cards = res.data ?? [];
        // Pre-select the default card
        const def = this.cards.find(c => c.isDefault);
        if (def) this.form.patchValue({ cardId: def.cardId });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  setAmount(amt: number): void { this.form.patchValue({ amount: amt }); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.error = '';
    const { cardId, amount, pin } = this.form.value;
    this.addedAmount = +amount;

    this.walletService.addFunds(+cardId, +amount, pin).subscribe({
      next: () => { this.submitting = false; this.step = 'success'; },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed to add funds. Please check your PIN.';
        this.submitting = false;
      },
    });
  }

  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  addMore(): void { this.form.reset(); this.step = 'form'; this.error = ''; }
  goToAddCard(): void { this.router.navigate(['/payment-methods']); }
  f(n: string) { return this.form.get(n); }
}