import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, Validators,
  ReactiveFormsModule, AbstractControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function passwordStrong(control: AbstractControl) {
  const v = control.value || '';
  const strong = /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v) && v.length >= 8;
  return strong ? null : { weakPassword: true };
}

function passwordMatch(control: AbstractControl) {
  const pw      = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  // ── State ───────────────────────────────────────────────────
  step             = 1;          // 1 = identity, 2 = security Q&A, 3 = new password, 4 = success
  loading          = false;
  error            = '';
  securityQuestion = '';         // returned from backend in step 1
  resetToken       = '';         // returned from backend in step 2
  showPassword     = false;
  showConfirm      = false;

  // ── Step 1 form ─────────────────────────────────────────────
  identityForm: FormGroup = this.fb.group({
    emailOrPhone: ['', [Validators.required]],
  });

  // ── Step 2 form ─────────────────────────────────────────────
  securityForm: FormGroup = this.fb.group({
    securityAnswer: ['', [Validators.required, Validators.minLength(3)]],
  });

  // ── Step 3 form ─────────────────────────────────────────────
  passwordForm: FormGroup = this.fb.group(
    {
      newPassword:     ['', [Validators.required, Validators.minLength(8), passwordStrong]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatch }
  );

  get i()  { return this.identityForm.controls; }
  get s()  { return this.securityForm.controls; }
  get p()  { return this.passwordForm.controls; }

  // ── Step 1: verify identity, get security question ──────────
  submitIdentity() {
    this.identityForm.markAllAsTouched();
    if (this.identityForm.invalid) return;

    this.loading = true;
    this.error   = '';

    this.authService.verifyIdentity(this.i['emailOrPhone'].value).subscribe({
      next: (res) => {
        this.loading          = false;
        this.securityQuestion = res.securityQuestion;
        this.step             = 2;
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'No account found with that email or phone.';
      },
    });
  }

  // ── Step 2: validate security answer, get reset token ───────
  submitSecurity() {
    this.securityForm.markAllAsTouched();
    if (this.securityForm.invalid) return;

    this.loading = true;
    this.error   = '';

    this.authService.validateSecurity({
      emailOrPhone:     this.i['emailOrPhone'].value,
      securityQuestion: this.securityQuestion,
      securityAnswer:   this.s['securityAnswer'].value.trim(),
    }).subscribe({
      next: (res) => {
        this.loading    = false;
        this.resetToken = res.resetToken;
        this.step       = 3;
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'Incorrect answer. Please try again.';
      },
    });
  }

  // ── Step 3: reset password ───────────────────────────────────
  submitPassword() {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) return;

    this.loading = true;
    this.error   = '';

    this.authService.resetPassword({
      resetToken:  this.resetToken,
      newPassword: this.p['newPassword'].value,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.step    = 4;           // success screen
        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'Password reset failed. Please start over.';
      },
    });
  }

  getPasswordStrength(): { level: number; label: string; color: string } {
    const pw = this.p['newPassword'].value || '';
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { level: 0, label: '',       color: '' },
      { level: 1, label: 'Weak',   color: '#ef4444' },
      { level: 2, label: 'Fair',   color: '#f97316' },
      { level: 3, label: 'Good',   color: '#eab308' },
      { level: 4, label: 'Strong', color: '#22c55e' },
    ];
    return levels[score] || levels[0];
  }

  // ── Password rule helpers (called from template) ─────────────
  hasMinLength(): boolean  { return (this.p['newPassword'].value || '').length >= 8; }
  hasUppercase(): boolean  { return /[A-Z]/.test(this.p['newPassword'].value || ''); }
  hasNumber(): boolean     { return /[0-9]/.test(this.p['newPassword'].value || ''); }
  hasSpecial(): boolean    { return /[^A-Za-z0-9]/.test(this.p['newPassword'].value || ''); }
}