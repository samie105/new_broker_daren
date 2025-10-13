'use server'

import { supabase } from '@/server/db/supabase'
import type { UserNotification } from '@/server/types/database'

/**
 * Get all notifications for the authenticated user
 */
export async function getNotificationsAction() {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view notifications',
        data: null
      }
    }

    // Get user's notifications from the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', user.id)
      .single() as { data: { notifications: UserNotification[] | null } | null, error: any }

    if (userError) {
      console.error('Error fetching notifications:', userError)
      return {
        success: false,
        error: 'Failed to fetch notifications',
        data: null
      }
    }

    const notifications = userData?.notifications || []

    // Sort by created_at descending (newest first)
    const sortedNotifications = notifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return {
      success: true,
      data: sortedNotifications,
      error: null
    }
  } catch (error) {
    console.error('Error in getNotificationsAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: null
    }
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCountAction() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in',
        data: 0
      }
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', user.id)
      .single() as { data: { notifications: UserNotification[] | null } | null, error: any }

    if (userError) {
      return {
        success: false,
        error: 'Failed to fetch unread count',
        data: 0
      }
    }

    const notifications = userData?.notifications || []
    const unreadCount = notifications.filter(n => !n.is_read).length

    return {
      success: true,
      data: unreadCount,
      error: null
    }
  } catch (error) {
    console.error('Error in getUnreadCountAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: 0
    }
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsReadAction(notificationId: string) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in',
        data: null
      }
    }

    // Get current notifications
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', user.id)
      .single() as { data: { notifications: UserNotification[] | null } | null, error: any }

    if (fetchError) {
      return {
        success: false,
        error: 'Failed to fetch notifications',
        data: null
      }
    }

    const notifications = userData?.notifications || []

    // Update the specific notification
    const updatedNotifications = notifications.map((notification: UserNotification) =>
      notification.id === notificationId
        ? { ...notification, is_read: true }
        : notification
    )

    // Save back to database
    const { error: updateError } = await supabase
      .from('users')
      // @ts-ignore - notifications field exists in DB but not in generated types yet
      .update({ notifications: updatedNotifications })
      .eq('id', user.id)

    if (updateError) {
      return {
        success: false,
        error: 'Failed to mark notification as read',
        data: null
      }
    }

    return {
      success: true,
      data: updatedNotifications,
      error: null
    }
  } catch (error) {
    console.error('Error in markNotificationAsReadAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: null
    }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsReadAction() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in',
        data: null
      }
    }

    // Get current notifications
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', user.id)
      .single() as { data: { notifications: UserNotification[] | null } | null, error: any }

    if (fetchError) {
      return {
        success: false,
        error: 'Failed to fetch notifications',
        data: null
      }
    }

    const notifications = userData?.notifications || []

    // Mark all as read
    const updatedNotifications = notifications.map((notification: UserNotification) => ({
      ...notification,
      is_read: true
    }))

    // Save back to database
    const { error: updateError } = await supabase
      .from('users')
      // @ts-ignore - notifications field exists in DB but not in generated types yet
      .update({ notifications: updatedNotifications })
      .eq('id', user.id)

    if (updateError) {
      return {
        success: false,
        error: 'Failed to mark all notifications as read',
        data: null
      }
    }

    return {
      success: true,
      data: updatedNotifications,
      error: null
    }
  } catch (error) {
    console.error('Error in markAllNotificationsAsReadAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: null
    }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationAction(notificationId: string) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in',
        data: null
      }
    }

    // Get current notifications
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', user.id)
      .single() as { data: { notifications: UserNotification[] | null } | null, error: any }

    if (fetchError) {
      return {
        success: false,
        error: 'Failed to fetch notifications',
        data: null
      }
    }

    const notifications = userData?.notifications || []

    // Filter out the deleted notification
    const updatedNotifications = notifications.filter(
      (notification: UserNotification) => notification.id !== notificationId
    )

    // Save back to database
    const { error: updateError } = await supabase
      .from('users')
      // @ts-ignore - notifications field exists in DB but not in generated types yet
      .update({ notifications: updatedNotifications })
      .eq('id', user.id)

    if (updateError) {
      return {
        success: false,
        error: 'Failed to delete notification',
        data: null
      }
    }

    return {
      success: true,
      data: updatedNotifications,
      error: null
    }
  } catch (error) {
    console.error('Error in deleteNotificationAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: null
    }
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotificationsAction() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in',
        data: null
      }
    }

    // Clear all notifications
    const { error: updateError } = await supabase
      .from('users')
      // @ts-ignore - notifications field exists in DB but not in generated types yet
      .update({ notifications: [] })
      .eq('id', user.id)

    if (updateError) {
      return {
        success: false,
        error: 'Failed to clear notifications',
        data: null
      }
    }

    return {
      success: true,
      data: [],
      error: null
    }
  } catch (error) {
    console.error('Error in clearAllNotificationsAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: null
    }
  }
}

/**
 * Add a new notification (typically called by backend after actions)
 */
export async function addNotificationAction(
  userId: string,
  notification: Omit<UserNotification, 'id' | 'is_read' | 'created_at'>
) {
  try {
    // Get current notifications
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('notifications')
      .eq('id', userId)
      .single() as { data: { notifications: UserNotification[] | null } | null, error: any }

    if (fetchError) {
      console.error('Error fetching user notifications:', fetchError)
      return {
        success: false,
        error: 'Failed to fetch notifications',
        data: null
      }
    }

    const currentNotifications = userData?.notifications || []

    // Create new notification
    const newNotification: UserNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      is_read: false,
      created_at: new Date().toISOString()
    }

    // Add to notifications array
    const updatedNotifications = [newNotification, ...currentNotifications]

    // Limit to last 100 notifications
    const limitedNotifications = updatedNotifications.slice(0, 100)

    // Save back to database
    const { error: updateError } = await supabase
      .from('users')
      // @ts-ignore - notifications field exists in DB but not in generated types yet
      .update({ notifications: limitedNotifications })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating notifications:', updateError)
      return {
        success: false,
        error: 'Failed to add notification',
        data: null
      }
    }

    return {
      success: true,
      data: newNotification,
      error: null
    }
  } catch (error) {
    console.error('Error in addNotificationAction:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: null
    }
  }
}
