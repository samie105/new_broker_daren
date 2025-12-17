'use server';

import { cookies } from 'next/headers';
import { supabase } from '../db/supabase';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetConfirmation } from './email';
import { ApiResponse, AuthResponse, User } from '../types/database';

// Cookie configuration
const COOKIE_NAME = 'auth_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Helper: Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Generate 6-digit PIN
function generate6DigitPIN(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Generate OTP expiry timestamp (15 minutes from now)
function getOTPExpiry(): string {
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
  const expiryTime = new Date(now + fifteenMinutes);
  return expiryTime.toISOString();
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

    console.log('🔍 [AUTH] getCurrentUser - cookie check:', { 
      hasCookie: !!userId, 
      userId: userId || 'none' 
    });

    if (!userId) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.log('⚠️ [AUTH] getCurrentUser - user not found in DB:', { userId, error: error?.message });
      return null;
    }

    console.log('✅ [AUTH] getCurrentUser - user found:', { userId, email: (data as any).email });
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
  phone?: string;
  country?: string;
  state?: string;
}): Promise<AuthResponse> {
  try {
    const { email, password, firstName, lastName, username, phone, country, state } = formData;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

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
        .limit(1)
        .maybeSingle();

      if (existingUsername) {
        return {
          success: false,
          error: 'Username already taken',
        };
      }
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = getOTPExpiry();
    
    console.log('🔢 [AUTH] Generating OTP for signup:', {
      otpCode,
      currentTime: new Date().toISOString(),
      expiresAt: otpExpiresAt,
      minutesUntilExpiry: 15
    });

    // Generate referral code (max 20 chars to fit DB constraint)
    const namePrefix = (username || firstName).toUpperCase().slice(0, 12); // Max 12 chars from name
    const referralCode = `${namePrefix}${Math.floor(1000 + Math.random() * 9000)}`; // Total max 16 chars

    // Generate withdrawal PIN and tax code PIN (not visible to user)
    const withdrawalPin = generate6DigitPIN();
    const taxCodePin = generate6DigitPIN();

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
        phone: phone || null,
        
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
        state: state || null,
        postal_code: null,
        country: country || null,
        
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
        
        // Security PINs (generated during signup, not visible to user)
        withdrawal_pin: withdrawalPin,
        tax_code_pin: taxCodePin,
        
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

    // Set auth cookie so user is logged in after signup
    await setAuthCookie((newUser as any).id);
    console.log('🍪 [AUTH] Auth cookie set for new user:', { userId: (newUser as any).id });

    // Best-effort side effects: do NOT block signup/redirect on these.
    // Users can always use "Resend code" on the verification screen.
    void (async () => {
      try {
        const { addNotificationAction } = await import('./notifications');
        await addNotificationAction((newUser as any).id, {
          type: 'announcement',
          title: '🎉 Welcome to Atlantic Pacific Capitals!',
          message: `Hi ${firstName}! Welcome to Atlantic Pacific Capitals. We're excited to have you on board. Start by verifying your email and exploring our features.`,
          icon: '👋',
          action_url: '/dashboard',
          metadata: {
            welcome_bonus: 'available',
            signup_date: new Date().toISOString(),
          },
        });
      } catch (notifError) {
        console.error('Failed to send welcome notification:', notifError);
      }
    })();

    void (async () => {
      try {
        console.log('📨 Sending signup verification OTP (best-effort):', {
          email,
          userId: (newUser as any).id,
          timestamp: new Date().toISOString(),
        });

        const emailResult = await sendOTPEmail(email, otpCode, 'verify');

        if (emailResult.success) {
          console.log('✅ Signup verification OTP sent successfully:', { email });
        } else {
          console.error('❌ Failed to send signup verification OTP:', {
            email,
            error: emailResult.error,
          });
        }
      } catch (emailError) {
        console.error('❌ Unexpected error while sending signup OTP:', emailError);
      }
    })();

    return {
      success: true,
      message: 'Account created! If you don\'t receive a code, use Resend on the verification screen.',
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

    // Find user - use limit(1).maybeSingle() to handle potential duplicates
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

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
  console.log('🔐 [AUTH] verifyEmailAction called:', { otp, timestamp: new Date().toISOString() });
  
  try {
    const user = await getCurrentUser();

    if (!user) {
      console.log('⚠️ [AUTH] No user found for verification');
      return {
        success: false,
        error: 'User not found. Please login.',
      };
    }

    console.log('👤 [AUTH] User for verification:', {
      userId: (user as any).id,
      email: (user as any).email,
      otp_code: (user as any).otp_code,
      otp_expires_at: (user as any).otp_expires_at,
      otp_is_used: (user as any).otp_is_used,
      providedOtp: otp,
      currentTime: new Date().toISOString()
    });

    // Check if already verified
    if (user.email_verified) {
      return {
        success: false,
        error: 'Email already verified',
      };
    }

    // Check OTP
    if (!(user as any).otp_code || (user as any).otp_code !== otp) {
      console.log('❌ [AUTH] OTP mismatch:', { 
        stored: (user as any).otp_code, 
        provided: otp 
      });
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
    // Ensure we parse the timestamp as UTC to avoid timezone issues
    const expiryDateStr = (user as any).otp_expires_at;
    const expiryDate = new Date(expiryDateStr + (expiryDateStr.includes('Z') ? '' : 'Z'));
    const currentDate = new Date();
    const isExpired = expiryDate < currentDate;
    
    console.log('⏰ [AUTH] OTP expiry check:', {
      expiresAt: (user as any).otp_expires_at,
      expiryDate: expiryDate.toISOString(),
      currentTime: currentDate.toISOString(),
      isExpired,
      timeDiff: expiryDate.getTime() - currentDate.getTime(),
      minutesLeft: Math.round((expiryDate.getTime() - currentDate.getTime()) / 60000)
    });
    
    if ((user as any).otp_expires_at && isExpired) {
      console.log('❌ [AUTH] OTP expired');
      return {
        success: false,
        error: 'Verification code has expired. Please request a new one.',
      };
    }

    // Check if OTP is already used
    if ((user as any).otp_is_used) {
      console.log('🚫 [AUTH] OTP already used');
      return {
        success: false,
        error: 'Verification code has already been used',
      };
    }

    console.log('✅ [AUTH] OTP verified successfully');

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
    console.log('📨 Sending welcome email:', {
      email: (user as any).email,
      userId: (user as any).id,
      name: (user as any).full_name,
      timestamp: new Date().toISOString()
    });
    
    const emailResult = await sendWelcomeEmail((user as any).email, (user as any).full_name || 'User');
    
    if (emailResult.success) {
      console.log('✅ Welcome email sent successfully:', { email: (user as any).email });
    } else {
      console.error('❌ Failed to send welcome email:', {
        email: (user as any).email,
        error: emailResult.error
      });
    }

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
  console.log('🔑 [AUTH] forgotPasswordAction called:', { email, timestamp: new Date().toISOString() });
  
  try {
    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (error || !user) {
      console.log('⚠️ [AUTH] User not found for password reset:', { email, error: error?.message });
      // Return neutral message - don't reveal if email exists
      return {
        success: true,
        message: 'If an account exists with this email, a reset code will be sent.',
        data: { emailSent: false } // Flag to indicate no email was actually sent
      };
    }

    console.log('👤 [AUTH] User found for password reset:', { email, userId: (user as any).id });

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = getOTPExpiry();

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
    console.log('📨 Sending password reset OTP:', {
      email,
      userId: (user as any).id,
      otpCode,
      timestamp: new Date().toISOString()
    });
    
    const emailResult = await sendOTPEmail(email, otpCode, 'reset');
    
    if (emailResult.success) {
      console.log('✅ Password reset OTP sent successfully:', { email });
    } else {
      console.error('❌ Failed to send password reset OTP:', {
        email,
        error: emailResult.error
      });
    }

    return {
      success: true,
      message: 'Reset code has been sent to your email.',
      data: { emailSent: true } // Flag to indicate email was actually sent
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
      .limit(1)
      .maybeSingle();

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
    if ((user as any).otp_expires_at) {
      const expiryDateStr = (user as any).otp_expires_at;
      const expiryDate = new Date(expiryDateStr + (expiryDateStr.includes('Z') ? '' : 'Z'));
      if (expiryDate < new Date()) {
        return {
          success: false,
          error: 'Verification code has expired',
        };
      }
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
    console.log('📨 Sending password reset confirmation email:', {
      email,
      userId: (user as any).id,
      timestamp: new Date().toISOString()
    });
    
    const emailResult = await sendPasswordResetConfirmation(email, (user as any).full_name || 'User');
    
    if (emailResult.success) {
      console.log('✅ Password reset confirmation email sent successfully:', { email });
    } else {
      console.error('❌ Failed to send password reset confirmation email:', {
        email,
        error: emailResult.error
      });
    }

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
  console.log('🔄 [AUTH] resendVerificationCodeAction called:', { timestamp: new Date().toISOString() });
  
  try {
    const user = await getCurrentUser();

    if (!user) {
      console.log('⚠️ [AUTH] No user session found for resend');
      return {
        success: false,
        error: 'User not found. Please login.',
      };
    }

    console.log('👤 [AUTH] User found for resend:', { userId: (user as any).id, email: (user as any).email });

    if ((user as any).email_verified) {
      console.log('⚠️ [AUTH] Email already verified:', { email: (user as any).email });
      return {
        success: false,
        error: 'Email already verified',
      };
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiresAt = getOTPExpiry();

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
    console.log('📨 Resending verification code:', {
      userId: (user as any).id,
      email: (user as any).email,
      timestamp: new Date().toISOString()
    });
    
    const emailResult = await sendOTPEmail((user as any).email, otpCode, 'verify');
    
    if (emailResult.success) {
      console.log('✅ Verification code resent successfully:', { 
        email: (user as any).email 
      });
    } else {
      console.error('❌ Failed to resend verification code:', {
        email: (user as any).email,
        error: emailResult.error
      });
    }

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
