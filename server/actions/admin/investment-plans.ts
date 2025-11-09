'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { ApiResponse } from '@/server/types/database'
import { requireAdmin } from '@/lib/admin-helpers'
import { revalidatePath } from 'next/cache'

export interface InvestmentPlan {
  id: string
  name: string
  plan_type: string
  min_amount: number
  max_amount: number
  roi_percentage: number
  duration_days: number
  risk_level: 'low' | 'medium' | 'high'
  status: 'active' | 'inactive'
  description?: string
  created_at: string
}

export async function getInvestmentPlansAction(): Promise<ApiResponse<InvestmentPlan[]>> {
  try {
    const admin = await requireAdmin()
    
    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('admins')
      .select('investment_plans')
      .eq('id', admin.id)
      .single()

    if (error) throw error

    const plans = ((data?.investment_plans || []) as unknown) as InvestmentPlan[]

    return {
      success: true,
      data: plans,
    }
  } catch (error: any) {
    console.error('Get investment plans error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch investment plans',
    }
  }
}

export async function createInvestmentPlanAction(
  planData: Omit<InvestmentPlan, 'id' | 'created_at'>
): Promise<ApiResponse<InvestmentPlan>> {
  try {
    const admin = await requireAdmin()
    
    const supabase = createServerSupabase()

    // Get current plans
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('investment_plans')
      .eq('id', admin.id)
      .single()

    if (fetchError) throw fetchError

    const currentPlans = ((adminData?.investment_plans || []) as unknown) as InvestmentPlan[]

    // Create new plan
    const newPlan: InvestmentPlan = {
      ...planData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }

    // Update admin with new plan
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        investment_plans: [...currentPlans, newPlan],
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', admin.id)

    if (updateError) throw updateError

    // Revalidate paths so changes reflect immediately
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/investment')

    return {
      success: true,
      data: newPlan,
      message: 'Investment plan created successfully',
    }
  } catch (error: any) {
    console.error('Create investment plan error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create investment plan',
    }
  }
}

export async function updateInvestmentPlanAction(
  planId: string,
  updates: Partial<Omit<InvestmentPlan, 'id' | 'created_at'>>
): Promise<ApiResponse<InvestmentPlan>> {
  try {
    const admin = await requireAdmin()
    
    const supabase = createServerSupabase()

    // Get current plans
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('investment_plans')
      .eq('id', admin.id)
      .single()

    if (fetchError) throw fetchError

    const currentPlans = ((adminData?.investment_plans || []) as unknown) as InvestmentPlan[]
    const planIndex = currentPlans.findIndex((p) => p.id === planId)

    if (planIndex === -1) {
      return {
        success: false,
        error: 'Investment plan not found',
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
        investment_plans: currentPlans,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', admin.id)

    if (updateError) throw updateError

    // Revalidate paths so changes reflect immediately
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/investment')

    return {
      success: true,
      data: currentPlans[planIndex],
      message: 'Investment plan updated successfully',
    }
  } catch (error: any) {
    console.error('Update investment plan error:', error)
    return {
      success: false,
      error: error.message || 'Failed to update investment plan',
    }
  }
}

export async function deleteInvestmentPlanAction(planId: string): Promise<ApiResponse<void>> {
  try {
    const admin = await requireAdmin()
    
    const supabase = createServerSupabase()

    // Get current plans
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('investment_plans')
      .eq('id', admin.id)
      .single()

    if (fetchError) throw fetchError

    const currentPlans = ((adminData?.investment_plans || []) as unknown) as InvestmentPlan[]
    const updatedPlans = currentPlans.filter((p) => p.id !== planId)

    // Save updated plans
    const { error: updateError } = await supabase
      .from('admins')
      .update({
        investment_plans: updatedPlans,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', admin.id)

    if (updateError) throw updateError

    // Revalidate paths so changes reflect immediately
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/investment')

    return {
      success: true,
      message: 'Investment plan deleted successfully',
    }
  } catch (error: any) {
    console.error('Delete investment plan error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete investment plan',
    }
  }
}

// Manage user investments
export async function terminateInvestmentAction(
  investmentId: string,
  payProfit: boolean = true
): Promise<ApiResponse<void>> {
  try {
    const admin = await requireAdmin()
    
    // TODO: Implement with users.active_investments JSONB field
    // Need to: 
    // 1. Find the user with this investment
    // 2. Update the investment status in JSONB array
    // 3. Update user wallet_balance if payProfit is true
    
    return {
      success: false,
      error: 'Not implemented - Investments are stored in users.active_investments JSONB field'
    }
  } catch (error: any) {
    console.error('Terminate investment error:', error)
    return {
      success: false,
      error: error.message || 'Failed to terminate investment',
    }
  }
}
