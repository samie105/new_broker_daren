'use server'

import { supabase } from '../db/supabase'
import { AdminAuthResponse } from '../types/database'

/**
 * Admin-only login action
 * Queries the admins table (separate from users table)
 */
export async function adminLoginAction(formData: {
  email: string
  password: string
}): Promise<AdminAuthResponse> {
  try {
    const { email, password } = formData

    console.log('🔐 ADMIN LOGIN ATTEMPT:', {
      email,
      timestamp: new Date().toISOString(),
    })

    // Find admin in admins table
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    if (error || !admin) {
      console.log('❌ ADMIN NOT FOUND in admins table:', email)
      return {
        success: false,
        error: 'Invalid admin credentials',
      }
    }

    // Check if admin account is active
    if (!(admin as any).is_active) {
      console.log('❌ ADMIN ACCOUNT DISABLED:', email)
      return {
        success: false,
        error: 'Admin account is disabled',
      }
    }

    // Check password (plain text comparison - admins table stores plain passwords)
    const dbPassword = (admin as any).password
    const passwordMatch = dbPassword === password

    if (!passwordMatch) {
      console.log('❌ ADMIN PASSWORD MISMATCH')

      return {
        success: false,
        error: 'Invalid admin credentials',
      }
    }

    console.log('✅ ADMIN VERIFIED:', {
      email,
      id: (admin as any).id,
    })

    // Note: Last login update skipped due to TypeScript limitations with admins table
    // The admin has been authenticated successfully

    // Set auth cookie
    await setAuthCookie((admin as any).id)

    console.log('✅ ADMIN LOGIN SUCCESSFUL')

    return {
      success: true,
      message: 'Welcome back, Administrator!',
      data: {
        id: (admin as any).id,
        email: (admin as any).email,
        full_name: (admin as any).full_name,
      },
    }
  } catch (error: any) {
    console.error('Admin login error:', error)
    return {
      success: false,
      error: error.message || 'An error occurred during admin login',
    }
  }
}

// Helper function - export setAuthCookie if not already exported
async function setAuthCookie(userId: string) {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  const COOKIE_NAME = 'admin_session'
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
  
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}
