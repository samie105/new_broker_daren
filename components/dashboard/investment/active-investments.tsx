"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Calendar, TrendingUp, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'
import type { Investment } from '@/server/actions/portfolio'

interface ActiveInvestmentsProps {
  investments: Investment[]
}

// Circular Progress Component
function CircularProgress({ 
  percentage, 
  size = 80, 
  strokeWidth = 8,
  label,
  value
}: { 
  percentage: number
  size?: number
  strokeWidth?: number
  label: string
  value: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round(percentage)}%</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  )
}

export function ActiveInvestments({ investments = [] }: ActiveInvestmentsProps) {
  const [expandedInvestments, setExpandedInvestments] = useState<number[]>([])

  const toggleExpand = (index: number) => {
    setExpandedInvestments(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      active: { variant: "default", label: "Active" },
      matured: { variant: "secondary", label: "Matured" },
      pending: { variant: "outline", label: "Pending" }
    }
    
    const config = statusConfig[status.toLowerCase()] || { variant: "outline", label: status }
    return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
  }

  const getRiskBadge = (riskLevel: string) => {
    const riskConfig: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      low: { variant: "secondary", label: "Low Risk" },
      medium: { variant: "default", label: "Medium Risk" },
      high: { variant: "destructive", label: "High Risk" }
    }
    
    const config = riskConfig[riskLevel.toLowerCase()] || { variant: "outline", label: riskLevel }
    return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Active Investments</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your investment portfolio performance
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {investments.filter(inv => inv.status === 'active').length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {investments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No active investments</p>
            <p className="text-sm mt-1">Start investing to see your portfolio here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment, index) => {
              const isExpanded = expandedInvestments.includes(index)
              // Calculate progress based on days elapsed vs total duration (capped at 100%)
              const progress = investment.duration > 0 
                ? Math.min(100, ((investment.days_elapsed || 0) / investment.duration) * 100)
                : 0

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  {/* Investment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{investment.plan_name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {investment.plan_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(investment.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(index)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Investment Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Invested</p>
                      <p className="text-sm font-semibold">
                        ${investment.amount_invested.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        ${investment.current_value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Returns</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        +${investment.profit.toLocaleString()} ({investment.roi}%)
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Progress Section */}
                      <div className="flex items-center justify-between">
                        <CircularProgress
                          percentage={progress}
                          label="Progress"
                          value={`${investment.days_elapsed || 0}/${investment.duration} days`}
                        />
                        
                        <div className="flex-1 px-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Start Date
                              </span>
                              <span className="font-medium">{investment.start_date}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Maturity Date
                              </span>
                              <span className="font-medium">{investment.end_date}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Days Remaining</span>
                              <Badge variant="outline">
                                {investment.days_remaining || 0} days
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Strategy</p>
                          <p className="text-sm font-medium">{investment.strategy}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                          <div>{getRiskBadge(investment.risk_level)}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        {investment.status === 'active' && (
                          <Button size="sm" variant="outline" className="flex-1">
                            Withdraw Early
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
