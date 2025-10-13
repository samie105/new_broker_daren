import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StakingOverviewServer } from '@/components/dashboard/staking/staking-overview-server'
import { AvailablePoolsServer } from '@/components/dashboard/staking/available-pools-server'
import { ActiveStakesServer } from '@/components/dashboard/staking/active-stakes-server'

export default function StakingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Staking</h1>
          <p className="text-muted-foreground text-sm">Stake your crypto assets and earn passive rewards</p>
        </div>

        {/* Staking Overview Stats */}
        <StakingOverviewServer />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Available Pools - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <AvailablePoolsServer />
          </div>
          
          {/* Active Stakes - Takes 1 column on xl screens */}
          <div>
            <ActiveStakesServer />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
