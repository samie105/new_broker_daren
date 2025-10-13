'use client'

import React, { useState } from 'react'
import { Check, Crown, Trophy, Award, Medal, Gem, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { purchaseSubscriptionPlanAction } from '@/server/actions/subscription'
import { useRouter } from 'next/navigation'

interface Plan {
  id: string
  name: string
  display_name: string
  tier: number
  price_monthly: number
  price_yearly: number
  description: string
  features: string[]
  limits: any
  color: string
  icon: string
  is_popular: boolean
}

interface PlansPageClientProps {
  plans: Plan[]
  currentSubscription: any
}

const iconMap: Record<string, any> = {
  Medal,
  Award,
  Trophy,
  Crown,
  Gem,
}

const colorMap: Record<string, string> = {
  gray: 'bg-gray-500',
  slate: 'bg-slate-500',
  yellow: 'bg-yellow-500',
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
}

export function PlansPageClient({ plans, currentSubscription }: PlansPageClientProps) {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)

  const currentPlanName = currentSubscription?.subscription_plan_name

  const handlePurchase = async (planId: string) => {
    setLoadingPlanId(planId)

    try {
      const result = await purchaseSubscriptionPlanAction({
        planId,
        billingCycle,
      })

      if (result.success) {
        toast.success('Subscription Updated!', {
          description: result.message,
        })
        
        // Refresh the page to show updated subscription
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        toast.error('Purchase Failed', {
          description: result.error || 'Failed to update subscription',
        })
      }
    } catch (error) {
      toast.error('Error', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Subscription Plans</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold">
            Choose Your <span className="gradient-text">Trading Plan</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock powerful features and take your trading to the next level. 
            All plans include 24/7 support and secure transactions.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-primary font-semibold">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = iconMap[plan.icon] || Medal
            const isCurrentPlan = plan.name === currentPlanName
            const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
            const features = Array.isArray(plan.features) ? plan.features : []

            return (
              <Card
                key={plan.id}
                className={`relative p-8 space-y-6 hover:shadow-xl transition-all ${
                  plan.is_popular ? 'ring-2 ring-primary shadow-lg' : ''
                } ${isCurrentPlan ? 'border-primary' : ''}`}
              >
                {/* Popular Badge */}
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="border-primary text-primary">
                      Current Plan
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-lg ${colorMap[plan.color] || 'bg-gray-500'} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold">{plan.display_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={isCurrentPlan || loadingPlanId !== null}
                  className={`w-full ${
                    plan.is_popular
                      ? 'bg-primary hover:bg-primary/90'
                      : ''
                  }`}
                  variant={plan.is_popular ? 'default' : 'outline'}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.tier > (currentSubscription?.subscription_plans?.tier || 0) ? (
                    'Upgrade Now'
                  ) : (
                    'Downgrade'
                  )}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-muted-foreground">
            All plans include SSL encryption, two-factor authentication, and cold storage security.
          </p>
          <p className="text-sm text-muted-foreground">
            Need help choosing? <a href="/dashboard/help" className="text-primary hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  )
}
