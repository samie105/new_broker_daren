/**
 * Notification Helper Utilities
 * 
 * This file contains helper functions to easily create notifications
 * for various user actions throughout the application.
 */

import { addNotificationAction } from './notifications'
import type { UserNotification } from '@/server/types/database'

/**
 * Send a transaction notification
 */
export async function notifyTransaction(
  userId: string,
  type: 'deposit' | 'withdrawal' | 'transfer',
  amount: number,
  currency: string,
  status: 'pending' | 'completed' | 'failed',
  transactionId?: string
) {
  const titles: Record<typeof type, string> = {
    deposit: 'Deposit Received',
    withdrawal: 'Withdrawal Processed',
    transfer: 'Transfer Completed'
  }

  const messages: Record<typeof type, Record<typeof status, string>> = {
    deposit: {
      pending: `Your deposit of $${amount.toLocaleString()} ${currency} is being processed.`,
      completed: `Your deposit of $${amount.toLocaleString()} ${currency} has been completed successfully.`,
      failed: `Your deposit of $${amount.toLocaleString()} ${currency} has failed. Please try again.`
    },
    withdrawal: {
      pending: `Your withdrawal of $${amount.toLocaleString()} ${currency} is being processed.`,
      completed: `Your withdrawal of $${amount.toLocaleString()} ${currency} has been completed successfully.`,
      failed: `Your withdrawal of $${amount.toLocaleString()} ${currency} has failed. Please contact support.`
    },
    transfer: {
      pending: `Your transfer of $${amount.toLocaleString()} ${currency} is being processed.`,
      completed: `Your transfer of $${amount.toLocaleString()} ${currency} has been completed successfully.`,
      failed: `Your transfer of $${amount.toLocaleString()} ${currency} has failed. Please try again.`
    }
  }

  return addNotificationAction(userId, {
    type: 'transaction',
    title: titles[type],
    message: messages[type][status],
    icon: status === 'completed' ? '✅' : status === 'failed' ? '❌' : '⏳',
    action_url: transactionId ? `/dashboard/history?transaction=${transactionId}` : '/dashboard/history',
    metadata: {
      transaction_id: transactionId,
      amount,
      currency,
      status
    }
  })
}

/**
 * Send a trade notification
 */
export async function notifyTrade(
  userId: string,
  action: 'opened' | 'closed',
  pair: string,
  amount: number,
  profitLoss?: number,
  tradeId?: string
) {
  const isProfit = profitLoss && profitLoss > 0
  const title = action === 'opened' ? 'Trade Opened' : 'Trade Closed'
  
  const message = action === 'opened'
    ? `You've opened a ${pair} position with $${amount.toLocaleString()}.`
    : `Your ${pair} position closed with ${isProfit ? 'a profit' : 'a loss'} of $${Math.abs(profitLoss || 0).toLocaleString()}.`

  return addNotificationAction(userId, {
    type: 'trade',
    title,
    message,
    icon: action === 'opened' ? '📈' : isProfit ? '🎉' : '📉',
    action_url: tradeId ? `/dashboard/trading?trade=${tradeId}` : '/dashboard/trading',
    metadata: {
      pair,
      amount,
      profit_loss: profitLoss,
      trade_id: tradeId
    }
  })
}

/**
 * Send a staking notification
 */
export async function notifyStaking(
  userId: string,
  action: 'started' | 'completed' | 'rewards',
  pool: string,
  amount: number,
  rewards?: number,
  stakingId?: string
) {
  const titles: Record<typeof action, string> = {
    started: 'Staking Started',
    completed: 'Staking Completed',
    rewards: 'Staking Rewards Earned'
  }

  const messages: Record<typeof action, string> = {
    started: `You've staked ${amount.toLocaleString()} tokens in ${pool}.`,
    completed: `Your ${pool} staking period has ended. You can now withdraw your tokens.`,
    rewards: `You've earned ${rewards?.toLocaleString() || 0} tokens in staking rewards from ${pool}!`
  }

  return addNotificationAction(userId, {
    type: 'staking',
    title: titles[action],
    message: messages[action],
    icon: action === 'rewards' ? '🎁' : '🪙',
    action_url: stakingId ? `/dashboard/staking?pool=${stakingId}` : '/dashboard/staking',
    metadata: {
      pool,
      amount,
      rewards,
      staking_id: stakingId
    }
  })
}

/**
 * Send an investment notification
 */
export async function notifyInvestment(
  userId: string,
  action: 'started' | 'matured' | 'payout',
  plan: string,
  amount: number,
  returns?: number,
  investmentId?: string
) {
  const titles: Record<typeof action, string> = {
    started: 'Investment Started',
    matured: 'Investment Matured',
    payout: 'Investment Payout'
  }

  const messages: Record<typeof action, string> = {
    started: `Your investment of $${amount.toLocaleString()} in ${plan} has started.`,
    matured: `Your ${plan} investment has matured! Total value: $${(amount + (returns || 0)).toLocaleString()}.`,
    payout: `You've received $${returns?.toLocaleString() || 0} from your ${plan} investment.`
  }

  return addNotificationAction(userId, {
    type: 'investment',
    title: titles[action],
    message: messages[action],
    icon: action === 'payout' ? '💰' : '💼',
    action_url: investmentId ? `/dashboard/investment?id=${investmentId}` : '/dashboard/investment',
    metadata: {
      plan,
      amount,
      returns,
      investment_id: investmentId
    }
  })
}

/**
 * Send a KYC notification
 */
export async function notifyKYC(
  userId: string,
  status: 'submitted' | 'approved' | 'rejected',
  reason?: string
) {
  const titles: Record<typeof status, string> = {
    submitted: 'KYC Submitted',
    approved: 'KYC Approved',
    rejected: 'KYC Rejected'
  }

  const messages: Record<typeof status, string> = {
    submitted: 'Your KYC documents have been submitted successfully. We\'ll review them shortly.',
    approved: 'Congratulations! Your KYC verification has been approved.',
    rejected: `Your KYC verification was rejected. ${reason || 'Please resubmit with correct information.'}`
  }

  return addNotificationAction(userId, {
    type: 'kyc',
    title: titles[status],
    message: messages[status],
    icon: status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '📋',
    action_url: '/dashboard/verification',
    metadata: {
      status,
      rejection_reason: reason
    }
  })
}

/**
 * Send a security notification
 */
export async function notifySecurity(
  userId: string,
  event: 'login' | 'password_changed' | '2fa_enabled' | '2fa_disabled' | 'suspicious_activity',
  details?: string
) {
  const titles: Record<typeof event, string> = {
    login: 'New Login Detected',
    password_changed: 'Password Changed',
    '2fa_enabled': 'Two-Factor Authentication Enabled',
    '2fa_disabled': 'Two-Factor Authentication Disabled',
    suspicious_activity: 'Suspicious Activity Detected'
  }

  const messages: Record<typeof event, string> = {
    login: `A new login was detected on your account. ${details || ''}`,
    password_changed: 'Your account password has been changed successfully.',
    '2fa_enabled': 'Two-factor authentication has been enabled for your account.',
    '2fa_disabled': 'Two-factor authentication has been disabled for your account.',
    suspicious_activity: `We detected suspicious activity on your account. ${details || 'Please review your recent activity.'}`
  }

  return addNotificationAction(userId, {
    type: 'security',
    title: titles[event],
    message: messages[event],
    icon: event === 'suspicious_activity' ? '⚠️' : '🔒',
    action_url: '/dashboard/settings?tab=security',
    metadata: {
      event,
      details
    }
  })
}

/**
 * Send a system notification
 */
export async function notifySystem(
  userId: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  return addNotificationAction(userId, {
    type: 'system',
    title,
    message,
    icon: '⚙️',
    action_url: actionUrl
  })
}

/**
 * Send an announcement
 */
export async function notifyAnnouncement(
  userId: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  return addNotificationAction(userId, {
    type: 'announcement',
    title,
    message,
    icon: '📢',
    action_url: actionUrl
  })
}
