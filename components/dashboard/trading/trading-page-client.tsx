"use client"

import React, { useState } from 'react'
import { CryptoList } from '@/components/dashboard/trading/crypto-list'
import { TradingChart } from '@/components/dashboard/trading/trading-chart'

type AssetType = 'crypto' | 'stocks' | 'currencies'

interface TradingPageClientProps {
  children?: React.ReactNode
}

export function TradingPageClient({ children }: TradingPageClientProps) {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  const [assetType, setAssetType] = useState<AssetType>('crypto')

  const handlePairSelect = (pair: string, symbol: string) => {
    setSelectedPair(pair)
    setSelectedSymbol(symbol)
  }

  const handleAssetTypeChange = (type: AssetType) => {
    setAssetType(type)
  }

  return (
    <>
      {/* Portfolio Balance - Passed as children from server */}
      {children}

      {/* Main Trading Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0 mb-6">
        {/* Left Column: Crypto List */}
        <div className="h-full">
          <CryptoList 
            onPairSelect={handlePairSelect} 
            selectedPair={selectedPair}
            onAssetTypeChange={handleAssetTypeChange}
          />
        </div>

        {/* Right Column: Trading Chart - Hidden on mobile */}
        <div className="h-full hidden xl:block">
          <TradingChart 
            selectedPair={selectedPair} 
            selectedSymbol={selectedSymbol}
            assetType={assetType}
          />
        </div>
      </div>
    </>
  )
}
