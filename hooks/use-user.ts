'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getUserProfileAction,
  updateUserProfileAction,
  updatePasswordAction,
  updateUserPreferencesAction,
  updateUserAvatarAction,
  deleteUserAccountAction,
} from '@/server/actions/user';
import type { User, UserUpdate } from '@/server/types/database';

// Hook: Get User Profile
export function useUserProfile() {
  return useQuery<User | null>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await getUserProfileAction();
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Hook: Update Profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserUpdate>) => {
      return await updateUserProfileAction(data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Profile updated!', {
          description: 'Your profile has been updated successfully.',
        });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else {
        toast.error('Update failed', {
          description: response.error || 'Could not update profile.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Update failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Update Password
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (params: { currentPassword: string; newPassword: string }) => {
      return await updatePasswordAction(params);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Password changed!', {
          description: 'Your password has been updated successfully.',
        });
      } else {
        toast.error('Password change failed', {
          description: response.error || 'Could not change password.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Password change failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Update Preferences
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: {
      preferred_language?: string;
      preferred_currency?: string;
      timezone?: string;
      marketing_emails_enabled?: boolean;
      trading_notifications_enabled?: boolean;
      security_alerts_enabled?: boolean;
      newsletter_subscribed?: boolean;
    }) => {
      return await updateUserPreferencesAction(preferences);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Preferences saved!', {
          description: 'Your preferences have been updated.',
        });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else {
        toast.error('Update failed', {
          description: response.error || 'Could not save preferences.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Update failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Update Avatar
export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarUrl: string) => {
      return await updateUserAvatarAction(avatarUrl);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Avatar updated!', {
          description: 'Your profile picture has been changed.',
        });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else {
        toast.error('Upload failed', {
          description: response.error || 'Could not upload avatar.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Upload failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Delete Account
export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await deleteUserAccountAction();
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Account deleted', {
          description: 'Your account has been deleted successfully.',
        });
        queryClient.clear();
        router.push('/');
      } else {
        toast.error('Deletion failed', {
          description: response.error || 'Could not delete account.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Deletion failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}
