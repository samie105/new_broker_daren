'use server'

import { requireAdmin } from '@/lib/admin-helpers'
import { createServerSupabase } from '@/server/db/supabase'
import { addNotificationAction } from '../notifications'

// Approve deposit - updates status and adds to wallet balance
export async function approveDepositAction(userId: string, depositId: number) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('deposits, wallet_balance, email, first_name')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return { success: false, error: 'User not found', message: '' }
    }

    const deposits = (user.deposits || []) as any[]
    const depositIndex = deposits.findIndex((d: any) => d.id === depositId)

    if (depositIndex === -1) {
      return { success: false, error: 'Deposit not found', message: '' }
    }

    const deposit = deposits[depositIndex]
    
    if (deposit.status === 'completed') {
      return { success: false, error: 'Deposit already approved', message: '' }
    }

    // Update deposit status
    deposits[depositIndex] = {
      ...deposit,
      status: 'completed',
      confirmations: '6/2',
      approved_at: new Date().toISOString()
    }

    // Calculate new balance
    const depositValue = typeof deposit.value === 'number' ? deposit.value : parseFloat(deposit.value || '0')
    const currentBalance = typeof user.wallet_balance === 'number' ? user.wallet_balance : parseFloat(user.wallet_balance || '0')
    const newBalance = currentBalance + depositValue

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        deposits: deposits as any,
        wallet_balance: newBalance,
        total_deposited: currentBalance + depositValue
      } as any)
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message, message: '' }
    }

    // Send notification to user
    await addNotificationAction(userId, {
      type: 'transaction',
      title: '✅ Deposit Approved',
      message: `Your deposit of ${deposit.amount} ${deposit.symbol} ($${deposit.value.toLocaleString()}) has been approved and credited to your account.`,
      icon: '💰',
      action_url: '/dashboard/history',
      metadata: {
        deposit_id: depositId,
        amount: deposit.amount,
        symbol: deposit.symbol,
        value: deposit.value
      }
    })

    return { 
      success: true, 
      message: 'Deposit approved successfully',
      data: { newBalance, deposit: deposits[depositIndex] }
    }
  } catch (error: any) {
    console.error('Approve deposit error:', error)
    return { success: false, error: error.message, message: '' }
  }
}

// Reject deposit
export async function rejectDepositAction(userId: string, depositId: number, reason: string) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('deposits, email, first_name')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return { success: false, error: 'User not found', message: '' }
    }

    const deposits = (user.deposits || []) as any[]
    const depositIndex = deposits.findIndex((d: any) => d.id === depositId)

    if (depositIndex === -1) {
      return { success: false, error: 'Deposit not found', message: '' }
    }

    const deposit = deposits[depositIndex]

    // Update deposit status
    deposits[depositIndex] = {
      ...deposit,
      status: 'failed',
      rejection_reason: reason,
      rejected_at: new Date().toISOString()
    }

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({ deposits: deposits as any } as any)
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message, message: '' }
    }

    // Send notification to user
    await addNotificationAction(userId, {
      type: 'transaction',
      title: '❌ Deposit Rejected',
      message: `Your deposit of ${deposit.amount} ${deposit.symbol} was rejected. Reason: ${reason}`,
      icon: '⚠️',
      action_url: '/dashboard/deposits',
      metadata: {
        deposit_id: depositId,
        reason
      }
    })

    return { success: true, message: 'Deposit rejected', data: deposits[depositIndex] }
  } catch (error: any) {
    console.error('Reject deposit error:', error)
    return { success: false, error: error.message, message: '' }
  }
}

// Approve withdrawal - deducts from wallet balance
export async function approveWithdrawalAction(userId: string, withdrawalId: number) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('withdrawals, wallet_balance, email, first_name, total_withdrawn')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return { success: false, error: 'User not found', message: '' }
    }

    const withdrawals = (user.withdrawals || []) as any[]
    const withdrawalIndex = withdrawals.findIndex((w: any) => w.id === withdrawalId)

    if (withdrawalIndex === -1) {
      return { success: false, error: 'Withdrawal not found', message: '' }
    }

    const withdrawal = withdrawals[withdrawalIndex]
    
    if (withdrawal.status === 'completed') {
      return { success: false, error: 'Withdrawal already approved', message: '' }
    }

    // Calculate withdrawal amount (amount + fee)
    const totalAmount = parseFloat(withdrawal.amount || '0')
    const currentBalance = typeof user.wallet_balance === 'number' ? user.wallet_balance : parseFloat(user.wallet_balance || '0')

    // Check if user has sufficient balance (this should already be checked, but double-check)
    if (currentBalance < totalAmount) {
      return { success: false, error: 'Insufficient balance', message: '' }
    }

    // Generate transaction hash
    const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`

    // Update withdrawal status
    withdrawals[withdrawalIndex] = {
      ...withdrawal,
      status: 'completed',
      tx_hash: txHash,
      approved_at: new Date().toISOString()
    }

    // Calculate new balance (deduct withdrawal amount)
    const newBalance = currentBalance - totalAmount

    // Update user
    const totalWithdrawn = typeof user.total_withdrawn === 'number' ? user.total_withdrawn : parseFloat(user.total_withdrawn || '0')
    const { error: updateError } = await supabase
      .from('users')
      .update({
        withdrawals: withdrawals as any,
        wallet_balance: newBalance,
        total_withdrawn: totalWithdrawn + totalAmount
      } as any)
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message, message: '' }
    }

    // Send notification to user
    await addNotificationAction(userId, {
      type: 'transaction',
      title: '✅ Withdrawal Approved',
      message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.symbol} has been processed. TX: ${txHash.slice(0, 10)}...`,
      icon: '💸',
      action_url: '/dashboard/history',
      metadata: {
        withdrawal_id: withdrawalId,
        amount: withdrawal.amount,
        symbol: withdrawal.symbol,
        tx_hash: txHash
      }
    })

    return { 
      success: true, 
      message: 'Withdrawal approved successfully',
      data: { newBalance, withdrawal: withdrawals[withdrawalIndex] }
    }
  } catch (error: any) {
    console.error('Approve withdrawal error:', error)
    return { success: false, error: error.message, message: '' }
  }
}

// Reject withdrawal
export async function rejectWithdrawalAction(userId: string, withdrawalId: number, reason: string) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('withdrawals, email, first_name')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return { success: false, error: 'User not found', message: '' }
    }

    const withdrawals = (user.withdrawals || []) as any[]
    const withdrawalIndex = withdrawals.findIndex((w: any) => w.id === withdrawalId)

    if (withdrawalIndex === -1) {
      return { success: false, error: 'Withdrawal not found', message: '' }
    }

    const withdrawal = withdrawals[withdrawalIndex]

    // Update withdrawal status
    withdrawals[withdrawalIndex] = {
      ...withdrawal,
      status: 'failed',
      rejection_reason: reason,
      rejected_at: new Date().toISOString()
    }

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({ withdrawals: withdrawals as any } as any)
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message, message: '' }
    }

    // Send notification to user
    await addNotificationAction(userId, {
      type: 'transaction',
      title: '❌ Withdrawal Rejected',
      message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.symbol} was rejected. Reason: ${reason}`,
      icon: '⚠️',
      action_url: '/dashboard/withdraw',
      metadata: {
        withdrawal_id: withdrawalId,
        reason
      }
    })

    return { success: true, message: 'Withdrawal rejected', data: withdrawals[withdrawalIndex] }
  } catch (error: any) {
    console.error('Reject withdrawal error:', error)
    return { success: false, error: error.message, message: '' }
  }
}

// Get all deposits from all users
export async function getAllDepositsAction() {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, deposits')
      .not('deposits', 'is', null)

    if (error) throw error

    // Flatten all deposits with user info
    const allDeposits: any[] = []
    
    users?.forEach((user: any) => {
      const deposits = user.deposits || []
      deposits.forEach((deposit: any) => {
        allDeposits.push({
          ...deposit,
          user_id: user.id,
          user_email: user.email,
          user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
        })
      })
    })

    // Sort by date (newest first)
    allDeposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return { success: true, data: allDeposits }
  } catch (error: any) {
    console.error('Get all deposits error:', error)
    return { success: false, error: error.message }
  }
}

// Get all withdrawals from all users
export async function getAllWithdrawalsAction() {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, withdrawals')
      .not('withdrawals', 'is', null)

    if (error) throw error

    // Flatten all withdrawals with user info
    const allWithdrawals: any[] = []
    
    users?.forEach((user: any) => {
      const withdrawals = user.withdrawals || []
      withdrawals.forEach((withdrawal: any) => {
        allWithdrawals.push({
          ...withdrawal,
          user_id: user.id,
          user_email: user.email,
          user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
        })
      })
    })

    // Sort by date (newest first)
    allWithdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return { success: true, data: allWithdrawals }
  } catch (error: any) {
    console.error('Get all withdrawals error:', error)
    return { success: false, error: error.message }
  }
}

// Get pending transactions
export async function getPendingTransactionsAction() {
  try {
    await requireAdmin()
    
    const [depositsResult, withdrawalsResult] = await Promise.all([
      getAllDepositsAction(),
      getAllWithdrawalsAction()
    ])

    const pendingDeposits = depositsResult.success 
      ? depositsResult.data?.filter((d: any) => d.status === 'pending') || []
      : []

    const pendingWithdrawals = withdrawalsResult.success
      ? withdrawalsResult.data?.filter((w: any) => w.status === 'pending') || []
      : []

    return { 
      success: true, 
      data: {
        deposits: pendingDeposits,
        withdrawals: pendingWithdrawals,
        total: pendingDeposits.length + pendingWithdrawals.length
      }
    }
  } catch (error: any) {
    console.error('Get pending transactions error:', error)
    return { success: false, error: error.message }
  }
}

