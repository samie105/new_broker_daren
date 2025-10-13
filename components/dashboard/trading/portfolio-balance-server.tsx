import { getPortfolioHoldingsAction } from '@/server/actions/portfolio'
import { PortfolioBalance } from './portfolio-balance'

export async function PortfolioBalanceServer() {
  const result = await getPortfolioHoldingsAction()
  
  if (!result.success || !result.data) {
    return <PortfolioBalance assets={[]} totalValue={0} />
  }

  const holdings = result.data

  // Transform holdings to match PortfolioBalance expected format
  const assets = holdings.map(holding => ({
    symbol: holding.symbol,
    name: holding.name,
    balance: holding.balance,
    value: holding.current_value || (holding.balance * holding.avg_buy_price),
    change: holding.current_value 
      ? ((holding.current_value - (holding.balance * holding.avg_buy_price)) / (holding.balance * holding.avg_buy_price)) * 100
      : 0,
    icon: holding.icon
  }))

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

  return <PortfolioBalance assets={assets} totalValue={totalValue} />
}
