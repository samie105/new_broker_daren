import { getCopyTradingPositionsAction } from '@/server/actions/portfolio'
import { CopyTradingOverview } from './copy-trading-overview'

export async function CopyTradingOverviewServer() {
  try {
    const result = await getCopyTradingPositionsAction()

    if (!result.success || !result.data) {
      return <CopyTradingOverview positions={[]} />
    }

    return <CopyTradingOverview positions={result.data} />
  } catch (error) {
    console.error('Failed to fetch copy trading positions:', error)
    return <CopyTradingOverview positions={[]} />
  }
}
