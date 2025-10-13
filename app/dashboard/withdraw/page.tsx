import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { WithdrawForm } from '@/components/dashboard/withdraw/withdraw-form'
import { WithdrawalHistoryServer } from '@/components/dashboard/withdraw/withdrawal-history-server'

export default function WithdrawPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Withdraw</h1>
          <p className="text-muted-foreground">Withdraw your crypto to external wallets</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WithdrawForm />
          <WithdrawalHistoryServer />
        </div>
      </div>
    </DashboardLayout>
  )
}