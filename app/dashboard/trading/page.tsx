import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { TradingViewLayout } from '@/components/dashboard/trading/trading-view-layout'
import { PortfolioBalanceServer } from '@/components/dashboard/trading/portfolio-balance-server'
import { ActiveOrdersServer } from '@/components/dashboard/trading/active-orders-server'

export default function TradingPage() {
  return (
    <DashboardLayout>
      <TradingViewLayout>
        <PortfolioBalanceServer />
        <ActiveOrdersServer />
      </TradingViewLayout>
    </DashboardLayout>
  )
}
