'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  signupAction,
  loginAction,
  logoutAction,
  verifyEmailAction,
  forgotPasswordAction,
  resetPasswordAction,
  resendVerificationCodeAction,
  getCurrentUser,
} from '@/server/actions/auth';
import type { User } from '@/server/types/database';

// Hook: Get Current User
export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

// Hook: Signup
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account.',
        });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        // Hard redirect to OTP verification page
        window.location.href = '/auth/verify-otp';
      } else {
        toast.error('Signup failed', {
          description: data.message || 'Please try again.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Signup failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        // Hard redirect to ensure cookie is sent with request - fixes production auth issues
        window.location.href = '/dashboard';
      } else {
        toast.error('Login failed', {
          description: data.message || 'Invalid credentials.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Login failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      toast.success('Logged out successfully', {
        description: 'See you next time!',
      });
      queryClient.clear();
      // Hard redirect to ensure clean session state
      window.location.href = '/auth/login';
    },
    onError: (error: Error) => {
      toast.error('Logout failed', {
        description: error.message || 'Please try again.',
      });
    },
  });
}

// Hook: Verify Email
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Email verified!', {
          description: 'Your account is now active.',
        });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        // Hard redirect to ensure cookie is properly recognized
        window.location.href = '/dashboard';
      } else {
        toast.error('Verification failed', {
          description: data.message || 'Invalid or expired code.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Verification failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Forgot Password
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Reset code sent!', {
          description: 'Check your email for the password reset code.',
        });
      } else {
        toast.error('Request failed', {
          description: data.message || 'Please try again.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Request failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Reset Password
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Password reset successful!', {
          description: 'You can now login with your new password.',
        });
        window.location.href = '/auth/login';
      } else {
        toast.error('Reset failed', {
          description: data.message || 'Invalid or expired code.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Reset failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Resend Verification Code
export function useResendCode() {
  return useMutation({
    mutationFn: resendVerificationCodeAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Code resent!', {
          description: 'Check your email for the new verification code.',
        });
      } else {
        toast.error('Resend failed', {
          description: data.message || 'Please try again.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Resend failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}
