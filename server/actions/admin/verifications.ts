'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { requireAdmin, logAdminAction } from '@/lib/admin-helpers'
import { revalidatePath } from 'next/cache'

// APPROVE VERIFICATION
export async function approveVerificationAction(userId: string) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { error } = await supabase
      .from('users')
      .update({
        kyc_status: 'approved',
        kyc_reviewed_at: new Date().toISOString(),
        kyc_reviewed_by: admin.id,
      } as any)
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    // TODO: Send notification (store in users.notifications JSONB)
    // await supabase.from('notifications').insert({
    //   user_id: userId,
    //   type: 'kyc',
    //   title: 'Verification Approved',
    //   message: 'Your identity verification has been approved. You now have full access to all features.',
    //   icon: '✅',
    //   is_read: false,
    // })

    await logAdminAction({
      actionType: 'kyc_approve',
      targetUserId: userId,
    })

    revalidatePath('/admin/verifications')

    return { success: true, message: 'Verification approved successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// REJECT VERIFICATION
export async function rejectVerificationAction(userId: string, reason: string) {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { error } = await supabase
      .from('users')
      .update({
        kyc_status: 'rejected',
        kyc_reviewed_at: new Date().toISOString(),
        kyc_reviewed_by: admin.id,
        kyc_rejection_reason: reason,
      } as any)
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    // TODO: Send notification (store in users.notifications JSONB)
    // await supabase.from('notifications').insert({
    //   user_id: userId,
    //   type: 'kyc',
    //   title: 'Verification Rejected',
    //   message: `Your identity verification was rejected. Reason: ${reason}. Please resubmit with correct information.`,
    //   icon: '❌',
    //   is_read: false,
    // })

    await logAdminAction({
      actionType: 'kyc_reject',
      targetUserId: userId,
      details: { reason },
    })

    revalidatePath('/admin/verifications')

    return { success: true, message: 'Verification rejected successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// GET PENDING VERIFICATIONS
export async function getPendingVerificationsAction() {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('kyc_status', 'pending')
      .order('kyc_submitted_at', { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// GET ALL VERIFICATIONS
export async function getAllVerificationsAction() {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('kyc_status', ['pending', 'approved', 'rejected'])
      .order('kyc_submitted_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
