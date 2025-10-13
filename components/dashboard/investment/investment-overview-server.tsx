import { getActiveInvestmentsAction } from '@/server/actions/portfolio'
import { InvestmentOverview } from './investment-overview'

export async function InvestmentOverviewServer() {
  try {
    const result = await getActiveInvestmentsAction()

    if (!result.success || !result.data) {
      return (
        <InvestmentOverview 
          stats={{
            totalInvested: 0,
            totalReturns: 0,
            activePlansCount: 0,
            averageROI: 0
          }} 
        />
      )
    }

    const { investments, total_invested, investment_returns } = result.data
    
    // Calculate average ROI from active investments
    const activeInvestments = investments.filter(inv => inv.status === 'active')
    const averageROI = activeInvestments.length > 0
      ? activeInvestments.reduce((sum, inv) => sum + inv.roi, 0) / activeInvestments.length
      : 0

    return (
      <InvestmentOverview 
        stats={{
          totalInvested: total_invested,
          totalReturns: investment_returns,
          activePlansCount: activeInvestments.length,
          averageROI
        }} 
      />
    )
  } catch (error) {
    console.error('Failed to fetch investment overview:', error)
    return (
      <InvestmentOverview 
        stats={{
          totalInvested: 0,
          totalReturns: 0,
          activePlansCount: 0,
          averageROI: 0
        }} 
      />
    )
  }
}
