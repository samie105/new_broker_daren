"use client"

import React from 'react'
import { TrendingUp, Target, Users, Shield, BarChart3, PieChart, Star, Globe, Award, Briefcase, DollarSign, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AnimateOnScroll, StaggeredAnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { Timeline } from '@/components/ui/timeline'

export function InvestmentSection() {
  const timelineData = [
    {
      title: "Risk Assessment",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Evaluate your risk tolerance and investment timeline to determine the best strategy
          </p>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10 shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="font-semibold">Personalized Risk Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    We analyze your financial goals, investment experience, and risk appetite to create a customized investment approach.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-xs text-muted-foreground">Conservative</div>
                      <div className="text-sm font-semibold text-green-500">Low Risk</div>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="text-xs text-muted-foreground">Balanced</div>
                      <div className="text-sm font-semibold text-yellow-500">Medium</div>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="text-xs text-muted-foreground">Aggressive</div>
                      <div className="text-sm font-semibold text-orange-500">High Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      title: "Strategy Selection",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Choose from proven investment strategies tailored to your goals
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-all border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">DCA Strategy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Regular investments to average out market volatility
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Expected Return:</span>
                  <Badge variant="outline" className="text-green-500">8-15%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-green-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <CardTitle className="text-lg">Growth Investing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Focus on high-potential emerging assets
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Expected Return:</span>
                  <Badge variant="outline" className="text-green-500">25-50%+</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Portfolio Building",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Diversify across different crypto assets and investment vehicles
          </p>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10 shrink-0">
                  <PieChart className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="font-semibold">Smart Diversification</h4>
                  <p className="text-sm text-muted-foreground">
                    Build a balanced portfolio across blue-chip cryptocurrencies, DeFi protocols, and emerging sectors.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Blue Chip Assets (BTC, ETH)
                      </div>
                      <span className="font-semibold">40%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        DeFi & Staking
                      </div>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Growth Opportunities
                      </div>
                      <span className="font-semibold">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      title: "Monitor & Optimize",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Track performance and rebalance your portfolio for optimal returns
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-primary" />
                  Real-time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor portfolio performance 24/7 with advanced metrics
                </p>
                <div className="text-2xl font-semibold text-primary">Live Dashboard</div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-500" />
                  Auto-Rebalancing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatic portfolio optimization based on market conditions
                </p>
                <div className="text-2xl font-semibold text-green-500">Quarterly</div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  const investmentTypes = [
    {
      icon: PieChart,
      title: 'Diversified Portfolios',
      description: 'Spread risk across multiple cryptocurrencies',
      benefit: 'Risk Management'
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategies',
      description: 'Focus on high-potential emerging crypto assets',
      benefit: 'High Returns'
    },
    {
      icon: Shield,
      title: 'Conservative Funds',
      description: 'Stable returns with established cryptocurrencies',
      benefit: 'Stability'
    },
    {
      icon: Activity,
      title: 'Active Trading',
      description: 'Professional day trading and arbitrage strategies',
      benefit: 'Alpha Generation'
    }
  ]

  const investmentStrategies = [
    {
      name: 'Dollar-Cost Averaging (DCA)',
      description: 'Invest fixed amounts regularly regardless of price',
      icon: BarChart3,
      risk: 'Low',
      timeframe: 'Long-term',
      returns: '8-15%',
      pros: ['Reduces volatility impact', 'Easy to execute', 'Emotional discipline'],
      cons: ['May miss timing opportunities', 'Slower capital deployment']
    },
    {
      name: 'Value Investing',
      description: 'Buy undervalued assets with strong fundamentals',
      icon: Target,
      risk: 'Medium',
      timeframe: 'Medium-term',
      returns: '15-25%',
      pros: ['Based on fundamentals', 'Lower risk', 'Long-term growth'],
      cons: ['Requires research', 'Patient capital needed']
    },
    {
      name: 'Growth Investing',
      description: 'Invest in high-growth potential cryptocurrencies',
      icon: TrendingUp,
      risk: 'High',
      timeframe: 'Variable',
      returns: '25-50%+',
      pros: ['High return potential', 'Innovation exposure', 'Market leadership'],
      cons: ['Higher volatility', 'Timing dependent']
    }
  ]

  const investmentFunds = [
    {
      name: 'DeFi Yield Fund',
      type: 'Yield Farming',
      totalValue: '$2.4M',
      participants: '1,250',
      apy: '12.5%',
      risk: 'Medium-High',
      minInvestment: '$100',
      lockPeriod: '30 days',
      strategy: 'Multi-protocol yield optimization across DeFi platforms',
      description: 'Automated yield farming across top DeFi protocols',
      assets: ['AAVE', 'COMP', 'UNI', 'SUSHI', 'CRV'],
      features: ['Auto-Rebalancing', 'Compound Interest', 'Risk Management', 'Gas Optimization']
    },
    {
      name: 'Blue Chip Index',
      type: 'Index Fund',
      totalValue: '$5.8M',
      participants: '2,870',
      apy: '15.2%',
      risk: 'Medium',
      minInvestment: '$250',
      lockPeriod: '90 days',
      strategy: 'Market cap weighted allocation to top cryptocurrencies',
      description: 'Diversified exposure to established cryptocurrencies',
      assets: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'],
      features: ['Professional Management', 'Diversified', 'Regular Rebalancing', 'Tax Optimization']
    },
    {
      name: 'Innovation Fund',
      type: 'Growth Strategy',
      totalValue: '$1.9M',
      participants: '890',
      apy: '22.8%',
      risk: 'High',
      minInvestment: '$500',
      lockPeriod: '60 days',
      strategy: 'Early-stage investments in emerging crypto sectors',
      description: 'Focus on AI, GameFi, and Web3 infrastructure tokens',
      assets: ['AI tokens', 'Gaming', 'Infrastructure', 'Privacy'],
      features: ['High Growth Potential', 'Sector Expertise', 'Early Access', 'Research-Driven']
    }
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-500 bg-green-500/10'
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'Medium-High':
        return 'text-orange-500 bg-orange-500/10'
      case 'High':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-16">
            <Badge className="inline-flex items-center space-x-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              <span>Crypto Investment Hub</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Smart <span className="gradient-text">crypto investments</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Build wealth through strategic cryptocurrency investments with professional fund management and proven strategies
            </p>
          </div>
        </AnimateOnScroll>

        {/* Timeline Section */}
        <Timeline data={timelineData} />

        {/* Investment Types */}
        <StaggeredAnimateOnScroll
          animation="fadeInUp"
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {investmentTypes.map((type, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                <Badge variant="outline" className="text-xs">
                  {type.benefit}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </StaggeredAnimateOnScroll>

        {/* Investment Strategies */}
        <AnimateOnScroll animation="fadeInUp" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-medium mb-4">Investment Strategies</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Choose from proven investment approaches tailored to different risk profiles and market conditions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {investmentStrategies.map((strategy, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <strategy.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <Badge className={`text-xs ${getRiskColor(strategy.risk)}`}>
                        {strategy.risk}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">Risk</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-xs font-bold">{strategy.timeframe}</div>
                      <div className="text-xs text-muted-foreground">Timeline</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-xs font-bold text-green-500">{strategy.returns}</div>
                      <div className="text-xs text-muted-foreground">Returns</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Advantages
                      </h4>
                      <ul className="space-y-1">
                        {strategy.pros.map((pro, idx) => (
                          <li key={idx} className="text-xs flex items-start">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2 flex items-center text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        Considerations
                      </h4>
                      <ul className="space-y-1">
                        {strategy.cons.map((con, idx) => (
                          <li key={idx} className="text-xs flex items-start">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimateOnScroll>


      </div>
    </section>
  )
} 