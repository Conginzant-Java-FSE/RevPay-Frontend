import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile-init',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="init-screen">
      <div class="spinner-wrap">
        <div class="spinner"></div>
        <p>Loading your account...</p>
      </div>
    </div>
  `,
  styles: [`
    .init-screen { height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0f1e; }
    .spinner-wrap { text-align:center; color:#7ca4d4; font-family:'DM Sans',sans-serif; }
    .spinner { width:48px; height:48px; border:3px solid rgba(124,164,212,0.2); border-top-color:#7ca4d4; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 16px; }
    @keyframes spin { to { transform:rotate(360deg); } }
    p { font-size:14px; }
  `]
})
export class ProfileInitComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        if (!res.data) { this.router.navigate(['/login']); return; }

        const profile = res.data;
        const profileComplete = profile.profileComplete;
        const accountType = profile.accountType;
        const mtpinSet = profile.mtpinSet;

        if (!profileComplete) {
          this.router.navigate(
            accountType === 'PERSONAL' ? ['/setup/personal'] : ['/setup/business']
          );
        } else if (!mtpinSet) {
          this.router.navigate(['/setup/mpin']);
        } else {
          this.router.navigate(['/dashboard'], { state: { profile: res.data } });
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }
}