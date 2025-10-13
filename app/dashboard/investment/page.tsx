import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { InvestmentOverviewServer } from '@/components/dashboard/investment/investment-overview-server'
import { AvailablePlansServer } from '@/components/dashboard/investment/available-plans-server'
import { ActiveInvestmentsServer } from '@/components/dashboard/investment/active-investments-server'

export default function InvestmentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Investments</h1>
          <p className="text-muted-foreground text-sm">Grow your wealth with strategic crypto investments</p>
        </div>

        {/* Investment Overview Stats */}
        <InvestmentOverviewServer />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Available Plans - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <AvailablePlansServer />
          </div>
          
          {/* Active Investments - Takes 1 column on xl screens */}
          <div>
            <ActiveInvestmentsServer />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
