import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

function pinMatchValidator(group: AbstractControl) {
  const pin     = group.get('mtPin')?.value;
  const confirm = group.get('confirmMtPin')?.value;
  return pin && confirm && pin !== confirm ? { pinMismatch: true } : null;
}

@Component({
  selector: 'app-mpin-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './mpin-setup.component.html',
  styleUrls: ['./mpin-setup.component.scss']
})
export class MpinSetupComponent {

  form: FormGroup;
  loading     = false;
  errorMsg    = '';
  success     = false;
  showPin     = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      mtPin:        ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
      confirmMtPin: ['', Validators.required],
    }, { validators: pinMatchValidator });
  }

  get f() { return this.form.controls; }

  get pinLength(): number { return this.f['mtPin'].value?.length ?? 0; }
  get digitsOnly(): boolean { return /^\d+$/.test(this.f['mtPin'].value ?? ''); }
  get pinsMatch(): boolean {
    return this.f['mtPin'].value === this.f['confirmMtPin'].value
      && (this.f['confirmMtPin'].value?.length ?? 0) > 0;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';

    this.http.post(`${environment.apiBaseUrl}/user/set-mt-pin`, {
      mtPin:        this.form.value.mtPin,
      confirmMtPin: this.form.value.confirmMtPin,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to set MPIN. Please try again.';
        this.loading  = false;
      }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}