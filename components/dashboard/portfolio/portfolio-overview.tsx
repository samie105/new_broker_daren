"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PortfolioOverviewProps {
  totalValue: number
  todayPnL: number
  todayPnLPercent: number
  holdingsCount: number
  monthlyROI: number
}

export function PortfolioOverview({ 
  totalValue = 0,
  todayPnL = 0,
  todayPnLPercent = 0,
  holdingsCount = 0,
  monthlyROI = 0
}: PortfolioOverviewProps) {
  const portfolioMetrics = [
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+4.57%',
      changeValue: '+$12,450',
      isPositive: true
    },
    {
      title: 'Today\'s P&L',
      value: `${todayPnL >= 0 ? '+' : ''}$${Math.abs(todayPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${todayPnLPercent >= 0 ? '+' : ''}${todayPnLPercent.toFixed(2)}%`,
      changeValue: 'vs yesterday',
      isPositive: todayPnL >= 0
    },
    {
      title: 'Holdings',
      value: `${holdingsCount} Assets`,
      change: '+2',
      changeValue: 'this month',
      isPositive: true
    },
    {
      title: 'Monthly ROI',
      value: `${monthlyROI.toFixed(1)}%`,
      change: '+2.3%',
      changeValue: 'vs last month',
      isPositive: monthlyROI >= 0
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {portfolioMetrics.map((metric, index) => (
        <Card key={index} className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">
                  {metric.title}
                </span>
                <div className={`p-1.5 rounded-lg ${
                  metric.isPositive 
                    ? 'bg-emerald-100 dark:bg-emerald-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  {metric.isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="text-2xl font-bold">
                {metric.value}
              </div>

              {/* Change */}
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${
                  metric.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground text-xs">
                  {metric.changeValue}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}