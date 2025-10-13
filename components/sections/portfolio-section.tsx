"use client"

import React from 'react'
import { PieChart, BarChart3, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Eye, EyeOff, RefreshCw, Download } from 'lucide-react'
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AnimateOnScroll, StaggeredAnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Area, AreaChart } from 'recharts'
import Image from 'next/image'

export function PortfolioSection() {
  const portfolioStats = [
    { 
      title: 'Total Portfolio Value', 
      value: '$48,290.50', 
      change: '+12.5%', 
      trend: 'up',
      icon: Wallet,
      description: 'All-time high'
    },
    { 
      title: '24h Portfolio Change', 
      value: '$2,150.30', 
      change: '+4.8%', 
      trend: 'up',
      icon: TrendingUp,
      description: 'Daily profit'
    },
    { 
      title: 'Total Assets', 
      value: '12', 
      change: '+2', 
      trend: 'up',
      icon: BarChart3,
      description: 'Diversified'
    },
    { 
      title: 'Best Performer', 
      value: 'SOL', 
      change: '+28.9%', 
      trend: 'up',
      icon: ArrowUpRight,
      description: 'This month'
    },
  ]

  const holdings = [
    { 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      amount: '0.425', 
      value: '$18,350', 
      allocation: 38, 
      change: '+2.4%', 
      trend: 'up', 
      fill: 'hsl(var(--chart-1))',
      image: '/assets/crypto/BTC.svg',
      price: '$43,176.32',
      marketCap: '$847.2B'
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum', 
      amount: '4.82', 
      value: '$12,040', 
      allocation: 25, 
      change: '+1.8%', 
      trend: 'up', 
      fill: 'hsl(var(--chart-2))',
      image: '/assets/crypto/ETH.svg',
      price: '$2,498.65',
      marketCap: '$300.5B'
    },
    { 
      symbol: 'SOL', 
      name: 'Solana', 
      amount: '32.5', 
      value: '$6,850', 
      allocation: 14, 
      change: '+5.2%', 
      trend: 'up', 
      fill: 'hsl(var(--chart-3))',
      image: '/assets/crypto/SOL.svg',
      price: '$210.78',
      marketCap: '$98.7B'
    },
    { 
      symbol: 'ADA', 
      name: 'Cardano', 
      amount: '1,250', 
      value: '$4,200', 
      allocation: 9, 
      change: '-1.2%', 
      trend: 'down', 
      fill: 'hsl(var(--chart-4))',
      image: '/assets/crypto/ADA.svg',
      price: '$3.36',
      marketCap: '$117.8B'
    },
    { 
      symbol: 'DOT', 
      name: 'Polkadot', 
      amount: '185', 
      value: '$3,680', 
      allocation: 8, 
      change: '+3.1%', 
      trend: 'up', 
      fill: 'hsl(var(--chart-5))',
      image: '/assets/crypto/DOT.svg',
      price: '$19.89',
      marketCap: '$26.4B'
    },
    { 
      symbol: 'MATIC', 
      name: 'Polygon', 
      amount: '450', 
      value: '$3,170', 
      allocation: 6, 
      change: '+2.8%', 
      trend: 'up', 
      fill: 'hsl(var(--chart-1))',
      image: '/assets/crypto/MATIC.svg',
      price: '$7.04',
      marketCap: '$6.7B'
    },
  ]

  const performanceData = [
    { month: 'Jan', value: 35420 },
    { month: 'Feb', value: 38230 },
    { month: 'Mar', value: 41850 },
    { month: 'Apr', value: 39240 },
    { month: 'May', value: 43690 },
    { month: 'Jun', value: 48450 },
  ]

  const chartConfig = {
    allocation: {
      label: "Portfolio Allocation",
    },
    BTC: {
      label: "Bitcoin",
      color: "hsl(var(--chart-1))",
    },
    ETH: {
      label: "Ethereum", 
      color: "hsl(var(--chart-2))",
    },
    SOL: {
      label: "Solana",
      color: "hsl(var(--chart-3))",
    },
    ADA: {
      label: "Cardano",
      color: "hsl(var(--chart-4))",
    },
    DOT: {
      label: "Polkadot",
      color: "hsl(var(--chart-5))",
    },
    MATIC: {
      label: "Polygon",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <section className="relative py-16 lg:py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Content - Text - Centralized */}
        <div className="max-w-4xl mx-auto mb-16 lg:mb-24 text-center">
          <AnimateOnScroll animation="fadeInUp">
            <div className="space-y-6">
              <Badge className="inline-flex items-center space-x-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium">
                <Wallet className="w-4 h-4" />
                <span>Advanced Portfolio Management</span>
              </Badge>
              <h2 className="text-4xl lg:text-6xl font-semibold max-w-4xl mx-auto">
                Track your <span className="gradient-text">crypto portfolio</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
                Professional-grade portfolio analytics with real-time insights and advanced trading tools
              </p>
              
              <div className="pt-4">
                <Button size="lg" className="gradient-bg rounded-full">
                  View Portfolio
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Bottom Content - Portfolio Screenshot - Bigger */}
        <AnimateOnScroll animation="fadeInUp" delay={0.4}>
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-background border border-border">
                {/* macOS Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-foreground">Portfolio Dashboard</div>
                  <div className="w-16"></div>
                </div>
                <div className="relative bg-background">
                  <Image
                    src="/assets/home/portfolio-page-light.png"
                    alt="Portfolio Management Dashboard"
                    width={1600}
                    height={1000}
                    className="object-contain object-top w-full h-auto dark:hidden"
                    priority
                  />
                  <Image
                    src="/assets/home/portfolio-page-dark.png"
                    alt="Portfolio Management Dashboard"
                    width={1600}
                    height={1000}
                    className="object-contain object-top w-full h-auto hidden dark:block"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
} 