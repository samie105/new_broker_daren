import { getPortfolioHistoryAction } from '@/server/actions/portfolio'
import { PortfolioChartClient } from './portfolio-chart-client'

export async function PortfolioChart() {
  const result = await getPortfolioHistoryAction()
  const data = result.data || []

  return <PortfolioChartClient data={data} />
}
