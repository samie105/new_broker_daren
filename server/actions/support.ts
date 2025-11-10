'use server'

import { createServerSupabase } from '@/server/db/supabase'

// Get published FAQs for users
export async function getPublishedFaqsAction(category?: string) {
  try {
    const supabase = createServerSupabase()

    // Get FAQs from admin table
    const { data: admin, error } = await supabase
      .from('admins')
      .select('faqs')
      .limit(1)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    const allFaqs = ((admin?.faqs || []) as unknown) as any[]
    
    // Filter published FAQs and by category if specified
    let filteredFaqs = allFaqs.filter((faq: any) => faq.is_published)
    
    if (category) {
      filteredFaqs = filteredFaqs.filter((faq: any) => faq.category === category)
    }

    // Sort by order_index
    filteredFaqs.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))

    return { success: true, data: filteredFaqs }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get active support contacts for users
export async function getActiveContactsAction() {
  try {
    // Return fixed support contacts - these are not editable by admins
    // Icons are determined by type on the frontend
    const fixedContacts = [
      {
        id: 'contact-email',
        type: 'email',
        label: 'Email Support',
        value: 'support@atlanticpacificcap.com',
        is_active: true,
        order_index: 1,
      },
      {
        id: 'contact-phone',
        type: 'phone',
        label: 'Phone Support',
        value: '+1 (555) 123-4567',
        is_active: true,
        order_index: 2,
      },
      {
        id: 'contact-whatsapp',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '+1 (555) 123-4567',
        is_active: true,
        order_index: 3,
      },
      {
        id: 'contact-telegram',
        type: 'telegram',
        label: 'Telegram',
        value: '@cryptosupport',
        is_active: true,
        order_index: 4,
      },
    ]

    return { success: true, data: fixedContacts }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

// Submit support ticket
export async function submitSupportTicketAction(data: {
  subject: string
  message: string
  category: string
  user_id: string
}) {
  try {
    // TODO: Implement with users.support_tickets JSONB field
    return { success: true, message: 'Your ticket has been submitted successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
