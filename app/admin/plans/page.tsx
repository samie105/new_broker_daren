import { requireAdmin } from '@/lib/admin-helpers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StakingPlansManager } from '@/components/admin/staking-plans-manager'
import { InvestmentPlansManager } from '@/components/admin/investment-plans-manager'
import { getStakingPlansAction } from '@/server/actions/admin/staking-plans'
import { getInvestmentPlansAction } from '@/server/actions/admin/investment-plans'

export default async function AdminPlansPage() {
  await requireAdmin()

  // Fetch plans data
  const stakingPlansResult = await getStakingPlansAction()
  const investmentPlansResult = await getInvestmentPlansAction()

  const stakingPlans = stakingPlansResult.success ? stakingPlansResult.data || [] : []
  const investmentPlans = investmentPlansResult.success ? investmentPlansResult.data || [] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plans Management</h1>
        <p className="text-muted-foreground">
          Create and manage staking and investment plans
        </p>
      </div>

      <Tabs defaultValue="staking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staking">Staking Plans</TabsTrigger>
          <TabsTrigger value="investment">Investment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="staking" className="space-y-4">
          <StakingPlansManager plans={stakingPlans} />
        </TabsContent>

        <TabsContent value="investment" className="space-y-4">
          <InvestmentPlansManager plans={investmentPlans} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
