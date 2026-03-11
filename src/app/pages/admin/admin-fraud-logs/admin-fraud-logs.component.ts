import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { FraudLog } from '../../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-fraud-logs',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './admin-fraud-logs.component.html',
  styleUrls: ['./admin-fraud-logs.component.scss'],
})
export class AdminFraudLogsComponent implements OnInit {
  private adminService = inject(AdminService);

  fraudLogs: FraudLog[] = [];
  loading = false;
  error = '';
  successMsg = '';
  blockingId: number | null = null;

  ngOnInit(): void {
    this.loadFraudLogs();
  }

  loadFraudLogs(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getFraudLogs().subscribe({
      next: (res) => {
        this.fraudLogs = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load fraud logs.';
      },
    });
  }

  blockUser(log: FraudLog): void {
    if (log.blocked) return;
    this.blockingId = log.id;
    this.error = '';
    this.adminService.blockUser(log.id).subscribe({
      next: () => {
        this.blockingId = null;
        this.successMsg = 'User blocked successfully.';
        this.loadFraudLogs();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.blockingId = null;
        this.error = err.error?.message || 'Failed to block user.';
      },
    });
  }

  getUserDisplay(log: FraudLog): string {
    if (log.userFullName) return log.userFullName;
    if (log.userEmail) return log.userEmail;
    if (log.userId) return `User #${log.userId}`;
    return 'Unknown';
  }
}
