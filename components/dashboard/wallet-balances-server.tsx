import { getPortfolioHoldingsAction } from '@/server/actions/portfolio'
import { WalletBalances as WalletBalancesClient } from './wallet-balances'

export async function WalletBalances() {
  const result = await getPortfolioHoldingsAction()
  const holdings = result.data || []

  return <WalletBalancesClient holdings={holdings} />
}
