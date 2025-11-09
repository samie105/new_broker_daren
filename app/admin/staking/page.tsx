import { requireAdmin } from '@/lib/admin-helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coins, DollarSign, Users, TrendingUp, PackagePlus } from 'lucide-react'
import { getStakingStatsAction, getAllStakingAction } from '@/server/actions/admin/stats'
import { getStakingPlansAction } from '@/server/actions/admin/staking-plans'
import { StakingDataTable } from '@/components/admin/staking-data-table'
import { StakingPlansManager } from '@/components/admin/staking-plans-manager'

export default async function AdminStakingPage() {
  await requireAdmin()
  
  // Fetch real statistics and data
  const statsResult = await getStakingStatsAction()
  const stakingResult = await getAllStakingAction()
  const plansResult = await getStakingPlansAction()
  
  const stats = statsResult.data || {
    activeStakes: 0,
    totalStaked: 0,
    stakers: 0,
    avgAPY: 0,
  }

  const stakes = stakingResult.success ? stakingResult.data || [] : []
  const plans = plansResult.success ? plansResult.data || [] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staking Management</h1>
        <p className="text-muted-foreground">
          Create staking plans and manage user positions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stakes</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStakes}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalStaked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all crypto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stakers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stakers}</div>
            <p className="text-xs text-muted-foreground">Active stakers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. APY</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAPY.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions" className="gap-2">
            <Coins className="h-4 w-4" />
            User Positions
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <PackagePlus className="h-4 w-4" />
            Staking Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Staking Positions</CardTitle>
              <CardDescription>
                View and manage all user staking positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StakingDataTable stakes={stakes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staking Plans</CardTitle>
              <CardDescription>
                Create and manage staking plans (Bronze, Silver, Gold, Diamond, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StakingPlansManager plans={plans} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
