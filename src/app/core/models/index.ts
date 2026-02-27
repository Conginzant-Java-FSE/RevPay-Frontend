// ── API wrapper ───────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PagedResponse<T> {
  success: boolean;
  message: string;
  data?: {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page (0-indexed)
  };
}

// ── User / Profile ────────────────────────────────────────────
// export interface BankAccount {
//   accountId: number;
//   accountHolderName: string;
//   accountNumber: string;      // masked: ****4291
//   bankName: string;
//   ifscCode: string;
//   isPrimary: boolean;
//   status: 'ACTIVE' | 'INACTIVE';
// }

// export interface UserProfile {
//   userId: number;
//   fullName: string;
//   email: string;
//   phone: string;
//   accountType: 'PERSONAL' | 'BUSINESS';
//   walletBalance: number;
//   currency: string;
//   profileComplete: boolean;
//   // personal only
//   dob?: string;
//   address?: string;
//   // business only
//   businessName?: string;
//   businessType?: 'SOLE_PROPRIETOR' | 'LLC' | 'CORPORATION' | 'PARTNERSHIP' | 'NON_PROFIT';
//   taxId?: string;
//   businessAddress?: string;
//   businessStatus?: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
//   contactPhone?: string;
//   website?: string;
//   // linked bank
//   bankAccount?: BankAccount;
// }

// ── Wallet ────────────────────────────────────────────────────
export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

// ── Payment Method (Card) ─────────────────────────────────────
export interface PaymentCard {
  cardId: number;
  nickname: string;
  cardType: 'VISA' | 'MASTERCARD' | 'AMEX' | 'RUPAY' | 'OTHER';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  billingAddress: string;
}

// ── Transaction ───────────────────────────────────────────────
export type TransactionType = 'SENT' | 'RECEIVED' | 'TOPUP' | 'WITHDRAWAL' | 'LOAN_REPAYMENT';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';

export interface Transaction {
  transactionId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  note?: string;
  counterparty?: {
    name: string;
    email: string;
  };
  balanceAfter: number;
  createdAt: string;
  completedAt?: string;
  moneyRequestId?: number;
}

export interface TransactionFilters {
  page?: number;
  size?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  from?: string;
  to?: string;
  search?: string;
}

// ── Money Request ─────────────────────────────────────────────
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED';

export interface MoneyRequest {
  requestId: number;
  from?: { name: string; email: string };   // incoming
  to?: { name: string; email: string };     // outgoing
  amount: number;
  purpose: string;
  status: RequestStatus;
  createdAt: string;
  expiresAt?: string;
}

// ── Notification ──────────────────────────────────────────────
export type NotificationType =
  | 'TRANSACTION'
  | 'MONEY_REQUEST'
  | 'CARD_CHANGE'
  | 'LOW_BALANCE'
  | 'SECURITY'
  | 'INVOICE'
  | 'LOAN';

export interface Notification {
  notificationId: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ── Invoice (Business) ────────────────────────────────────────
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceLineItem {
  lineItemId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;   // e.g. 18 for 18%
  lineTotal?: number;
}

export interface Invoice {
  id: number;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  lineItems: InvoiceLineItem[];
  paymentTerms?: 'NET_7' | 'NET_15' | 'NET_30' | 'NET_60';
  dueDate: string;
  status: InvoiceStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummary {
  totalPaid: number;
  totalUnpaid: number;
  totalOverdue: number;
  countPaid: number;
  countUnpaid: number;
  countOverdue: number;
}

// ── Loan (Business) ───────────────────────────────────────────
export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'CLOSED';

export interface Loan {
  loanId: number;
  status: LoanStatus;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayable: number;
  amountRepaid: number;
  outstandingBalance: number;
  purpose: string;
  nextDueDate?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface RepaymentSchedule {
  installmentNo: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

// ── Analytics (Business) ─────────────────────────────────────
export interface AnalyticsSummary {
  totalReceived: number;
  totalSent: number;
  pendingIncoming: number;
  pendingOutgoing: number;
  netFlow: number;
}

export interface RevenuePoint {
  period: string;
  revenue: number;
  transactionCount: number;
}

export interface TopCustomer {
  rank: number;
  customer: { name: string; email: string };
  totalVolume: number;
  transactionCount: number;
}

export interface PaymentTrend {
  date: string;
  incoming: number;
  outgoing: number;
}

export { UserProfile, BankAccountSummary } from './user.model';