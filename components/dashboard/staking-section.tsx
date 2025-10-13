"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Coins, Calendar, TrendingUp, Clock } from 'lucide-react'
import Image from 'next/image'
import { CountUpCurrency, CountUpPercentage } from '@/components/ui/count-up'

const stakingData = [
  {
    id: 1,
    symbol: 'ETH',
    name: 'Ethereum 2.0',
    stakedAmount: 5.2,
    usdValue: 19968.30,
    apy: 4.2,
    rewards: 0.218,
    rewardsUsd: 837.45,
    duration: '90 days',
    status: 'active',
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-05-30T00:00:00Z',
    icon: '/assets/crypto/ETH.svg'
  },
  {
    id: 2,
    symbol: 'SOL',
    name: 'Solana Staking',
    stakedAmount: 150,
    usdValue: 21420.00,
    apy: 6.8,
    rewards: 10.2,
    rewardsUsd: 1456.44,
    duration: '30 days',
    status: 'active',
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-05-31T00:00:00Z',
    icon: '/assets/crypto/SOL.svg'
  },
  {
    id: 3,
    symbol: 'ADA',
    name: 'Cardano Pool',
    stakedAmount: 2500,
    usdValue: 1212.50,
    apy: 5.1,
    rewards: 127.5,
    rewardsUsd: 61.84,
    duration: '60 days',
    status: 'completed',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-04-01T00:00:00Z',
    icon: '/assets/crypto/ADA.svg'
  },
  {
    id: 4,
    symbol: 'DOT',
    name: 'Polkadot Staking',
    stakedAmount: 80,
    usdValue: 560.00,
    apy: 12.5,
    rewards: 10.0,
    rewardsUsd: 70.00,
    duration: '120 days',
    status: 'pending',
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-09-29T00:00:00Z',
    icon: '/assets/crypto/DOT.svg'
  }
]

export function StakingSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const nextStaking = () => {
    setCurrentIndex((prev) => (prev + 1) % stakingData.length)
  }
  
  const prevStaking = () => {
    setCurrentIndex((prev) => (prev - 1 + stakingData.length) % stakingData.length)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'completed':
        return 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-3 h-3" />
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'completed':
        return <Coins className="w-3 h-3" />
      default:
        return null
    }
  }

  const currentStaking = stakingData[currentIndex]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Staking Positions</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStaking}
              disabled={stakingData.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextStaking}
              disabled={stakingData.length <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Indicators */}
        {stakingData.length > 1 && (
          <div className="flex justify-center space-x-2 mt-2">
            {stakingData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Staking Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src={currentStaking.icon}
                  alt={currentStaking.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <div>
                <div className="font-medium">{currentStaking.name}</div>
                <div className="text-sm text-muted-foreground">{currentStaking.symbol}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getStatusColor(currentStaking.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(currentStaking.status)}
                  <span className="capitalize">{currentStaking.status}</span>
                </div>
              </Badge>
            </div>
          </div>

          {/* APY Display */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Annual Percentage Yield</div>
                <div className="text-2xl font-bold text-primary">
                  <CountUpPercentage 
                    percentage={currentStaking.apy} 
                    duration={1500}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-medium">{currentStaking.duration}</div>
              </div>
            </div>
          </div>

          {/* Staking Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Staked Amount</div>
              <div className="font-medium">
                {currentStaking.stakedAmount.toLocaleString()} {currentStaking.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                <CountUpCurrency amount={currentStaking.usdValue} duration={1500} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Rewards Earned</div>
              <div className="font-medium text-green-600">
                +{currentStaking.rewards.toLocaleString()} {currentStaking.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                <CountUpCurrency amount={currentStaking.rewardsUsd} duration={1500} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Start Date</div>
              <div className="font-medium text-sm">
                {formatDate(currentStaking.startDate)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">End Date</div>
              <div className="font-medium text-sm">
                {formatDate(currentStaking.endDate)}
              </div>
            </div>
          </div>

          {/* Progress Bar (for active stakings) */}
          {currentStaking.status === 'active' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            {currentStaking.status === 'active' && (
              <>
                <Button variant="outline" className="flex-1" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Claim Rewards
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  Unstake
                </Button>
              </>
            )}
            {currentStaking.status === 'pending' && (
              <Button variant="outline" className="w-full" size="sm">
                View Details
              </Button>
            )}
            {currentStaking.status === 'completed' && (
              <Button variant="outline" className="w-full" size="sm">
                Stake Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 