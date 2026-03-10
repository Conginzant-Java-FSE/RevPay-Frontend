import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, NotifPreferenceItem } from '../../core/services/notification.service';
import { Notification, NotificationType } from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

interface PrefGroup {
  key:         string;
  label:       string;
  description: string;
  icon:        string;
  types:       string[];
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  loading    = true;
  markingAll = false;
  activeTab: 'list' | 'preferences' = 'list';

  prefsLoading = false;
  prefsSaving  = false;
  prefsError   = '';
  prefsSuccess = '';

  private rawPrefs: NotifPreferenceItem[] = [];

  readonly prefGroups: PrefGroup[] = [
    {
      key:         'TRANSACTION',
      label:       'Transaction Alerts',
      description: 'Notifications for money sent and received',
      icon:        'payments',
      types:       ['TRANSACTION_SENT', 'TRANSACTION_RECEIVED'],
    },
    {
      key:         'MONEY_REQUEST',
      label:       'Money Requests',
      description: 'Notifications for received, accepted, declined, and cancelled requests',
      icon:        'request_page',
      types:       ['MONEY_REQUEST_RECEIVED', 'MONEY_REQUEST_ACCEPTED',
                    'MONEY_REQUEST_DECLINED', 'MONEY_REQUEST_CANCELLED'],
    },
    {
      key:         'CARD',
      label:       'Card Activity',
      description: 'Notifications when a card is added or removed',
      icon:        'credit_card',
      types:       ['CARD_ADDED', 'CARD_REMOVED'],
    },
    {
      key:         'LOW_BALANCE',
      label:       'Low Balance Alert',
      description: 'Notify when wallet balance falls below ₹500',
      icon:        'warning',
      types:       ['LOW_BALANCE'],
    },
    {
      key:         'SECURITY',
      label:       'Security Alerts',
      description: 'Notifications for security events and system updates',
      icon:        'lock',
      types:       ['SECURITY_ALERT', 'SYSTEM_UPDATE'],
    },
    {
      key:         'INVOICE',
      label:       'Invoice Updates',
      description: 'Notifications for invoice sent, paid, and overdue (business)',
      icon:        'receipt_long',
      types:       ['INVOICE_SENT', 'INVOICE_PAID', 'INVOICE_OVERDUE'],
    },
    {
      key:         'LOAN',
      label:       'Loan Reminders',
      description: 'Notifications for loan approval and rejection',
      icon:        'account_balance',
      types:       ['LOAN_APPROVED', 'LOAN_REJECTED'],
    },
    {
      key:         'GENERAL',
      label:       'General & Promotions',
      description: 'General announcements and promotional notifications',
      icon:        'campaign',
      types:       ['GENERAL', 'PROMOTIONAL'],
    },
  ];

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadPreferences();
  }

  // ── Notifications list ────────────────────────────────────────

  loadNotifications(): void {
    this.notifService.getAll().subscribe({
      next: (res) => { this.notifications = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  markRead(n: Notification): void {
    if (n.isRead) return;
    this.notifService.markRead(n.notificationId).subscribe({
      next: () => { n.isRead = true; },
    });
  }

  markAllRead(): void {
    this.markingAll = true;
    this.notifService.markAllRead().subscribe({
      next:  () => { this.notifications.forEach(n => n.isRead = true); this.markingAll = false; },
      error: () => { this.markingAll = false; },
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  typeIcon(type: NotificationType): string {
    const map: Record<string, string> = {
      TRANSACTION:             'payments',
      TRANSACTION_RECEIVED:    'payments',
      TRANSACTION_SENT:        'payments',
      MONEY_REQUEST:           'request_page',
      MONEY_REQUEST_RECEIVED:  'request_page',
      MONEY_REQUEST_ACCEPTED:  'request_page',
      MONEY_REQUEST_DECLINED:  'request_page',
      MONEY_REQUEST_CANCELLED: 'request_page',
      CARD_CHANGE:             'credit_card',
      CARD_ADDED:              'credit_card',
      CARD_REMOVED:            'credit_card',
      LOW_BALANCE:             'warning',
      SECURITY:                'lock',
      SECURITY_ALERT:          'lock',
      SYSTEM_UPDATE:           'settings',
      INVOICE:                 'receipt_long',
      INVOICE_SENT:            'receipt_long',
      INVOICE_PAID:            'receipt_long',
      INVOICE_OVERDUE:         'receipt_long',
      LOAN:                    'account_balance',
      LOAN_APPROVED:           'account_balance',
      LOAN_REJECTED:           'account_balance',
      GENERAL:                 'campaign',
      PROMOTIONAL:             'campaign',
    };
    return map[type] ?? 'notifications';
  }

  // ── Preferences ───────────────────────────────────────────────

  loadPreferences(): void {
    this.prefsLoading = true;
    this.notifService.getPreferences().subscribe({
      next: (res) => {
        // Store the raw array — this is the source of truth
        this.rawPrefs    = res.data ?? [];
        this.prefsLoading = false;
      },
      error: () => { this.prefsLoading = false; },
    });
  }

  isGroupEnabled(group: PrefGroup): boolean {
    if (this.rawPrefs.length === 0) return true;
    return group.types.every(type => {
      const item = this.rawPrefs.find(p => p.notificationType === type);
      return item ? item.isEnabled : true;
    });
  }

  toggleGroup(group: PrefGroup, enabled: boolean): void {
    group.types.forEach(type => {
      const item = this.rawPrefs.find(p => p.notificationType === type);
      if (item) {
        item.isEnabled = enabled;
      } else {
        this.rawPrefs.push({ notificationType: type, isEnabled: enabled });
      }
    });
  }

  savePreferences(): void {
    this.prefsSaving  = true;
    this.prefsError   = '';
    this.prefsSuccess = '';

    const payload = {
      preferences: this.rawPrefs
    }

    this.notifService.updatePreferences(payload).subscribe({
      next: () => {
        this.prefsSaving  = false;
        this.prefsSuccess = 'Preferences saved!';
        setTimeout(() => this.prefsSuccess = '', 3000);
      },
      error: (err) => {
        this.prefsError  = err.error?.message ?? 'Failed to save preferences.';
        this.prefsSaving = false;
      },
    });
  }
}