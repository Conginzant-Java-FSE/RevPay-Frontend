import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  profile: UserProfile | null = null;
  loggingOut = false;
  sidebarOpen = false;
  unreadCount = 0;            // ← was hardcoded 3, now live

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notifService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => { this.profile = res.data ?? null; },
      error: () => this.router.navigate(['/login']),
    });

    // Load real unread count
    this.notifService.getAll().subscribe({
      next: (res) => {
        this.unreadCount = (res.data ?? []).filter(n => !n.isRead).length;
      },
    });
  }

  get initials(): string {
    const parts = (this.profile?.fullName || '').split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return '?';
  }

  get isBusinessAccount(): boolean {
    return this.profile?.accountType === 'BUSINESS';
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }

  logout(): void {
    this.loggingOut = true;
    this.authService.logout().subscribe({
      next:  () => { this.authService.clearSession(); this.router.navigate(['/login']); },
      error: () => { this.authService.clearSession(); this.router.navigate(['/login']); },
    });
  }
}