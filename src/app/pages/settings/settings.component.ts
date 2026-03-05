import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = true;
  activeTab: 'profile' | 'password' | 'pin' = 'profile';
  saving = false;
  error = '';
  successMsg = '';

  profileForm: FormGroup;
  passwordForm: FormGroup;
  pinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userService: UserService,
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phone:    ['', Validators.required],
      address:  [''],
      dob:      [''],
      // business
      businessName: [''],
      contactPhone: [''],
      website:      [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });

    this.pinForm = this.fb.group({
      currentPin: [''],
      newPin:     ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
      confirmPin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data ?? null;
        this.loading = false;
        if (this.profile) {
          this.profileForm.patchValue({
            fullName:     this.profile.fullName,
            phone:        this.profile.phone,
            address:      this.profile.address ?? '',
            dob:          this.profile.dob ?? '',
            businessName: this.profile.businessName ?? '',
            contactPhone: this.profile.contactPhone ?? '',
            website:      this.profile.website ?? '',
          });
        }
      },
      error: () => { this.loading = false; },
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.saving = true;
    const update$ = this.profile?.accountType === 'BUSINESS'
      ? this.profileService.updateBusiness(this.profileForm.value)
      : this.profileService.updatePersonal(this.profileForm.value);

    update$.subscribe({
      next: () => { this.saving = false; this.successMsg = 'Profile updated!'; setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.saving = false; },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) { this.error = 'Passwords do not match.'; return; }
    this.saving = true;
    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: () => { this.saving = false; this.passwordForm.reset(); this.successMsg = 'Password changed!'; setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.saving = false; },
    });
  }

  changePin(): void {
    if (this.pinForm.invalid) { this.pinForm.markAllAsTouched(); return; }
    const { newPin, confirmPin } = this.pinForm.value;
    if (newPin !== confirmPin) { this.error = 'PINs do not match.'; return; }
    this.saving = true;
    this.profileService.changePin(this.pinForm.value).subscribe({
      next: () => { this.saving = false; this.pinForm.reset(); this.successMsg = 'PIN updated!'; setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.saving = false; },
    });
  }

  isPersonal(): boolean { return this.profile?.accountType === 'PERSONAL'; }
  isBusiness(): boolean { return this.profile?.accountType === 'BUSINESS'; }
  pf(n: string) { return this.profileForm.get(n); }
  pwf(n: string) { return this.passwordForm.get(n); }
  pinf(n: string) { return this.pinForm.get(n); }
}
