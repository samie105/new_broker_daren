"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TrendingUp, Users, Star, Trophy, Copy } from 'lucide-react'

const tradingExperts = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: '/avatars/expert1.jpg',
    title: 'Crypto Technical Analyst',
    rating: 4.8,
    followers: 12500,
    winRate: 78.5,
    totalReturn: 245.8,
    monthlyReturn: 18.5,
    expertise: ['Bitcoin', 'DeFi', 'Technical Analysis'],
    verified: true,
    followers24h: 150,
    copiers: 850
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    avatar: '/avatars/expert2.jpg',
    title: 'Institutional Trader',
    rating: 4.9,
    followers: 8900,
    winRate: 82.1,
    totalReturn: 189.3,
    monthlyReturn: 22.1,
    expertise: ['Ethereum', 'Altcoins', 'Risk Management'],
    verified: true,
    followers24h: 89,
    copiers: 640
  },
  {
    id: 3,
    name: 'Alex Thompson',
    avatar: '/avatars/expert3.jpg',
    title: 'Quantitative Analyst',
    rating: 4.7,
    followers: 15200,
    winRate: 71.2,
    totalReturn: 298.7,
    monthlyReturn: 15.8,
    expertise: ['Algorithmic Trading', 'Portfolio Management'],
    verified: true,
    followers24h: 203,
    copiers: 1200
  }
]

export function ExpertList() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {tradingExperts.map((expert) => (
        <Card key={expert.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={expert.avatar} alt={expert.name} />
                  <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{expert.name}</h3>
                    {expert.verified && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                        <Trophy className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{expert.title}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{expert.rating}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{expert.followers.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Copy className="w-4 h-4" />
                <span>{expert.copiers}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-emerald-600">+{expert.totalReturn}%</div>
                <div className="text-xs text-muted-foreground">Total Return</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-bold">{expert.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xl font-bold text-primary">+{expert.monthlyReturn}%</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>

            {/* Expertise Tags */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Expertise</div>
              <div className="flex flex-wrap gap-1">
                {expert.expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Growth Indicator */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New followers (24h)</span>
              <div className="flex items-center space-x-1 text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span className="font-medium">+{expert.followers24h}</span>
              </div>
            </div>

            <Button className="w-full">
              Copy Trades
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}