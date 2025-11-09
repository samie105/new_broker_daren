'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { ApiResponse } from '@/server/types/database'

// Get investment statistics
export async function getInvestmentStatsAction(): Promise<ApiResponse<{
  activeInvestments: number
  totalInvested: number
  investors: number
  avgROI: number
}>> {
  try {
    const supabase = createServerSupabase()

    // Get all users with their active_investments JSONB field
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, active_investments')
      .not('active_investments', 'is', null)

    if (usersError) throw usersError

    // Parse JSONB and calculate stats
    let activeInvestments = 0
    let totalInvested = 0
    let totalROI = 0
    const investors = new Set<string>()

    users?.forEach(user => {
      const investments = (user.active_investments as any[]) || []
      investments.forEach(inv => {
        if (inv.status === 'active') {
          activeInvestments++
          totalInvested += inv.amount_invested || 0
          totalROI += inv.roi || 0
          investors.add(user.id)
        }
      })
    })

    const avgROI = activeInvestments > 0 ? totalROI / activeInvestments : 0

    return {
      success: true,
      data: {
        activeInvestments,
        totalInvested,
        investors: investors.size,
        avgROI,
      },
    }
  } catch (error: any) {
    console.error('Get investment stats error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch investment stats',
      data: {
        activeInvestments: 0,
        totalInvested: 0,
        investors: 0,
        avgROI: 0,
      },
    }
  }
}

// Get staking statistics
export async function getStakingStatsAction(): Promise<ApiResponse<{
  activeStakes: number
  totalStaked: number
  stakers: number
  avgAPY: number
}>> {
  try {
    const supabase = createServerSupabase()

    // Get all users with their staking_positions JSONB field
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, staking_positions')
      .not('staking_positions', 'is', null)

    if (usersError) throw usersError

    // Parse JSONB and calculate stats
    let activeStakes = 0
    let totalStaked = 0
    let totalWeightedAPY = 0
    const stakers = new Set<string>()

    users?.forEach(user => {
      const stakes = (user.staking_positions as any[]) || []
      stakes.forEach(stake => {
        if (stake.status === 'active') {
          activeStakes++
          totalStaked += stake.amount || 0
          totalWeightedAPY += (stake.apy || 0) * (stake.amount || 0)
          stakers.add(user.id)
        }
      })
    })

    const avgAPY = totalStaked > 0 ? totalWeightedAPY / totalStaked : 0

    return {
      success: true,
      data: {
        activeStakes,
        totalStaked,
        stakers: stakers.size,
        avgAPY,
      },
    }
  } catch (error: any) {
    console.error('Get staking stats error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch staking stats',
      data: {
        activeStakes: 0,
        totalStaked: 0,
        stakers: 0,
        avgAPY: 0,
      },
    }
  }
}

// Get trading statistics
export async function getTradingStatsAction(): Promise<ApiResponse<{
  openTrades: number
  totalVolume: number
  winRate: number
  totalProfitLoss: number
}>> {
  try {
    const supabase = createServerSupabase()

    // Get all users with their trades
    const { data: users, error } = await supabase
      .from('users')
      .select('trades')
      .not('trades', 'is', null)

    if (error) throw error

    // Parse JSONB and calculate stats
    let openTrades = 0
    let totalVolume = 0
    let winningTrades = 0
    let totalClosedTrades = 0
    let totalProfitLoss = 0

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    users?.forEach(user => {
      const trades = (user.trades as any[]) || []
      trades.forEach(trade => {
        if (trade.status === 'pending' || trade.status === 'open') {
          openTrades++
        }

        // Calculate stats for completed/closed trades in last 30 days
        if (trade.status === 'completed' || trade.status === 'closed') {
          const closedAt = trade.closed_at ? new Date(trade.closed_at) : new Date(trade.opened_at)
          if (closedAt >= thirtyDaysAgo) {
            totalClosedTrades++
            totalVolume += trade.total || 0
            totalProfitLoss += trade.profit || 0
            
            if ((trade.profit || 0) > 0) {
              winningTrades++
            }
          }
        }
      })
    })

    const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0

    return {
      success: true,
      data: {
        openTrades,
        totalVolume,
        winRate,
        totalProfitLoss,
      },
    }
  } catch (error: any) {
    console.error('Get trading stats error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch trading stats',
      data: {
        openTrades: 0,
        totalVolume: 0,
        winRate: 0,
        totalProfitLoss: 0,
      },
    }
  }
}

// Get dashboard overview statistics
export async function getDashboardStatsAction(): Promise<ApiResponse<{
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  pendingVerifications: number
}>> {
  try {
    const supabase = createServerSupabase()

    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Get active users (logged in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers, error: activeError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', thirtyDaysAgo.toISOString())

    if (activeError) throw activeError

    // Get total revenue (sum of all completed deposits from users.deposits JSONB)
    const { data: usersWithDeposits, error: depositsError } = await supabase
      .from('users')
      .select('deposits')
      .not('deposits', 'is', null)

    if (depositsError) throw depositsError

    let totalRevenue = 0
    usersWithDeposits?.forEach(user => {
      const deposits = (user.deposits as any[]) || []
      deposits.forEach(deposit => {
        if (deposit.status === 'completed') {
          totalRevenue += deposit.amount || 0
        }
      })
    })

    // Get pending verifications
    const { count: pendingVerifications, error: verifyError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('kyc_status', 'pending')

    if (verifyError) throw verifyError

    return {
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalRevenue,
        pendingVerifications: pendingVerifications || 0,
      },
    }
  } catch (error: any) {
    console.error('Get dashboard stats error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch dashboard stats',
      data: {
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        pendingVerifications: 0,
      },
    }
  }
}

// Get all investments with user details
export async function getAllInvestmentsAction(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = createServerSupabase()

    // Get all users with their active_investments
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, active_investments')
      .not('active_investments', 'is', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Flatten investments with user details
    const investments: any[] = []
    users?.forEach(user => {
      const userInvestments = (user.active_investments as any[]) || []
      userInvestments.forEach(inv => {
        investments.push({
          ...inv,
          user_id: user.id,
          users: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        })
      })
    })

    return {
      success: true,
      data: investments,
    }
  } catch (error: any) {
    console.error('Get all investments error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch investments',
      data: [],
    }
  }
}

// Get all staking positions with user details
export async function getAllStakingAction(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = createServerSupabase()

    // Get all users with their staking_positions
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, staking_positions')
      .not('staking_positions', 'is', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Flatten staking positions with user details
    const stakes: any[] = []
    users?.forEach(user => {
      const userStakes = (user.staking_positions as any[]) || []
      userStakes.forEach(stake => {
        stakes.push({
          ...stake,
          user_id: user.id,
          users: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        })
      })
    })

    return {
      success: true,
      data: stakes,
    }
  } catch (error: any) {
    console.error('Get all staking error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch staking positions',
      data: [],
    }
  }
}

// Get all trades with user details
export async function getAllTradesAction(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = createServerSupabase()

    // Get all users with their trades
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, trades')
      .not('trades', 'is', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Flatten trades with user details
    const trades: any[] = []
    users?.forEach(user => {
      const userTrades = (user.trades as any[]) || []
      userTrades.forEach(trade => {
        trades.push({
          ...trade,
          user_id: user.id,
          users: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        })
      })
    })

    return {
      success: true,
      data: trades,
    }
  } catch (error: any) {
    console.error('Get all trades error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch trades',
      data: [],
    }
  }
}
