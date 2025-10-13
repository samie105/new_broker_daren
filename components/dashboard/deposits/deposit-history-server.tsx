import { getDepositsAction } from '@/server/actions/portfolio'
import { DepositHistory as DepositHistoryClient } from './deposit-history'

export async function DepositHistory() {
  const result = await getDepositsAction()
  const deposits = result.data || []

  return <DepositHistoryClient deposits={deposits} />
}
