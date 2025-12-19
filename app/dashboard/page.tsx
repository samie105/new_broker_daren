import React, { Suspense } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { GainersLosers } from '@/components/dashboard/gainers-losers'
import { WalletBalances } from '@/components/dashboard/wallet-balances-server'
import { ExchangeSection } from '@/components/dashboard/exchange-section'
import { TradesSection } from '@/components/dashboard/trades-section-server'
import { CryptoPriceList } from '@/components/dashboard/crypto-price-list'
import { TransactionHistory } from '@/components/dashboard/transaction-history-server'
import { getDashboardMetricsAction } from '@/server/actions/portfolio'

// Async component to fetch and display user data
async function DashboardContent() {
  const metricsResult = await getDashboardMetricsAction()
  
  const metrics = metricsResult?.data
  const subscriptionPlan = metrics?.subscription_plan || 'Bronze'

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your portfolio overview • {subscriptionPlan} Plan
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <DashboardMetrics 
        portfolioValue={metrics?.portfolio_value || 0}
        activePositions={metrics?.active_positions || 0}
        totalDeposited={metrics?.total_deposited || 0}
        totalWithdrawn={metrics?.total_withdrawn || 0}
        planBonus={metrics?.plan_bonus || 0}
        subscriptionPlan={subscriptionPlan}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        <PortfolioChart />
      </div>

      {/* Wallet Balances and Exchange */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WalletBalances />
        <ExchangeSection />
      </div>

      {/* Trades and Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradesSection />
        <GainersLosers />
      </div>

      {/* Crypto Price List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CryptoPriceList />
        </div>
        <div className="space-y-6">
          <TransactionHistory />
        </div>
      </div>
    </>
  )
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded" />
        ))}
      </div>
      <div className="h-96 bg-muted rounded" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </DashboardLayout>
  )
} 