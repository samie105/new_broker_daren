'use server'

import { supabase } from '../db/supabase'

interface CryptoDepositMethod {
  symbol: string
  name: string
  address: string
  network: string
  icon: string
  is_active: boolean
  min_deposit: number
  confirmations_required: number
}

interface P2PDepositMethod {
  id: string
  name: string
  icon: string
  username: string
  account_id: string
  is_active: boolean
  instructions: string
}

interface BankTransferInfo {
  id: string
  bank_name: string
  account_name: string
  account_number: string
  routing_number?: string
  swift_code?: string
  iban?: string
  bank_address?: string
  is_active: boolean
  instructions?: string
  icon?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// GET CRYPTO DEPOSIT METHODS
export async function getCryptoDepositMethodsAction(): Promise<ApiResponse<CryptoDepositMethod[]>> {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('crypto_deposit_methods')
      .limit(1)
      .single()

    if (error) {
      console.error('❌ Error fetching crypto deposit methods:', error)
      return {
        success: false,
        error: 'Failed to fetch crypto deposit methods',
        data: []
      }
    }

    const methods = (admin as any)?.crypto_deposit_methods || []
    const activeMethods = methods.filter((method: CryptoDepositMethod) => method.is_active)

    return {
      success: true,
      data: activeMethods
    }
  } catch (error: any) {
    console.error('❌ Error in getCryptoDepositMethodsAction:', error)
    return {
      success: false,
      error: error.message || 'An error occurred',
      data: []
    }
  }
}

// GET P2P DEPOSIT METHODS
export async function getP2PDepositMethodsAction(): Promise<ApiResponse<P2PDepositMethod[]>> {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('p2p_deposit_methods')
      .limit(1)
      .single()

    if (error) {
      console.error('❌ Error fetching P2P deposit methods:', error)
      return {
        success: false,
        error: 'Failed to fetch P2P deposit methods',
        data: []
      }
    }

    const methods = (admin as any)?.p2p_deposit_methods || []
    const activeMethods = methods.filter((method: P2PDepositMethod) => method.is_active)

    return {
      success: true,
      data: activeMethods
    }
  } catch (error: any) {
    console.error('❌ Error in getP2PDepositMethodsAction:', error)
    return {
      success: false,
      error: error.message || 'An error occurred',
      data: []
    }
  }
}

// GET BANK TRANSFER INFO
export async function getBankTransferInfoAction(): Promise<ApiResponse<BankTransferInfo[]>> {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('bank_transfer_info')
      .limit(1)
      .single()

    if (error) {
      console.error('❌ Error fetching bank transfer info:', error)
      return {
        success: false,
        error: 'Failed to fetch bank transfer information',
        data: []
      }
    }

    const bankInfo = (admin as any)?.bank_transfer_info || []
    const activeInfo = bankInfo.filter((info: BankTransferInfo) => info.is_active)

    return {
      success: true,
      data: activeInfo
    }
  } catch (error: any) {
    console.error('❌ Error in getBankTransferInfoAction:', error)
    return {
      success: false,
      error: error.message || 'An error occurred',
      data: []
    }
  }
}

// GET USER TRANSACTION HISTORY
export async function getTransactionHistoryAction(userId: string): Promise<ApiResponse> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('transaction_history')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching transaction history:', error)
      return {
        success: false,
        error: 'Failed to fetch transaction history',
        data: []
      }
    }

    const history = (user as any)?.transaction_history || []

    return {
      success: true,
      data: history
    }
  } catch (error: any) {
    console.error('❌ Error in getTransactionHistoryAction:', error)
    return {
      success: false,
      error: error.message || 'An error occurred',
      data: []
    }
  }
}
