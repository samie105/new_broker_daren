import { getTradesAction } from '@/server/actions/portfolio'
import { TradesSection as TradesSectionClient } from './trades-section'

export async function TradesSection() {
  const result = await getTradesAction()
  const trades = result.data || []

  return <TradesSectionClient trades={trades} />
}
