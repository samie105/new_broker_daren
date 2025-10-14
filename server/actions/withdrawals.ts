'use server'

import { supabase } from '../db/supabase'
import { cookies } from 'next/headers'
import { ApiResponse } from '../types/database'
import { notifyTransaction } from './notification-helpers'
import { sendWithdrawalNotification } from '../email/nodemailer'

interface WithdrawalData {
  symbol: string
  name: string
  amount: number
  address: string
  network: string
  fee: number
  taxCodePin: string
  withdrawalPin: string
}

export async function validateTaxCodePinAction(taxCodePin: string): Promise<ApiResponse<boolean>> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: false
      }
    }

    const userId = sessionCookie.value

    // Get user's actual tax code PIN
    const { data: user, error } = await supabase
      .from('users')
      .select('tax_code_pin, email, first_name')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'Failed to fetch user data',
        data: false
      }
    }

    // Validate tax code PIN
    if ((user as any).tax_code_pin !== taxCodePin) {
      return {
        success: false,
        error: 'Invalid tax code PIN',
        data: false
      }
    }

    return {
      success: true,
      message: 'Tax code verified',
      data: true
    }
  } catch (error: any) {
    console.error('❌ Error validating tax code PIN:', error)
    return {
      success: false,
      error: error.message || 'Failed to validate tax code PIN',
      data: false
    }
  }
}

export async function validateWithdrawalPinAction(withdrawalPin: string): Promise<ApiResponse<boolean>> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated',
        data: false
      }
    }

    const userId = sessionCookie.value

    // Get user's actual withdrawal PIN
    const { data: user, error } = await supabase
      .from('users')
      .select('withdrawal_pin')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'Failed to fetch user data',
        data: false
      }
    }

    // Validate withdrawal PIN
    if ((user as any).withdrawal_pin !== withdrawalPin) {
      return {
        success: false,
        error: 'Invalid withdrawal PIN',
        data: false
      }
    }

    return {
      success: true,
      message: 'Withdrawal PIN verified',
      data: true
    }
  } catch (error: any) {
    console.error('❌ Error validating withdrawal PIN:', error)
    return {
      success: false,
      error: error.message || 'Failed to validate withdrawal PIN',
      data: false
    }
  }
}

export async function processWithdrawalAction(
  withdrawalData: WithdrawalData
): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth_session')

    if (!sessionCookie) {
      return {
        success: false,
        error: 'Not authenticated'
      }
    }

    const userId = sessionCookie.value

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('withdrawals, portfolio_holdings, total_withdrawn, email, first_name, last_name')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return {
        success: false,
        error: 'Failed to fetch user data'
      }
    }

    const withdrawals = (user as any).withdrawals || []
    const holdings = (user as any).portfolio_holdings || []

    // Check if user has sufficient balance
    const holding = holdings.find((h: any) => h.symbol === withdrawalData.symbol)
    if (!holding || holding.balance < withdrawalData.amount) {
      return {
        success: false,
        error: 'Insufficient balance'
      }
    }

    // Create new withdrawal record
    const newWithdrawal = {
      id: withdrawals.length + 1,
      symbol: withdrawalData.symbol,
      name: withdrawalData.name,
      amount: withdrawalData.amount,
      address: withdrawalData.address,
      network: withdrawalData.network,
      status: 'pending',
      fee: withdrawalData.fee,
      tx_hash: null,
      date: new Date().toISOString(),
      icon: `/assets/crypto/${withdrawalData.symbol}.svg`
    }

    // Add to withdrawals array
    withdrawals.push(newWithdrawal)

    // Update user's portfolio holdings (deduct amount + fee)
    const totalDeducted = withdrawalData.amount + withdrawalData.fee
    const updatedHoldings = holdings.map((h: any) => {
      if (h.symbol === withdrawalData.symbol) {
        return {
          ...h,
          balance: h.balance - totalDeducted
        }
      }
      return h
    })

    // Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        withdrawals: withdrawals,
        portfolio_holdings: updatedHoldings,
        total_withdrawn: ((user as any).total_withdrawn || 0) + withdrawalData.amount
      } as any as never)
      .eq('id', userId)

    if (updateError) {
      console.error('❌ Error updating user withdrawals:', updateError)
      return {
        success: false,
        error: 'Failed to process withdrawal'
      }
    }

    // Send notification
    try {
      await notifyTransaction(
        userId,
        'withdrawal',
        withdrawalData.amount,
        withdrawalData.symbol,
        'pending',
        newWithdrawal.id.toString()
      )
    } catch (notifError) {
      console.error('❌ Error sending notification:', notifError)
      // Don't fail withdrawal if notification fails
    }

    // Send email notification
    try {
      const userEmail = (user as any).email

      await sendWithdrawalNotification(
        userEmail,
        `${withdrawalData.amount} (Fee: ${withdrawalData.fee})`,
        withdrawalData.symbol,
        withdrawalData.address
      )
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError)
      // Don't fail withdrawal if email fails
    }

    return {
      success: true,
      message: 'Withdrawal processed successfully',
      data: newWithdrawal
    }
  } catch (error: any) {
    console.error('❌ Error processing withdrawal:', error)
    return {
      success: false,
      error: error.message || 'Failed to process withdrawal'
    }
  }
}
