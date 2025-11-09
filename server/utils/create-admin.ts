'use server'

import { supabase } from '../db/supabase'

/**
 * DEVELOPMENT ONLY: Quick Admin User Creator
 * Server action to create an admin user for testing purposes
 * 
 * ⚠️ WARNING: Secure this file properly or remove in production
 * 
 * Usage:
 * import { createQuickAdminUser } from '@/server/utils/create-admin'
 * const result = await createQuickAdminUser()
 */

export async function createQuickAdminUser() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'This action is disabled in production',
      }
    }

    const adminData = {
      id: crypto.randomUUID(),
      email: 'Alpha@adminsecure.private',
      password: 'AdminSecurePassword2025!@#$%^&*()', // CHANGE THIS!
      full_name: 'Alpha Administrator',
      username: 'alpha_admin',
      role: 'super_admin',
      email_verified: true,
      email_verified_at: new Date().toISOString(),
      kyc_status: 'approved',
      account_status: 'active',
      wallet_balance: 0,
      available_balance: 0,
      account_tier: 'premium',
      // Additional required fields
      phone: '+1234567890',
      country: 'US',
      date_of_birth: '1990-01-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('🔧 Checking for existing admin user...')

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', adminData.email)
      .limit(1)
      .maybeSingle()

    if (existingUser) {
      console.log('✅ Admin user already exists, updating role...')
      
      // Update to super_admin using raw update (avoiding type issues)
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'super_admin',
          email_verified: true,
          kyc_status: 'approved',
          account_status: 'active',
        })
        .eq('email', adminData.email)

      if (updateError) {
        console.error('❌ Update error:', updateError)
        return {
          success: false,
          error: updateError.message,
        }
      }

      console.log('✅ User upgraded to super_admin')

      return {
        success: true,
        message: 'Existing user upgraded to super_admin',
        userId: (existingUser as any).id,
      }
    }

    console.log('🆕 Creating new admin user...')

    // Create new admin user using raw insert
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([adminData])
      .select('id, email, role, full_name')
      .single()

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      return {
        success: false,
        error: insertError.message,
      }
    }

    console.log('✅ Admin user created successfully:', newUser)

    return {
      success: true,
      message: 'Admin user created successfully! Login at /auth/login with Alpha@adminsecure.private',
      data: newUser,
      credentials: {
        email: 'Alpha@adminsecure.private',
        password: 'AdminSecurePassword2025!@#$%^&*()',
        note: '⚠️ CHANGE PASSWORD after first login!',
      },
    }
  } catch (error: any) {
    console.error('❌ Create admin error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create admin user',
    }
  }
}

/**
 * Create admin from existing user by email
 */
export async function makeUserAdmin(email: string) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'This action is disabled in production',
      }
    }

    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        role: 'super_admin',
        email_verified: true,
        kyc_status: 'approved',
        account_status: 'active',
      })
      .eq('email', email)
      .select('id, email, role, full_name')
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: `User ${email} is now a super_admin`,
      data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
