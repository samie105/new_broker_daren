import { getStakingPositionsAction } from '@/server/actions/portfolio'
import { ActiveStakes } from './active-stakes'

export async function ActiveStakesServer() {
  const result = await getStakingPositionsAction()
  
  if (!result.success || !result.data) {
    return <ActiveStakes stakes={[]} />
  }

  return <ActiveStakes stakes={result.data} />
}
