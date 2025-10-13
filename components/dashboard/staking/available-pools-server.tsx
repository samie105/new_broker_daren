import { getAdminStakingPlansAction } from '@/server/actions/portfolio'
import { AvailablePools } from './available-pools'

export async function AvailablePoolsServer() {
  try {
    const result = await getAdminStakingPlansAction()

    if (!result.success) {
      return <AvailablePools adminPlans={[]} />
    }

    return <AvailablePools adminPlans={result.data} />
  } catch (error) {
    console.error('Failed to fetch admin staking plans:', error)
    return <AvailablePools adminPlans={[]} />
  }
}
