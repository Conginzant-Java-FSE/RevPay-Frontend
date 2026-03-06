import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { TransactionService } from '../../core/services/transaction.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserProfile, Transaction, Notification } from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: UserProfile | null = null;
  transactions: Transaction[] = [];
  notifications: Notification[] = [];
  loading = true;

  quickActions = [
    { icon: '↗', label: 'Send Money', color: '#4f8ef7', route: '/send-money'   },
    { icon: '↙', label: 'Request',    color: '#22c55e', route: '/requests'      },
    { icon: '＋', label: 'Add Funds', color: '#a855f7', route: '/add-funds'     },
    { icon: '↓',  label: 'Withdraw',  color: '#f97316', route: '/withdraw'      },
  ];

  constructor(
    private userService: UserService,
    private txnService: TransactionService,
    private notifService: NotificationService,
    private router: Router,
  ) {
    const nav = this.router.getCurrentNavigation();
    const stateProfile = nav?.extras?.state?.['profile'];
    if (stateProfile) {
      this.profile = stateProfile;
    }
  }

  ngOnInit(): void {
    if (!this.profile) {
      this.userService.getProfile().subscribe({
        next: (res) => { this.profile = res.data ?? null; },
        error: () => this.router.navigate(['/login']),
      });
    }

    // Load recent transactions (first 6)
    this.txnService.getAll({ page: 0, size: 6 }).subscribe({
      next: (res) => {
        this.transactions = res.data ?? [];
      },
    });

    // Load recent notifications (first 5)
    this.notifService.getAll().subscribe({
      next: (res) => {
        this.notifications = (res.data ?? []).slice(0, 5);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  get firstName(): string {
    return (this.profile?.fullName || '').split(' ')[0] || 'there';
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) return 'Good morning';
    if (h >= 12 && h < 17) return 'Good afternoon';
    if (h >= 17 && h < 21) return 'Good evening';
    return 'Good night';
  }

  get isBusinessPendingVerification(): boolean {
    return this.profile?.accountType === 'BUSINESS'
        && this.profile?.businessStatus === 'PENDING_VERIFICATION';
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.isRead);
  }

  // Pending = sum of amounts in PENDING transactions
  get pendingAmount(): number {
    return this.transactions
      .filter(t => t.status === 'PENDING')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  txnIcon(type: string): string {
    const m: Record<string, string> = {
      SEND: '↗', RECEIVE: '↙', TOPUP: '＋', WITHDRAWAL: '↓', LOAN_REPAYMENT: '🏦',
    };
    return m[type] ?? '•';
  }

  txnTypeClass(type: string): string {
    const m: Record<string, string> = {
      SEND: 'sent', RECEIVE: 'received', TOPUP: 'topup',
      WITHDRAWAL: 'withdrawal', LOAN_REPAYMENT: 'loan',
    };
    return m[type] ?? '';
  }

  notifIcon(type: string): string {
    const m: Record<string, string> = {
      TRANSACTION: 'payments',
      TRANSACTION_RECEIVED: 'payments',
      TRANSACTION_SENT: 'payments',
      MONEY_REQUEST: 'request_page',
      CARD_CHANGE: 'credit_card',
      LOW_BALANCE: 'warning',
      SECURITY: 'lock',
      INVOICE: 'receipt_long',
      LOAN: 'account_balance',
    };
    return m[type] ?? 'notifications';
  }
}