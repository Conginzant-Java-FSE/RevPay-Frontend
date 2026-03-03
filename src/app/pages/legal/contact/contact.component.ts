import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TeamMember {
  name:    string;
  role:    string;
  initials: string;
  color:   string;   // gradient accent for avatar
  email?:  string;
  linkedin?: string;
}

interface FaqItem {
  question: string;
  answer:   string;
  open:     boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {

  team: TeamMember[] = [
    {
      name:     'Midhun V S',
      role:     'Full Stack Developer',
      initials: 'M',
      color:    'linear-gradient(135deg, #4f8ef7, #7c3aed)',
      email:    'midhun21@zohomail.in',
    },
    {
      name:     'Manoj S',
      role:     'Full Stack Developer',
      initials: 'MS',
      color:    'linear-gradient(135deg, #22c55e, #16a34a)',
      email:    'manojmanoj76004@gmail.com',
    },
    {
      name:     'Likhith M',
      role:     'Full Stack Developer',
      initials: 'L',
      color:    'linear-gradient(135deg, #f59e0b, #d97706)',
      email:    'likhithmandem@gmail.com',
    },
    {
      name:     'Ramesh P',
      role:     'Full Stack Developer',
      initials: 'R',
      color:    'linear-gradient(135deg, #a855f7, #7c3aed)',
      email:    'rameshrunvin21@gmail.com',
    },
    {
      name:     'Kartheek C',
      role:     'Full Stack Developer',
      initials: 'K',
      color:    'linear-gradient(135deg, #06b6d4, #0284c7)',
      email:    'kartheekchintu@gmail.com',
    },
  ];

  channels = [
    {
      icon:  '📧',
      title: 'Email Support',
      desc:  'For account or transaction issues',
      value: 'support@revpay.in',
      link:  'mailto:support@revpay.in',
      label: 'Send an email',
      color: '#4f8ef7',
    },
    {
      icon:  '🔒',
      title: 'Security',
      desc:  'Report vulnerabilities or suspicious activity',
      value: 'security@revpay.in',
      link:  'mailto:security@revpay.in',
      label: 'Contact security team',
      color: '#22c55e',
    },
    {
      icon:  '🏢',
      title: 'Business Enquiries',
      desc:  'Partnerships and enterprise solutions',
      value: 'business@revpay.in',
      link:  'mailto:business@revpay.in',
      label: 'Get in touch',
      color: '#a855f7',
    },
    {
      icon:  '📞',
      title: 'Phone Support',
      desc:  'Available Mon–Fri, 9 AM – 6 PM IST',
      value: '+91 8903909217',
      link:  'tel:+918903909217',
      label: 'Call us',
      color: '#f59e0b',
    },
  ];

  faqs: FaqItem[] = [
    {
      question: 'How long does it take to get a response?',
      answer:   'We typically respond to email support requests within 24 business hours. For urgent security issues, our team is available around the clock.',
      open: false,
    },
    {
      question: 'My transaction failed but money was deducted. What do I do?',
      answer:   'Failed transaction amounts are automatically refunded within 3–5 business days. If you don\'t see the refund after 5 days, email support@revpay.in with your transaction ID.',
      open: false,
    },
    {
      question: 'How do I report a suspicious activity on my account?',
      answer:   'Immediately change your password and transaction PIN from Settings, then email security@revpay.in with details. We\'ll investigate within 2 hours.',
      open: false,
    },
    {
      question: 'Can I integrate RevPay into my business platform?',
      answer:   'Yes! We offer API access for business accounts. Reach out at business@revpay.in with your use-case and we\'ll schedule a technical discussion.',
      open: false,
    },
  ];

  currentYear = new Date().getFullYear();

  toggleFaq(item: FaqItem): void {
    item.open = !item.open;
  }
}
