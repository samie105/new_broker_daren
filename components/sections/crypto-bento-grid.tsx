"use client"

import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Eye, Star, ArrowUpRight, ArrowDownRight, Globe, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import Image from 'next/image'

export function CryptoBentoGrid() {
  const cryptoData = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: '$43,176.32',
      change: '+2.45%',
      change24h: '$1,032.50',
      trend: 'up',
      marketCap: '$847.2B',
      volume: '$28.4B',
      image: '/assets/crypto/BTC.svg',
      color: 'hsl(var(--chart-1))',
      size: 'large',
      description: 'Digital Gold Standard',
      rank: 1,
      dominance: '52.1%',
      supply: '19.8M BTC',
      allTimeHigh: '$69,044.77',
      fear: 'Greed',
      sparkline: [41200, 42100, 41800, 43200, 43176]
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: '$2,498.65',
      change: '+1.82%',
      change24h: '+$44.65',
      trend: 'up',
      marketCap: '$300.5B',
      volume: '$15.2B',
      image: '/assets/crypto/ETH.svg',
      color: 'hsl(var(--chart-2))',
      size: 'large',
      description: 'Smart Contract Platform',
      rank: 2,
      dominance: '18.5%',
      supply: '120.3M ETH',
      allTimeHigh: '$4,891.70',
      fear: 'Optimism',
      sparkline: [2420, 2456, 2489, 2501, 2498]
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: '$210.78',
      change: '+5.23%',
      change24h: '+$10.48',
      trend: 'up',
      marketCap: '$98.7B',
      volume: '$4.8B',
      image: '/assets/crypto/SOL.svg',
      color: 'hsl(var(--chart-3))',
      size: 'medium',
      description: 'High-Performance Blockchain',
      rank: 5,
      dominance: '6.1%',
      supply: '468.4M SOL',
      allTimeHigh: '$259.96',
      fear: 'Extreme Greed',
      sparkline: [198, 205, 209, 212, 210]
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: '$3.36',
      change: '-1.24%',
      change24h: '-$0.04',
      trend: 'down',
      marketCap: '$117.8B',
      volume: '$2.1B',
      image: '/assets/crypto/ADA.svg',
      color: 'hsl(var(--chart-4))',
      size: 'medium',
      description: 'Research-Driven Platform',
      rank: 4,
      dominance: '7.3%',
      supply: '35.0B ADA',
      allTimeHigh: '$3.09',
      fear: 'Fear',
      sparkline: [3.42, 3.38, 3.35, 3.31, 3.36]
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      price: '$19.89',
      change: '+3.15%',
      change24h: '+$0.61',
      trend: 'up',
      marketCap: '$26.4B',
      volume: '$1.2B',
      image: '/assets/crypto/DOT.svg',
      color: 'hsl(var(--chart-5))',
      size: 'small',
      description: 'Interoperability Protocol',
      rank: 11,
      dominance: '1.6%',
      supply: '1.33B DOT',
      allTimeHigh: '$54.98',
      fear: 'Optimism',
      sparkline: [19.2, 19.5, 19.8, 20.1, 19.89]
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      price: '$7.04',
      change: '+2.89%',
      change24h: '+$0.20',
      trend: 'up',
      marketCap: '$6.7B',
      volume: '$892M',
      image: '/assets/crypto/MATIC.svg',
      color: 'hsl(var(--chart-1))',
      size: 'small',
      description: 'Ethereum Scaling Solution',
      rank: 13,
      dominance: '0.4%',
      supply: '10.0B MATIC',
      allTimeHigh: '$2.92',
      fear: 'Greed',
      sparkline: [6.82, 6.95, 7.02, 7.08, 7.04]
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      price: '$25.67',
      change: '+4.12%',
      change24h: '+$1.02',
      trend: 'up',
      marketCap: '$15.1B',
      volume: '$1.5B',
      image: '/assets/crypto/LINK.svg',
      color: 'hsl(var(--chart-2))',
      size: 'small',
      description: 'Decentralized Oracle Network',
      rank: 12,
      dominance: '0.9%',
      supply: '588.1M LINK',
      allTimeHigh: '$52.88',
      fear: 'Greed',
      sparkline: [24.5, 25.1, 25.4, 25.8, 25.67]
    },
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      price: '$124.33',
      change: '+6.78%',
      change24h: '+$7.89',
      trend: 'up',
      marketCap: '$48.2B',
      volume: '$3.2B',
      image: '/assets/crypto/AVAX.svg',
      color: 'hsl(var(--chart-3))',
      size: 'medium',
      description: 'Highly Scalable Blockchain',
      rank: 6,
      dominance: '3.0%',
      supply: '388.0M AVAX',
      allTimeHigh: '$146.22',
      fear: 'Extreme Greed',
      sparkline: [115, 118, 122, 126, 124]
    },
    {
      symbol: 'UNI',
      name: 'Uniswap',
      price: '$31.45',
      change: '+8.92%',
      change24h: '+$2.58',
      trend: 'up',
      marketCap: '$18.9B',
      volume: '$2.8B',
      image: '/assets/crypto/UNI.svg',
      color: 'hsl(var(--chart-4))',
      size: 'small',
      description: 'Decentralized Exchange Protocol',
      rank: 10,
      dominance: '1.2%',
      supply: '1.0B UNI',
      allTimeHigh: '$44.97',
      fear: 'Extreme Greed',
      sparkline: [28.5, 29.8, 30.5, 32.1, 31.45]
    }
  ]

  const getGridClass = (size: string, index: number) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2'
      case 'medium':
        return 'md:col-span-2 md:row-span-1'
      case 'small':
        return 'md:col-span-1 md:row-span-1'
      default:
        return 'md:col-span-1 md:row-span-1'
    }
  }

  const getFearGreedColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Extreme Greed':
        return 'text-green-500 bg-green-500/10'
      case 'Greed':
        return 'text-green-400 bg-green-400/10'
      case 'Optimism':
        return 'text-blue-500 bg-blue-500/10'
      case 'Fear':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'Extreme Fear':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-muted-foreground bg-muted/10'
    }
  }

  const MiniSparkline = ({ data, trend }: { data: number[]; trend: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60
      const y = 20 - ((value - min) / range) * 20
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="60" height="20" className="ml-auto">
        <polyline
          fill="none"
          stroke={trend === 'up' ? '#22c55e' : '#ef4444'}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    )
  }

  const CryptoCard = ({ crypto }: { crypto: typeof cryptoData[0] }) => {
    return (
      <div className="h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 group hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className={`rounded-full flex items-center justify-center ${
                crypto.size === 'large' ? 'w-12 h-12' : 'w-10 h-10'
              }`}
              style={{ backgroundColor: `${crypto.color}20` }}
            >
              <Image
                src={crypto.image}
                alt={crypto.name}
                width={crypto.size === 'large' ? 32 : 24}
                height={crypto.size === 'large' ? 32 : 24}
                className={crypto.size === 'large' ? 'w-8 h-8' : 'w-6 h-6'}
              />
            </div>
            <div>
              <div className={`font-bold ${crypto.size === 'large' ? 'text-lg' : 'text-base'} text-gray-900 dark:text-gray-100`}>
                {crypto.symbol}
              </div>
              <div className={`${crypto.size === 'large' ? 'text-sm' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
                {crypto.name}
              </div>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={`text-xs ${
              crypto.size === 'small' ? 'hidden lg:inline-flex' : ''
            }`}
          >
            #{crypto.rank}
          </Badge>
        </div>

        {/* Price and Change */}
        <div className="space-y-2">
          <div className={`font-bold ${crypto.size === 'large' ? 'text-2xl' : 'text-xl'} text-gray-900 dark:text-gray-100`}>
            {crypto.price}
          </div>
          <div className="flex items-center justify-between">
            <Badge 
              variant={crypto.trend === 'up' ? 'default' : 'destructive'} 
              className="text-xs"
            >
              {crypto.trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {crypto.change}
            </Badge>
            {crypto.size !== 'small' && (
              <MiniSparkline data={crypto.sparkline} trend={crypto.trend} />
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {crypto.change24h} (24h)
          </div>
        </div>

        {/* Size-specific content */}
        {crypto.size === 'large' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{crypto.marketCap}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Market Cap</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{crypto.volume}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">24h Volume</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Dominance:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{crypto.dominance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Supply:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{crypto.supply}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">ATH:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{crypto.allTimeHigh}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sentiment: </span>
                <Badge className={`text-xs ${getFearGreedColor(crypto.fear)}`}>
                  {crypto.fear}
                </Badge>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        )}

        {crypto.size === 'medium' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{crypto.marketCap}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Market Cap</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{crypto.volume}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Volume</div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Dominance:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{crypto.dominance}</span>
            </div>
          </div>
        )}

        {crypto.size === 'small' && (
          <div className="space-y-2">
            <div className="text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{crypto.marketCap}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Market Cap</div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {crypto.description}
            </div>
          </div>
        )}

        {/* Watch Button */}
        <Button 
          size="sm" 
          variant="ghost" 
          className="w-full text-xs group-hover:bg-primary/10 transition-colors"
        >
          <Star className="w-3 h-3 mr-1" />
          Add to Watchlist
        </Button>
      </div>
    )
  }

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-12">
            <Badge className="inline-flex items-center space-x-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BarChart3 className="w-4 h-4" />
              <span>Real-Time Market Data</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Live <span className="gradient-text">crypto prices</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track the performance of top cryptocurrencies with real-time prices, market data, and advanced analytics
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeInUp" delay={0.2}>
          <BentoGrid className="max-w-7xl mx-auto">
            {cryptoData.map((crypto, index) => (
              <BentoGridItem
                key={crypto.symbol}
                title=""
                description=""
                header={<CryptoCard crypto={crypto} />}
                className={getGridClass(crypto.size, index)}
              />
            ))}
          </BentoGrid>
        </AnimateOnScroll>

        {/* Market Stats Footer */}
        <AnimateOnScroll animation="fadeInUp" delay={0.3} className="mt-12">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">$1.67T</div>
                  <div className="text-sm text-muted-foreground">Total Market Cap</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">+2.4%</div>
                  <div className="text-sm text-muted-foreground">24h Change</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">$89.2B</div>
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">12,847</div>
                  <div className="text-sm text-muted-foreground">Active Coins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
    </section>
  )
} 