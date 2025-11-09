'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { ApiResponse } from '@/server/types/database'
import { requireAdmin } from '@/lib/admin-helpers'
import { revalidatePath } from 'next/cache'

export interface StakingPlan {
  id: string
  name: string
  symbol: string
  apy: number
  min_amount: number
  max_amount: number
  duration_days: number
  status: 'active' | 'inactive'
  description?: string
  created_at: string
}

export async function getStakingPlansAction(): Promise<ApiResponse<StakingPlan[]>> {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('admins')
      .select('staking_plans')
      .eq('id', admin.id)
      .single()

    if (error) throw error

    const plans = (data?.staking_plans || []as unknown) as StakingPlan[]

    return {
      success: true,
      data: plans,
    }
  } catch (error: any) {
    console.error('Get staking plans error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch staking plans',
    }
  }
}

export async function createStakingPlanAction(
  planData: Omit<StakingPlan, 'id' | 'created_at'>
): Promise<ApiResponse<StakingPlan>> {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    // Get current plans
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('staking_plans')
      .eq('id', admin.id)
      .single()

    if (fetchError) throw fetchError

    const currentPlans = (adminData?.staking_plans || []as unknown) as StakingPlan[]

    // Create new plan
    const newPlan: StakingPlan = {
      ...planData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }

    // Update admin with new plan
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        staking_plans: [...currentPlans, newPlan],
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', admin.id)

    if (updateError) throw updateError

    // Revalidate paths so changes reflect immediately
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/staking')

    return {
      success: true,
      data: newPlan,
      message: 'Staking plan created successfully',
    }
  } catch (error: any) {
    console.error('Create staking plan error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create staking plan',
    }
  }
}

export async function updateStakingPlanAction(
  planId: string,
  updates: Partial<Omit<StakingPlan, 'id' | 'created_at'>>
): Promise<ApiResponse<StakingPlan>> {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    // Get current plans
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('staking_plans')
      .eq('id', admin.id)
      .single()

    if (fetchError) throw fetchError

    const currentPlans = (adminData?.staking_plans || []as unknown) as StakingPlan[]
    const planIndex = currentPlans.findIndex((p) => p.id === planId)

    if (planIndex === -1) {
      return {
        success: false,
        error: 'Staking plan not found',
      }
    }

    // Update the plan
    currentPlans[planIndex] = {
      ...currentPlans[planIndex],
      ...updates,
    }

    // Save updated plans
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        staking_plans: currentPlans,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', admin.id)

    if (updateError) throw updateError

    // Revalidate paths so changes reflect immediately
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/staking')

    return {
      success: true,
      data: currentPlans[planIndex],
      message: 'Staking plan updated successfully',
    }
  } catch (error: any) {
    console.error('Update staking plan error:', error)
    return {
      success: false,
      error: error.message || 'Failed to update staking plan',
    }
  }
}

export async function deleteStakingPlanAction(planId: string): Promise<ApiResponse<void>> {
  try {
    const admin = await requireAdmin()
    const supabase = createServerSupabase()

    // Get current plans
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('staking_plans')
      .eq('id', admin.id)
      .single()

    if (fetchError) throw fetchError

    const currentPlans = (adminData?.staking_plans || []as unknown) as StakingPlan[]
    const updatedPlans = currentPlans.filter((p) => p.id !== planId)

    // Save updated plans
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        staking_plans: updatedPlans,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', admin.id)

    if (updateError) throw updateError

    // Revalidate paths so changes reflect immediately
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/staking')

    return {
      success: true,
      message: 'Staking plan deleted successfully',
    }
  } catch (error: any) {
    console.error('Delete staking plan error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete staking plan',
    }
  }
}

// Manage user staking positions
export async function terminateStakingPositionAction(
  stakingId: string,
  payProfit: boolean = true
): Promise<ApiResponse<void>> {
  try {
    const admin = await requireAdmin()
    
    // TODO: Implement with users.staking_positions JSONB field
    // Need to:
    // 1. Find the user with this staking position
    // 2. Update the position status in JSONB array
    // 3. Update user wallet_balance if payProfit is true
    
    return {
      success: false,
      error: 'Not implemented - Staking positions are stored in users.staking_positions JSONB field'
    }
  } catch (error: any) {
    console.error('Terminate staking error:', error)
    return {
      success: false,
      error: error.message || 'Failed to terminate staking position',
    }
  }
}
