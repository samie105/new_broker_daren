'use server'

import { requireAdmin } from '@/lib/admin-helpers'
import { createServerSupabase } from '@/server/db/supabase'

// ==================== FAQs ====================

export async function getAllFaqsAction() {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    const { data: admin, error } = await supabase
      .from('admins')
      .select('faqs')
      .limit(1)
      .single()

    if (error) throw error

    const faqs = ((admin?.faqs || []) as unknown) as any[]
    return { success: true, data: faqs }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createFaqAction(faq: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get current FAQs with admin ID
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, faqs')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const currentFaqs = ((admin?.faqs || []) as unknown) as any[]

    // Add new FAQ
    const newFaq = {
      ...faq,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedFaqs = [...currentFaqs, newFaq]

    // Update admin record
    const { error: updateError } = await supabase
      .from('admins')
      .update({ faqs: updatedFaqs as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, data: newFaq, message: 'FAQ created successfully' }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function updateFaqAction(id: string, updates: any) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get current FAQs
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, faqs')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const currentFaqs = ((admin?.faqs || []) as unknown) as any[]
    const faqIndex = currentFaqs.findIndex((f: any) => f.id === id)

    if (faqIndex === -1) {
      return { success: false, error: 'FAQ not found', message: '' }
    }

    // Update FAQ
    currentFaqs[faqIndex] = {
      ...currentFaqs[faqIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Update admin record
    const { error: updateError } = await supabase
      .from('admins')
      .update({ faqs: currentFaqs as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, data: currentFaqs[faqIndex], message: 'FAQ updated successfully' }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

export async function deleteFaqAction(id: string) {
  try {
    await requireAdmin()
    const supabase = createServerSupabase()

    // Get current FAQs
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('id, faqs')
      .limit(1)
      .single()

    if (fetchError) throw fetchError

    const currentFaqs = ((admin?.faqs || []) as unknown) as any[]
    const updatedFaqs = currentFaqs.filter((f: any) => f.id !== id)

    // Update admin record
    const { error: updateError } = await supabase
      .from('admins')
      .update({ faqs: updatedFaqs as any })
      .eq('id', (admin as any).id)

    if (updateError) throw updateError

    return { success: true, message: 'FAQ deleted successfully' }
  } catch (error: any) {
    return { success: false, error: error.message, message: '' }
  }
}

// ==================== Support Contacts ====================
// Note: Support contacts are now FIXED and cannot be edited by admins
// They are hardcoded in the public support actions

export async function getAllContactsAction() {
  try {
    await requireAdmin()
    
    // Return fixed contacts for display in admin panel
    const fixedContacts = [
      {
        id: 'contact-email',
        type: 'email',
        label: 'Email Support',
        value: 'support@atlanticpacificcap.com',
        icon: '📧',
        is_active: true,
        order_index: 1,
      },
      {
        id: 'contact-phone',
        type: 'phone',
        label: 'Phone Support',
        value: '+1 (555) 123-4567',
        icon: '📞',
        is_active: true,
        order_index: 2,
      },
      {
        id: 'contact-whatsapp',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '+1 (555) 123-4567',
        icon: '💬',
        is_active: true,
        order_index: 3,
      },
      {
        id: 'contact-telegram',
        type: 'telegram',
        label: 'Telegram',
        value: '@cryptosupport',
        icon: '✈️',
        is_active: true,
        order_index: 4,
      },
    ]

    return { success: true, data: fixedContacts }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// These contact CRUD operations are disabled since contacts are now fixed
export async function createContactAction(contact: any) {
  return { 
    success: false, 
    error: 'Support contacts are fixed and cannot be modified', 
    message: 'Contact creation disabled' 
  }
}

export async function updateContactAction(id: string, updates: any) {
  return { 
    success: false, 
    error: 'Support contacts are fixed and cannot be modified', 
    message: 'Contact updates disabled' 
  }
}

export async function deleteContactAction(id: string) {
  return { 
    success: false, 
    error: 'Support contacts are fixed and cannot be modified', 
    message: 'Contact deletion disabled' 
  }
}

// ==================== Support Tickets ====================

export async function getAllTicketsAction(status?: string) {
  try {
    await requireAdmin()
    // TODO: Implement with users.support_tickets JSONB field
    return { success: true, data: [] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function respondToTicketAction(ticketId: string, response: string) {
  try {
    await requireAdmin()
    // TODO: Implement with users.support_tickets JSONB field
    return { success: false, error: 'Not implemented - Tickets stored in users.support_tickets JSONB' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTicketStatusAction(ticketId: string, status: string) {
  try {
    await requireAdmin()
    // TODO: Implement with users.support_tickets JSONB field
    return { success: false, error: 'Not implemented - Tickets stored in users.support_tickets JSONB' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
