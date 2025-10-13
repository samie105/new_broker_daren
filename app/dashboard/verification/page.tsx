import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { VerificationStatus } from '@/components/dashboard/verification/verification-status'
import { VerificationForm } from '@/components/dashboard/verification/verification-form'

export default function VerificationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Identity Verification</h1>
          <p className="text-muted-foreground">Verify your identity to unlock full trading features</p>
        </div>

        {/* Pending Request Status */}
        <VerificationStatus />

        {/* Verification Form */}
        <VerificationForm />
      </div>
    </DashboardLayout>
  )
}
