'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  adminLoginAction,
  adminLogoutAction,
  getUsersAction,
  getUserByIdAction,
  suspendUserAction,
  unsuspendUserAction,
  verifyKYCAction,
  updateUserTierAction,
  assignUserToAdminAction,
  getAdminStatsAction,
  getCurrentAdmin,
} from '@/server/actions/admin';
import type { User, Admin } from '@/server/types/database';

// Hook: Get Current Admin
export function useAdminAuth() {
  const { data: admin, isLoading, error } = useQuery<Admin | null>({
    queryKey: ['currentAdmin'],
    queryFn: async () => {
      const response = await getCurrentAdmin();
      if (response && response !== null) {
        return response as Admin;
      }
      return null;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    error,
  };
}

// Hook: Admin Login
export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      return await adminLoginAction(params);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Admin access granted', {
          description: 'Welcome to the admin dashboard.',
        });
        queryClient.invalidateQueries({ queryKey: ['currentAdmin'] });
        router.push('/admin/dashboard');
      } else {
        toast.error('Admin login failed', {
          description: response.error || 'Invalid credentials.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Admin login failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Admin Logout
export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminLogoutAction,
    onSuccess: () => {
      toast.success('Admin logged out', {
        description: 'See you next time!',
      });
      queryClient.clear();
      router.push('/admin/login');
    },
    onError: (error: Error) => {
      toast.error('Logout failed', {
        description: error.message || 'Please try again.',
      });
    },
  });
}

// Hook: Get Users
export function useUsers(filters?: {
  tier?: string;
  kyc_status?: string;
  account_status?: string;
  search?: string;
}) {
  return useQuery<User[]>({
    queryKey: ['users', filters],
    queryFn: async () => {
      const response = await getUsersAction(filters);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    staleTime: 1 * 60 * 1000,
  });
}

// Hook: Get User by ID
export function useUserById(userId: string) {
  return useQuery<User | null>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await getUserByIdAction(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook: Suspend User
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; reason: string; duration?: number }) => {
      return await suspendUserAction(params.userId, params.reason, params.duration);
    },
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('User suspended', {
          description: 'The user account has been suspended.',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      } else {
        toast.error('Suspension failed', {
          description: response.error || 'Could not suspend user.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Suspension failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Unsuspend User
export function useUnsuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await unsuspendUserAction(userId);
    },
    onSuccess: (response, userId) => {
      if (response.success) {
        toast.success('User activated', {
          description: 'The user account has been reactivated.',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      } else {
        toast.error('Activation failed', {
          description: response.error || 'Could not activate user.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Activation failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Verify KYC
export function useVerifyKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      status: 'verified' | 'rejected';
      rejectionReason?: string;
    }) => {
      return await verifyKYCAction(params.userId, params.status, params.rejectionReason);
    },
    onSuccess: (response, variables) => {
      if (response.success) {
        const action = variables.status === 'verified' ? 'approved' : 'rejected';
        toast.success(`KYC ${action}`, {
          description: `The user's KYC has been ${action}.`,
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      } else {
        toast.error('KYC update failed', {
          description: response.error || 'Could not update KYC status.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('KYC update failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Update User Tier
export function useUpdateUserTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      tier: 'basic' | 'silver' | 'gold' | 'platinum' | 'premium';
    }) => {
      return await updateUserTierAction(params.userId, params.tier);
    },
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Tier updated', {
          description: `User tier has been changed to ${variables.tier}.`,
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      } else {
        toast.error('Tier update failed', {
          description: response.error || 'Could not update user tier.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Tier update failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Assign User to Admin
export function useAssignUserToAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; adminId: string }) => {
      return await assignUserToAdminAction(params.userId, params.adminId);
    },
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('User assigned', {
          description: 'User has been assigned to admin successfully.',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      } else {
        toast.error('Assignment failed', {
          description: response.error || 'Could not assign user.',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Assignment failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}

// Hook: Get Admin Stats
export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await getAdminStatsAction();
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
