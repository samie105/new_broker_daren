import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ExpertList } from '@/components/dashboard/trading-experts/expert-list'
import { CopyTradingOverviewServer } from '@/components/dashboard/trading-experts/copy-trading-overview-server'

export default function TradingExpertsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Experts</h1>
          <p className="text-muted-foreground">Follow and copy trades from professional traders</p>
        </div>

        {/* Copy Trading Overview */}
        <CopyTradingOverviewServer />

        {/* Expert List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Discover Experts</h2>
          <ExpertList />
        </div>
      </div>
    </DashboardLayout>
  )
}