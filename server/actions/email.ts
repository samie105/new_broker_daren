'use server';

import {
  sendOTPEmail as _sendOTPEmail,
  sendWelcomeEmail as _sendWelcomeEmail,
  sendPasswordResetConfirmation as _sendPasswordResetConfirmation,
  sendWithdrawalNotification as _sendWithdrawalNotification,
  verifyEmailConfig as _verifyEmailConfig,
} from '../email/nodemailer';

import type { ApiResponse } from '../types/database';

export async function sendOTPEmail(to: string, otp: string, type: string): Promise<ApiResponse> {
  const res = await _sendOTPEmail(to, otp, type);
  return res.success
    ? { success: true, message: 'OTP email sent' }
    : { success: false, error: res.error || 'Failed to send OTP email' };
}

export async function sendWelcomeEmail(to: string, name: string): Promise<ApiResponse> {
  const res = await _sendWelcomeEmail(to, name);
  return res.success
    ? { success: true, message: 'Welcome email sent' }
    : { success: false, error: res.error || 'Failed to send welcome email' };
}

export async function sendPasswordResetConfirmation(to: string, name: string): Promise<ApiResponse> {
  const res = await _sendPasswordResetConfirmation(to, name);
  return res.success
    ? { success: true, message: 'Password reset email sent' }
    : { success: false, error: res.error || 'Failed to send password reset email' };
}

export async function sendWithdrawalNotification(
  to: string,
  amount: string,
  asset: string,
  address: string
): Promise<ApiResponse> {
  const res = await _sendWithdrawalNotification(to, amount, asset, address);
  return res.success
    ? { success: true, message: 'Withdrawal notification sent' }
    : { success: false, error: res.error || 'Failed to send withdrawal notification' };
}

export async function verifyEmailConfigAction(): Promise<ApiResponse> {
  const ok = await _verifyEmailConfig();
  return ok
    ? { success: true, message: 'Email server ready' }
    : { success: false, error: 'Email server configuration error' };
}
