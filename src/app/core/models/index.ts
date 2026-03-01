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
export type TransactionType   = 'SEND' | 'RECEIVE' | 'TOPUP' | 'WITHDRAWAL' | 'LOAN_REPAYMENT';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';

export interface TransactionCounterparty {
  userId:   number;
  fullName: string;
  email:    string;
}

export interface Transaction {
  transactionId: number;   // API field name
  type:          TransactionType;
  status:        TransactionStatus;
  amount:        number;
  currency:      string;
  note?:         string;
  counterparty?: TransactionCounterparty;
  balanceAfter?: number;
  createdAt:     string;
  completedAt?:  string;
}

export interface TransactionPagination {
  currentPage:  number;
  pageSize:     number;
  totalRecords: number;
  totalPages:   number;
  hasNext:      boolean;
  hasPrevious:  boolean;
}

export interface TransactionListResponse {
  success:    boolean;
  data:       Transaction[];
  pagination: TransactionPagination;
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
  customer?: { name: string; email: string; address?: string };
  customerName?: string;
  customerEmail?: string;
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