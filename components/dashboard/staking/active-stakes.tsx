"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Unlock, ChevronDown, ChevronUp } from 'lucide-react'
import { StakingPosition } from '@/server/actions/portfolio'

interface ActiveStakesProps {
  stakes: StakingPosition[]
}

export function ActiveStakes({ stakes = [] }: ActiveStakesProps) {
  const [expandedStakes, setExpandedStakes] = useState<number[]>([])

  const toggleStake = (id: number) => {
    setExpandedStakes(prev =>
      prev.includes(id) ? prev.filter(stakeId => stakeId !== id) : [...prev, id]
    )
  }

  if (stakes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Stakes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No active stakes yet
          </div>
        </CardContent>
      </Card>
    )
  }

  const calculateDays = (startDate: string, endDate?: string, lockPeriod?: number) => {
    const now = new Date()
    const start = new Date(startDate)
    const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (endDate) {
      const end = new Date(endDate)
      const daysLeft = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return { daysElapsed, daysLeft: Math.max(0, daysLeft) }
    }
    
    if (lockPeriod) {
      const daysLeft = Math.max(0, lockPeriod - daysElapsed)
      return { daysElapsed, daysLeft }
    }
    
    return { daysElapsed, daysLeft: 0 }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Active Stakes</CardTitle>
        <p className="text-sm text-muted-foreground">Manage your staked assets and rewards</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stakes.map((stake) => {
            const { daysElapsed, daysLeft } = calculateDays(stake.start_date, stake.end_date, stake.lock_period)
            const progress = daysLeft === 0 ? 100 : (daysElapsed / stake.lock_period) * 100
            const isExpanded = expandedStakes.includes(stake.id)
            const isUnlocked = stake.status === 'completed' || daysLeft === 0
            
            return (
              <Card key={stake.id} className="border-border/50">
                <CardContent className="p-4">
                  <div 
                    className="flex items-start justify-between mb-3 cursor-pointer"
                    onClick={() => toggleStake(stake.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image src={stake.icon} alt={stake.symbol} fill className="rounded-full" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{stake.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stake.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isUnlocked ? 'default' : 'secondary'}>
                        {stake.status === 'active' ? 'Active' : stake.status === 'completed' ? 'Unlocked' : 'Cancelled'}
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Staked</div>
                      <div className="font-semibold text-sm">{stake.amount.toLocaleString()} {stake.symbol}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Rewards</div>
                      <div className="font-semibold text-emerald-600 text-sm">+{stake.rewards.toLocaleString()} {stake.symbol}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{daysElapsed} days</span>
                      <span>{daysLeft} days left</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-border space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">APY</div>
                          <div className="font-semibold">{stake.apy}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Lock Period</div>
                          <div className="font-semibold">{stake.lock_period} days</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                          <div className="font-semibold">{new Date(stake.start_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{stake.end_date ? 'End Date' : 'Unlock Date'}</div>
                          <div className="font-semibold">{stake.end_date ? new Date(stake.end_date).toLocaleDateString() : 'Calculating...'}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isUnlocked ? (
                          <Button className="flex-1" size="sm"><Unlock className="w-4 h-4 mr-2" />Unstake & Claim</Button>
                        ) : (
                          <>
                            <Button variant="outline" className="flex-1" size="sm">Add More</Button>
                            <Button variant="outline" className="flex-1" size="sm">View Details</Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
