"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Search, Star, StarOff, Bitcoin, TrendingUp, DollarSign } from 'lucide-react'
import Image from 'next/image'
import { TradingChart } from './trading-chart'

type AssetType = 'crypto' | 'stocks' | 'currencies'

const cryptoAssets = [
  { symbol: 'BTC', name: 'Bitcoin', basePrice: 67420.50 },
  { symbol: 'ETH', name: 'Ethereum', basePrice: 3840.25 },
  { symbol: 'SOL', name: 'Solana', basePrice: 142.80 },
  { symbol: 'ADA', name: 'Cardano', basePrice: 0.2498 },
  { symbol: 'MATIC', name: 'Polygon', basePrice: 0.7684 },
  { symbol: 'DOT', name: 'Polkadot', basePrice: 4.238 },
  { symbol: 'AVAX', name: 'Avalanche', basePrice: 24.56 },
  { symbol: 'LINK', name: 'Chainlink', basePrice: 11.43 },
  { symbol: 'UNI', name: 'Uniswap', basePrice: 6.78 },
  { symbol: 'LTC', name: 'Litecoin', basePrice: 68.92 },
  { symbol: 'BCH', name: 'Bitcoin Cash', basePrice: 112.45 },
  { symbol: 'XLM', name: 'Stellar', basePrice: 0.1034 },
  { symbol: 'VET', name: 'VeChain', basePrice: 0.0234 },
  { symbol: 'TRX', name: 'TRON', basePrice: 0.0823 },
  { symbol: 'ALGO', name: 'Algorand', basePrice: 0.1456 },
  { symbol: 'XTZ', name: 'Tezos', basePrice: 0.7890 },
  { symbol: 'AAVE', name: 'Aave', basePrice: 89.34 },
  { symbol: 'CRO', name: 'Cronos', basePrice: 0.0654 },
  { symbol: 'MANA', name: 'Decentraland', basePrice: 0.3421 },
  { symbol: 'SHIB', name: 'Shiba Inu', basePrice: 0.00001823 },
  { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.0634 },
  { symbol: 'XMR', name: 'Monero', basePrice: 158.90 },
  { symbol: 'DASH', name: 'Dash', basePrice: 25.67 },
  { symbol: 'ZEC', name: 'Zcash', basePrice: 23.45 },
  { symbol: 'ETC', name: 'Ethereum Classic', basePrice: 18.92 },
  { symbol: 'SUSHI', name: 'SushiSwap', basePrice: 0.7234 },
  { symbol: 'GRT', name: 'The Graph', basePrice: 0.1567 },
  { symbol: 'OP', name: 'Optimism', basePrice: 1.234 },
  { symbol: 'APE', name: 'ApeCoin', basePrice: 1.089 },
  { symbol: 'AXS', name: 'Axie Infinity', basePrice: 4.567 },
  { symbol: 'GMT', name: 'STEPN', basePrice: 0.2134 }
]

const cryptoPairs = cryptoAssets.map(asset => {
  const changePercent = (Math.random() - 0.5) * 20
  const currentPrice = asset.basePrice * (1 + changePercent / 100)
  const changeValue = currentPrice - asset.basePrice
  const isPositive = changeValue >= 0

  return {
    symbol: asset.symbol,
    name: asset.name,
    pair: `${asset.symbol}/USDT`,
    price: currentPrice,
    change: Math.abs(changePercent),
    changeValue: Math.abs(changeValue),
    isPositive,
    icon: `/assets/crypto/${asset.symbol}.svg`
  }
})

const stockAssets = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 178.25 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 412.80 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 142.65 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 178.35 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 875.28 },
  { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 242.84 },
  { symbol: 'META', name: 'Meta Platforms', basePrice: 512.42 },
  { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 485.73 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', basePrice: 165.89 },
  { symbol: 'INTC', name: 'Intel Corp.', basePrice: 45.67 },
  { symbol: 'PYPL', name: 'PayPal Holdings', basePrice: 68.92 },
  { symbol: 'ADBE', name: 'Adobe Inc.', basePrice: 562.18 },
  { symbol: 'CRM', name: 'Salesforce Inc.', basePrice: 285.47 },
  { symbol: 'ORCL', name: 'Oracle Corp.', basePrice: 128.93 },
  { symbol: 'CSCO', name: 'Cisco Systems', basePrice: 56.84 },
  { symbol: 'IBM', name: 'IBM Corp.', basePrice: 185.32 },
  { symbol: 'DIS', name: 'Walt Disney Co.', basePrice: 95.67 },
  { symbol: 'NKE', name: 'Nike Inc.', basePrice: 108.42 },
  { symbol: 'BA', name: 'Boeing Co.', basePrice: 187.56 },
  { symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 198.73 }
]

const stockPairs = stockAssets.map(asset => {
  const changePercent = (Math.random() - 0.5) * 10
  const currentPrice = asset.basePrice * (1 + changePercent / 100)
  const changeValue = currentPrice - asset.basePrice
  const isPositive = changeValue >= 0

  return {
    symbol: asset.symbol,
    name: asset.name,
    pair: `${asset.symbol}/USD`,
    price: currentPrice,
    change: Math.abs(changePercent),
    changeValue: Math.abs(changeValue),
    isPositive,
    icon: `/assets/stock/${asset.symbol}.svg`
  }
})

const currencyAssets = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', basePrice: 1.0842 },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', basePrice: 1.2634 },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', basePrice: 149.85 },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', basePrice: 0.6523 },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', basePrice: 1.3645 },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', basePrice: 0.5987 },
  { symbol: 'EURGBP', name: 'Euro / British Pound', basePrice: 0.8582 },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', basePrice: 162.45 },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', basePrice: 189.32 },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', basePrice: 97.76 },
  { symbol: 'CHFJPY', name: 'Swiss Franc / Japanese Yen', basePrice: 168.92 },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', basePrice: 1.6623 },
  { symbol: 'EURCAD', name: 'Euro / Canadian Dollar', basePrice: 1.4798 },
  { symbol: 'EURCHF', name: 'Euro / Swiss Franc', basePrice: 0.9456 },
  { symbol: 'GBPCHF', name: 'British Pound / Swiss Franc', basePrice: 1.1023 },
  { symbol: 'AUDCAD', name: 'Australian Dollar / Canadian Dollar', basePrice: 0.8901 },
  { symbol: 'AUDNZD', name: 'Australian Dollar / New Zealand Dollar', basePrice: 1.0895 },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', basePrice: 0.8723 }
]

const currencyPairs = currencyAssets.map(asset => {
  const changePercent = (Math.random() - 0.5) * 4
  const currentPrice = asset.basePrice * (1 + changePercent / 100)
  const changeValue = currentPrice - asset.basePrice
  const isPositive = changeValue >= 0

  return {
    symbol: asset.symbol,
    name: asset.name,
    pair: asset.symbol,
    price: currentPrice,
    change: Math.abs(changePercent),
    changeValue: Math.abs(changeValue),
    isPositive,
    icon: `/assets/currencies/${asset.symbol}.svg`
  }
})

export function CryptoList({ onPairSelect, selectedPair, onAssetTypeChange }: {
  onPairSelect?: (pair: string, symbol: string) => void
  selectedPair?: string
  onAssetTypeChange?: (type: AssetType) => void
}) {
  const [assetType, setAssetType] = useState<AssetType>('crypto')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>(['BTC', 'ETH', 'SOL'])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerPair, setDrawerPair] = useState('')
  const [drawerSymbol, setDrawerSymbol] = useState('')

  const handleAssetTypeChange = (type: AssetType) => {
    setAssetType(type)
    onAssetTypeChange?.(type)
  }

  // Get current assets based on asset type
  const currentAssets = assetType === 'crypto' ? cryptoPairs : assetType === 'stocks' ? stockPairs : currencyPairs

  const filteredCryptos = currentAssets.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(fav => fav !== symbol)
        : [...prev, symbol]
    )
  }

  const handleTradeClick = (pair: string, symbol: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check if we're on mobile (screen width < 1280px which is xl breakpoint)
    const isMobile = window.innerWidth < 1280
    
    if (isMobile) {
      setDrawerPair(pair)
      setDrawerSymbol(symbol)
      setIsDrawerOpen(true)
    } else {
      onPairSelect?.(pair, symbol)
    }
  }

  const handleRowClick = (pair: string, symbol: string) => {
    // Check if we're on mobile (screen width < 1280px which is xl breakpoint)
    const isMobile = window.innerWidth < 1280
    
    if (isMobile) {
      setDrawerPair(pair)
      setDrawerSymbol(symbol)
      setIsDrawerOpen(true)
    } else {
      onPairSelect?.(pair, symbol)
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-scroll">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg">Markets</CardTitle>
        </div>

        {/* Asset Type Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={assetType === 'crypto' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssetTypeChange('crypto')}
            className="flex-1"
          >
            <Bitcoin className="w-4 h-4 mr-2" />
            Crypto
          </Button>
          <Button
            variant={assetType === 'stocks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssetTypeChange('stocks')}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Stocks
          </Button>
          <Button
            variant={assetType === 'currencies' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssetTypeChange('currencies')}
            className="flex-1"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Forex
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search markets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 max-h-[700px] overflow-hidden/ p-0">
        <div className="grid grid-cols-12 gap-3 px-4 py-4 border-b border-border/50 bg-muted/60 text-xs font-semibold text-foreground/80 uppercase tracking-wide sticky top-0 z-10">
          <div className="col-span-1"></div>
          <div className="col-span-5 text-left">Asset</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-3 text-right">Action</div>
        </div>

        <div className="overflow-y-auto /max-h-[calc(700px-60px)]">{filteredCryptos.map((crypto, index) => (
            <div
              key={`${crypto.symbol}-${index}`}
              className={`grid grid-cols-12 gap-3 px-4 py-4 border-b border-border/10 hover:bg-muted/30 transition-all duration-200 group cursor-pointer ${
                selectedPair === crypto.pair ? 'bg-primary/5 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => handleRowClick(crypto.pair, crypto.symbol)}
            >
              <div className="col-span-1 flex items-center">
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(crypto.symbol) }}>
                  {favorites.includes(crypto.symbol) ? (
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  ) : (
                    <StarOff className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <div className="col-span-5 flex items-center space-x-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image src={crypto.icon} alt={crypto.symbol} fill className="rounded-full" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-foreground">{crypto.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{crypto.name}</div>
                </div>
              </div>

              <div className="col-span-3 flex items-center justify-end">
                <div className="text-sm font-semibold text-foreground">
                  ${crypto.price < 1 
                    ? crypto.price.toFixed(6).replace(/\.?0+$/, '')
                    : crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }
                </div>
              </div>

              <div className="col-span-3 flex items-center justify-end">
                <Button size="sm" variant="outline" 
                  className="text-xs px-3 py-1 h-7"
                  onClick={(e) => handleTradeClick(crypto.pair, crypto.symbol, e)}>
                  Trade
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCryptos.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm text-muted-foreground">No markets found</div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Mobile Trading Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{drawerPair} Trading</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <TradingChart selectedPair={drawerPair} selectedSymbol={drawerSymbol} assetType={assetType} />
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  )
}
