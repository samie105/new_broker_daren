import { requireAdmin } from '@/lib/admin-helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { getTradingStatsAction, getAllTradesAction } from '@/server/actions/admin/stats'
import { TradesDataTable } from '@/components/admin/trades-data-table'

export default async function AdminTradesPage() {
  await requireAdmin()
  
  // Fetch real statistics and data
  const statsResult = await getTradingStatsAction()
  const tradesResult = await getAllTradesAction()
  
  const stats = statsResult.data || {
    openTrades: 0,
    totalVolume: 0,
    winRate: 0,
    totalProfitLoss: 0,
  }

  const trades = tradesResult.success ? tradesResult.data || [] : []

  const isProfitable = stats.totalProfitLoss >= 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trades Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage user trading activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTrades}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalVolume / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
            {isProfitable ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{stats.totalProfitLoss >= 0 ? '$' : '-$'}
              {Math.abs(stats.totalProfitLoss).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
          <CardDescription>
            View and manage all user trading positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TradesDataTable trades={trades} />
        </CardContent>
      </Card>
    </div>
  )
}
