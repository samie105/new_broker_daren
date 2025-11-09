import { requireAdmin } from '@/lib/admin-helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, DollarSign, Users, Activity, PackagePlus } from 'lucide-react'
import { getInvestmentStatsAction, getAllInvestmentsAction } from '@/server/actions/admin/stats'
import { getInvestmentPlansAction } from '@/server/actions/admin/investment-plans'
import { InvestmentsDataTable } from '@/components/admin/investments-data-table'
import { InvestmentPlansManager } from '@/components/admin/investment-plans-manager'

export default async function AdminInvestmentsPage() {
  await requireAdmin()
  
  // Fetch real statistics and data
  const statsResult = await getInvestmentStatsAction()
  const investmentsResult = await getAllInvestmentsAction()
  const plansResult = await getInvestmentPlansAction()
  
  const stats = statsResult.data || {
    activeInvestments: 0,
    totalInvested: 0,
    investors: 0,
    avgROI: 0,
  }

  const investments = investmentsResult.success ? investmentsResult.data || [] : []
  const plans = plansResult.success ? plansResult.data || [] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Investment Management</h1>
        <p className="text-muted-foreground">
          Create investment plans and manage user positions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInvestments}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.investors}</div>
            <p className="text-xs text-muted-foreground">Active investors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Last 90 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            User Positions
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <PackagePlus className="h-4 w-4" />
            Investment Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Investment Positions</CardTitle>
              <CardDescription>
                View and manage all user investment positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentsDataTable investments={investments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Plans</CardTitle>
              <CardDescription>
                Create and manage investment plans (Bronze, Silver, Gold, Diamond, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentPlansManager plans={plans} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
