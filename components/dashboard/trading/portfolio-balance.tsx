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
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xs sm:text-sm lg:text-base">Portfolio Balance</CardTitle>
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground mt-1 sm:mt-2">
              ${totalValue.toLocaleString()}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2"
          >
            <span className="hidden sm:inline">View Assets</span>
            <span className="sm:hidden">Assets</span>
            {isExpanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2 sm:space-y-3">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                    <Image
                      src={asset.icon}
                      alt={asset.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-[10px] sm:text-xs">{asset.symbol}</div>
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground">{asset.balance.toFixed(4)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-[10px] sm:text-xs">
                    ${asset.value.toLocaleString()}
                  </div>
                  <div className={`text-[9px] sm:text-[10px] flex items-center ${
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
