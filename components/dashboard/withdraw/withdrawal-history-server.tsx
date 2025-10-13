import { getWithdrawalsAction } from '@/server/actions/portfolio'
import { WithdrawalHistory } from './withdrawal-history'

export async function WithdrawalHistoryServer() {
  const result = await getWithdrawalsAction()
  
  if (!result.success || !result.data) {
    return <WithdrawalHistory withdrawals={[]} />
  }

  return <WithdrawalHistory withdrawals={result.data} />
}
