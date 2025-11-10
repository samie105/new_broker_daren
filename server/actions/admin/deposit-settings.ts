'use server'

import { requireAdmin } from '@/lib/admin-helpers'
import { createServerSupabase } from '@/server/db/supabase'

// ==================== CRYPTO DEPOSIT METHODS ====================

export async function getCryptoDepositMethodsAction() {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error } = await supabase
      .from('admins')
      .select('crypto_deposit_methods')
      .limit(1)
      .single()

    if (error) throw error

    return { success: true, data: admin?.crypto_deposit_methods || [] }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function updateCryptoDepositMethodAction(symbol: string, updates: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, crypto_deposit_methods')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.crypto_deposit_methods || []) as any[]
    const methodIndex = methods.findIndex((m: any) => m.symbol === symbol)

    if (methodIndex === -1) {
      return { success: false, error: 'Method not found', message: '' }
    }

    methods[methodIndex] = {
      ...methods[methodIndex],
      ...updates
    }

    const { error: updateError } = await supabase
      .from('admins')
      .update({ crypto_deposit_methods: methods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'Crypto deposit method updated successfully', data: methods[methodIndex] }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function addCryptoDepositMethodAction(method: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, crypto_deposit_methods')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.crypto_deposit_methods || []) as any[]
    
    // Check if symbol already exists
    if (methods.some((m: any) => m.symbol === method.symbol)) {
      return { success: false, error: 'Symbol already exists', message: '' }
    }

    methods.push(method)

    const { error: updateError } = await supabase
      .from('admins')
      .update({ crypto_deposit_methods: methods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'Crypto deposit method added successfully', data: method }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function deleteCryptoDepositMethodAction(symbol: string) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, crypto_deposit_methods')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.crypto_deposit_methods || []) as any[]
    const filteredMethods = methods.filter((m: any) => m.symbol !== symbol)

    const { error: updateError } = await supabase
      .from('admins')
      .update({ crypto_deposit_methods: filteredMethods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'Crypto deposit method deleted successfully' }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

// ==================== P2P DEPOSIT METHODS ====================

export async function getP2PDepositMethodsAction() {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error } = await supabase
      .from('admins')
      .select('p2p_deposit_methods')
      .limit(1)
      .single()

    if (error) throw error

    return { success: true, data: admin?.p2p_deposit_methods || [] }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function updateP2PDepositMethodAction(id: string, updates: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, p2p_deposit_methods')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.p2p_deposit_methods || []) as any[]
    const methodIndex = methods.findIndex((m: any) => m.id === id)

    if (methodIndex === -1) {
      return { success: false, error: 'Method not found', message: '' }
    }

    methods[methodIndex] = {
      ...methods[methodIndex],
      ...updates
    }

    const { error: updateError } = await supabase
      .from('admins')
      .update({ p2p_deposit_methods: methods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'P2P deposit method updated successfully', data: methods[methodIndex] }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function addP2PDepositMethodAction(method: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, p2p_deposit_methods')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.p2p_deposit_methods || []) as any[]
    
    // Generate unique ID if not provided
    const newMethod = {
      ...method,
      id: method.id || crypto.randomUUID()
    }

    methods.push(newMethod)

    const { error: updateError } = await supabase
      .from('admins')
      .update({ p2p_deposit_methods: methods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'P2P deposit method added successfully', data: newMethod }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function deleteP2PDepositMethodAction(id: string) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, p2p_deposit_methods')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.p2p_deposit_methods || []) as any[]
    const filteredMethods = methods.filter((m: any) => m.id !== id)

    const { error: updateError } = await supabase
      .from('admins')
      .update({ p2p_deposit_methods: filteredMethods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'P2P deposit method deleted successfully' }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

// ==================== BANK TRANSFER METHODS ====================

export async function getBankTransferMethodsAction() {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error } = await supabase
      .from('admins')
      .select('bank_transfer_info')
      .limit(1)
      .single()

    if (error) throw error

    return { success: true, data: admin?.bank_transfer_info || [] }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function updateBankTransferMethodAction(id: string, updates: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, bank_transfer_info')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.bank_transfer_info || []) as any[]
    const methodIndex = methods.findIndex((m: any) => m.id === id)

    if (methodIndex === -1) {
      return { success: false, error: 'Bank account not found', message: '' }
    }

    methods[methodIndex] = {
      ...methods[methodIndex],
      ...updates
    }

    const { error: updateError } = await supabase
      .from('admins')
      .update({ bank_transfer_info: methods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'Bank transfer method updated successfully', data: methods[methodIndex] }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function addBankTransferMethodAction(method: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, bank_transfer_info')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.bank_transfer_info || []) as any[]
    
    // Generate unique ID if not provided
    const newMethod = {
      ...method,
      id: method.id || `bank_${Date.now()}`
    }

    methods.push(newMethod)

    const { error: updateError } = await supabase
      .from('admins')
      .update({ bank_transfer_info: methods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'Bank transfer method added successfully', data: newMethod }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function deleteBankTransferMethodAction(id: string) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, bank_transfer_info')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const methods = (admin?.bank_transfer_info || []) as any[]
    const filteredMethods = methods.filter((m: any) => m.id !== id)

    const { error: updateError } = await supabase
      .from('admins')
      .update({ bank_transfer_info: filteredMethods as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'Bank transfer method deleted successfully' }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}
