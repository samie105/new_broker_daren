"use client"

import React, { useState } from 'react'
import { TradingChart } from './trading-chart'
import { CryptoList } from './crypto-list'
import { PlaceOrder } from './place-order'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Wallet,
  ListOrdered,
  TrendingUp,
  X,
  ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AssetType = 'crypto' | 'stocks' | 'currencies'

interface TradingViewLayoutProps {
  children?: React.ReactNode
}

export function TradingViewLayout({ children }: TradingViewLayoutProps) {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  const [assetType, setAssetType] = useState<AssetType>('crypto')
  
  // Panel states - default closed to not interfere with navigation
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false)
  const [orderPanelOpen, setOrderPanelOpen] = useState(false)

  const handlePairSelect = (pair: string, symbol: string) => {
    setSelectedPair(pair)
    setSelectedSymbol(symbol)
  }

  const handleAssetTypeChange = (type: AssetType) => {
    setAssetType(type)
    // Set default symbols for each asset type to avoid invalid symbols
    if (type === 'crypto' && assetType !== 'crypto') {
      // Only change if switching FROM another type
      setSelectedPair('BTC/USDT')
      setSelectedSymbol('BTCUSDT')
    } else if (type === 'stocks' && assetType !== 'stocks') {
      setSelectedPair('AAPL/USD')
      setSelectedSymbol('AAPL')
    } else if (type === 'currencies' && assetType !== 'currencies') {
      setSelectedPair('EURUSD')
      setSelectedSymbol('EURUSD')
    }
  }

  // Extract children components
  const childrenArray = React.Children.toArray(children)
  const portfolioBalance = childrenArray[0]
  const activeOrders = childrenArray[1]

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] min-h-[600px] overflow-hidden rounded-lg border border-border">
      {/* TradingView Chart - Main Content */}
      <div className="absolute inset-0 w-full h-full">
        <TradingChart 
          selectedPair={selectedPair} 
          selectedSymbol={selectedSymbol}
          assetType={assetType}
        />
      </div>

      {/* Left Floating Panel - Crypto List */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out",
          leftPanelOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full w-[280px] sm:w-[300px] lg:w-[340px] backdrop-blur-xl bg-background/50 border-r border-border/50 shadow-2xl">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border/50 bg-background/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <h3 className="font-semibold text-xs sm:text-sm">Markets</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(false)}
              className="h-6 w-6 sm:h-7 sm:w-7 p-0"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="h-[calc(100%-48px)] sm:h-[calc(100%-56px)] overflow-hidden">
            <CryptoList 
              onPairSelect={handlePairSelect} 
              selectedPair={selectedPair}
              onAssetTypeChange={handleAssetTypeChange}
            />
          </div>
        </div>
      </div>

      {/* Left Panel Toggle Button (when closed) */}
      {!leftPanelOpen && (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-xl bg-background/50 border border-l-0 border-border/50 rounded-r-lg p-1.5 sm:p-2 shadow-lg hover:bg-background/70 transition-colors"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Right Floating Panel - Portfolio Balance */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out",
          rightPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full w-[280px] sm:w-[300px] lg:w-[360px] backdrop-blur-xl bg-background/50 border-l border-border/50 shadow-2xl overflow-y-auto">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border/50 bg-background/30 sticky top-0 z-10">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <h3 className="font-semibold text-xs sm:text-sm">Portfolio</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(false)}
              className="h-6 w-6 sm:h-7 sm:w-7 p-0"
            >
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="p-2 sm:p-3 text-xs sm:text-sm">
            {portfolioBalance}
          </div>
        </div>
      </div>

      {/* Right Panel Toggle Button (when closed) */}
      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-xl bg-background/50 border border-r-0 border-border/50 rounded-l-lg p-1.5 sm:p-2 shadow-lg hover:bg-background/70 transition-colors"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Bottom Floating Panel - Active Orders */}
      <div
        className={cn(
          "absolute left-0 right-0 bottom-0 z-10 transition-transform duration-300 ease-in-out",
          bottomPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="h-[220px] sm:h-[260px] backdrop-blur-xl bg-background/50 border-t border-border/50 shadow-2xl">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 border-b border-border/50 bg-background/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ListOrdered className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <h3 className="font-semibold text-xs sm:text-sm">Active Orders</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBottomPanelOpen(false)}
              className="h-6 w-6 sm:h-7 sm:w-7 p-0"
            >
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="h-[calc(100%-40px)] sm:h-[calc(100%-48px)] overflow-y-auto p-2 sm:p-3 text-xs sm:text-sm">
            {activeOrders}
          </div>
        </div>
      </div>

      {/* Bottom Panel Toggle Button (when closed) */}
      {!bottomPanelOpen && (
        <button
          onClick={() => setBottomPanelOpen(true)}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 backdrop-blur-xl bg-background/50 border border-b-0 border-border/50 rounded-t-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg hover:bg-background/70 transition-colors"
        >
          <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Panel Layout Controls - Bottom Left */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20">
        <div className="backdrop-blur-xl bg-background/50 border border-border/50 rounded-lg p-0.5 sm:p-1 shadow-lg flex flex-row items-center gap-0.5 sm:gap-1">
          <Button
            variant={leftPanelOpen ? "default" : "ghost"}
            size="sm"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="h-8 w-8 sm:h-7 sm:w-auto sm:px-2 p-0 sm:p-2"
          >
            <TrendingUp className="w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Markets</span>
          </Button>
          <Button
            variant={orderPanelOpen ? "default" : "ghost"}
            size="sm"
            onClick={() => setOrderPanelOpen(!orderPanelOpen)}
            className="h-8 w-8 sm:h-7 sm:w-auto sm:px-2 p-0 sm:p-2"
          >
            <ShoppingCart className="w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Trade</span>
          </Button>
          <Button
            variant={rightPanelOpen ? "default" : "ghost"}
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="h-8 w-8 sm:h-7 sm:w-auto sm:px-2 p-0 sm:p-2"
          >
            <Wallet className="w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Portfolio</span>
          </Button>
          <Button
            variant={bottomPanelOpen ? "default" : "ghost"}
            size="sm"
            onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
            className="h-8 w-8 sm:h-7 sm:w-auto sm:px-2 p-0 sm:p-2"
          >
            <ListOrdered className="w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Orders</span>
          </Button>
        </div>
      </div>

      {/* Order Panel - Center Left (floating) */}
      <div
        className={cn(
          "absolute left-2 sm:left-4 top-4 sm:top-4 z-20 transition-all duration-300 ease-in-out",
          orderPanelOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
        )}
      >
        <div className="w-[280px] sm:w-[300px] lg:w-[340px] backdrop-blur-xl bg-background/50 border border-border/50 rounded-lg shadow-2xl max-h-[calc(100vh-10rem)]">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border/50 bg-background/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <h3 className="font-semibold text-xs sm:text-sm">Place Order</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOrderPanelOpen(false)}
              className="h-6 w-6 sm:h-7 sm:w-7 p-0"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="p-2 sm:p-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <PlaceOrder 
              selectedPair={selectedPair}
              selectedSymbol={selectedSymbol}
              currentPrice={67420.50}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
