import { getTransactionsAction } from '@/server/actions/portfolio'
import { TransactionHistory as TransactionHistoryClient } from './transaction-history'

export async function TransactionHistory() {
  const result = await getTransactionsAction()
  const transactions = result.data || []

  return <TransactionHistoryClient transactions={transactions} />
}
