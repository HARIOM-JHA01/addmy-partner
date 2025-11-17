export interface Partner {
  id: string;
  name: string;
  tgid: string;
  username: string;
  email?: string;
  referralCode: string;
  referralUrl: string;
  userCredits: number;
  usedUserCredits: number;
  availableUserCredits: number;
  renewalCredits: number;
  usedRenewalCredits: number;
  availableRenewalCredits: number;
  isReferralActive: boolean;
  joinDate?: string;
  lastActive?: string;
}

export interface Package {
  _id: string;
  name: string;
  type: "USER_CREDITS" | "RENEWAL_CREDITS";
  credits: number;
  renewalMonths?: number;
  price: number;
  discount: number;
  finalPrice: number;
  description: string;
  status: number;
}

export interface Payment {
  _id: string;
  package: {
    _id: string;
    name: string;
    type: string;
    credits: number;
  };
  amount: number;
  credits: number;
  transactionId: string;
  walletAddress: string;
  status: number;
  paymentStatus: number;
  createdAt: string;
}

export interface PartnerUser {
  id: string;
  userId: string;
  username: string;
  name: string;
  tgid: string;
  joinDate: string;
  membershipExpiryDate: string;
  isExpired: boolean;
  daysUntilExpiry: number;
  renewalCount: number;
  lastRenewalDate?: string;
}

export interface UserDetail {
  id: string;
  user: {
    id: string;
    username: string;
    nameEnglish: string;
    nameChinese: string;
    tgid: string;
    email?: string;
    contact?: string;
  };
  joinDate: string;
  membershipExpiryDate: string;
  isExpired: boolean;
  daysUntilExpiry: number;
  renewalCount: number;
  lastRenewalDate?: string;
  lastRenewalBy?: string;
}

export interface RenewalPrice {
  _id: string;
  membershipMonths: number;
  creditCost: number;
  description: string;
  status: number;
}

export interface DashboardStats {
  credits: {
    userCredits: number;
    usedUserCredits: number;
    availableUserCredits: number;
    renewalCredits: number;
    usedRenewalCredits: number;
    availableRenewalCredits: number;
  };
  referral: {
    referralCode: string;
    referralUrl: string;
    isActive: boolean;
  };
  users: {
    total: number;
    active: number;
    expired: number;
    joinedThisMonth: number;
  };
  renewals: {
    total: number;
  };
  payments: {
    pending: number;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
