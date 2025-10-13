"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TrendingUp, TrendingDown, Play, Pause, Settings } from 'lucide-react'
import type { CopyTradingPosition } from '@/server/actions/portfolio'

interface CopyTradingOverviewProps {
  positions: CopyTradingPosition[]
}

export function CopyTradingOverview({ positions = [] }: CopyTradingOverviewProps) {
  const totalAllocated = positions.reduce((sum, pos) => sum + pos.allocated_amount, 0)
  const totalCurrentValue = positions.reduce((sum, pos) => sum + pos.current_value, 0)
  const totalProfit = totalCurrentValue - totalAllocated
  const totalProfitPercent = totalAllocated > 0 ? (totalProfit / totalAllocated) * 100 : 0

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      active: { variant: "default", label: "Active" },
      paused: { variant: "secondary", label: "Paused" },
      stopped: { variant: "outline", label: "Stopped" }
    }
    
    const config = statusConfig[status.toLowerCase()] || { variant: "outline", label: status }
    return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Allocated</div>
              <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Current Value</div>
              <div className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total P&L</div>
              <div className={`text-2xl font-bold flex items-center ${
                totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {totalProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-2" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2" />
                )}
                <span>
                  {totalProfit >= 0 ? '+' : ''}${Math.abs(totalProfit).toLocaleString()} 
                  ({totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Copy Trading Positions</CardTitle>
            <Badge variant="outline">{positions.filter(p => p.status === 'active').length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No active copy trading positions</p>
              <p className="text-sm mt-1">Start copying expert traders to see your positions here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => {
                const isProfit = position.profit >= 0

                return (
                  <div
                    key={position.expert_id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    {/* Expert Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={position.expert_avatar} alt={position.expert_name} />
                        <AvatarFallback>{getInitials(position.expert_name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{position.expert_name}</h3>
                          {getStatusBadge(position.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{position.trades_copied} trades copied</span>
                          <span>•</span>
                          <span>{position.win_rate}% success rate</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="text-right space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Allocated</div>
                        <div className="text-sm font-medium">${position.allocated_amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Current Value</div>
                        <div className="text-sm font-semibold">${position.current_value.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* P&L */}
                    <div className="text-right ml-6 space-y-1">
                      <div className={`text-lg font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}${position.profit.toFixed(2)}
                      </div>
                      <div className={`text-sm ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}{position.profit_percent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-6 flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        {position.status === 'active' ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
