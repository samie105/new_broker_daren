"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, TrendingUp, TrendingDown, RefreshCw, ChevronLeft, ChevronRight, Bitcoin, DollarSign } from 'lucide-react'
import Image from 'next/image'
import { getTopCryptos, type CryptoData } from '@/lib/crypto-actions'
import { getStocks, type StockData } from '@/lib/stock-actions'

type AssetType = 'crypto' | 'stocks' | 'currencies'

// Currency data (keeping this as static for now)
const currencyData = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.0842, change: 0.23, marketCap: 0 },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.2634, change: -0.15, marketCap: 0 },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 149.85, change: 0.45, marketCap: 0 },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', price: 0.6523, change: 0.34, marketCap: 0 },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', price: 1.3645, change: -0.12, marketCap: 0 },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', price: 0.5987, change: 0.28, marketCap: 0 },
  { symbol: 'EURGBP', name: 'Euro / British Pound', price: 0.8582, change: 0.18, marketCap: 0 },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', price: 162.45, change: 0.67, marketCap: 0 },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', price: 189.32, change: -0.23, marketCap: 0 },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', price: 97.76, change: 0.41, marketCap: 0 },
  { symbol: 'CHFJPY', name: 'Swiss Franc / Japanese Yen', price: 168.92, change: 0.12, marketCap: 0 },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', price: 1.6623, change: -0.08, marketCap: 0 },
  { symbol: 'EURCAD', name: 'Euro / Canadian Dollar', price: 1.4798, change: 0.35, marketCap: 0 },
  { symbol: 'EURCHF', name: 'Euro / Swiss Franc', price: 0.9456, change: -0.11, marketCap: 0 },
  { symbol: 'GBPCHF', name: 'British Pound / Swiss Franc', price: 1.1023, change: 0.19, marketCap: 0 },
  { symbol: 'AUDCAD', name: 'Australian Dollar / Canadian Dollar', price: 0.8901, change: 0.22, marketCap: 0 },
]

export function CryptoPriceList() {
  const [assetType, setAssetType] = useState<AssetType>('crypto')
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [stocks, setStocks] = useState<StockData[]>([])
  const [filteredAssets, setFilteredAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8

  // Fetch data on mount and when asset type changes
  const fetchData = async () => {
    try {
      setRefreshing(true)
      setLoading(true)
      
      if (assetType === 'crypto') {
        const data = await getTopCryptos(50)
        setCryptos(data)
      } else if (assetType === 'stocks') {
        const data = await getStocks()
        setStocks(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [assetType])

  // Get current data based on asset type
  const getCurrentData = () => {
    if (assetType === 'crypto') {
      return cryptos.map(crypto => ({
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.current_price,
        change: crypto.price_change_percentage_24h,
        marketCap: crypto.market_cap,
        icon: `/assets/crypto/${crypto.symbol.toUpperCase()}.svg`,
        market_cap_rank: crypto.market_cap_rank
      }))
    } else if (assetType === 'stocks') {
      return stocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.changePercent,
        marketCap: stock.marketCap,
        icon: `/assets/stock/${stock.symbol}.svg`
      }))
    } else {
      return currencyData.map(currency => ({
        ...currency,
        icon: `/assets/currencies/${currency.symbol}.svg`
      }))
    }
  }

  const currentData = getCurrentData()

  useEffect(() => {
    const filtered = currentData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredAssets(filtered)
    setCurrentPage(0) // Reset to first page when searching
  }, [searchQuery, cryptos, stocks, assetType])

  const formatPrice = (price: number) => {
    if (assetType === 'currencies') {
      return price.toFixed(4)
    }
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    } else if (price < 1) {
      return `$${price.toFixed(4)}`
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const formatMarketCap = (marketCap: number) => {
    if (!marketCap || marketCap === 0) {
      return 'N/A'
    }
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toLocaleString()}`
    }
  }

  const paginatedAssets = filteredAssets.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold">
            {assetType === 'crypto' ? 'Crypto' : assetType === 'stocks' ? 'Stock' : 'Forex'} Prices
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchData}
              disabled={refreshing}
              className="h-8 px-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Asset Type Tabs */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={assetType === 'crypto' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('crypto')}
            className="flex-1"
          >
            <Bitcoin className="w-4 h-4 mr-2" />
            Crypto
          </Button>
          <Button
            variant={assetType === 'stocks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('stocks')}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Stocks
          </Button>
          <Button
            variant={assetType === 'currencies' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('currencies')}
            className="flex-1"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Forex
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={`Search ${assetType === 'crypto' ? 'cryptocurrencies' : assetType === 'stocks' ? 'stocks' : 'forex pairs'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div>
                    <div className="w-16 h-4 bg-muted rounded mb-1"></div>
                    <div className="w-12 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-4 bg-muted rounded mb-1"></div>
                  <div className="w-16 h-3 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Asset List */}
            <div className="space-y-2">
              {paginatedAssets.map((item: any, index) => (
                <div key={item.symbol || index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {assetType === 'crypto' && (
                        <span className="text-xs text-muted-foreground w-6">
                          #{item.market_cap_rank || (currentPage * itemsPerPage + index + 1)}
                        </span>
                      )}
                      <div className="relative w-8 h-8">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="rounded-full object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPrice(item.price)}
                    </div>
                    <div className={`text-xs flex items-center justify-end ${
                      item.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(item.change).toFixed(2)}%
                    </div>
                  </div>
                  
                  {assetType !== 'currencies' && (
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-muted-foreground">Market Cap</div>
                      <div className="text-sm font-medium">
                        {formatMarketCap(item.marketCap)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredAssets.length)} of {filteredAssets.length}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {filteredAssets.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found matching your search.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 