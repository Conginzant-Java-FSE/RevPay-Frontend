import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function passwordMatch(control: AbstractControl) {
  const pw = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  step = 1; // 1 = account type, 2 = personal info, 3 = security
  accountType: 'PERSONAL' | 'BUSINESS' = 'PERSONAL';
  loading = false;
  error = '';
  success = '';
  showPassword = false;
  showAnswer = false;

  form: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      businessName: [''],
      businessType: [''],
      taxId: [''],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', [Validators.required, Validators.minLength(3)]],
      agreeTerms: [false, Validators.requiredTrue],
    },
    { validators: passwordMatch }
  );

  get f() { return this.form.controls; }

  selectAccountType(type: 'PERSONAL' | 'BUSINESS') {
    this.accountType = type;
    this.step = 2;
  }

  nextStep() {
    // Validate step 2 fields
    const step2Fields = ['fullName', 'email', 'phone'];
    // if (this.accountType === 'BUSINESS') step2Fields.push('businessName', 'businessType');
    step2Fields.forEach(f => this.form.get(f)?.markAsTouched());
    const step2Valid = step2Fields.every(f => this.form.get(f)?.valid);
    if (step2Valid) this.step = 3;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const { confirmPassword, agreeTerms, securityAnswer, ...rest } = this.form.value;

    const payload = {
      ...rest,
      accountType: this.accountType,
      securityAnswer: securityAnswer.trim().toLowerCase(),
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting you to login...';

        // Auto-dismiss after 3 seconds then navigate
        setTimeout(() => {
          this.success = '';
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  getPasswordStrength(): { level: number; label: string; color: string } {
    const pw = this.f['password'].value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { level: 0, label: '', color: '' },
      { level: 1, label: 'Weak', color: '#ef4444' },
      { level: 2, label: 'Fair', color: '#f97316' },
      { level: 3, label: 'Good', color: '#eab308' },
      { level: 4, label: 'Strong', color: '#22c55e' },
    ];
    return levels[score] || levels[0];
  }

  dropdownOpen = false;

  securityQuestions = [
    {
      group: 'Personal',
      questions: [
        { value: 'What city did you grow up in?', label: 'What city did you grow up in?' },
        { value: 'What was your childhood nickname?', label: 'What was your childhood nickname?' },
        { value: 'In what city did your parents meet?', label: 'In what city did your parents meet?' },
      ],
    },
    {
      group: 'School & Career',
      questions: [
        { value: 'What elementary school did you attend?', label: 'What elementary school did you attend?' },
        { value: 'What was the name of your first employer?', label: 'What was the name of your first employer?' },
        { value: 'What was your college major?', label: 'What was your college major?' },
      ],
    },
    {
      group: 'Memorable Things',
      questions: [
        { value: 'What was the make and model of your first car?', label: 'What was the make and model of your first car?' },
        { value: 'What is the first name of your childhood best friend?', label: 'What is the first name of your childhood best friend?' },
        { value: 'What was the name of your first pet?', label: 'What was the name of your first pet?' },
        { value: 'What is the last name of your favorite teacher?', label: 'What is the last name of your favorite teacher?' },
      ],
    },
  ];

  selectQuestion(value: string) {
    this.form.get('securityQuestion')!.setValue(value);
    this.form.get('securityQuestion')!.markAsTouched();
    this.dropdownOpen = false;
  }

  getSelectedLabel(): string {
    const val = this.form.get('securityQuestion')!.value;
    for (const group of this.securityQuestions) {
      const match = group.questions.find(q => q.value === val);
      if (match) return match.label;
    }
    return '';
  }
  
}
