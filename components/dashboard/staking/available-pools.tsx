"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { Lock, TrendingUp, Clock, Search, Users, User, CheckCircle2, XCircle, Bitcoin, DollarSign, TrendingDownIcon } from 'lucide-react'
import type { StakingPlan } from '@/server/actions/portfolio'
import { searchUserByEmailAction } from '@/server/actions/user-search'
import { toast } from 'sonner'

type AssetType = 'crypto' | 'stocks' | 'currencies'

interface AvailablePoolsProps {
  adminPlans: StakingPlan[]
}

const stakingPools = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    apy: 5.2,
    lockPeriod: '30 days',
    minStake: 0.1,
    totalStaked: '2.5M ETH',
    icon: '/assets/crypto/ETH.svg',
    risk: 'Low'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    apy: 4.8,
    lockPeriod: '60 days',
    minStake: 0.01,
    totalStaked: '45K BTC',
    icon: '/assets/crypto/BTC.svg',
    risk: 'Low'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    apy: 12.5,
    lockPeriod: '14 days',
    minStake: 1,
    totalStaked: '12M SOL',
    icon: '/assets/crypto/SOL.svg',
    risk: 'Medium'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    apy: 8.3,
    lockPeriod: '21 days',
    minStake: 10,
    totalStaked: '5M ADA',
    icon: '/assets/crypto/ADA.svg',
    risk: 'Low'
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    apy: 15.7,
    lockPeriod: '28 days',
    minStake: 1,
    totalStaked: '3M DOT',
    icon: '/assets/crypto/DOT.svg',
    risk: 'Medium'
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    apy: 18.4,
    lockPeriod: '30 days',
    minStake: 0.5,
    totalStaked: '8M AVAX',
    icon: '/assets/crypto/AVAX.svg',
    risk: 'High'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    apy: 10.2,
    lockPeriod: '15 days',
    minStake: 50,
    totalStaked: '25M MATIC',
    icon: '/assets/crypto/MATIC.svg',
    risk: 'Medium'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    apy: 7.8,
    lockPeriod: '45 days',
    minStake: 5,
    totalStaked: '1.5M LINK',
    icon: '/assets/crypto/LINK.svg',
    risk: 'Low'
  }
]

const stockPools = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    apy: 6.5,
    lockPeriod: '90 days',
    minStake: 100,
    totalStaked: '$25M',
    icon: '/assets/stock/AAPL.svg',
    risk: 'Low'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    apy: 7.2,
    lockPeriod: '90 days',
    minStake: 100,
    totalStaked: '$18M',
    icon: '/assets/stock/MSFT.svg',
    risk: 'Low'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    apy: 8.5,
    lockPeriod: '60 days',
    minStake: 150,
    totalStaked: '$22M',
    icon: '/assets/stock/GOOGL.svg',
    risk: 'Medium'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    apy: 12.3,
    lockPeriod: '45 days',
    minStake: 200,
    totalStaked: '$15M',
    icon: '/assets/stock/TSLA.svg',
    risk: 'High'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    apy: 11.8,
    lockPeriod: '60 days',
    minStake: 150,
    totalStaked: '$20M',
    icon: '/assets/stock/NVDA.svg',
    risk: 'High'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon',
    apy: 7.8,
    lockPeriod: '90 days',
    minStake: 100,
    totalStaked: '$19M',
    icon: '/assets/stock/AMZN.svg',
    risk: 'Medium'
  }
]

const currencyPools = [
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    apy: 4.2,
    lockPeriod: '30 days',
    minStake: 1000,
    totalStaked: '$50M',
    icon: '/assets/currencies/EURUSD.svg',
    risk: 'Low'
  },
  {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    apy: 4.5,
    lockPeriod: '30 days',
    minStake: 1000,
    totalStaked: '$35M',
    icon: '/assets/currencies/GBPUSD.svg',
    risk: 'Low'
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    apy: 3.8,
    lockPeriod: '60 days',
    minStake: 1000,
    totalStaked: '$42M',
    icon: '/assets/currencies/USDJPY.svg',
    risk: 'Low'
  },
  {
    symbol: 'AUDUSD',
    name: 'Australian Dollar / US Dollar',
    apy: 5.2,
    lockPeriod: '45 days',
    minStake: 1500,
    totalStaked: '$28M',
    icon: '/assets/currencies/AUDUSD.svg',
    risk: 'Medium'
  },
  {
    symbol: 'USDCAD',
    name: 'US Dollar / Canadian Dollar',
    apy: 4.8,
    lockPeriod: '30 days',
    minStake: 1000,
    totalStaked: '$32M',
    icon: '/assets/currencies/USDCAD.svg',
    risk: 'Low'
  },
  {
    symbol: 'NZDUSD',
    name: 'New Zealand Dollar / US Dollar',
    apy: 5.5,
    lockPeriod: '45 days',
    minStake: 1500,
    totalStaked: '$25M',
    icon: '/assets/currencies/NZDUSD.svg',
    risk: 'Medium'
  }
]

const walletBalances = [
  { name: 'ETH', fullName: 'Ethereum Wallet', balance: 2.5, icon: '/assets/crypto/ETH.svg' },
  { name: 'BTC', fullName: 'Bitcoin Wallet', balance: 0.15, icon: '/assets/crypto/BTC.svg' },
  { name: 'SOL', fullName: 'Solana Wallet', balance: 0, icon: '/assets/crypto/SOL.svg' },
  { name: 'ADA', fullName: 'Cardano Wallet', balance: 1500, icon: '/assets/crypto/ADA.svg' },
  { name: 'DOT', fullName: 'Polkadot Wallet', balance: 50, icon: '/assets/crypto/DOT.svg' },
  { name: 'AVAX', fullName: 'Avalanche Wallet', balance: 0, icon: '/assets/crypto/AVAX.svg' },
  { name: 'MATIC', fullName: 'Polygon Wallet', balance: 0, icon: '/assets/crypto/MATIC.svg' },
  { name: 'LINK', fullName: 'Chainlink Wallet', balance: 25, icon: '/assets/crypto/LINK.svg' }
]

function StakeFormContent({ 
  selectedPool, 
  stakeAmount, 
  setStakeAmount,
  stakeType,
  setStakeType,
  partnerEmail,
  setPartnerEmail,
  partnerShare,
  setPartnerShare,
  selectedWallet,
  setSelectedWallet,
  userSearchStatus,
  setUserSearchStatus,
  foundUser,
  setFoundUser,
  handleSearchUser
}: any) {
  return (
    <div className="space-y-4 pt-4">
      {/* Pool Info */}
      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={selectedPool?.icon || ''}
            alt={selectedPool?.symbol || ''}
            fill
            className="rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
        <div>
          <div className="font-semibold">{selectedPool?.name}</div>
          <div className="text-sm text-emerald-600 font-medium">{selectedPool?.apy}% APY</div>
        </div>
      </div>

      {/* Stake Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Stake Type</label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={stakeType === 'solo' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => setStakeType('solo')}
          >
            <User className="w-4 h-4 mr-2" />
            Solo Staker
          </Button>
          <Button
            type="button"
            variant={stakeType === 'joint' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => setStakeType('joint')}
            disabled={!(selectedPool as any)?.isJointAllowed}
          >
            <Users className="w-4 h-4 mr-2" />
            Joint Staker
          </Button>
        </div>
        {!(selectedPool as any)?.isJointAllowed && (
          <p className="text-xs text-muted-foreground">
            Joint staking is not available for this pool
          </p>
        )}
      </div>

      {/* Joint Staker Fields */}
      {stakeType === 'joint' && (
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

            {/* User Search Status with Skeleton */}
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
                  <div className="text-sm font-medium text-emerald-600">User Found!</div>
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
                Partner will receive {100 - Number(partnerShare)}% of rewards
              </p>
            </div>
          )}
        </div>
      )}

      {/* Amount to Stake */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount to Stake</label>
        <Input
          type="number"
          placeholder={`Min: ${selectedPool?.minStake} ${selectedPool?.symbol}`}
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
      </div>

      {/* Wallet Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Deduct From</label>
        <Select value={selectedWallet} onValueChange={setSelectedWallet}>
          <SelectTrigger>
            <SelectValue placeholder="Select wallet" />
          </SelectTrigger>
          <SelectContent>
            {walletBalances
              .filter(wallet => wallet.name === selectedPool?.symbol)
              .map((wallet) => (
                <SelectItem key={wallet.name} value={wallet.name}>
                  <div className="flex items-center gap-2">
                    {wallet.fullName} ({wallet.balance} {wallet.name})
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        {/* Show deposit button if selected wallet has 0 balance */}
        {selectedWallet && walletBalances.find(w => w.name === selectedWallet)?.balance === 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-yellow-600 font-medium">Insufficient Balance</p>
              <p className="text-xs text-muted-foreground">Your {selectedWallet} wallet is empty</p>
            </div>
            <Button size="sm" variant="outline">
              Deposit Now
            </Button>
          </div>
        )}
      </div>

      {/* Estimated Rewards */}
      <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lock Period</span>
          <span className="font-medium">{selectedPool?.lockPeriod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Est. Annual Rewards</span>
          <span className="font-medium text-emerald-600">
            {stakeAmount ? (Number(stakeAmount) * (selectedPool?.apy || 0) / 100).toFixed(4) : '0.00'} {selectedPool?.symbol}
          </span>
        </div>
        {stakeType === 'joint' && userSearchStatus === 'found' && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Share ({partnerShare}%)</span>
              <span className="font-medium text-emerald-600">
                {stakeAmount ? ((Number(stakeAmount) * (selectedPool?.apy || 0) / 100) * Number(partnerShare) / 100).toFixed(4) : '0.00'} {selectedPool?.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Partner Share ({100 - Number(partnerShare)}%)</span>
              <span className="font-medium text-muted-foreground">
                {stakeAmount ? ((Number(stakeAmount) * (selectedPool?.apy || 0) / 100) * (100 - Number(partnerShare)) / 100).toFixed(4) : '0.00'} {selectedPool?.symbol}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Confirm Button */}
      <Button 
        className="w-full" 
        size="lg"
        disabled={
          !stakeAmount || 
          !selectedWallet || 
          (stakeType === 'joint' && userSearchStatus !== 'found')
        }
      >
        Confirm Stake
      </Button>
    </div>
  )
}

export function AvailablePools({ adminPlans = [] }: AvailablePoolsProps) {
  const [assetType, setAssetType] = useState<AssetType>('crypto')
  const [selectedPool, setSelectedPool] = useState<any>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeType, setStakeType] = useState<'solo' | 'joint'>('solo')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerShare, setPartnerShare] = useState('50')
  const [selectedWallet, setSelectedWallet] = useState('')
  const [userSearchStatus, setUserSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not-found'>('idle')
  const [foundUser, setFoundUser] = useState<{ name: string; email: string } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Transform admin plans to pool format
  const adminPoolsTransformed = adminPlans.map(plan => ({
    symbol: plan.symbol,
    name: plan.name,
    apy: plan.apy,
    lockPeriod: `${plan.duration_days} days`,
    minStake: plan.min_amount,
    totalStaked: '0', // Not tracked yet
    icon: `/assets/crypto/${plan.symbol}.svg`,
    risk: plan.apy > 15 ? 'High' : plan.apy > 10 ? 'Medium' : 'Low',
    isJointAllowed: plan.is_joint_allowed,
    planId: plan.id
  }))

  // Get current pools based on asset type - prioritize admin plans for crypto
  const currentPools = assetType === 'crypto' 
    ? (adminPoolsTransformed.length > 0 ? adminPoolsTransformed : stakingPools)
    : assetType === 'stocks' ? stockPools : currencyPools

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-emerald-600 bg-emerald-500/10'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-500/10'
      case 'High':
        return 'text-red-600 bg-red-500/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
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
          description: `${result.user.full_name} is available for joint staking`
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

  const resetDialog = () => {
    setStakeAmount('')
    setStakeType('solo')
    setPartnerEmail('')
    setPartnerShare('50')
    setSelectedWallet('')
    setUserSearchStatus('idle')
    setFoundUser(null)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetDialog()
    }
  }

  const formProps = {
    selectedPool,
    stakeAmount,
    setStakeAmount,
    stakeType,
    setStakeType,
    partnerEmail,
    setPartnerEmail,
    partnerShare,
    setPartnerShare,
    selectedWallet,
    setSelectedWallet,
    userSearchStatus,
    setUserSearchStatus,
    foundUser,
    setFoundUser,
    handleSearchUser
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Available Staking Pools</CardTitle>
        <p className="text-sm text-muted-foreground">Choose a pool to start earning rewards</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPools.map((pool) => (
            <Card key={pool.symbol} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={pool.icon}
                        alt={pool.symbol}
                        fill
                        className="rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{pool.symbol}</div>
                      <div className="text-xs text-muted-foreground">{pool.name}</div>
                    </div>
                  </div>
                  <Badge className={getRiskColor(pool.risk)}>
                    {pool.risk}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>APY</span>
                    </div>
                    <span className="font-semibold text-emerald-600">{pool.apy}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Lock Period</span>
                    </div>
                    <span className="text-sm font-medium">{pool.lockPeriod}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Min Stake</span>
                    </div>
                    <span className="text-sm font-medium">{pool.minStake} {pool.symbol}</span>
                  </div>
                </div>

                {isMobile ? (
                  <Drawer open={isOpen} onOpenChange={handleOpenChange}>
                    <DrawerTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedPool(pool)}
                      >
                        Stake {pool.symbol}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[90vh]">
                      <DrawerHeader>
                        <DrawerTitle>Stake {selectedPool?.symbol}</DrawerTitle>
                      </DrawerHeader>
                      <div className="px-4 pb-4 overflow-y-auto">
                        <StakeFormContent {...formProps} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedPool(pool)}
                      >
                        Stake {pool.symbol}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Stake {selectedPool?.symbol}</DialogTitle>
                      </DialogHeader>
                      <StakeFormContent {...formProps} />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
