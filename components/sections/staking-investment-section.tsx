"use client"

import React from 'react'
import { Shield, TrendingUp, Users, Clock, Coins, ArrowUpRight, Star, Lock, Globe, Target, Award, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AnimateOnScroll, StaggeredAnimateOnScroll } from '@/components/ui/animate-on-scroll'
import Image from 'next/image'

export function StakingInvestmentSection() {
  const stakingOptions = [
    {
      name: 'Ethereum 2.0',
      symbol: 'ETH',
      image: '/assets/crypto/ETH.svg',
      apy: '4.2%',
      minStake: '0.1 ETH',
      lockPeriod: 'Flexible',
      totalStaked: '$128.5M',
      participants: '12,450',
      status: 'active',
      color: 'hsl(var(--chart-2))',
      description: 'Secure the Ethereum network and earn rewards',
      risk: 'Low',
      features: ['Liquid Staking', 'Auto-Compound', 'Slashing Protection']
    },
    {
      name: 'Solana Staking',
      symbol: 'SOL',
      image: '/assets/crypto/SOL.svg',
      apy: '6.8%',
      minStake: '1 SOL',
      lockPeriod: '2-3 days',
      totalStaked: '$89.2M',
      participants: '8,750',
      status: 'active',
      color: 'hsl(var(--chart-3))',
      description: 'High-performance blockchain staking rewards',
      risk: 'Medium',
      features: ['Fast Unstaking', 'High APY', 'MEV Rewards']
    },
    {
      name: 'Cardano Pool',
      symbol: 'ADA',
      image: '/assets/crypto/ADA.svg',
      apy: '5.1%',
      minStake: '10 ADA',
      lockPeriod: '20 days',
      totalStaked: '$67.8M',
      participants: '5,320',
      status: 'active',
      color: 'hsl(var(--chart-4))',
      description: 'Research-driven proof-of-stake protocol',
      risk: 'Low',
      features: ['Delegation', 'Liquid Rewards', 'Governance Rights']
    },
    {
      name: 'Polkadot Nominator',
      symbol: 'DOT',
      image: '/assets/crypto/DOT.svg',
      apy: '7.3%',
      minStake: '5 DOT',
      lockPeriod: '28 days',
      totalStaked: '$45.1M',
      participants: '3,890',
      status: 'limited',
      color: 'hsl(var(--chart-5))',
      description: 'Multi-chain interoperability staking',
      risk: 'Medium',
      features: ['Cross-Chain', 'Parachain Auctions', 'High Returns']
    }
  ]

  const investmentPools = [
    {
      name: 'DeFi Yield Pool',
      type: 'Automated Strategy',
      totalValue: '$2.4M',
      participants: '1,250',
      apy: '12.5%',
      risk: 'High',
      minInvestment: '$100',
      lockPeriod: '30 days',
      assets: ['AAVE', 'COMP', 'UNI', 'SUSHI'],
      description: 'Diversified DeFi protocol yield farming',
      strategy: 'Multi-protocol yield optimization',
      features: ['Auto-Rebalancing', 'Compound Interest', 'Risk Management']
    },
    {
      name: 'Blue Chip Crypto Fund',
      type: 'Index Fund',
      totalValue: '$5.8M',
      participants: '2,870',
      apy: '15.2%',
      risk: 'Medium',
      minInvestment: '$250',
      lockPeriod: '90 days',
      assets: ['BTC', 'ETH', 'SOL', 'ADA'],
      description: 'Top cryptocurrency exposure with professional management',
      strategy: 'Market cap weighted allocation',
      features: ['Professional Management', 'Diversified', 'Regular Rebalancing']
    },
    {
      name: 'Gaming & NFT Fund',
      type: 'Thematic Investment',
      totalValue: '$1.9M',
      participants: '890',
      apy: '22.8%',
      risk: 'High',
      minInvestment: '$500',
      lockPeriod: '60 days',
      assets: ['AXS', 'SAND', 'MANA', 'ENJ'],
      description: 'Gaming tokens and NFT ecosystem investments',
      strategy: 'Gaming and metaverse focused allocation',
      features: ['High Growth Potential', 'Trend Following', 'Sector Expertise']
    }
  ]

  const jointStakingBenefits = [
    {
      icon: Users,
      title: 'Pool Resources',
      description: 'Combine funds to meet minimum staking requirements',
      benefit: 'Lower barriers to entry'
    },
    {
      icon: Shield,
      title: 'Shared Risk',
      description: 'Distribute risk across multiple participants',
      benefit: 'Reduced individual exposure'
    },
    {
      icon: TrendingUp,
      title: 'Better Returns',
      description: 'Access to higher APY pools with larger stakes',
      benefit: 'Optimized yield generation'
    },
    {
      icon: Star,
      title: 'Professional Management',
      description: 'Experienced validators and node operators',
      benefit: 'Expert infrastructure management'
    }
  ]

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-12">
            <Badge className="inline-flex items-center space-x-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Coins className="w-4 h-4" />
              <span>Staking & Investment Hub</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Grow your crypto with <span className="gradient-text">smart staking</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join group staking pools and investment funds to maximize returns while minimizing risks through shared resources
            </p>
          </div>
        </AnimateOnScroll>

        {/* Joint Staking Benefits */}
        <StaggeredAnimateOnScroll
          animation="fadeInUp"
          staggerDelay={0.1}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {jointStakingBenefits.map((benefit, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:bg-card/70 transition-all group text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                <Badge variant="outline" className="text-xs">
                  {benefit.benefit}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </StaggeredAnimateOnScroll>

        {/* Staking Options */}
        <AnimateOnScroll animation="fadeInUp" className="mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Joint Staking Pools</h3>
            <p className="text-muted-foreground">
              Participate in group staking to access premium validators and higher rewards
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {stakingOptions.map((option, index) => (
              <AnimateOnScroll key={option.symbol} animation="fadeInUp" delay={index * 0.1}>
                <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-all group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${option.color}20` }}
                        >
                          <Image
                            src={option.image}
                            alt={option.name}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{option.name}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={option.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {option.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-primary/5">
                        <div className="text-2xl font-bold text-primary">{option.apy}</div>
                        <div className="text-xs text-muted-foreground">Annual APY</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/50">
                        <div className="text-lg font-bold">{option.participants}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min Stake:</span>
                        <span className="font-medium">{option.minStake}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lock Period:</span>
                        <span className="font-medium">{option.lockPeriod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Staked:</span>
                        <span className="font-medium">{option.totalStaked}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <Badge variant={option.risk === 'Low' ? 'default' : 'secondary'} className="text-xs">
                          {option.risk}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {option.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full gradient-bg group-hover:shadow-lg transition-all">
                      <Lock className="w-4 h-4 mr-2" />
                      Join Staking Pool
                    </Button>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Investment Pools */}
        <AnimateOnScroll animation="fadeInUp">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Joint Investment Funds</h3>
            <p className="text-muted-foreground">
              Professional managed funds with shared capital and diversified strategies
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {investmentPools.map((pool, index) => (
              <AnimateOnScroll key={pool.name} animation="fadeInUp" delay={index * 0.1}>
                <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-all group h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {pool.type}
                      </Badge>
                      <Badge 
                        variant={pool.risk === 'Low' ? 'default' : pool.risk === 'Medium' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {pool.risk} Risk
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{pool.name}</CardTitle>
                    <CardDescription>{pool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                      <div className="text-3xl font-bold text-primary">{pool.apy}</div>
                      <div className="text-sm text-muted-foreground">Expected Annual Return</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 rounded-lg bg-background/50">
                        <div className="text-sm font-bold">{pool.totalValue}</div>
                        <div className="text-xs text-muted-foreground">Total AUM</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/50">
                        <div className="text-sm font-bold">{pool.participants}</div>
                        <div className="text-xs text-muted-foreground">Investors</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min Investment:</span>
                        <span className="font-medium">{pool.minInvestment}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lock Period:</span>
                        <span className="font-medium">{pool.lockPeriod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Strategy:</span>
                        <span className="font-medium text-right text-xs">{pool.strategy}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Key Assets:</div>
                      <div className="flex flex-wrap gap-2">
                        {pool.assets.map((asset, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {pool.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full gradient-bg group-hover:shadow-lg transition-all">
                      <Target className="w-4 h-4 mr-2" />
                      Join Investment Fund
                    </Button>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Call to Action */}
        <AnimateOnScroll animation="fadeInUp" delay={0.3}>
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 mt-16">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of investors who are already earning passive income through our secure staking pools and professional investment funds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-bg">
                  <Award className="w-5 h-5 mr-2" />
                  Explore Staking Pools
                </Button>
                <Button size="lg" variant="outline">
                  <Globe className="w-5 h-5 mr-2" />
                  Browse Investment Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
    </section>
  )
} 