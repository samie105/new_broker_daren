import { getActiveInvestmentsAction } from '@/server/actions/portfolio'
import { ActiveInvestments } from './active-investments'

export async function ActiveInvestmentsServer() {
  try {
    const result = await getActiveInvestmentsAction()

    if (!result.success || !result.data) {
      return <ActiveInvestments investments={[]} />
    }

    return <ActiveInvestments investments={result.data.investments} />
  } catch (error) {
    console.error('Failed to fetch active investments:', error)
    return <ActiveInvestments investments={[]} />
  }
}
