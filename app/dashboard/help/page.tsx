import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { HelpSupport } from '@/components/dashboard/help/help-support'
import { HelpFAQ } from '@/components/dashboard/help/help-faq'

export default function HelpPage() {
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
        <HelpSupport />

        {/* FAQ Section */}
        <HelpFAQ />
      </div>
    </DashboardLayout>
  )
}
