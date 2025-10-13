"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Wallet, DollarSign, Activity, ArrowDownLeft, ArrowUpRight, Calendar, Gift } from 'lucide-react'
import { CountUpCurrency, CountUpPercentage } from '@/components/ui/count-up'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Metric {
  title: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: any
  color: string
  bgColor: string
  isCount?: boolean
  isPercentage?: boolean
  isPlan?: boolean
}

interface DashboardMetricsProps {
  portfolioValue: number
  activePositions: number
  totalDeposited: number
  totalWithdrawn: number
  planBonus: number
  subscriptionPlan: string
}

export function DashboardMetrics({
  portfolioValue = 0,
  activePositions = 0,
  totalDeposited = 0,
  totalWithdrawn = 0,
  planBonus = 0,
  subscriptionPlan = 'Bronze'
}: DashboardMetricsProps) {
  const metrics: Metric[] = [
    {
      title: 'Total Portfolio Value',
      value: portfolioValue,
      change: 12.5,
      changeType: 'increase' as const,
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10 dark:bg-primary/20'
    },
    {
      title: 'Active Positions',
      value: activePositions,
      change: 2.1,
      changeType: 'increase' as const,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      isCount: true
    },
    {
      title: 'Total Withdrawn',
      value: totalWithdrawn,
      change: -2.3,
      changeType: 'decrease' as const,
      icon: ArrowDownLeft,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20'
    },
    {
      title: 'Total Deposited',
      value: totalDeposited,
      change: 15.6,
      changeType: 'increase' as const,
      icon: ArrowUpRight,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      title: 'Subscription Plan',
      value: subscriptionPlan,
      change: 0,
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50 dark:bg-slate-950/20',
      isPlan: true
    },
    {
      title: 'Plan Bonus',
      value: planBonus,
      change: 5.8,
      changeType: 'increase' as const,
      icon: Gift,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20'
    }
  ]

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.isPercentage ? (
                  <div className="flex items-center">
                    <CountUpPercentage 
                      percentage={metric.value as number} 
                      duration={2000}
                      delay={index * 200}
                    />
                  </div>
                ) : metric.isCount ? (
                  <div className="flex items-center">
                    <span className="tabular-nums">
                      {metric.value}
                    </span>
                  </div>
                ) : metric.isPlan ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-foreground">
                      {metric.value}
                    </span>
                  </div>
                ) : (
                  <CountUpCurrency 
                    amount={metric.value as number} 
                    duration={2000}
                    delay={index * 200}
                  />
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {metric.change > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                ) : metric.change < 0 ? (
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                ) : (
                  <Activity className="w-3 h-3 text-gray-500 mr-1" />
                )}
                <span className={
                  metric.change > 0 ? 'text-green-600' : 
                  metric.change < 0 ? 'text-red-600' : 
                  'text-gray-600'
                }>
                  {metric.change === 0 ? 'No change' : `${Math.abs(metric.change)}%`}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Dashboard Overview</h3>
            <div className="flex space-x-2">
              <CarouselPrevious className="relative inset-auto h-8 w-8 translate-x-0 translate-y-0" />
              <CarouselNext className="relative inset-auto h-8 w-8 translate-x-0 translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {metrics.map((metric, index) => (
              <CarouselItem key={index}>
                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${metric.bgColor} transition-all duration-300`}>
                      <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metric.isPercentage ? (
                        <div className="flex items-center">
                          <CountUpPercentage 
                            percentage={metric.value as number} 
                            duration={2000}
                          />
                        </div>
                      ) : metric.isCount ? (
                        <div className="flex items-center">
                          <span className="tabular-nums">
                            {metric.value}
                          </span>
                        </div>
                      ) : metric.isPlan ? (
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-foreground">
                            {metric.value}
                          </span>
                        </div>
                      ) : (
                        <CountUpCurrency 
                          amount={metric.value as number} 
                          duration={2000}
                        />
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {metric.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : metric.change < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      ) : (
                        <Activity className="w-3 h-3 text-gray-500 mr-1" />
                      )}
                      <span className={
                        metric.change > 0 ? 'text-green-600' : 
                        metric.change < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }>
                        {metric.change === 0 ? 'No change' : `${Math.abs(metric.change)}%`}
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  )
} 