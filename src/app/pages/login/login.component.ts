import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    emailOrPhone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  error = '';
  showPassword = false;

  get emailOrPhone() { return this.form.get('emailOrPhone')!; }
  get password() { return this.form.get('password')!; }

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.tokenService.setToken(res.token);
        // this.router.navigate(['/dashboard']);
        this.router.navigate(['/init'])
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
      },
    });
  }
}
