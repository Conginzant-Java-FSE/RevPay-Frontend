import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-personal-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ← this is what was missing
  templateUrl: './personal-setup.component.html',
  styleUrls: ['./personal-setup.component.scss']
})
export class PersonalSetupComponent {

  form: FormGroup;
  loading = false;
  errorMsg = '';
  step = 1;
  accountTypes = ['SAVINGS', 'CHECKING'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      dob:               ['', Validators.required],
      address:           ['', Validators.required],
      accountHolderName: ['', Validators.required],
      bankName:          ['', Validators.required],
      accountNumber:     ['', [Validators.required, Validators.minLength(8)]],
      ifscCode:          ['', Validators.required],
      accountType:       ['SAVINGS', Validators.required],
      isPrimary:         [true]
    });
  }

  nextStep(): void {
    ['username', 'dob', 'address'].forEach(f => this.form.get(f)?.markAsTouched());
    const valid = ['username', 'dob', 'address'].every(f => this.form.get(f)?.valid);
    if (valid) this.step = 2;
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
    this.userService.createPersonalProfile(this.form.value).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/setup/mpin']); },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }
}