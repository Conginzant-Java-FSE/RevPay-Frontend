import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SecurityFeature {
  icon:  string;
  title: string;
  desc:  string;
  color: string;
}

interface SecuritySection {
  id:      string;
  heading: string;
  content: string[];
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent {

  currentYear = new Date().getFullYear();

  features: SecurityFeature[] = [
    {
      icon:  '🔐',
      title: 'End-to-End Encryption',
      desc:  'All data in transit is encrypted using TLS 1.3. Sensitive data at rest is encrypted with AES-256.',
      color: '#4f8ef7',
    },
    {
      icon:  '🛡',
      title: 'Transaction PIN',
      desc:  'Every payment requires a separate 4–6 digit PIN, independent of your login password.',
      color: '#22c55e',
    },
    {
      icon:  '👁',
      title: 'Real-Time Monitoring',
      desc:  'Our systems monitor all transactions 24/7 for suspicious patterns and flag anomalies instantly.',
      color: '#a855f7',
    },
    {
      icon:  '🔑',
      title: 'Secure Authentication',
      desc:  'Passwords are hashed using BCrypt. Security questions add a second layer of identity verification.',
      color: '#f59e0b',
    },
    {
      icon:  '📋',
      title: 'Full Audit Trail',
      desc:  'Every action on your account is logged with timestamp, IP, and device — visible to you anytime.',
      color: '#06b6d4',
    },
    {
      icon:  '🚫',
      title: 'Role-Based Access',
      desc:  'Personal and business accounts have strictly separated permissions. No cross-account data access.',
      color: '#ef4444',
    },
  ];

  sections: SecuritySection[] = [
    {
      id: 'data-protection',
      heading: '1. Data Protection',
      content: [
        'RevPay collects only the data necessary to provide our payment services. We never sell your personal information to third parties.',
        'All personal data is stored in encrypted databases hosted on ISO 27001 certified infrastructure. Database backups are encrypted and stored in geographically separate locations.',
        'Card numbers are never stored on our servers. We store only the last four digits for display purposes. Full card data is tokenized through our PCI DSS compliant payment processor.',
        'Sensitive fields such as passwords and PINs are one-way hashed using industry-standard algorithms and cannot be recovered — not even by our own engineers.',
      ],
    },
    {
      id: 'account-security',
      heading: '2. Account Security',
      content: [
        'We recommend enabling a strong, unique password for your RevPay account and never reusing it from other services.',
        'Your Transaction PIN is separate from your account password and is required for every outgoing payment, withdrawal, and sensitive account change. This ensures that even if your password is compromised, your funds remain protected.',
        'Security questions provide an additional identity verification layer for password recovery. Your answers are hashed and cannot be read in plaintext.',
        'We send immediate notifications for every login, password change, PIN change, and payment method modification. If you receive a notification you did not trigger, contact us immediately at security@revpay.in.',
      ],
    },
    {
      id: 'payment-security',
      heading: '3. Payment Security',
      content: [
        'All payment transactions are processed over encrypted HTTPS connections. We use HTTP Strict Transport Security (HSTS) to prevent downgrade attacks.',
        'Money transfers require PIN verification at the time of transaction. Requests expire automatically after 7 days to prevent stale authorizations.',
        'Our systems detect and block duplicate transactions, rapid succession payments, and unusually large transfers that deviate from your normal spending pattern.',
        'Business loans and high-value transfers undergo additional verification steps before processing to protect both sender and receiver.',
      ],
    },
    {
      id: 'infrastructure',
      heading: '4. Infrastructure Security',
      content: [
        'RevPay\'s backend is deployed behind a Web Application Firewall (WAF) that filters malicious traffic, SQL injection attempts, and cross-site scripting (XSS) attacks.',
        'API endpoints are rate-limited to prevent brute-force attacks. Repeated failed login or PIN attempts result in temporary account lockout.',
        'All API communication uses JWT-based authentication with short-lived access tokens. Tokens are invalidated immediately upon logout.',
        'Internal systems follow the principle of least privilege — each service can only access the data it explicitly needs to function.',
      ],
    },
    {
      id: 'reporting',
      heading: '5. Vulnerability Reporting',
      content: [
        'We welcome responsible disclosure from security researchers. If you discover a vulnerability in RevPay, please report it to security@revpay.in with a detailed description.',
        'Do not exploit any vulnerability or access any account other than your own during your research. We ask that you give us reasonable time to investigate and fix reported issues before public disclosure.',
        'We review all reports within 48 hours and aim to resolve critical vulnerabilities within 7 days. We appreciate the security community\'s efforts in keeping RevPay safe.',
        'While RevPay does not currently offer a formal bug bounty program, we acknowledge and appreciate all responsible disclosures.',
      ],
    },
  ];

  activeSection = '';

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection = id;
  }
}
