import { PlansPageClient } from './plans-client'
import { getSubscriptionPlansAction, getUserSubscriptionAction } from '@/server/actions/subscription'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Subscription Plans | Trans-Atlantic Capitals',
  description: 'Choose the perfect plan for your trading needs',
}

export default async function PlansPage() {
  // Fetch plans and user subscription
  const [plansResult, subscriptionResult] = await Promise.all([
    getSubscriptionPlansAction(),
    getUserSubscriptionAction(),
  ])

  if (!subscriptionResult.success) {
    // User not authenticated
    redirect('/auth/login?from=/dashboard/plans')
  }

  return (
    <PlansPageClient 
      plans={plansResult.data || []} 
      currentSubscription={subscriptionResult.data}
    />
  )
}
