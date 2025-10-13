import { getPortfolioHoldingsAction, getWalletAddressesAction } from '@/server/actions/portfolio'
import { AssetHoldings } from './asset-holdings'

export async function AssetHoldingsServer() {
  const [holdingsResult, walletsResult] = await Promise.all([
    getPortfolioHoldingsAction(),
    getWalletAddressesAction()
  ])
  
  if (!holdingsResult.success || !holdingsResult.data) {
    return <AssetHoldings holdings={[]} />
  }

  const holdings = holdingsResult.data
  const wallets = walletsResult.success && walletsResult.data ? walletsResult.data : {}

  // Calculate total portfolio value for allocation percentages
  // Use current_value if available, otherwise balance * avg_buy_price
  const totalValue = holdings.reduce((sum, h) => {
    const value = h.current_value || (h.balance * h.avg_buy_price)
    return sum + value
  }, 0)

  // Enrich holdings with wallet addresses and allocation
  const enrichedHoldings = holdings.map(holding => {
    const value = holding.current_value || (holding.balance * holding.avg_buy_price)
    const change24h = holding.current_value 
      ? ((holding.current_value - (holding.balance * holding.avg_buy_price)) / (holding.balance * holding.avg_buy_price)) * 100
      : 0

    return {
      symbol: holding.symbol,
      name: holding.name || holding.symbol,
      amount: holding.balance,
      value: value,
      allocation: totalValue > 0 ? (value / totalValue) * 100 : 0,
      change: change24h,
      isPositive: change24h >= 0,
      icon: `/assets/crypto/${holding.symbol}.svg`,
      walletAddress: wallets[holding.symbol.toLowerCase()] || 'No wallet address'
    }
  })

  return <AssetHoldings holdings={enrichedHoldings} />
}
