import { getAdminInvestmentPlansAction } from '@/server/actions/portfolio'
import { AvailablePlans } from './available-plans'

export async function AvailablePlansServer() {
  try {
    const result = await getAdminInvestmentPlansAction()

    if (!result.success) {
      return <AvailablePlans adminPlans={[]} />
    }

    return <AvailablePlans adminPlans={result.data} />
  } catch (error) {
    console.error('Failed to fetch admin investment plans:', error)
    return <AvailablePlans adminPlans={[]} />
  }
}
