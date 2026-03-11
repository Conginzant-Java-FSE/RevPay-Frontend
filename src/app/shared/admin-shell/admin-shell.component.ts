import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss'],
})
export class AdminShellComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  loggingOut = false;

  logout(): void {
    this.loggingOut = true;
    this.adminService.logout().subscribe({
      next: () => {
        this.adminService.clearAdminSession();
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.adminService.clearAdminSession();
        this.router.navigate(['/admin/login']);
      },
    });
  }
}
