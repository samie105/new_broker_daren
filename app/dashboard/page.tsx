import React from 'react'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { GainersLosers } from '@/components/dashboard/gainers-losers'
import { WalletBalances } from '@/components/dashboard/wallet-balances-server'
import { ExchangeSection } from '@/components/dashboard/exchange-section'
import { TradesSection } from '@/components/dashboard/trades-section-server'
import { CryptoPriceList } from '@/components/dashboard/crypto-price-list'
import { TransactionHistory } from '@/components/dashboard/transaction-history-server'
import { getUserDetailsAction } from '@/server/actions/user'
import { getDashboardMetricsAction } from '@/server/actions/portfolio'

export default async function DashboardPage() {
  // Fetch user details and metrics on page load
  const [userResult, metricsResult] = await Promise.all([
    getUserDetailsAction(),
    getDashboardMetricsAction(),
  ])

  if (!userResult.success || !userResult.data) {
    // User not authenticated, redirect to login
    redirect('/auth/login')
  }

  const user = userResult.data
  const metrics = metricsResult.data
  const userName = user.first_name || user.username || user.email?.split('@')[0] || 'User'
  const subscriptionPlan = metrics?.subscription_plan || 'Bronze'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {userName}! 👋
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
          {/* Portfolio Chart - Full width */}
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
      </div>
    </DashboardLayout>
  )
} 