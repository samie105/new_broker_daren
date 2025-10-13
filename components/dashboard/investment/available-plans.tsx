"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { TrendingUp, Clock, DollarSign, Target, Bitcoin, Users, User, Search, CheckCircle2, XCircle } from 'lucide-react'
import type { InvestmentPlan } from '@/server/actions/portfolio'
import { Skeleton } from '@/components/ui/skeleton'
import { searchUserByEmailAction } from '@/server/actions/user-search'
import { toast } from 'sonner'

type AssetType = 'crypto' | 'stocks' | 'currencies'

interface AvailablePlansProps {
  adminPlans: InvestmentPlan[]
}

const investmentPlans = [
  {
    name: 'Bitcoin Growth Fund',
    symbol: 'BTC',
    roi: 25.8,
    duration: '90 days',
    minInvestment: 1000,
    totalInvested: '$15.2M',
    icon: '/assets/crypto/BTC.svg',
    risk: 'Medium',
    strategy: 'Dollar-Cost Averaging'
  },
  {
    name: 'Ethereum Yield Plus',
    symbol: 'ETH',
    roi: 32.4,
    duration: '120 days',
    minInvestment: 500,
    totalInvested: '$8.7M',
    icon: '/assets/crypto/ETH.svg',
    risk: 'Medium',
    strategy: 'Growth Investing'
  },
  {
    name: 'Altcoin Opportunity',
    symbol: 'ALT',
    roi: 45.7,
    duration: '60 days',
    minInvestment: 250,
    totalInvested: '$4.5M',
    icon: '/assets/crypto/SOL.svg',
    risk: 'High',
    strategy: 'Active Trading'
  },
  {
    name: 'Stable Growth Portfolio',
    symbol: 'USDT',
    roi: 12.5,
    duration: '180 days',
    minInvestment: 2000,
    totalInvested: '$25M',
    icon: '/assets/crypto/USDT.svg',
    risk: 'Low',
    strategy: 'Conservative Funds'
  },
  {
    name: 'DeFi Innovation Fund',
    symbol: 'DeFi',
    roi: 38.2,
    duration: '90 days',
    minInvestment: 1500,
    totalInvested: '$6.8M',
    icon: '/assets/crypto/AVAX.svg',
    risk: 'High',
    strategy: 'Growth Strategies'
  },
  {
    name: 'Diversified Crypto Basket',
    symbol: 'DIV',
    roi: 28.6,
    duration: '150 days',
    minInvestment: 1000,
    totalInvested: '$12.4M',
    icon: '/assets/crypto/DOT.svg',
    risk: 'Medium',
    strategy: 'Diversified Portfolios'
  }
]

const stockPlans = [
  {
    name: 'Tech Giants Growth Fund',
    symbol: 'TECH',
    roi: 22.5,
    duration: '120 days',
    minInvestment: 2000,
    totalInvested: '$45M',
    icon: '/assets/stock/AAPL.svg',
    risk: 'Medium',
    strategy: 'Growth Investing'
  },
  {
    name: 'S&P 500 Index Fund',
    symbol: 'SPX',
    roi: 15.8,
    duration: '180 days',
    minInvestment: 1500,
    totalInvested: '$75M',
    icon: '/assets/stock/MSFT.svg',
    risk: 'Low',
    strategy: 'Diversified Portfolios'
  },
  {
    name: 'Electric Vehicle Leaders',
    symbol: 'EV',
    roi: 35.2,
    duration: '90 days',
    minInvestment: 1000,
    totalInvested: '$28M',
    icon: '/assets/stock/TSLA.svg',
    risk: 'High',
    strategy: 'Growth Strategies'
  },
  {
    name: 'Semiconductor Innovation',
    symbol: 'SEMI',
    roi: 30.8,
    duration: '100 days',
    minInvestment: 1500,
    totalInvested: '$32M',
    icon: '/assets/stock/NVDA.svg',
    risk: 'High',
    strategy: 'Active Trading'
  },
  {
    name: 'Blue Chip Dividend Fund',
    symbol: 'DIVD',
    roi: 18.5,
    duration: '150 days',
    minInvestment: 2500,
    totalInvested: '$55M',
    icon: '/assets/stock/JNJ.svg',
    risk: 'Low',
    strategy: 'Conservative Funds'
  }
]

const currencyPlans = [
  {
    name: 'Major Pairs Basket',
    symbol: 'FX-MAJ',
    roi: 12.5,
    duration: '60 days',
    minInvestment: 5000,
    totalInvested: '$120M',
    icon: '/assets/currencies/EURUSD.svg',
    risk: 'Low',
    strategy: 'Conservative Funds'
  },
  {
    name: 'Emerging Markets FX',
    symbol: 'FX-EM',
    roi: 18.7,
    duration: '90 days',
    minInvestment: 3000,
    totalInvested: '$65M',
    icon: '/assets/currencies/GBPUSD.svg',
    risk: 'Medium',
    strategy: 'Growth Investing'
  },
  {
    name: 'Carry Trade Strategy',
    symbol: 'FX-CARRY',
    roi: 22.3,
    duration: '120 days',
    minInvestment: 4000,
    totalInvested: '$48M',
    icon: '/assets/currencies/AUDUSD.svg',
    risk: 'Medium',
    strategy: 'Active Trading'
  },
  {
    name: 'Safe Haven Currencies',
    symbol: 'FX-SAFE',
    roi: 10.2,
    duration: '180 days',
    minInvestment: 6000,
    totalInvested: '$95M',
    icon: '/assets/currencies/USDJPY.svg',
    risk: 'Low',
    strategy: 'Conservative Funds'
  }
]

export function AvailablePlans({ adminPlans = [] }: AvailablePlansProps) {
  const [assetType, setAssetType] = useState<AssetType>('crypto')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [investAmount, setInvestAmount] = useState('')
  const [investType, setInvestType] = useState<'solo' | 'joint'>('solo')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerShare, setPartnerShare] = useState('50')
  const [userSearchStatus, setUserSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not-found'>('idle')
  const [foundUser, setFoundUser] = useState<{ name: string; email: string } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Transform admin plans to display format
  const adminPlansTransformed = adminPlans.map(plan => ({
    name: plan.name,
    symbol: plan.plan_type,
    roi: plan.roi_percent,
    duration: `${plan.duration_days} days`,
    minInvestment: plan.min_investment,
    totalInvested: '0', // Not tracked yet
    icon: '/assets/crypto/BTC.svg', // Default icon
    risk: plan.risk_level.charAt(0).toUpperCase() + plan.risk_level.slice(1),
    strategy: plan.strategy,
    isJointAllowed: plan.is_joint_allowed,
    planId: plan.id
  }))

  // Get current plans based on asset type - prioritize admin plans for crypto
  const currentPlans = assetType === 'crypto' 
    ? (adminPlansTransformed.length > 0 ? adminPlansTransformed : investmentPlans)
    : assetType === 'stocks' ? stockPlans : currencyPlans

  const handleInvest = () => {
    console.log('Investing:', investAmount, 'in', selectedPlan?.name)
    setIsDialogOpen(false)
    setInvestAmount('')
  }

  const handleSearchUser = async () => {
    if (!partnerEmail) {
      toast.error('Please enter an email address')
      return
    }
    
    setUserSearchStatus('searching')
    
    try {
      const result = await searchUserByEmailAction(partnerEmail)
      
      if (result.success && result.user) {
        setFoundUser({ 
          name: result.user.full_name, 
          email: result.user.email 
        })
        setUserSearchStatus('found')
        toast.success('Partner found!', {
          description: `${result.user.full_name} is available for joint investment`
        })
      } else {
        setFoundUser(null)
        setUserSearchStatus('not-found')
        toast.error('User not found', {
          description: result.error || 'No user with this email exists'
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      setFoundUser(null)
      setUserSearchStatus('not-found')
      toast.error('Search failed', {
        description: 'Unable to search for user. Please try again.'
      })
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-500 bg-green-500/10'
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'High': return 'text-orange-500 bg-orange-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Investment Plans</CardTitle>
        <p className="text-sm text-muted-foreground">Choose from curated investment strategies</p>
      </CardHeader>
      
      {/* Asset Type Tabs */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => setAssetType('crypto')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              assetType === 'crypto'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bitcoin className="w-4 h-4" />
            Crypto
          </button>
          <button
            onClick={() => setAssetType('stocks')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              assetType === 'stocks'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Stocks
          </button>
          <button
            onClick={() => setAssetType('currencies')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              assetType === 'currencies'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Currencies
          </button>
        </div>
      </div>
      
      <CardContent>
        <div className="grid gap-4">
          {currentPlans.map((plan, index) => (
            <Card key={index} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  {/* Left side - Icon and Details */}
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={plan.icon}
                        alt={plan.symbol}
                        fill
                        className="rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{plan.name}</h3>
                        <Badge className={getRiskColor(plan.risk)}>
                          {plan.risk} Risk
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{plan.strategy}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Expected ROI</div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-600">{plan.roi}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Duration</div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{plan.duration}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Min. Investment</div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">${plan.minInvestment.toLocaleString()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Total Invested</div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{plan.totalInvested}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Invest Button */}
                  <div className="ml-4">
                    <Dialog open={isDialogOpen && selectedPlan?.name === plan.name} onOpenChange={(open) => {
                      setIsDialogOpen(open)
                      if (open) setSelectedPlan(plan)
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedPlan(plan)}>
                          Invest Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invest in {plan.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          {/* Plan Info */}
                          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={plan.icon}
                                alt={plan.symbol}
                                fill
                                className="rounded-full"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                            </div>
                            <div>
                              <div className="font-semibold">{plan.name}</div>
                              <div className="text-sm text-emerald-600 font-medium">{plan.roi}% ROI • {plan.duration}</div>
                            </div>
                          </div>

                          {/* Investment Type Selection */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Investment Type</label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={investType === 'solo' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() => setInvestType('solo')}
                              >
                                <User className="w-4 h-4 mr-2" />
                                Solo Investment
                              </Button>
                              <Button
                                type="button"
                                variant={investType === 'joint' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() => setInvestType('joint')}
                                disabled={!(plan as any)?.isJointAllowed}
                              >
                                <Users className="w-4 h-4 mr-2" />
                                Joint Investment
                              </Button>
                            </div>
                            {!(plan as any)?.isJointAllowed && (
                              <p className="text-xs text-muted-foreground">
                                Joint investment is not available for this plan
                              </p>
                            )}
                          </div>

                          {/* Joint Partner Fields */}
                          {investType === 'joint' && (
                            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Partner Email</label>
                                <div className="flex gap-2">
                                  <Input
                                    type="email"
                                    placeholder="partner@example.com"
                                    value={partnerEmail}
                                    onChange={(e) => {
                                      setPartnerEmail(e.target.value)
                                      setUserSearchStatus('idle')
                                      setFoundUser(null)
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSearchUser}
                                    disabled={!partnerEmail || userSearchStatus === 'searching'}
                                  >
                                    <Search className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* User Search Status */}
                                {userSearchStatus === 'searching' && (
                                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Skeleton className="h-10 w-10 rounded-full" />
                                      <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {userSearchStatus === 'found' && foundUser && (
                                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-emerald-600">Partner Found!</div>
                                      <div className="text-xs text-muted-foreground">{foundUser.name}</div>
                                    </div>
                                  </div>
                                )}

                                {userSearchStatus === 'not-found' && (
                                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <div className="text-sm text-red-600">User not found</div>
                                  </div>
                                )}
                              </div>

                              {userSearchStatus === 'found' && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Your Share (%)</label>
                                  <Input
                                    type="number"
                                    placeholder="50"
                                    value={partnerShare}
                                    onChange={(e) => setPartnerShare(e.target.value)}
                                    min="1"
                                    max="99"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Your partner will receive {100 - parseInt(partnerShare || '50')}% of profits
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Investment Amount */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Investment Amount (USD)</label>
                            <Input
                              type="number"
                              placeholder={`Min. $${plan.minInvestment}`}
                              value={investAmount}
                              onChange={(e) => setInvestAmount(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Minimum investment: ${plan.minInvestment.toLocaleString()}
                            </p>
                          </div>

                          {/* Expected Returns */}
                          {investAmount && parseFloat(investAmount) >= plan.minInvestment && (
                            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              <div className="text-sm text-muted-foreground mb-1">Expected Returns</div>
                              <div className="text-2xl font-bold text-emerald-600">
                                ${((parseFloat(investAmount) * plan.roi) / 100).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Total value: ${(parseFloat(investAmount) + (parseFloat(investAmount) * plan.roi) / 100).toLocaleString()}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              onClick={handleInvest}
                              disabled={!investAmount || parseFloat(investAmount) < plan.minInvestment}
                            >
                              Confirm Investment
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
