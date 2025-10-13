'use server'

import { cookies } from 'next/headers'
import { supabase } from '@/server/db/supabase'

export interface PortfolioHolding {
  symbol: string
  name: string
  balance: number
  avg_buy_price: number
  icon: string
  current_value?: number
}

export interface Transaction {
  id: number
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'transfer'
  symbol: string
  name: string
  amount: number
  price: number
  total: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  date: string
  icon: string
}

export interface Trade {
  id: number
  type: 'BUY' | 'SELL'
  symbol: string
  name: string
  amount: number
  entry_price: number
  current_price: number
  total: number
  profit: number
  profit_percent: number
  status: 'pending' | 'active' | 'completed' | 'failed' | 'cancelled'
  opened_at: string
  closed_at?: string
  icon: string
}

export interface StakingPosition {
  id: number
  symbol: string
  name: string
  amount: number
  apy: number
  rewards: number
  start_date: string
  end_date?: string
  status: 'active' | 'completed' | 'cancelled'
  lock_period: number
  icon: string
}

export interface PortfolioSnapshot {
  date: string
  value: number
  change: number
}

export interface DashboardMetrics {
  portfolio_value: number
  active_positions: number
  total_deposited: number
  total_withdrawn: number
  plan_bonus: number
  subscription_plan: string
}

export interface Deposit {
  id: number
  symbol: string
  name: string
  amount: number
  value: number
  status: string
  confirmations: string
  tx_hash: string
  date: string
  icon: string
}

export interface Withdrawal {
  id: number
  symbol: string
  name: string
  amount: number
  address: string
  status: string
  fee: number
  tx_hash: string | null
  date: string
  icon: string
}

/**
 * Get user's portfolio holdings
 */
export async function getPortfolioHoldingsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    // Cookie value is just the user ID string
    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('portfolio_holdings')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching portfolio holdings:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).portfolio_holdings as PortfolioHolding[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getPortfolioHoldingsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch portfolio holdings',
      data: null,
    }
  }
}

/**
 * Get user's transactions
 */
export async function getTransactionsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    // Cookie value is just the user ID string
    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('transactions')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching transactions:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).transactions as Transaction[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getTransactionsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch transactions',
      data: null,
    }
  }
}

/**
 * Get user's trades
 */
export async function getTradesAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    // Cookie value is just the user ID string
    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('trades')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching trades:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).trades as Trade[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getTradesAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch trades',
      data: null,
    }
  }
}

/**
 * Get user's staking positions
 */
export async function getStakingPositionsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    // Cookie value is just the user ID string
    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('staking_positions')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching staking positions:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).staking_positions as StakingPosition[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getStakingPositionsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch staking positions',
      data: null,
    }
  }
}

/**
 * Get portfolio history for chart
 */
export async function getPortfolioHistoryAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    // Cookie value is just the user ID string
    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('portfolio_history')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching portfolio history:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).portfolio_history as PortfolioSnapshot[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getPortfolioHistoryAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch portfolio history',
      data: null,
    }
  }
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetricsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    // Cookie value is just the user ID string
    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        portfolio_value,
        active_positions,
        total_deposited,
        total_withdrawn,
        plan_bonus,
        subscription_plan_name,
        subscription_status
      `)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching dashboard metrics:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    const userData = user as any
    const metrics: DashboardMetrics = {
      portfolio_value: userData.portfolio_value || 0,
      active_positions: userData.active_positions || 0,
      total_deposited: userData.total_deposited || 0,
      total_withdrawn: userData.total_withdrawn || 0,
      plan_bonus: userData.plan_bonus || 0,
      subscription_plan: userData.subscription_plan_name || 'Bronze',
    }

    return {
      success: true,
      data: metrics,
    }
  } catch (error: any) {
    console.error('❌ Error in getDashboardMetricsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch dashboard metrics',
      data: null,
    }
  }
}

/**
 * Get user's deposits
 */
export async function getDepositsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('deposits')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching deposits:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).deposits as Deposit[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getDepositsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch deposits',
      data: null,
    }
  }
}

/**
 * Get user's withdrawals
 */
export async function getWithdrawalsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('withdrawals')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching withdrawals:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).withdrawals as Withdrawal[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getWithdrawalsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch withdrawals',
      data: null,
    }
  }
}

/**
 * Get user's wallet addresses
 */
export async function getWalletAddressesAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('wallet_addresses')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching wallet addresses:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).wallet_addresses as Record<string, string>) || {},
    }
  } catch (error: any) {
    console.error('❌ Error in getWalletAddressesAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch wallet addresses',
      data: null,
    }
  }
}

/**
 * Get combined transaction history (deposits, withdrawals, trades, transactions)
 * Returns all transaction types in a unified format for history page
 */
export async function getCombinedHistoryAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('transactions, deposits, withdrawals, trades, staking_positions, total_deposited, total_withdrawn, total_rewards_earned')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.error('❌ Error in getCombinedHistoryAction:', error)
      return {
        success: false,
        error: 'Failed to fetch transaction history',
        data: null,
      }
    }

    // Combine all transaction types
    const transactions = ((user as any).transactions as Transaction[]) || []
    const deposits = ((user as any).deposits as Deposit[]) || []
    const withdrawals = ((user as any).withdrawals as Withdrawal[]) || []
    const trades = ((user as any).trades as Trade[]) || []
    const stakes = ((user as any).staking_positions as StakingPosition[]) || []

    // Transform to unified format
    interface CombinedTransaction {
      id: string
      type: 'deposit' | 'withdrawal' | 'trade' | 'staking' | 'buy' | 'sell'
      symbol: string
      name: string
      amount: number
      value: number
      status: string
      date: string
      txHash?: string | null
      icon: string
    }

    const combined: CombinedTransaction[] = []

    // Add transactions (buy/sell)
    transactions.forEach(tx => {
      combined.push({
        id: `tx-${tx.id}`,
        type: tx.type as any,
        symbol: tx.symbol,
        name: tx.name,
        amount: tx.amount,
        value: tx.total,
        status: tx.status,
        date: tx.date,
        icon: tx.icon
      })
    })

    // Add deposits
    deposits.forEach(dep => {
      combined.push({
        id: `dep-${dep.id}`,
        type: 'deposit',
        symbol: dep.symbol,
        name: dep.name,
        amount: dep.amount,
        value: dep.value,
        status: dep.status,
        date: dep.date,
        txHash: dep.tx_hash,
        icon: dep.icon
      })
    })

    // Add withdrawals
    withdrawals.forEach(wd => {
      combined.push({
        id: `wd-${wd.id}`,
        type: 'withdrawal',
        symbol: wd.symbol,
        name: wd.name,
        amount: -wd.amount, // Negative for withdrawals
        value: wd.amount, // Use amount as value
        status: wd.status,
        date: wd.date,
        txHash: wd.tx_hash,
        icon: wd.icon
      })
    })

    // Add trades
    trades.forEach(trade => {
      combined.push({
        id: `trade-${trade.id}`,
        type: 'trade',
        symbol: trade.symbol,
        name: trade.name,
        amount: trade.type === 'BUY' ? trade.amount : -trade.amount,
        value: trade.total,
        status: trade.status,
        date: trade.opened_at,
        icon: trade.icon
      })
    })

    // Sort by date (most recent first)
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate summary stats
    const totalDeposited = (user as any).total_deposited || 0
    const totalWithdrawn = (user as any).total_withdrawn || 0
    const totalRewards = (user as any).total_rewards_earned || 0
    
    const depositCount = deposits.length
    const withdrawalCount = withdrawals.length
    const tradeCount = trades.length
    const tradingVolume = trades.reduce((sum, t) => sum + t.total, 0)

    // Count active stakes and calculate rewards
    const activeStakes = stakes.filter(s => s.status === 'active')
    const stakingRewards = activeStakes.reduce((sum, s) => sum + s.rewards, 0)

    return {
      success: true,
      data: {
        transactions: combined,
        summary: {
          totalDeposited,
          depositCount,
          totalWithdrawn,
          withdrawalCount,
          tradingVolume,
          tradeCount,
          stakingRewards,
          rewardCount: activeStakes.length
        }
      },
    }
  } catch (error: any) {
    console.error('❌ Error in getCombinedHistoryAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch combined history',
      data: null,
    }
  }
}

// ============================================================================
// TRADING ACTIONS
// ============================================================================

export interface ActiveOrder {
  id: number
  type: 'buy' | 'sell'
  pair: string
  symbol: string
  amount: number
  price: number
  total: number
  filled: number
  status: 'pending' | 'filled' | 'cancelled'
  created_at: string
}

export interface OrderHistory {
  id: number
  type: 'buy' | 'sell'
  pair: string
  symbol: string
  amount: number
  entry_price: number
  current_price: number
  total: number
  status: 'gain' | 'loss' | 'pending'
  profit: number
  profit_percent: number
  filled_at: string
}

/**
 * Get active trading orders
 */
export async function getActiveOrdersAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('active_orders')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.error('❌ Error in getActiveOrdersAction:', error)
      return {
        success: false,
        error: 'Failed to fetch active orders',
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).active_orders as ActiveOrder[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getActiveOrdersAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch active orders',
      data: null,
    }
  }
}

/**
 * Get order history with gain/loss status
 */
export async function getOrderHistoryAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('order_history')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.error('❌ Error in getOrderHistoryAction:', error)
      return {
        success: false,
        error: 'Failed to fetch order history',
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).order_history as OrderHistory[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getOrderHistoryAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch order history',
      data: null,
    }
  }
}

// ============================================================================
// INVESTMENT ACTIONS
// ============================================================================

export interface Investment {
  id: number
  plan_name: string
  plan_type: 'crypto' | 'stocks' | 'currencies'
  amount_invested: number
  current_value: number
  profit: number
  roi: number
  duration_months: number
  duration: number  // Duration in days (for UI compatibility)
  days_elapsed?: number  // Days since start
  days_remaining?: number  // Days until maturity
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'cancelled'
  risk_level: 'low' | 'medium' | 'high'
  strategy?: string  // Investment strategy
}

/**
 * Get active investments
 */
export async function getActiveInvestmentsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('active_investments, total_invested, investment_returns')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.error('❌ Error in getActiveInvestmentsAction:', error)
      return {
        success: false,
        error: 'Failed to fetch investments',
        data: null,
      }
    }

    // Process investments to add calculated fields
    const rawInvestments = ((user as any).active_investments as Investment[]) || []
    const processedInvestments = rawInvestments.map(investment => {
      const startDate = new Date(investment.start_date)
      const endDate = new Date(investment.end_date)
      const now = new Date()

      // Calculate duration in days
      const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Calculate days elapsed (capped at duration for matured investments)
      const daysElapsedRaw = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
      const daysElapsed = Math.min(daysElapsedRaw, durationInDays)
      
      // Calculate days remaining
      const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

      return {
        ...investment,
        duration: durationInDays,
        days_elapsed: daysElapsed,
        days_remaining: daysRemaining
      }
    })

    return {
      success: true,
      data: {
        investments: processedInvestments,
        total_invested: (user as any).total_invested || 0,
        investment_returns: (user as any).investment_returns || 0,
      },
    }
  } catch (error: any) {
    console.error('❌ Error in getActiveInvestmentsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch investments',
      data: null,
    }
  }
}

// ============================================================================
// COPY TRADING ACTIONS
// ============================================================================

export interface CopyTradingPosition {
  id: number
  expert_id: string
  expert_name: string
  expert_avatar: string
  win_rate: number
  allocated_amount: number
  current_value: number
  profit: number
  profit_percent: number
  trades_copied: number
  started_at: string
  status: 'active' | 'paused' | 'stopped'
}

/**
 * Get copy trading positions
 */
export async function getCopyTradingPositionsAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('copy_trading_positions')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.error('❌ Error in getCopyTradingPositionsAction:', error)
      return {
        success: false,
        error: 'Failed to fetch copy trading positions',
        data: null,
      }
    }

    return {
      success: true,
      data: ((user as any).copy_trading_positions as CopyTradingPosition[]) || [],
    }
  } catch (error: any) {
    console.error('❌ Error in getCopyTradingPositionsAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch copy trading positions',
      data: null,
    }
  }
}

// ============================================================================
// VERIFICATION ACTIONS
// ============================================================================

export interface VerificationStatus {
  status: 'unverified' | 'pending' | 'verified' | 'rejected'
  level: 'none' | 'basic' | 'intermediate' | 'advanced'
  verified_at: string | null
}

/**
 * Get user verification status
 */
export async function getVerificationStatusAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: null,
      }
    }

    const userId = sessionCookie.value

    const { data: user, error } = await supabase
      .from('users')
      .select('verification_status, verification_level, verified_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.error('❌ Error in getVerificationStatusAction:', error)
      return {
        success: false,
        error: 'Failed to fetch verification status',
        data: null,
      }
    }

    return {
      success: true,
      data: {
        status: (user as any).verification_status || 'unverified',
        level: (user as any).verification_level || 'none',
        verified_at: (user as any).verified_at || null,
      },
    }
  } catch (error: any) {
    console.error('❌ Error in getVerificationStatusAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch verification status',
      data: null,
    }
  }
}

// ============================================================================
// ADMIN PLANS SECTION
// ============================================================================

export interface StakingPlan {
  id: string
  name: string
  symbol: string
  apy: number
  min_amount: number
  max_amount: number
  duration_days: number
  is_joint_allowed: boolean
  is_active: boolean
  created_at: string
}

export interface InvestmentPlan {
  id: string
  name: string
  plan_type: string
  min_investment: number
  max_investment: number
  duration_days: number
  roi_percent: number
  risk_level: 'low' | 'medium' | 'high'
  strategy: string
  is_joint_allowed: boolean
  is_active: boolean
  created_at: string
}

/**
 * Get staking plans from admin
 * Returns available staking plans if user's admin_id matches
 */
export async function getAdminStakingPlansAction() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value

    if (!userId) {
      return {
        success: false,
        error: 'Not authenticated',
        data: [],
      }
    }

    // Get user's admin_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('admin_id')
      .eq('id', userId)
      .single()

    if (userError || !user || !(user as any).admin_id) {
      console.log('User has no admin_id, returning empty plans')
      return {
        success: true,
        data: [],
      }
    }

    const adminId = (user as any).admin_id

    // Get admin's staking plans
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('staking_plans')
      .eq('id', adminId)
      .single()

    if (adminError || !admin) {
      console.error('❌ Error fetching admin staking plans:', adminError)
      return {
        success: false,
        error: 'Failed to fetch staking plans',
        data: [],
      }
    }

    const stakingPlans = ((admin as any).staking_plans || []) as StakingPlan[]
    
    // Filter only active plans
    const activePlans = stakingPlans.filter(plan => plan.is_active)

    return {
      success: true,
      data: activePlans,
    }
  } catch (error: any) {
    console.error('❌ Error in getAdminStakingPlansAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch staking plans',
      data: [],
    }
  }
}

/**
 * Get investment plans from admin
 * Returns available investment plans if user's admin_id matches
 */
export async function getAdminInvestmentPlansAction() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value

    if (!userId) {
      return {
        success: false,
        error: 'Not authenticated',
        data: [],
      }
    }

    // Get user's admin_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('admin_id')
      .eq('id', userId)
      .single()

    if (userError || !user || !(user as any).admin_id) {
      console.log('User has no admin_id, returning empty plans')
      return {
        success: true,
        data: [],
      }
    }

    const adminId = (user as any).admin_id

    // Get admin's investment plans
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('investment_plans')
      .eq('id', adminId)
      .single()

    if (adminError || !admin) {
      console.error('❌ Error fetching admin investment plans:', adminError)
      return {
        success: false,
        error: 'Failed to fetch investment plans',
        data: [],
      }
    }

    const investmentPlans = ((admin as any).investment_plans || []) as InvestmentPlan[]
    
    // Filter only active plans
    const activePlans = investmentPlans.filter(plan => plan.is_active)

    return {
      success: true,
      data: activePlans,
    }
  } catch (error: any) {
    console.error('❌ Error in getAdminInvestmentPlansAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch investment plans',
      data: [],
    }
  }
}

// ============================================================================
// SUBSCRIPTION PLANS SECTION
// ============================================================================

export interface SubscriptionPlan {
  id: string
  name: string
  display_name: string
  tier: number
  price_monthly: number
  price_yearly: number
  description: string
  features: string[]
  limits: {
    trading_fee: number
    withdrawal_fee: number
    max_trades_per_day: number
    max_withdrawal_per_day: number
  }
  color: string
  icon: string
  is_active: boolean
  is_popular: boolean
  created_at: string
}

/**
 * Get subscription plans from admin
 * Returns available subscription plans if user's admin_id matches
 */
export async function getAdminSubscriptionPlansAction() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value

    if (!userId) {
      return {
        success: false,
        error: 'Not authenticated',
        data: [],
      }
    }

    // Get user's admin_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('admin_id')
      .eq('id', userId)
      .single()

    if (userError || !user || !(user as any).admin_id) {
      console.log('User has no admin_id, returning empty plans')
      return {
        success: true,
        data: [],
      }
    }

    const adminId = (user as any).admin_id

    // Get admin's subscription plans
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('subscription_plans')
      .eq('id', adminId)
      .single()

    if (adminError || !admin) {
      console.error('❌ Error fetching admin subscription plans:', adminError)
      return {
        success: false,
        error: 'Failed to fetch subscription plans',
        data: [],
      }
    }

    const subscriptionPlans = ((admin as any).subscription_plans || []) as SubscriptionPlan[]
    
    // Filter only active plans and sort by tier
    const activePlans = subscriptionPlans
      .filter(plan => plan.is_active)
      .sort((a, b) => a.tier - b.tier)

    return {
      success: true,
      data: activePlans,
    }
  } catch (error: any) {
    console.error('❌ Error in getAdminSubscriptionPlansAction:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch subscription plans',
      data: [],
    }
  }
}
