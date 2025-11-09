import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { HelpSupport } from '@/components/dashboard/help/help-support'
import { HelpFAQ } from '@/components/dashboard/help/help-faq'
import { getPublishedFaqsAction, getActiveContactsAction } from '@/server/actions/support'

export default async function HelpPage() {
  const [faqsResult, contactsResult] = await Promise.all([
    getPublishedFaqsAction(),
    getActiveContactsAction(),
  ])

  const faqs = faqsResult.success ? faqsResult.data : []
  const contacts = contactsResult.success ? contactsResult.data : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Help Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground">Get assistance with your account and trading</p>
          </div>
        </div>

        {/* Support Options */}
        <HelpSupport contacts={contacts || []} />

        {/* FAQ Section */}
        <HelpFAQ faqs={faqs || []} />
      </div>
    </DashboardLayout>
  )
}
