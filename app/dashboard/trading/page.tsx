import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { PortfolioBalanceServer } from '@/components/dashboard/trading/portfolio-balance-server'
import { ActiveOrdersServer } from '@/components/dashboard/trading/active-orders-server'
import { TradingPageClient } from '@/components/dashboard/trading/trading-page-client'

export default function TradingPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="space-y-2 mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-foreground">Live Trading</h1>
          <p className="text-muted-foreground text-sm">Execute trades in real-time with advanced tools</p>
        </div>

        {/* Client Component with Server Components as children */}
        <TradingPageClient>
          {/* Portfolio Balance - Server Component */}
          <div className="mb-6">
            <PortfolioBalanceServer />
          </div>
        </TradingPageClient>

        {/* Active Orders - Server Component */}
        <div className="flex-shrink-0">
          <ActiveOrdersServer />
        </div>
      </div>
    </DashboardLayout>
  )
}
