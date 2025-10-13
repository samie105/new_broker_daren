'use server';

import { cookies } from 'next/headers';
import { supabase } from '../db/supabase';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetConfirmation } from '../email/nodemailer';
import { ApiResponse, AuthResponse, User } from '../types/database';

// Cookie configuration
const COOKIE_NAME = 'auth_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Helper: Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Set auth cookie
async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

// Helper: Get current user from cookie
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(COOKIE_NAME)?.value;

    if (!userId) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return data as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// SIGNUP ACTION
export async function signupAction(formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}): Promise<AuthResponse> {
  try {
    const { email, password, firstName, lastName, username } = formData;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered',
      };
    }

    // Check if username is taken (if provided)
    if (username) {
      const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUsername) {
        return {
          success: false,
          error: 'Username already taken',
        };
      }
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Generate referral code
    const referralCode = `${username?.toUpperCase() || firstName.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

    // Create user with all required fields and defaults
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      // @ts-ignore - Some fields may not be in generated types yet
      .insert({
        // Authentication
        email,
        password, // Plain text as requested
        email_verified: false,
        email_verified_at: null,
        phone: null,
        
        // Profile
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        username: username || null,
        date_of_birth: null,
        gender: null,
        avatar_url: null,
        
        // Address
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        postal_code: null,
        country: null,
        
        // KYC & Verification
        kyc_status: 'pending',
        kyc_submitted_at: null,
        kyc_verified_at: null,
        kyc_rejection_reason: null,
        identity_document_type: null,
        identity_document_number: null,
        identity_document_expiry: null,
        proof_of_address_verified: false,
        selfie_verified: false,
        
        // Account Status
        account_status: 'active',
        account_tier: 'basic',
        is_active: true,
        is_suspended: false,
        suspension_reason: null,
        suspended_at: null,
        suspended_until: null,
        
        // Security
        two_factor_enabled: false,
        two_factor_method: null,
        last_login_at: null,
        last_login_ip: null,
        login_attempts: 0,
        locked_until: null,
        
        // Trading & Investment Preferences
        trading_experience: null,
        investment_experience: null,
        risk_tolerance: null,
        preferred_language: 'en',
        preferred_currency: 'USD',
        timezone: null,
        
        // Financial Limits
        daily_withdrawal_limit: null,
        monthly_withdrawal_limit: null,
        daily_trade_limit: null,
        
        // Compliance
        source_of_funds: null,
        employment_status: null,
        occupation: null,
        annual_income_range: null,
        net_worth_range: null,
        politically_exposed: false,
        tax_country: null,
        tax_id_number: null,
        
        // Marketing & Notifications
        marketing_emails_enabled: true,
        trading_notifications_enabled: true,
        security_alerts_enabled: true,
        newsletter_subscribed: true,
        notifications: [],
        
        // Referral
        referral_code: referralCode,
        referred_by_code: null,
        referral_earnings: 0,
        
        // OTP Fields
        otp_code: otpCode,
        otp_type: 'verify',
        otp_expires_at: otpExpiresAt,
        otp_attempts: 0,
        otp_is_used: false,
        
        // Admin Mapping
        admin_id: null,
        
        // Metadata
        user_agent: null,
        registration_ip: null,
        notes: null,
        tags: null,
      })
      .select('id, email, username, full_name, avatar_url, account_tier, email_verified')
      .single();

    if (insertError || !newUser) {
      console.error('Insert error:', insertError);
      return {
        success: false,
        error: insertError?.message || 'Failed to create account',
      };
    }

    // Send welcome notification
    try {
      const { addNotificationAction } = await import('./notifications');
      await addNotificationAction((newUser as any).id, {
        type: 'announcement',
        title: '🎉 Welcome to CryptoVault!',
        message: `Hi ${firstName}! Welcome to CryptoVault. We're excited to have you on board. Start by verifying your email and exploring our features.`,
        icon: '👋',
        action_url: '/dashboard',
        metadata: {
          welcome_bonus: 'available',
          signup_date: new Date().toISOString(),
        },
      });
    } catch (notifError) {
      console.error('Failed to send welcome notification:', notifError);
      // Don't fail signup if notification fails
    }

    // Send OTP email
    await sendOTPEmail(email, otpCode, 'verify');

    return {
      success: true,
      message: 'Account created! Please check your email for verification code.',
      data: newUser,
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during signup',
    };
  }
}

// LOGIN ACTION
export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const { email, password } = formData;

    console.log('🔐 LOGIN ATTEMPT:', {
      email,
      passwordLength: password?.length,
      timestamp: new Date().toISOString(),
    });

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('📊 DATABASE QUERY RESULT:', {
      userFound: !!user,
      hasError: !!error,
      errorMessage: error?.message,
      userId: user ? (user as any).id : null,
    });

    if (error || !user) {
      console.log('❌ USER NOT FOUND:', { email, error: error?.message });
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Check password (plain text comparison as requested)
    const dbPassword = (user as any).password;
    const passwordMatch = dbPassword === password;

    console.log('🔑 PASSWORD CHECK:', {
      providedPasswordLength: password.length,
      dbPasswordLength: dbPassword?.length,
      passwordMatch,
      // NEVER log actual passwords in production!
      providedPassword: password,
      dbPassword: dbPassword,
    });

    if (!passwordMatch) {
      console.log('❌ PASSWORD MISMATCH');
      // Increment login attempts
      await supabase
        .from('users')
        .update({ login_attempts: (user as any).login_attempts + 1 } as any as never)
        .eq('id', (user as any).id);

      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    console.log('✅ PASSWORD MATCHED');

    // Check if account is suspended
    if ((user as any).is_suspended) {
      console.log('❌ ACCOUNT SUSPENDED');
      return {
        success: false,
        error: 'Your account has been suspended. Please contact support.',
      };
    }

    // Check if account is locked
    if ((user as any).locked_until && new Date((user as any).locked_until) > new Date()) {
      console.log('❌ ACCOUNT LOCKED');
      return {
        success: false,
        error: 'Your account is temporarily locked. Please try again later.',
      };
    }

    console.log('📝 UPDATING LAST LOGIN...');
    // Update last login
    await supabase
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
        login_attempts: 0, // Reset attempts on successful login
      } as any as never)
      .eq('id', (user as any).id);

    console.log('🍪 SETTING AUTH COOKIE...');
    // Set auth cookie
    await setAuthCookie((user as any).id);

    console.log('✅ LOGIN SUCCESSFUL:', {
      userId: (user as any).id,
      email: (user as any).email,
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        id: (user as any).id,
        email: (user as any).email,
        username: (user as any).username,
        full_name: (user as any).full_name,
        avatar_url: (user as any).avatar_url,
        account_tier: (user as any).account_tier,
        email_verified: (user as any).email_verified,
      },
    };
  } catch (error: any) {
    console.error('💥 LOGIN ERROR:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during login',
    };
  }
}

// LOGOUT ACTION
export async function logoutAction(): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Logout failed',
    };
  }
}

// VERIFY EMAIL ACTION
export async function verifyEmailAction(otp: string): Promise<AuthResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'User not found. Please login.',
      };
    }

    // Check if already verified
    if (user.email_verified) {
      return {
        success: false,
        error: 'Email already verified',
      };
    }

    // Check OTP
    if (!(user as any).otp_code || (user as any).otp_code !== otp) {
      // Increment attempts
      await supabase
        .from('users')
        .update({ otp_attempts: (user as any).otp_attempts + 1 } as any as never)
        .eq('id', (user as any).id);

      return {
        success: false,
        error: 'Invalid verification code',
      };
    }

    // Check if OTP is expired
    if ((user as any).otp_expires_at && new Date((user as any).otp_expires_at) < new Date()) {
      return {
        success: false,
        error: 'Verification code has expired. Please request a new one.',
      };
    }

    // Check if OTP is already used
    if ((user as any).otp_is_used) {
      return {
        success: false,
        error: 'Verification code has already been used',
      };
    }

    // Verify email
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        otp_is_used: true,
      } as any as never)
      .eq('id', (user as any).id)
      .select('id, email, username, full_name, avatar_url, account_tier, email_verified')
      .single();

    if (error || !updatedUser) {
      return {
        success: false,
        error: 'Failed to verify email',
      };
    }

    // Send welcome email
    await sendWelcomeEmail((user as any).email, (user as any).full_name || 'User');

    return {
      success: true,
      message: 'Email verified successfully!',
      data: updatedUser,
    };
  } catch (error: any) {
    console.error('Verify email error:', error);
    return {
      success: false,
      error: error.message || 'Verification failed',
    };
  }
}

// FORGOT PASSWORD ACTION
export async function forgotPasswordAction(email: string): Promise<ApiResponse> {
  try {
    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: 'If the email exists, a reset code has been sent.',
      };
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Update user with OTP
    await supabase
      .from('users')
      .update({
        otp_code: otpCode,
        otp_type: 'reset',
        otp_expires_at: otpExpiresAt,
        otp_attempts: 0,
        otp_is_used: false,
      } as any as never)
      .eq('id', (user as any).id);

    // Send OTP email
    await sendOTPEmail(email, otpCode, 'reset');

    return {
      success: true,
      message: 'If the email exists, a reset code has been sent.',
    };
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process request',
    };
  }
}

// RESET PASSWORD ACTION
export async function resetPasswordAction(formData: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<ApiResponse> {
  try {
    const { email, otp, newPassword } = formData;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return {
        success: false,
        error: 'Invalid request',
      };
    }

    // Check OTP
    if (!(user as any).otp_code || (user as any).otp_code !== otp) {
      // Increment attempts
      await supabase
        .from('users')
        .update({ otp_attempts: (user as any).otp_attempts + 1 } as any as never)
        .eq('id', (user as any).id);

      return {
        success: false,
        error: 'Invalid verification code',
      };
    }

    // Check if OTP is expired
    if ((user as any).otp_expires_at && new Date((user as any).otp_expires_at) < new Date()) {
      return {
        success: false,
        error: 'Verification code has expired',
      };
    }

    // Check if OTP is already used
    if ((user as any).otp_is_used) {
      return {
        success: false,
        error: 'Verification code has already been used',
      };
    }

    // Check if OTP type is correct
    if ((user as any).otp_type !== 'reset') {
      return {
        success: false,
        error: 'Invalid verification code',
      };
    }

    // Update password
    await supabase
      .from('users')
      .update({
        password: newPassword, // Plain text as requested
        otp_is_used: true,
      } as any as never)
      .eq('id', (user as any).id);

    // Send confirmation email
    await sendPasswordResetConfirmation(email, (user as any).full_name || 'User');

    return {
      success: true,
      message: 'Password reset successfully! You can now login with your new password.',
    };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: error.message || 'Failed to reset password',
    };
  }
}

// RESEND VERIFICATION CODE
export async function resendVerificationCodeAction(): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'User not found. Please login.',
      };
    }

    if ((user as any).email_verified) {
      return {
        success: false,
        error: 'Email already verified',
      };
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Update user
    await supabase
      .from('users')
      .update({
        otp_code: otpCode,
        otp_type: 'verify',
        otp_expires_at: otpExpiresAt,
        otp_attempts: 0,
        otp_is_used: false,
      } as any as never)
      .eq('id', (user as any).id);

    // Send OTP email
    await sendOTPEmail((user as any).email, otpCode, 'verify');

    return {
      success: true,
      message: 'Verification code sent!',
    };
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send verification code',
    };
  }
}
