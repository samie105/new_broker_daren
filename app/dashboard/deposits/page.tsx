import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DepositMethods } from '@/components/dashboard/deposits/deposit-methods'
import { DepositHistory } from '@/components/dashboard/deposits/deposit-history-server'

export default function DepositsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deposits</h1>
          <p className="text-muted-foreground">Add funds to your trading account</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepositMethods />
          <DepositHistory />
        </div>
      </div>
    </DashboardLayout>
  )
}