import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-business-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ← required
  templateUrl: './business-setup.component.html',
  styleUrls: ['./business-setup.component.scss']
})
export class BusinessSetupComponent {

  form: FormGroup;
  loading = false;
  errorMsg = '';
  step = 1;

  businessTypes = [
    { value: 'SOLE_PROPRIETOR', label: 'Sole Proprietor' },
    { value: 'LLC',             label: 'LLC' },
    { value: 'CORPORATION',     label: 'Corporation' },
    { value: 'PARTNERSHIP',     label: 'Partnership' },
    { value: 'NON_PROFIT',      label: 'Non-Profit' }
  ];

  accountTypes = ['SAVINGS', 'CHECKING'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username:          ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      businessName:      ['', Validators.required],
      businessType:      ['', Validators.required],
      taxId:             ['', Validators.required],
      address:           ['', Validators.required],
      contactPhone:      ['', Validators.required],
      website:           [''],
      accountHolderName: ['', Validators.required],
      bankName:          ['', Validators.required],
      accountNumber:     ['', [Validators.required, Validators.minLength(8)]],
      ifscCode:          ['', Validators.required],
      accountType:       ['SAVINGS', Validators.required],
      isPrimary:         [true]
    });
  }

  nextStep(): void {
    const fields = ['username', 'businessName', 'businessType', 'taxId', 'address', 'contactPhone'];
    fields.forEach(f => this.form.get(f)?.markAsTouched());
    if (fields.every(f => this.form.get(f)?.valid)) this.step = 2;
  }

  prevStep(): void { this.step = 1; }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.userService.createBusinessProfile(this.form.value).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/setup/mpin']); },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }
}