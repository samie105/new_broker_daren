import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { PortfolioOverviewServer } from '@/components/dashboard/portfolio/portfolio-overview-server'
import { AssetHoldingsServer } from '@/components/dashboard/portfolio/asset-holdings-server'
import { PortfolioCharts } from '@/components/dashboard/portfolio/portfolio-charts'

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground text-sm">Track your crypto investments and performance</p>
        </div>

        {/* Portfolio Overview */}
        <PortfolioOverviewServer />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Holdings - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2 space-y-8">
            <AssetHoldingsServer />
          </div>
          
          {/* Charts - Takes 1 column on xl screens */}
          <div className="space-y-8">
            <PortfolioCharts />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
