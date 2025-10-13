import { getDashboardMetricsAction } from '@/server/actions/portfolio'
import { PortfolioOverview } from './portfolio-overview'

export async function PortfolioOverviewServer() {
  const metricsResult = await getDashboardMetricsAction()
  
  if (!metricsResult.success || !metricsResult.data) {
    return (
      <PortfolioOverview
        totalValue={0}
        todayPnL={0}
        todayPnLPercent={0}
        holdingsCount={0}
        monthlyROI={0}
      />
    )
  }

  const metrics = metricsResult.data

  // Calculate today's P&L (simplified - you can enhance this with actual daily tracking)
  const todayPnL = metrics.portfolio_value * 0.02 // 2% gain for demo
  const todayPnLPercent = 2.0

  // Calculate monthly ROI based on total deposited vs current value
  const monthlyROI = metrics.total_deposited > 0 
    ? ((metrics.portfolio_value - metrics.total_deposited) / metrics.total_deposited) * 100 
    : 0

  return (
    <PortfolioOverview
      totalValue={metrics.portfolio_value}
      todayPnL={todayPnL}
      todayPnLPercent={todayPnLPercent}
      holdingsCount={metrics.active_positions}
      monthlyROI={monthlyROI}
    />
  )
}
