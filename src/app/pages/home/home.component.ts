import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  features = [
    {
      icon: 'flash_on',
      title: 'Instant Transfers',
      desc: 'Send and receive money in real-time to anyone, anywhere.',
    },
    {
      icon: 'lock',
      title: 'Bank-Grade Security',
      desc: 'End-to-end encryption, 2FA, and transaction PIN protection.',
    },
    {
      icon: 'analytics',
      title: 'Smart Analytics',
      desc: 'Visual dashboards and reports to track every dollar.',
    },
    {
      icon: 'business',
      title: 'Business Tools',
      desc: 'Invoicing, loan management, and payment acceptance built-in.',
    },
    {
      icon: 'notifications',
      title: 'Live Notifications',
      desc: 'Stay informed with real-time alerts on all activity.',
    },
    {
      icon: 'credit_card',
      title: 'Multi-Card Support',
      desc: 'Link multiple cards and bank accounts seamlessly.',
    },
  ];

  stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '₹2B+', label: 'Transactions Processed' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '128-bit', label: 'Encryption' },
  ];
}
