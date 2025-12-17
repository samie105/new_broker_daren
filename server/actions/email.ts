'use server';

import {
  sendOTPEmail as _sendOTPEmail,
  sendWelcomeEmail as _sendWelcomeEmail,
  sendPasswordResetConfirmation as _sendPasswordResetConfirmation,
  sendWithdrawalNotification as _sendWithdrawalNotification,
  verifyEmailConfig as _verifyEmailConfig,
} from '../email/nodemailer';

import type { ApiResponse } from '../types/database';

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

const EMAIL_TIMEOUT_MS = 8_000;

export async function sendOTPEmail(to: string, otp: string, type: string): Promise<ApiResponse> {
  try {
    const res = await withTimeout(_sendOTPEmail(to, otp, type), EMAIL_TIMEOUT_MS, 'sendOTPEmail');
    return res.success
      ? { success: true, message: 'OTP email sent' }
      : { success: false, error: res.error || 'Failed to send OTP email' };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send OTP email',
    };
  }
}

export async function sendWelcomeEmail(to: string, name: string): Promise<ApiResponse> {
  try {
    const res = await withTimeout(_sendWelcomeEmail(to, name), EMAIL_TIMEOUT_MS, 'sendWelcomeEmail');
    return res.success
      ? { success: true, message: 'Welcome email sent' }
      : { success: false, error: res.error || 'Failed to send welcome email' };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send welcome email',
    };
  }
}

export async function sendPasswordResetConfirmation(to: string, name: string): Promise<ApiResponse> {
  try {
    const res = await withTimeout(
      _sendPasswordResetConfirmation(to, name),
      EMAIL_TIMEOUT_MS,
      'sendPasswordResetConfirmation'
    );
    return res.success
      ? { success: true, message: 'Password reset email sent' }
      : { success: false, error: res.error || 'Failed to send password reset email' };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send password reset email',
    };
  }
}

export async function sendWithdrawalNotification(
  to: string,
  amount: string,
  asset: string,
  address: string
): Promise<ApiResponse> {
  try {
    const res = await withTimeout(
      _sendWithdrawalNotification(to, amount, asset, address),
      EMAIL_TIMEOUT_MS,
      'sendWithdrawalNotification'
    );
    return res.success
      ? { success: true, message: 'Withdrawal notification sent' }
      : { success: false, error: res.error || 'Failed to send withdrawal notification' };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send withdrawal notification',
    };
  }
}

export async function verifyEmailConfigAction(): Promise<ApiResponse> {
  try {
    const ok = await withTimeout(_verifyEmailConfig(), EMAIL_TIMEOUT_MS, 'verifyEmailConfig');
    return ok
      ? { success: true, message: 'Email server ready' }
      : { success: false, error: 'Email server configuration error' };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Email server configuration error',
    };
  }
}
