// Database Types - Generated from Supabase Schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      admins: {
        Row: Admin;
        Insert: AdminInsert;
        Update: AdminUpdate;
      };
    };
  };
}

// User Types
export interface User {
  // Primary Key
  id: string;

  // Authentication
  email: string;
  email_verified: boolean;
  email_verified_at: string | null;
  password: string;
  phone: string | null;

  // Profile
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  username: string | null;
  date_of_birth: string | null;
  gender: string | null;
  avatar_url: string | null;

  // Address
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;

  // KYC & Verification
  kyc_status: 'pending' | 'submitted' | 'verified' | 'rejected';
  kyc_submitted_at: string | null;
  kyc_verified_at: string | null;
  kyc_rejection_reason: string | null;
  identity_document_type: string | null;
  identity_document_number: string | null;
  identity_document_expiry: string | null;
  proof_of_address_verified: boolean;
  selfie_verified: boolean;

  // Account Status
  account_status: 'active' | 'inactive' | 'suspended' | 'closed';
  account_tier: 'basic' | 'silver' | 'gold' | 'platinum' | 'premium';
  is_active: boolean;
  is_suspended: boolean;
  suspension_reason: string | null;
  suspended_at: string | null;
  suspended_until: string | null;

  // Security
  two_factor_enabled: boolean;
  two_factor_method: 'email' | 'sms' | 'authenticator' | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  login_attempts: number;
  locked_until: string | null;

  // Trading & Investment Preferences
  trading_experience: 'beginner' | 'intermediate' | 'advanced' | 'professional' | null;
  investment_experience: 'beginner' | 'intermediate' | 'advanced' | 'professional' | null;
  risk_tolerance: 'low' | 'moderate' | 'high' | 'very_high' | null;
  preferred_language: string;
  preferred_currency: string;
  timezone: string | null;

  // Financial Limits
  daily_withdrawal_limit: number | null;
  monthly_withdrawal_limit: number | null;
  daily_trade_limit: number | null;

  // Compliance
  source_of_funds: string | null;
  employment_status: string | null;
  occupation: string | null;
  annual_income_range: string | null;
  net_worth_range: string | null;
  politically_exposed: boolean;
  tax_country: string | null;
  tax_id_number: string | null;

  // Marketing & Notifications
  marketing_emails_enabled: boolean;
  trading_notifications_enabled: boolean;
  security_alerts_enabled: boolean;
  newsletter_subscribed: boolean;
  notifications: UserNotification[] | null;

  // Referral
  referral_code: string | null;
  referred_by_code: string | null;
  referral_earnings: number;

  // OTP Fields
  otp_code: string | null;
  otp_type: 'verify' | 'reset' | 'withdraw' | 'trade_confirm' | '2fa' | null;
  otp_expires_at: string | null;
  otp_attempts: number;
  otp_is_used: boolean;

  // Admin Mapping
  admin_id: string | null;

  // Metadata
  user_agent: string | null;
  registration_ip: string | null;
  notes: string | null;
  tags: string[] | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UserUpdate = Partial<UserInsert>;

// Admin Types
export interface Admin {
  id: string;
  email: string;
  password: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type AdminInsert = Omit<Admin, 'id' | 'created_at' | 'updated_at'>;
export type AdminUpdate = Partial<AdminInsert>;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Response Types
export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  account_tier: string | null;
  email_verified: boolean | null;
}

export interface AdminAuthUser {
  id: string;
  email: string;
  full_name: string | null;
}

export interface AuthResponse extends ApiResponse<AuthUser> {
  token?: string;
}

export interface AdminAuthResponse extends ApiResponse<AdminAuthUser> {
  token?: string;
}

// OTP Types
export interface OTPData {
  code: string;
  type: 'verify' | 'reset' | 'withdraw' | 'trade_confirm' | '2fa';
  expires_at: string;
}

// Notification Types
export interface UserNotification {
  id: string;
  type: 'transaction' | 'trade' | 'staking' | 'investment' | 'kyc' | 'security' | 'system' | 'announcement';
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
  metadata?: {
    transaction_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    [key: string]: any;
  };
}
