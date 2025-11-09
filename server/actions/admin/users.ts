'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { requireAdmin, logAdminAction } from '@/lib/admin-helpers'
import { revalidatePath } from 'next/cache'

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  country: string
  role: string
  is_banned: boolean
  kyc_status: string
  created_at: string
  wallet_balance: number
}

// GET ALL USERS
export async function getAllUsersAction() {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// GET USER BY ID
export async function getUserByIdAction(userId: string) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// UPDATE USER
export async function updateUserAction(userId: string, updates: Partial<AdminUser>) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    await logAdminAction({
      actionType: 'user_update',
      targetUserId: userId,
      details: { updates },
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, data, message: 'User updated successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// DELETE USER
export async function deleteUserAction(userId: string) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logAdminAction({
      actionType: 'user_delete',
      targetUserId: userId,
    })

    revalidatePath('/admin/users')

    return { success: true, message: 'User deleted successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// BAN USER
export async function banUserAction(userId: string, reason: string) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .update({
        is_banned: true,
        banned_at: new Date().toISOString(),
        banned_reason: reason,
      } as any)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    await logAdminAction({
      actionType: 'user_ban',
      targetUserId: userId,
      details: { reason },
    })

    // TODO: Send notification to user (store in users.notifications JSONB)
    // await supabase.from('notifications').insert({
    //   user_id: userId,
    //   type: 'account',
    //   title: 'Account Suspended',
    //   message: `Your account has been suspended. Reason: ${reason}`,
    //   icon: '🚫',
    //   is_read: false,
    // })

    revalidatePath('/admin/users')

    return { success: true, data, message: 'User banned successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// UNBAN USER
export async function unbanUserAction(userId: string) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .update({
        is_banned: false,
        banned_at: null,
        banned_reason: null,
      } as any)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    await logAdminAction({
      actionType: 'user_unban',
      targetUserId: userId,
    })

    // TODO: Send notification to user (store in users.notifications JSONB)
    // await supabase.from('notifications').insert({
    //   user_id: userId,
    //   type: 'account',
    //   title: 'Account Restored',
    //   message: 'Your account has been restored and you can now access all features.',
    //   icon: '✅',
    //   is_read: false,
    // })

    revalidatePath('/admin/users')

    return { success: true, data, message: 'User unbanned successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// UPDATE USER BALANCE
export async function updateUserBalanceAction(
  userId: string,
  amount: number,
  type: 'add' | 'subtract' | 'set'
) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    // Get current balance
    const { data: user } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    let newBalance = 0
    const currentBalance = (user as any)?.wallet_balance || 0

    switch (type) {
      case 'add':
        newBalance = currentBalance + amount
        break
      case 'subtract':
        newBalance = currentBalance - amount
        break
      case 'set':
        newBalance = amount
        break
    }

    const { data, error } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance } as any)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    await logAdminAction({
      actionType: 'balance_update',
      targetUserId: userId,
      details: { type, amount, oldBalance: currentBalance, newBalance },
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, data, message: 'Balance updated successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
