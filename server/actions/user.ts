'use server';

import { supabase } from '../db/supabase';
import { getCurrentUser } from './auth';
import { ApiResponse, User, UserUpdate } from '../types/database';

// GET USER PROFILE
export async function getUserProfileAction(): Promise<ApiResponse<User>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    };
  } catch (error: any) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error.message || 'Failed to retrieve profile',
    };
  }
}

// UPDATE USER PROFILE
export async function updateUserProfileAction(
  updates: Partial<UserUpdate>
): Promise<ApiResponse<User>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates as any as never)
      .eq('id', (user as any).id)
      .select('*')
      .single();

    if (error || !updatedUser) {
      return {
        success: false,
        error: error?.message || 'Failed to update profile',
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser as User,
    };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update profile',
    };
  }
}

// UPDATE PASSWORD
export async function updatePasswordAction(formData: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const { currentPassword, newPassword } = formData;

    // Verify current password (plain text comparison)
    if ((user as any).password !== currentPassword) {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Update password
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword } as any as never)
      .eq('id', (user as any).id);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to update password',
      };
    }

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error: any) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update password',
    };
  }
}

// UPDATE USER PREFERENCES
export async function updateUserPreferencesAction(preferences: {
  language?: string;
  theme?: string;
  preferred_currency?: string;
  timezone?: string;
  marketing_emails_enabled?: boolean;
  trading_notifications_enabled?: boolean;
  security_alerts_enabled?: boolean;
  newsletter_subscribed?: boolean;
}): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const { error } = await supabase
      .from('users')
      .update(preferences as any as never)
      .eq('id', (user as any).id);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to update preferences',
      };
    }

    return {
      success: true,
      message: 'Preferences updated successfully',
    };
  } catch (error: any) {
    console.error('Update preferences error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update preferences',
    };
  }
}

// UPDATE AVATAR
export async function updateUserAvatarAction(avatarUrl: string): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const { error } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl } as any as never)
      .eq('id', (user as any).id);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to update avatar',
      };
    }

    return {
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar_url: avatarUrl },
    };
  } catch (error: any) {
    console.error('Update avatar error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update avatar',
    };
  }
}

// DELETE USER ACCOUNT
export async function deleteUserAccountAction(): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('users')
      .update({
        is_active: false,
        account_status: 'deleted',
        deleted_at: new Date().toISOString(),
      } as any as never)
      .eq('id', (user as any).id);

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete account',
      };
    }

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  } catch (error: any) {
    console.error('Delete account error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete account',
    };
  }
}

// GET USER DETAILS WITH SUBSCRIPTION AND NOTIFICATIONS
export async function getUserDetailsAction(): Promise<ApiResponse<any>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    console.log('📊 Fetching user details with subscription for:', (user as any).id);

    // Fetch user with subscription plan details
    const { data: userDetails, error } = await supabase
      .from('users')
      .select(`
        *,
        subscription_plans (
          id,
          name,
          display_name,
          tier,
          price_monthly,
          price_yearly,
          features,
          limits,
          color,
          icon
        )
      `)
      .eq('id', (user as any).id)
      .single();

    if (error) {
      console.error('❌ Error fetching user details:', error);
      return {
        success: false,
        error: 'Failed to fetch user details',
      };
    }

    console.log('✅ User details fetched successfully');

    return {
      success: true,
      message: 'User details retrieved successfully',
      data: userDetails,
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in getUserDetailsAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// GET USER NOTIFICATIONS
export async function getUserNotificationsAction(): Promise<ApiResponse<any[]>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        data: [],
      };
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', (user as any).id)
      .single();

    if (error) {
      console.error('❌ Error fetching notifications:', error);
      return {
        success: false,
        error: 'Failed to fetch notifications',
        data: [],
      };
    }

    return {
      success: true,
      data: ((userData as any)?.notifications as any[]) || [],
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in getUserNotificationsAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

// MARK NOTIFICATION AS READ
export async function markNotificationAsReadAction(notificationId: string): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get current notifications
    const { data: userData } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', (user as any).id)
      .single();

    if (!userData) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Update the specific notification
    const notifications = ((userData as any).notifications as any[]) || [];
    const updatedNotifications = notifications.map((notif: any) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );

    // Save back to database
    const { error } = await supabase
      .from('users')
      .update({ notifications: updatedNotifications } as any as never)
      .eq('id', (user as any).id);

    if (error) {
      console.error('❌ Error marking notification as read:', error);
      return {
        success: false,
        error: 'Failed to mark notification as read',
      };
    }

    return {
      success: true,
      message: 'Notification marked as read',
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in markNotificationAsReadAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// MARK ALL NOTIFICATIONS AS READ
export async function markAllNotificationsAsReadAction(): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get current notifications
    const { data: userData } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', (user as any).id)
      .single();

    if (!userData) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Mark all as read
    const notifications = ((userData as any).notifications as any[]) || [];
    const updatedNotifications = notifications.map((notif: any) => ({
      ...notif,
      read: true,
    }));

    // Save back to database
    const { error } = await supabase
      .from('users')
      .update({ notifications: updatedNotifications } as any as never)
      .eq('id', (user as any).id);

    if (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return {
        success: false,
        error: 'Failed to mark all notifications as read',
      };
    }

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in markAllNotificationsAsReadAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// ADD NOTIFICATION (Admin or system function)
export async function addNotificationAction(
  userId: string,
  notification: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    link?: string;
  }
): Promise<ApiResponse<any>> {
  try {
    // Get current notifications
    const { data: userData } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', userId)
      .single();

    if (!userData) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const notifications = ((userData as any).notifications as any[]) || [];
    
    // Create new notification
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      link: notification.link || null,
      read: false,
      timestamp: new Date().toISOString(),
    };

    // Add to beginning of array
    const updatedNotifications = [newNotification, ...notifications];

    // Save back to database
    const { error } = await supabase
      .from('users')
      .update({ notifications: updatedNotifications } as any as never)
      .eq('id', userId);

    if (error) {
      console.error('❌ Error adding notification:', error);
      return {
        success: false,
        error: 'Failed to add notification',
      };
    }

    return {
      success: true,
      message: 'Notification added successfully',
      data: newNotification,
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in addNotificationAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}
