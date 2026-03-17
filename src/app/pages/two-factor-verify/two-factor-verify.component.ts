import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-two-factor-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-layout centered">
      <div class="verify-card">
        <h1>Two-Factor Verification</h1>
        <p>A verification code has been sent to your email.</p>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="alert error" *ngIf="error">{{ error }}</div>
          <div class="alert success" *ngIf="success">{{ success }}</div>

          <div class="form-group">
            <label>6-Digit Code</label>
            <input type="text" formControlName="otp" placeholder="123456" maxlength="6" class="otp-input"/>
          </div>

          <button class="btn-primary full" [disabled]="loading">
            {{ loading ? 'Verifying...' : 'Verify Code' }}
          </button>

          <div class="resend-wrap">
            <button type="button" class="btn-link" (click)="resend()" [disabled]="resendCooldown > 0">
              Resend Code {{ resendCooldown > 0 ? '(' + resendCooldown + 's)' : '' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .verify-card {
      background: #1e293b;
      padding: 2rem;
      border-radius: 1rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
      color: #f1f5f9;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; margin-bottom: 1.5rem; }
    .otp-input {
      font-size: 1.5rem;
      letter-spacing: 0.5rem;
      text-align: center;
    }
    .resend-wrap { margin-top: 1rem; }
    .btn-link { background: none; border: none; color: #3b82f6; cursor: pointer; text-decoration: underline; }
    .btn-link:disabled { color: #64748b; cursor: default; text-decoration: none; }
  `]
})
export class TwoFactorVerifyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  emailOrPhone = '';
  loading = false;
  error = '';
  success = '';
  resendCooldown = 0;

  form: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  ngOnInit() {
    this.emailOrPhone = history.state.emailOrPhone;
    if (!this.emailOrPhone) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.verifyOtp(this.emailOrPhone, this.form.value.otp).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.tokenService.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid code. Please try again.';
      }
    });
  }

  resend() {
    this.authService.resendOtp(this.emailOrPhone).subscribe({
      next: () => {
        this.success = 'New code sent!';
        this.resendCooldown = 60;
        const timer = setInterval(() => {
          this.resendCooldown--;
          if (this.resendCooldown <= 0) clearInterval(timer);
        }, 1000);
      }
    });
  }
}
