import { getStakingPositionsAction } from '@/server/actions/portfolio'
import { StakingOverview } from './staking-overview'

export async function StakingOverviewServer() {
  const result = await getStakingPositionsAction()
  
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <StakingOverview
        totalStaked={0}
        totalRewards={0}
        activeStakes={0}
        averageAPY={0}
      />
    )
  }

  const stakes = result.data

  // Calculate metrics from staking positions
  const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0)
  const totalRewards = stakes.reduce((sum, stake) => sum + stake.rewards, 0)
  const activeStakes = stakes.filter(s => s.status === 'active').length
  const averageAPY = stakes.length > 0
    ? stakes.reduce((sum, stake) => sum + stake.apy, 0) / stakes.length
    : 0

  return (
    <StakingOverview
      totalStaked={totalStaked}
      totalRewards={totalRewards}
      activeStakes={activeStakes}
      averageAPY={averageAPY}
    />
  )
}
