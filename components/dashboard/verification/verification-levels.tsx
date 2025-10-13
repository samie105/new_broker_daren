"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wallet, TrendingUp, Shield, Globe } from 'lucide-react'

const verificationLevels = [
  {
    level: 1,
    title: 'Basic Verification',
    status: 'completed',
    description: 'Email and phone verification',
    limits: {
      dailyWithdraw: 1000,
      monthlyWithdraw: 10000
    },
    features: ['Basic trading', 'Deposit funds', 'Limited withdrawals'],
    color: 'emerald'
  },
  {
    level: 2,
    title: 'Identity Verification',
    status: 'pending',
    description: 'Government ID and address proof',
    limits: {
      dailyWithdraw: 50000,
      monthlyWithdraw: 500000
    },
    features: ['Full trading access', 'Higher limits', 'Priority support'],
    color: 'orange'
  },
  {
    level: 3,
    title: 'Enhanced Verification',
    status: 'not_started',
    description: 'Advanced security and compliance',
    limits: {
      dailyWithdraw: 'Unlimited',
      monthlyWithdraw: 'Unlimited'
    },
    features: ['Institutional features', 'No limits', 'Dedicated manager'],
    color: 'blue'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          Active
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
          In Progress
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Available
        </Badge>
      )
  }
}

const getLevelIcon = (level: number) => {
  switch (level) {
    case 1:
      return <Wallet className="w-5 h-5" />
    case 2:
      return <TrendingUp className="w-5 h-5" />
    default:
      return <Shield className="w-5 h-5" />
  }
}

export function VerificationLevels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {verificationLevels.map((tier) => (
        <Card key={tier.level} className={`relative overflow-hidden ${
          tier.status === 'completed' ? 'ring-2 ring-emerald-200 dark:ring-emerald-900' : ''
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${
                tier.color === 'emerald' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/20' 
                  : tier.color === 'orange'
                  ? 'bg-orange-100 dark:bg-orange-900/20'
                  : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                <div className={`${
                  tier.color === 'emerald' 
                    ? 'text-emerald-600' 
                    : tier.color === 'orange'
                    ? 'text-orange-600'
                    : 'text-blue-600'
                }`}>
                  {getLevelIcon(tier.level)}
                </div>
              </div>
              {getStatusBadge(tier.status)}
            </div>
            <div>
              <CardTitle className="text-lg">Level {tier.level}</CardTitle>
              <h3 className="font-semibold text-sm text-foreground">{tier.title}</h3>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Withdrawal Limits</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily:</span>
                  <span className="font-medium">
                    {typeof tier.limits.dailyWithdraw === 'number' 
                      ? `$${tier.limits.dailyWithdraw.toLocaleString()}` 
                      : tier.limits.dailyWithdraw}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly:</span>
                  <span className="font-medium">
                    {typeof tier.limits.monthlyWithdraw === 'number' 
                      ? `$${tier.limits.monthlyWithdraw.toLocaleString()}` 
                      : tier.limits.monthlyWithdraw}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features</h4>
              <ul className="space-y-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                    <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {tier.status !== 'completed' && (
              <Button 
                className={`w-full ${
                  tier.status === 'pending' 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : ''
                }`}
                disabled={tier.status === 'pending'}
              >
                {tier.status === 'pending' ? 'Review in Progress' : 'Start Verification'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}