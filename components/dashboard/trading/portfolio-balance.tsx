"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

interface PortfolioAsset {
  symbol: string
  name: string
  balance: number
  value: number
  change: number
  icon: string
}

interface PortfolioBalanceProps {
  assets: PortfolioAsset[]
  totalValue: number
}

export function PortfolioBalance({ assets = [], totalValue = 0 }: PortfolioBalanceProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Portfolio Balance</CardTitle>
            <div className="text-3xl font-bold text-foreground mt-2">
              ${totalValue.toLocaleString()}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            View Assets
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8">
                    <Image
                      src={asset.icon}
                      alt={asset.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{asset.symbol}</div>
                    <div className="text-xs text-muted-foreground">{asset.balance.toFixed(4)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-sm">
                    ${asset.value.toLocaleString()}
                  </div>
                  <div className={`text-xs flex items-center ${
                    asset.change > 0 ? 'text-emerald-600' : asset.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {asset.change > 0 ? '+' : asset.change < 0 ? '' : ''}{asset.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
