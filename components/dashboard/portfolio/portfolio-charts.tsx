"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const allocationData = [
  { name: 'Bitcoin', value: 35.2, color: '#F7931A' },
  { name: 'Ethereum', value: 24.8, color: '#627EEA' },
  { name: 'Solana', value: 18.5, color: '#9945FF' },
  { name: 'Cardano', value: 12.3, color: '#0033AD' },
  { name: 'Others', value: 9.2, color: '#64748B' }
]

export function PortfolioCharts() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Asset Allocation</CardTitle>
        <p className="text-sm text-muted-foreground">Portfolio distribution</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {allocationData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="pt-4 border-t border-border/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                Best Performer
              </div>
              <div className="text-sm font-semibold text-emerald-600 mt-1">
                ADA +12.8%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                Rebalance Score
              </div>
              <div className="text-sm font-semibold mt-1">
                8.5/10
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}