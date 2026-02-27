export type AccountType = 'PERSONAL' | 'BUSINESS';

export interface BankAccountSummary {
  bankName: string;
  accountNumber: string;
  accountType?: string;
}

export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  accountType: 'PERSONAL' | 'BUSINESS';
  walletBalance: number;
  currency: string;
  profileComplete: boolean;
  // personal only
  dob?: string;
  address?: string;
  // business only
  businessName?: string;
  businessType?: 'SOLE_PROPRIETOR' | 'LLC' | 'CORPORATION' | 'PARTNERSHIP' | 'NON_PROFIT';
  taxId?: string;
  businessAddress?: string;
  businessStatus?: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  contactPhone?: string;
  website?: string;
  // linked bank
  bankAccount?: BankAccountSummary;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PersonalProfileRequest {
  username?: string;
  dob: string;
  address: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'SAVINGS' | 'CHECKING';
  isPrimary: boolean;
}

export interface BusinessProfileRequest {
  username?: string;
  dob?: string;
  address: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'SAVINGS' | 'CHECKING';
  isPrimary: boolean;
  businessName: string;
  businessType: 'SOLE_PROPRIETOR' | 'LLC' | 'CORPORATION' | 'PARTNERSHIP' | 'NON_PROFIT';
  taxId: string;
  contactPhone: string;
  website?: string;
}
