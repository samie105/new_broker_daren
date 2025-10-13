'use server'

import { supabase } from '../db/supabase'
import { getCurrentUser } from './auth'

export interface SearchUserResult {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

export interface SearchUserResponse {
  success: boolean
  user?: SearchUserResult
  error?: string
}

/**
 * Search for a user by email address
 * Used for joint staking/investment partner search
 * Prevents searching for yourself
 */
export async function searchUserByEmailAction(email: string): Promise<SearchUserResponse> {
  try {
    // Validate input
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address'
      }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return {
        success: false,
        error: 'Not authenticated'
      }
    }

    // Prevent searching for yourself
    const currentUserEmail = (currentUser as any).email?.toLowerCase()
    const searchEmail = email.toLowerCase().trim()

    if (currentUserEmail === searchEmail) {
      return {
        success: false,
        error: 'You cannot add yourself as a partner'
      }
    }

    // Search for user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url')
      .eq('email', searchEmail)
      .single()

    if (error) {
      console.log('❌ User search error:', error.message)
      return {
        success: false,
        error: 'User not found'
      }
    }

    if (!user) {
      return {
        success: false,
        error: 'No user found with this email address'
      }
    }

    console.log(`✅ User found: ${(user as any).full_name} (${(user as any).email})`)

    return {
      success: true,
      user: {
        id: (user as any).id,
        email: (user as any).email,
        full_name: (user as any).full_name || 'Unknown User',
        avatar_url: (user as any).avatar_url || undefined
      }
    }
  } catch (error: any) {
    console.error('❌ Error searching user:', error)
    return {
      success: false,
      error: error.message || 'Failed to search user'
    }
  }
}
