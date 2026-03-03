import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent {
  lastUpdated = 'February 23, 2026';

  sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: [
        {
          subtitle: '1.1 Agreement to Terms',
          body: `By creating a RevPay account, accessing our web application, or using any of our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use RevPay. These terms constitute a legally binding agreement between you and RevPay.`,
        },
        {
          subtitle: '1.2 Changes to Terms',
          body: `RevPay reserves the right to modify these Terms of Service at any time. When we make material changes, we will notify you via email or an in-app notification at least 14 days before the changes take effect. Your continued use of RevPay after the effective date of updated terms constitutes acceptance of the new terms. If you disagree with the updated terms, you must close your account before the effective date.`,
        },
        {
          subtitle: '1.3 Eligibility',
          body: `You must be at least 18 years of age to use RevPay. By using our services, you represent and warrant that you are of legal age to form a binding contract and are not prohibited from using financial services under applicable law. Business accounts may only be registered by authorized representatives of the business entity.`,
        },
      ],
    },
    {
      id: 'account-registration',
      title: '2. Account Registration & Security',
      content: [
        {
          subtitle: '2.1 Account Creation',
          body: `To use RevPay, you must register for an account by providing accurate, current, and complete information. You agree to maintain and promptly update your account information to keep it accurate and current. Providing false information, creating accounts on behalf of others without authorization, or creating multiple accounts is strictly prohibited and may result in immediate account termination.`,
        },
        {
          subtitle: '2.2 Account Security Responsibilities',
          body: `You are solely responsible for maintaining the confidentiality of your account credentials, including your password, transaction PIN, and security question answers. You must immediately notify RevPay of any unauthorized use of your account or any other security breach. RevPay will never ask you for your password or PIN via email, phone, or chat. Any activity conducted through your account is your responsibility.`,
        },
        {
          subtitle: '2.3 Account Verification',
          body: `RevPay may require you to complete identity verification procedures at any time. For business accounts, you may be required to submit supporting documentation to verify your business identity and ownership. Failure to complete required verification may result in restrictions on your account functionality or account suspension.`,
        },
        {
          subtitle: '2.4 One Account Per User',
          body: `Each individual may only maintain one personal RevPay account. A business may maintain one business account per legal business entity. Duplicate accounts will be merged or terminated at RevPay's discretion. If you believe your account has been compromised, contact support immediately rather than creating a new account.`,
        },
      ],
    },
    {
      id: 'payment-services',
      title: '3. Payment Services',
      content: [
        {
          subtitle: '3.1 Wallet and Funds',
          body: `RevPay provides a digital wallet that allows you to store funds for use within the platform. Wallet funds are not bank deposits and are not insured by any government deposit protection scheme. The wallet is intended for transactional use — RevPay is not a savings or investment product. You may add funds to your wallet from linked payment cards and withdraw to your linked bank account.`,
        },
        {
          subtitle: '3.2 Money Transfers',
          body: `RevPay enables you to send and receive money to and from other RevPay users. All transfers are subject to availability of sufficient funds in your wallet. You are responsible for ensuring the accuracy of recipient details before authorizing a transfer. Once a transfer is completed, it generally cannot be reversed unless the recipient agrees to return the funds or fraud is confirmed.`,
        },
        {
          subtitle: '3.3 Transaction Limits',
          body: `RevPay may impose transaction limits on your account based on your account type, verification status, and transaction history. These limits exist to protect users and comply with financial regulations. Limits may be adjusted over time and will be communicated through the app. Attempting to circumvent transaction limits is a violation of these terms.`,
        },
        {
          subtitle: '3.4 Transaction Fees',
          body: `RevPay may charge fees for certain services. Any applicable fees will be clearly disclosed to you before you authorize a transaction. RevPay reserves the right to introduce new fees or change existing fees with 30 days prior notice. Continued use of the service after fee changes take effect constitutes acceptance of the new fee structure.`,
        },
        {
          subtitle: '3.5 Simulated Transactions',
          body: `During the development and testing phase of RevPay, certain transaction types including wallet top-ups from cards and withdrawals to bank accounts are simulated and do not involve actual movement of real funds. This will be clearly indicated within the application. RevPay is not responsible for any decisions made based on simulated transaction data.`,
        },
      ],
    },
    {
      id: 'business-accounts',
      title: '4. Business Account Terms',
      content: [
        {
          subtitle: '4.1 Business Eligibility',
          body: `Business accounts are available to legally registered business entities. By registering a business account, you warrant that the business is validly constituted under applicable law, you have authority to bind the business to these terms, and all business information provided is accurate and current. RevPay reserves the right to verify business legitimacy before activating full business account features.`,
        },
        {
          subtitle: '4.2 Invoicing',
          body: `Business users may use RevPay's invoicing features to create, send, and track invoices to customers. You are responsible for the accuracy of all invoice details including amounts, tax rates, and customer information. RevPay's invoicing tools are provided as a convenience and do not constitute accounting or legal advice. You remain responsible for compliance with all applicable tax and invoicing regulations in your jurisdiction.`,
        },
        {
          subtitle: '4.3 Business Loans',
          body: `RevPay may offer simulated business loan products to eligible business accounts. Loan applications, approval decisions, interest rates, and repayment terms provided through RevPay are for demonstration purposes during the platform's current development phase and do not constitute actual lending or credit agreements. No real funds are disbursed through the loan feature at this time.`,
        },
        {
          subtitle: '4.4 Analytics Data',
          body: `Business analytics, revenue reports, and customer transaction summaries provided through RevPay are based on data within the RevPay platform only and should not be used as the sole basis for business or financial decisions. RevPay makes no warranties regarding the completeness or accuracy of analytics data for external reporting or accounting purposes.`,
        },
      ],
    },
    {
      id: 'prohibited-uses',
      title: '5. Prohibited Uses',
      content: [
        {
          subtitle: '5.1 Illegal Activities',
          body: `You must not use RevPay for any illegal purpose including money laundering, fraud, financing terrorism, tax evasion, or any other activity that violates applicable local, national, or international law. RevPay cooperates fully with law enforcement and regulatory authorities and will report suspicious activity as required by law.`,
        },
        {
          subtitle: '5.2 Prohibited Transactions',
          body: `The following types of transactions are strictly prohibited on RevPay: purchases of illegal goods or services, gambling or lottery services where prohibited by law, transactions related to adult content platforms, pyramid schemes or multi-level marketing of a fraudulent nature, and any transactions intended to circumvent financial regulations. Violation may result in immediate account termination and reporting to relevant authorities.`,
        },
        {
          subtitle: '5.3 Platform Abuse',
          body: `You must not attempt to reverse-engineer, hack, or compromise the security of the RevPay platform, use automated scripts or bots to interact with the service, create fake accounts or impersonate other users, interfere with the proper functioning of the platform, or attempt to access data belonging to other users. Such activities will result in immediate account termination and may result in legal action.`,
        },
      ],
    },
    {
      id: 'limitation',
      title: '6. Limitation of Liability',
      content: [
        {
          subtitle: '6.1 Service Availability',
          body: `RevPay strives to maintain high availability of its platform but does not guarantee uninterrupted or error-free service. We may suspend or discontinue services temporarily for maintenance, upgrades, or circumstances beyond our reasonable control. RevPay is not liable for losses arising from service unavailability or interruption.`,
        },
        {
          subtitle: '6.2 Limitation of Damages',
          body: `To the maximum extent permitted by applicable law, RevPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to loss of profits, loss of data, or business interruption. RevPay's total liability for any claim arising from use of the service shall not exceed the total fees paid by you to RevPay in the three months preceding the claim.`,
        },
        {
          subtitle: '6.3 User Errors',
          body: `RevPay is not responsible for losses resulting from user error, including sending money to the wrong recipient, entering incorrect amounts, or disclosing account credentials to unauthorized parties. Always verify transaction details carefully before confirming. RevPay will make reasonable efforts to assist in recovery but cannot guarantee reversal of completed transactions.`,
        },
      ],
    },
    {
      id: 'termination',
      title: '7. Termination',
      content: [
        {
          subtitle: '7.1 Termination by You',
          body: `You may close your RevPay account at any time through the account settings. Upon account closure, any remaining wallet balance will be transferred to your linked bank account within 5–10 business days. You remain responsible for any outstanding obligations including pending transactions or loan repayments at the time of closure.`,
        },
        {
          subtitle: '7.2 Termination by RevPay',
          body: `RevPay reserves the right to suspend or terminate your account at any time without prior notice if you violate these Terms of Service, engage in fraudulent activity, pose a risk to other users or the platform, or if required to do so by law or regulation. In non-urgent cases, we will provide reasonable notice and opportunity to remedy the violation before termination.`,
        },
        {
          subtitle: '7.3 Effect of Termination',
          body: `Upon termination of your account, your right to access RevPay services ceases immediately. Sections of these Terms that by their nature should survive termination — including provisions relating to intellectual property, limitation of liability, and dispute resolution — will continue to apply after termination.`,
        },
      ],
    },
    {
      id: 'governing-law',
      title: '8. Governing Law & Disputes',
      content: [
        {
          subtitle: '8.1 Governing Law',
          body: `These Terms of Service are governed by and construed in accordance with applicable law. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in the jurisdiction where RevPay is registered. If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.`,
        },
        {
          subtitle: '8.2 Dispute Resolution',
          body: `Before initiating formal legal proceedings, you agree to contact RevPay's support team and allow 30 days for good-faith resolution of the dispute. RevPay is committed to resolving user concerns promptly and fairly. For unresolved disputes, both parties agree to attempt mediation before resorting to litigation.`,
        },
      ],
    },
    {
      id: 'contact-legal',
      title: '9. Contact Information',
      content: [
        {
          subtitle: 'Legal & Compliance',
          body: `For questions about these Terms of Service, legal notices, or compliance matters, please contact our Legal Team at legal@revpay.com. For general support and account issues, please use the in-app support feature. For privacy-related queries, refer to our Privacy Policy and contact privacy@revpay.com.`,
        },
      ],
    },
  ];
}