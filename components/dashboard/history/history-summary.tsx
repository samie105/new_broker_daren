"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface HistorySummaryProps {
  totalDeposited: number
  depositCount: number
  totalWithdrawn: number
  withdrawalCount: number
  tradingVolume: number
  tradeCount: number
  stakingRewards: number
  rewardCount: number
}

export function HistorySummary({
  totalDeposited = 0,
  depositCount = 0,
  totalWithdrawn = 0,
  withdrawalCount = 0,
  tradingVolume = 0,
  tradeCount = 0,
  stakingRewards = 0,
  rewardCount = 0
}: HistorySummaryProps) {
  const summaryStats = [
    {
      title: 'Total Deposits',
      value: totalDeposited,
      count: depositCount,
      icon: ArrowDownLeft,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      title: 'Total Withdrawals',
      value: totalWithdrawn,
      count: withdrawalCount,
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Trading Volume',
      value: tradingVolume,
      count: tradeCount,
      icon: ArrowUpRight,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Staking Rewards',
      value: stakingRewards,
      count: rewardCount,
      icon: ArrowUpRight,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {summaryStats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <div className="text-2xl font-bold">${stat.value.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}