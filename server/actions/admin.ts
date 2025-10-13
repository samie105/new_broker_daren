'use server';

import { cookies } from 'next/headers';
import { supabase } from '../db/supabase';
import { ApiResponse, Admin, User } from '../types/database';

const ADMIN_COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Helper: Set admin cookie
async function setAdminCookie(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

// Helper: Get current admin
export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!adminId) return null;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error || !data) return null;

    return data as Admin;
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
  }
}

// ADMIN LOGIN
export async function adminLoginAction(formData: {
  email: string;
  password: string;
}): Promise<ApiResponse<Admin>> {
  try {
    const { email, password } = formData;

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Check password
    if ((admin as any).password !== password) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    if (!(admin as any).is_active) {
      return {
        success: false,
        error: 'Admin account is inactive',
      };
    }

    // Update last login
    await supabase
      .from('admins')
      .update({ last_login_at: new Date().toISOString() } as any as never)
      .eq('id', (admin as any).id);

    // Set admin cookie
    await setAdminCookie((admin as any).id);

    return {
      success: true,
      message: 'Admin login successful',
      data: admin,
    };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return {
      success: false,
      error: error.message || 'Admin login failed',
    };
  }
}

// ADMIN LOGOUT
export async function adminLogoutAction(): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);

    return {
      success: true,
      message: 'Admin logged out successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Logout failed',
    };
  }
}

// GET ALL USERS
export async function getUsersAction(filters?: {
  status?: string;
  tier?: string;
  kyc_status?: string;
  search?: string;
}): Promise<ApiResponse<User[]>> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    let query = supabase.from('users').select('*');

    if (filters?.status) {
      query = query.eq('account_status', filters.status);
    }

    if (filters?.tier) {
      query = query.eq('account_tier', filters.tier);
    }

    if (filters?.kyc_status) {
      query = query.eq('kyc_status', filters.kyc_status);
    }

    if (filters?.search) {
      query = query.or(
        `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
      };
    }

    return {
      success: true,
      data: data as User[],
    };
  } catch (error: any) {
    console.error('Get users error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch users',
    };
  }
}

// GET SINGLE USER
export async function getUserByIdAction(userId: string): Promise<ApiResponse<User>> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message || 'User not found',
      };
    }

    return {
      success: true,
      data: data as User,
    };
  } catch (error: any) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user',
    };
  }
}

// SUSPEND USER
export async function suspendUserAction(
  userId: string,
  reason: string,
  duration?: number
): Promise<ApiResponse> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const suspendedUntil = duration
      ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { error } = await supabase
      .from('users')
      .update({
        is_suspended: true,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        suspended_until: suspendedUntil,
      } as any as never)
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to suspend user',
      };
    }

    return {
      success: true,
      message: 'User suspended successfully',
    };
  } catch (error: any) {
    console.error('Suspend user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to suspend user',
    };
  }
}

// UNSUSPEND USER
export async function unsuspendUserAction(userId: string): Promise<ApiResponse> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const { error } = await supabase
      .from('users')
      .update({
        is_suspended: false,
        suspension_reason: null,
        suspended_at: null,
        suspended_until: null,
      } as any as never)
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to unsuspend user',
      };
    }

    return {
      success: true,
      message: 'User unsuspended successfully',
    };
  } catch (error: any) {
    console.error('Unsuspend user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to unsuspend user',
    };
  }
}

// VERIFY KYC
export async function verifyKYCAction(
  userId: string,
  status: 'verified' | 'rejected',
  rejectionReason?: string
): Promise<ApiResponse> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const updates: any = {
      kyc_status: status,
    };

    if (status === 'verified') {
      updates.kyc_verified_at = new Date().toISOString();
      updates.kyc_rejection_reason = null;
    } else if (status === 'rejected' && rejectionReason) {
      updates.kyc_rejection_reason = rejectionReason;
    }

    const { error } = await supabase.from('users').update(updates as any as never).eq('id', userId);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to update KYC status',
      };
    }

    return {
      success: true,
      message: `KYC ${status} successfully`,
    };
  } catch (error: any) {
    console.error('Verify KYC error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify KYC',
    };
  }
}

// UPDATE USER TIER
export async function updateUserTierAction(
  userId: string,
  tier: 'basic' | 'silver' | 'gold' | 'platinum' | 'premium'
): Promise<ApiResponse> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const { error } = await supabase
      .from('users')
      .update({ account_tier: tier } as any as never)
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to update user tier',
      };
    }

    return {
      success: true,
      message: 'User tier updated successfully',
    };
  } catch (error: any) {
    console.error('Update tier error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update tier',
    };
  }
}

// ASSIGN USER TO ADMIN
export async function assignUserToAdminAction(
  userId: string,
  adminId: string
): Promise<ApiResponse> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const { error } = await supabase
      .from('users')
      .update({ admin_id: adminId } as any as never)
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to assign user to admin',
      };
    }

    return {
      success: true,
      message: 'User assigned to admin successfully',
    };
  } catch (error: any) {
    console.error('Assign user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to assign user',
    };
  }
}

// GET ADMIN STATS
export async function getAdminStatsAction(): Promise<
  ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    pendingKYC: number;
    verifiedKYC: number;
  }>
> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const [total, active, suspended, pendingKYC, verifiedKYC] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('is_suspended', true),
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('kyc_status', 'pending'),
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('kyc_status', 'verified'),
    ]);

    return {
      success: true,
      data: {
        totalUsers: total.count || 0,
        activeUsers: active.count || 0,
        suspendedUsers: suspended.count || 0,
        pendingKYC: pendingKYC.count || 0,
        verifiedKYC: verifiedKYC.count || 0,
      },
    };
  } catch (error: any) {
    console.error('Get stats error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch stats',
    };
  }
}
