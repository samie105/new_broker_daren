'use server';

import { supabase } from '../db/supabase';
import { getCurrentUser } from './auth';
import { ApiResponse } from '../types/database';
import { cookies } from 'next/headers';

// GET ALL SUBSCRIPTION PLANS FROM ADMIN
export async function getSubscriptionPlansAction(): Promise<ApiResponse<any[]>> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_session')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'Not authenticated',
        data: [],
      };
    }

    // Get user's admin_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('admin_id')
      .eq('id', userId)
      .single();

    if (userError || !user || !(user as any).admin_id) {
      console.log('User has no admin_id, returning empty plans');
      return {
        success: true,
        message: 'No subscription plans available',
        data: [],
      };
    }

    const adminId = (user as any).admin_id;

    // Get admin's subscription plans
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('subscription_plans')
      .eq('id', adminId)
      .single();

    if (adminError || !admin) {
      console.error('❌ Error fetching admin subscription plans:', adminError);
      return {
        success: false,
        error: 'Failed to fetch subscription plans',
        data: [],
      };
    }

    const plans = ((admin as any).subscription_plans || []);
    
    // Filter only active plans and sort by tier
    const activePlans = plans
      .filter((plan: any) => plan.is_active)
      .sort((a: any, b: any) => a.tier - b.tier);

    return {
      success: true,
      message: 'Subscription plans retrieved successfully',
      data: activePlans,
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in getSubscriptionPlansAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

// GET SINGLE SUBSCRIPTION PLAN FROM ADMIN
export async function getSubscriptionPlanAction(planId: string): Promise<ApiResponse<any>> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_session')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get user's admin_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('admin_id')
      .eq('id', userId)
      .single();

    if (userError || !user || !(user as any).admin_id) {
      return {
        success: false,
        error: 'No admin found',
      };
    }

    const adminId = (user as any).admin_id;

    // Get admin's subscription plans
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('subscription_plans')
      .eq('id', adminId)
      .single();

    if (adminError || !admin) {
      return {
        success: false,
        error: 'Failed to fetch subscription plan',
      };
    }

    const plans = ((admin as any).subscription_plans || []);
    const plan = plans.find((p: any) => p.id === planId);

    if (!plan) {
      return {
        success: false,
        error: 'Subscription plan not found',
      };
    }

    return {
      success: true,
      message: 'Subscription plan retrieved successfully',
      data: plan,
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in getSubscriptionPlanAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// PURCHASE/UPGRADE SUBSCRIPTION PLAN
export async function purchaseSubscriptionPlanAction(formData: {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const { planId, billingCycle } = formData;

    // Get the plan details from admin
    const planResult = await getSubscriptionPlanAction(planId);

    if (!planResult.success || !planResult.data) {
      return {
        success: false,
        error: 'Invalid subscription plan',
      };
    }

    const plan = planResult.data;

    // Calculate subscription dates
    const startDate = new Date();
    const expiryDate = new Date();
    
    if (billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Update user's subscription
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_plan_name: plan.name,
        subscription_status: 'active',
        subscription_started_at: startDate.toISOString(),
        subscription_expires_at: expiryDate.toISOString(),
        billing_cycle: billingCycle,
      } as any as never)
      .eq('id', (user as any).id);

    if (updateError) {
      console.error('❌ Error updating user subscription:', updateError);
      return {
        success: false,
        error: 'Failed to activate subscription',
      };
    }

    // Here you would integrate with a payment provider (Stripe, PayPal, etc.)
    // For now, we're just updating the database

    const planData = plan as any;
    console.log(`✅ User ${(user as any).email} purchased ${planData.display_name} (${billingCycle})`);

    return {
      success: true,
      message: `Successfully subscribed to ${planData.display_name} plan`,
      data: {
        plan: planData.display_name,
        billingCycle,
        expiresAt: expiryDate.toISOString(),
      },
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in purchaseSubscriptionPlanAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// CANCEL SUBSCRIPTION
export async function cancelSubscriptionAction(): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Downgrade to bronze (free tier) by plan name
    const { error } = await supabase
      .from('users')
      .update({
        subscription_plan_name: 'bronze',
        subscription_status: 'cancelled',
        billing_cycle: 'monthly',
      } as any as never)
      .eq('id', (user as any).id);

    if (error) {
      console.error('❌ Error cancelling subscription:', error);
      return {
        success: false,
        error: 'Failed to cancel subscription',
      };
    }

    console.log(`✅ User ${(user as any).email} cancelled their subscription`);

    return {
      success: true,
      message: 'Subscription cancelled successfully. You have been downgraded to the Bronze (free) plan.',
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in cancelSubscriptionAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// GET USER'S CURRENT SUBSCRIPTION
export async function getUserSubscriptionAction(): Promise<ApiResponse<any>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get user data with subscription_plan_name
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        subscription_plan_name,
        subscription_status,
        subscription_started_at,
        subscription_expires_at,
        billing_cycle,
        admin_id
      `)
      .eq('id', (user as any).id)
      .single();

    if (userError || !userData) {
      console.error('❌ Error fetching user data:', userError);
      return {
        success: false,
        error: 'Failed to fetch subscription details',
      };
    }

    const userDataTyped = userData as any;

    // Get the subscription plan from admin's subscription_plans array
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('subscription_plans')
      .eq('id', userDataTyped.admin_id)
      .single();

    if (adminError || !adminData) {
      console.error('❌ Error fetching admin plans:', adminError);
      return {
        success: false,
        error: 'Failed to fetch subscription plan details',
      };
    }

    const adminDataTyped = adminData as any;
    const subscriptionPlans = adminDataTyped.subscription_plans || [];
    
    // Find the user's current plan in admin's plans array
    const currentPlan = subscriptionPlans.find(
      (plan: any) => plan.name === userDataTyped.subscription_plan_name
    );

    // Return user data with the plan details embedded
    return {
      success: true,
      message: 'Subscription details retrieved successfully',
      data: {
        ...userDataTyped,
        subscription_plans: currentPlan || null,
      },
    };
  } catch (error: any) {
    console.error('❌ Unexpected error in getUserSubscriptionAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}
