"use client"

import React from 'react'
import { Shield, Users, Coins, Lock, Globe, User, UserCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { Timeline } from '@/components/ui/timeline'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export function StakingSection() {
  const timelineData = [
    {
      title: "Choose Path",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Decide between solo staking for full control or joint staking for easier entry
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-all border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Solo Staking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete control, direct rewards, no sharing
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Min Stake:</span>
                  <Badge variant="outline">32 ETH</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-green-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <CardTitle className="text-lg">Joint Staking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Lower entry, shared rewards, easy setup
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Min Stake:</span>
                  <Badge variant="outline">0.1 ETH</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Deposit Assets",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Lock your crypto assets in a validator node to secure the network
          </p>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10 shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="font-semibold">Secure Lock-up</h4>
                  <p className="text-sm text-muted-foreground">
                    Your assets are locked in smart contracts with multi-signature protection and cold storage security.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground">Security</div>
                      <div className="text-sm font-semibold">Bank-grade</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground">Protection</div>
                      <div className="text-sm font-semibold">Multi-sig</div>
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
      title: "Validate Network",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Your staked assets help validate transactions and create new blocks
          </p>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10 shrink-0">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="font-semibold">Network Participation</h4>
                  <p className="text-sm text-muted-foreground">
                    Contribute to blockchain security by validating transactions, proposing blocks, and maintaining consensus.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Transaction validation
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Block proposal
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Consensus maintenance
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
      title: "Earn Rewards",
      content: (
        <div>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Receive regular rewards based on your stake amount and network performance
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Coins className="w-4 h-4 mr-2 text-primary" />
                  Passive Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">4-15%</div>
                <p className="text-xs text-muted-foreground">Annual Percentage Yield</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  Auto-Compound
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500 mb-1">Daily</div>
                <p className="text-xs text-muted-foreground">Automatic Reinvestment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  const soloVsJoint = [
    {
      type: 'Solo Staking',
      icon: User,
      description: 'Full control over your assets',
      pros: [
        'Complete control',
        'Direct validator rewards',
        'No profit sharing',
        'Full decision power'
      ],
      cons: [
        'Higher minimums',
        'Technical setup',
        '32 ETH required',
        'Solo risk'
      ],
      minStake: '32 ETH',
      complexity: 'High',
      returns: '4-6%',
      color: 'primary'
    },
    {
      type: 'Joint Staking',
      icon: Users,
      description: 'Pool resources with others',
      pros: [
        'Lower entry barrier',
        'Shared risk',
        'Professional management',
        'Easy setup'
      ],
      cons: [
        'Shared rewards',
        'Less control',
        'Pool fees',
        'Trust required'
      ],
      minStake: '0.1 ETH',
      complexity: 'Low',
      returns: '3-5%',
      color: 'green'
    }
  ]

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Simplified Header */}
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <Badge className="inline-flex items-center space-x-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Coins className="w-4 h-4" />
              <span>Staking</span>
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-semibold mb-4">
              Earn rewards with <span className="gradient-text">crypto staking</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Secure networks, earn passive income
            </p>
          </div>
        </AnimateOnScroll>

        {/* Timeline Section */}
        <Timeline data={timelineData} />

        {/* Comparison Section */}
        <AnimateOnScroll animation="fadeInUp" className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-medium mb-3">Choose Your Approach</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the staking method that fits your goals
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {soloVsJoint.map((option, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-full ${option.color === 'primary' ? 'bg-primary/10' : 'bg-green-500/10'}`}>
                      <option.icon className={`w-6 h-6 ${option.color === 'primary' ? 'text-primary' : 'text-green-500'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{option.type}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-xs font-bold">{option.minStake}</div>
                      <div className="text-xs text-muted-foreground">Min</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-xs font-bold">{option.complexity}</div>
                      <div className="text-xs text-muted-foreground">Setup</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-xs font-bold text-green-500">{option.returns}</div>
                      <div className="text-xs text-muted-foreground">APY</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Pros
                      </h4>
                      <ul className="space-y-1.5">
                        {option.pros.map((pro, idx) => (
                          <li key={idx} className="text-xs flex items-start">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2 flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        Cons
                      </h4>
                      <ul className="space-y-1.5">
                        {option.cons.map((con, idx) => (
                          <li key={idx} className="text-xs flex items-start">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 rounded-full ${option.color === 'primary' ? 'bg-primary hover:bg-primary/90' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    <option.icon className="w-4 h-4 mr-2" />
                    Choose {option.type}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Staking Dashboard Showcase */}
        <AnimateOnScroll animation="fadeInUp" className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-medium mb-3">Manage Your Stakes</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track all your staking positions in one powerful dashboard
            </p>
          </div>
          
          <StakingImageShowcase />
        </AnimateOnScroll>
      </div>
    </section>
  )
}

function StakingImageShowcase() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-muted/50 border border-border">
        <div className="aspect-[16/10] w-full" />
      </div>
    )
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-background border border-border hover:shadow-3xl transition-shadow duration-300">
      <Image
        src={isDark ? '/assets/home/staking-page-dark.png' : '/assets/home/staking-page-light.png'}
        alt="Staking Dashboard"
        width={1920}
        height={1080}
        className="w-full h-auto"
        priority
      />
    </div>
  )
} 