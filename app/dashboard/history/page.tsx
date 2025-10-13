import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { HistorySummaryServer } from '@/components/dashboard/history/history-summary-server'
import { TransactionHistoryTableServer } from '@/components/dashboard/history/transaction-history-table-server'

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground">Complete overview of all your account activity</p>
        </div>

        {/* Summary Statistics */}
        <HistorySummaryServer />

        {/* Transaction History Table */}
        <TransactionHistoryTableServer />
      </div>
    </DashboardLayout>
  )
}