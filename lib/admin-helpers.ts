'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  fullName: string | null
  isActive: boolean
}

// Helper: Get admin ID from cookie
async function getAdminIdFromCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const adminId = cookieStore.get('auth_session')?.value
    return adminId || null
  } catch (error) {
    console.error('getAdminIdFromCookie error:', error)
    return null
  }
}

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const adminId = await getAdminIdFromCookie()
    if (!adminId) return false

    // Check in admins table
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('admins')
      .select('id, is_active')
      .eq('id', adminId)
      .limit(1)
      .maybeSingle()

    if (error || !data) return false

    return (data as any).is_active === true
  } catch (error) {
    console.error('isAdmin error:', error)
    return false
  }
}

// Get admin user details
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const adminId = await getAdminIdFromCookie()
    if (!adminId) return null

    // Query admins table directly
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, full_name, is_active')
      .eq('id', adminId)
      .limit(1)
      .maybeSingle()

    if (error || !data) return null

    const adminData = data as any
    
    if (!adminData.is_active) {
      return null
    }

    return {
      id: adminData.id,
      email: adminData.email,
      fullName: adminData.full_name,
      isActive: adminData.is_active,
    }
  } catch (error) {
    console.error('getAdminUser error:', error)
    return null
  }
}

// Require admin access or redirect
export async function requireAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser()
  
  if (!adminUser) {
    // Check if this is a regular user trying to access admin area
    const adminId = await getAdminIdFromCookie()
    if (adminId) {
      // They have a session cookie but not in admins table
      // Check if they're a regular user
      const supabase = createServerSupabase()
      const { data: regularUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', adminId)
        .limit(1)
        .maybeSingle()
      
      if (regularUser) {
        // This is a regular user, not an admin - redirect to dashboard
        redirect('/dashboard')
      }
    }
    
    // Not logged in or session expired - redirect to admin login
    redirect('/admin-login')
  }

  return adminUser
}

// Log admin action
export async function logAdminAction(params: {
  actionType: string
  targetUserId?: string
  targetId?: string
  details?: any
  ipAddress?: string
}): Promise<void> {
  try {
    const adminUser = await getAdminUser()
    if (!adminUser) return

    // TODO: Implement with admins.actions JSONB field
    console.log('Admin action logged:', params)
  } catch (error) {
    console.error('logAdminAction error:', error)
  }
}
