"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Wallet, Clock, Award } from 'lucide-react'

interface StakingOverviewProps {
  totalStaked: number
  totalRewards: number
  activeStakes: number
  averageAPY: number
}

export function StakingOverview({ 
  totalStaked = 0, 
  totalRewards = 0, 
  activeStakes = 0, 
  averageAPY = 0 
}: StakingOverviewProps) {
  const statsData = [
    {
      title: 'Total Staked',
      value: `$${totalStaked.toLocaleString()}`,
      change: '+12.5%',
      isPositive: true,
      icon: Wallet,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Total Rewards',
      value: `$${totalRewards.toLocaleString()}`,
      change: '+45.2%',
      isPositive: true,
      icon: Award,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    },
    {
      title: 'Active Stakes',
      value: activeStakes.toString(),
      change: '+3',
      isPositive: true,
      icon: TrendingUp,
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Avg. APY',
      value: `${averageAPY.toFixed(1)}%`,
      change: '+2.1%',
      isPositive: true,
      icon: Clock,
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`${stat.isPositive ? 'text-emerald-600' : 'text-red-600'} bg-transparent px-0`}
                  >
                    {stat.change} this month
                  </Badge>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
