"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Wallet, PieChart, Award } from 'lucide-react'

interface InvestmentStats {
  totalInvested: number
  totalReturns: number
  activePlansCount: number
  averageROI: number
}

interface InvestmentOverviewProps {
  stats: InvestmentStats
}

export function InvestmentOverview({ stats }: InvestmentOverviewProps) {
  const statsData = [
    {
      title: 'Total Invested',
      value: `$${stats.totalInvested.toLocaleString()}`,
      change: '+18.5%',
      isPositive: true,
      icon: Wallet,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Total Returns',
      value: `$${stats.totalReturns.toLocaleString()}`,
      change: '+32.1%',
      isPositive: true,
      icon: Award,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    },
    {
      title: 'Active Plans',
      value: stats.activePlansCount.toString(),
      change: '+2',
      isPositive: true,
      icon: PieChart,
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Avg. ROI',
      value: `${stats.averageROI.toFixed(1)}%`,
      change: '+3.2%',
      isPositive: true,
      icon: TrendingUp,
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
                    className={`${stat.isPositive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
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
