import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  lastUpdated = 'December 20, 2025';

  sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      content: [
        {
          subtitle: '1.1 Information You Provide Directly',
          body: `When you register for a RevPay account, we collect information you provide including your full name, email address, phone number, date of birth, and residential address. For business accounts, we additionally collect your business name, business type, tax identification number, and business address. When you add payment methods, we collect card details which are immediately tokenized — we never store raw card numbers or CVV codes on our servers.`,
        },
        {
          subtitle: '1.2 Transaction Information',
          body: `We collect details of every transaction you conduct through RevPay, including the amount, timestamp, transaction type (sent, received, top-up, withdrawal), notes or memos attached to transactions, and the identities of counterparties involved. This data is essential for processing payments and maintaining your transaction history.`,
        },
        {
          subtitle: '1.3 Automatically Collected Information',
          body: `When you use RevPay, we automatically collect certain technical information including your IP address, browser type and version, operating system, device identifiers, pages visited within our application, the date and time of your visits, and referring URLs. We use this information for security monitoring, fraud detection, and improving our services.`,
        },
        {
          subtitle: '1.4 Security Information',
          body: `To protect your account, we collect and store your security question and a hashed version of your security answer, your transaction PIN (stored as a secure hash), and login attempt history. We also maintain logs of account changes such as password updates, PIN changes, and linked payment method modifications.`,
        },
      ],
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Your Information',
      content: [
        {
          subtitle: '2.1 To Provide Our Services',
          body: `We use your information to create and manage your account, process money transfers and payment requests, generate invoices, process loan applications for business accounts, send you notifications about account activity, and provide customer support when you need assistance.`,
        },
        {
          subtitle: '2.2 For Security and Fraud Prevention',
          body: `Your information is used to verify your identity, detect and prevent fraudulent transactions, monitor for suspicious activity, enforce our Terms of Service, and comply with legal obligations including anti-money laundering (AML) and know-your-customer (KYC) requirements where applicable.`,
        },
        {
          subtitle: '2.3 To Improve Our Platform',
          body: `We analyze aggregated, anonymized usage data to understand how users interact with RevPay, identify features that need improvement, develop new functionality, and optimize the performance and reliability of our platform. We do not sell individual user data for advertising purposes.`,
        },
        {
          subtitle: '2.4 Communications',
          body: `We use your contact information to send you transaction confirmations, account alerts, security notifications, and service updates. You can manage your notification preferences within the app. We will not send you unsolicited marketing communications without your explicit consent.`,
        },
      ],
    },
    {
      id: 'sharing',
      title: '3. How We Share Your Information',
      content: [
        {
          subtitle: '3.1 With Other RevPay Users',
          body: `When you send or request money, the recipient will see your display name and the note or purpose you attach to the transaction. We do not share your full address, date of birth, card details, or bank account numbers with other users under any circumstances.`,
        },
        {
          subtitle: '3.2 With Service Providers',
          body: `We work with trusted third-party service providers who help us operate RevPay, including payment processors for card tokenization and transaction processing, cloud hosting providers for data storage and application infrastructure, and analytics providers for platform performance monitoring. All service providers are contractually bound to handle your data in accordance with this policy.`,
        },
        {
          subtitle: '3.3 For Legal Compliance',
          body: `We may disclose your information when required by law, in response to valid legal processes such as court orders or government requests, to protect the rights and safety of RevPay, our users, or the public, or in connection with any merger, acquisition, or sale of company assets where user data forms part of the transferred assets.`,
        },
        {
          subtitle: '3.4 We Do Not Sell Your Data',
          body: `RevPay does not sell, rent, or trade your personal information to third parties for their marketing or commercial purposes. Your data is used solely to provide and improve our services to you.`,
        },
      ],
    },
    {
      id: 'data-security',
      title: '4. Data Security',
      content: [
        {
          subtitle: '4.1 Security Measures',
          body: `RevPay employs industry-standard security measures to protect your information. All data transmitted between your device and our servers is encrypted using TLS 1.2 or higher. Sensitive data including passwords, PINs, and security answers are stored using strong one-way hashing algorithms and are never stored in plaintext. Card numbers are tokenized immediately upon entry and the raw numbers are never persisted in our databases.`,
        },
        {
          subtitle: '4.2 Your Responsibilities',
          body: `You are responsible for maintaining the confidentiality of your account credentials, transaction PIN, and security question answers. Do not share your password or PIN with anyone, including RevPay support staff who will never ask for this information. Enable device lock on any device you use to access RevPay. Log out after using RevPay on shared or public devices.`,
        },
        {
          subtitle: '4.3 Data Breach Response',
          body: `In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and relevant authorities within 72 hours of becoming aware of the breach, as required by applicable law. We will provide information about the nature of the breach, data affected, and steps we are taking to mitigate harm.`,
        },
      ],
    },
    {
      id: 'data-retention',
      title: '5. Data Retention',
      content: [
        {
          subtitle: '5.1 Active Accounts',
          body: `We retain your personal information and transaction history for as long as your RevPay account remains active. Transaction records are retained for a minimum of seven years to comply with financial recordkeeping regulations, even after account closure.`,
        },
        {
          subtitle: '5.2 Account Deletion',
          body: `When you delete your RevPay account, we deactivate your account and begin the process of anonymizing or deleting your personal information within 30 days. However, certain information may be retained longer where required by law, for fraud prevention, or to resolve disputes. Anonymized transaction data may be retained indefinitely for analytical purposes.`,
        },
      ],
    },
    {
      id: 'your-rights',
      title: '6. Your Rights',
      content: [
        {
          subtitle: '6.1 Access and Correction',
          body: `You have the right to access the personal information we hold about you at any time through your account settings. If any information is inaccurate or incomplete, you can update it directly in the app or contact our support team to request corrections.`,
        },
        {
          subtitle: '6.2 Data Portability',
          body: `You can export your transaction history at any time in CSV or PDF format from the Transactions section of your account. This allows you to take your financial data with you if you choose to stop using RevPay.`,
        },
        {
          subtitle: '6.3 Account Deletion',
          body: `You have the right to request deletion of your account and associated personal data at any time through the account settings. We will process your request within 30 days, subject to our legal obligations to retain certain financial records.`,
        },
        {
          subtitle: '6.4 Opt-Out of Communications',
          body: `You can manage your notification preferences at any time through the app settings. You may opt out of non-essential communications while still receiving critical security and transaction notifications that are necessary for the operation of your account.`,
        },
      ],
    },
    {
      id: 'cookies',
      title: '7. Cookies and Tracking',
      content: [
        {
          subtitle: '7.1 How We Use Cookies',
          body: `RevPay uses cookies and similar tracking technologies to maintain your session after login, remember your preferences, analyze how you use our platform, and detect suspicious activity. Essential cookies required for the application to function cannot be disabled. Analytics cookies can be managed through your browser settings.`,
        },
      ],
    },
    {
      id: 'contact',
      title: '8. Contact Us',
      content: [
        {
          subtitle: 'Privacy Questions',
          body: `If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact our Privacy Team at privacy@revpay.com. We will respond to all legitimate requests within 30 days. For urgent security concerns, please use the in-app support channel.`,
        },
      ],
    },
  ];
}