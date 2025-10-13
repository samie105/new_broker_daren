import { getCombinedHistoryAction } from '@/server/actions/portfolio'
import { HistorySummary } from './history-summary'

export async function HistorySummaryServer() {
  const result = await getCombinedHistoryAction()

  if (!result.success || !result.data) {
    return (
      <HistorySummary
        totalDeposited={0}
        depositCount={0}
        totalWithdrawn={0}
        withdrawalCount={0}
        tradingVolume={0}
        tradeCount={0}
        stakingRewards={0}
        rewardCount={0}
      />
    )
  }

  const { summary } = result.data

  return (
    <HistorySummary
      totalDeposited={summary.totalDeposited}
      depositCount={summary.depositCount}
      totalWithdrawn={summary.totalWithdrawn}
      withdrawalCount={summary.withdrawalCount}
      tradingVolume={summary.tradingVolume}
      tradeCount={summary.tradeCount}
      stakingRewards={summary.stakingRewards}
      rewardCount={summary.rewardCount}
    />
  )
}
