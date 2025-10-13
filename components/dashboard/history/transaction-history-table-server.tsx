import { getCombinedHistoryAction } from '@/server/actions/portfolio'
import { TransactionHistoryTable } from './transaction-history-table'

export async function TransactionHistoryTableServer() {
  const result = await getCombinedHistoryAction()

  if (!result.success || !result.data) {
    return <TransactionHistoryTable transactions={[]} />
  }

  return <TransactionHistoryTable transactions={result.data.transactions} />
}
