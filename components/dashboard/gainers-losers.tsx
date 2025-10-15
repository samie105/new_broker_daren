"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { getGainersAndLosers, type CryptoData } from '@/lib/crypto-actions'

export function GainersLosers() {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers')
  const [gainersData, setGainersData] = useState<CryptoData[]>([])
  const [losersData, setLosersData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const data = await getGainersAndLosers()
      setGainersData(data.gainers)
      setLosersData(data.losers)
    } catch (error) {
      console.error('Error fetching gainers and losers:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  const formatPrice = (price: number) => {
    if (price < 0.001) {
      return price.toFixed(8)
    } else if (price < 1) {
      return price.toFixed(4)
    } else if (price < 100) {
      return price.toFixed(2)
    } else {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
  }

  const currentData = activeTab === 'gainers' ? gainersData : losersData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Market Movers</CardTitle>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchData}
              disabled={refreshing}
              className="h-8 px-3 hover:bg-muted/80"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant={activeTab === 'gainers' ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-2 sm:px-3"
                onClick={() => setActiveTab('gainers')}
              >
                <TrendingUp className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Top Gainers</span>
              </Button>
              <Button
                variant={activeTab === 'losers' ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-2 sm:px-3"
                onClick={() => setActiveTab('losers')}
              >
                <TrendingDown className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Top Losers</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border/50 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-muted rounded-full"></div>
                  <div className="flex flex-col space-y-1">
                    <div className="w-14 h-4 bg-muted rounded"></div>
                    <div className="w-20 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-16 h-4 bg-muted rounded"></div>
                  <div className="w-12 h-3 bg-muted rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {currentData.map((asset, index) => (
              <div key={asset.symbol} className="group flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="relative w-9 h-9 p-1">
                    <Image
                      src={asset.localIcon || `/assets/crypto/${asset.symbol.toUpperCase()}.svg`}
                      alt={asset.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-sm tracking-wide">{asset.symbol.toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">{asset.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-sm mb-1">
                    ${formatPrice(asset.current_price)}
                  </div>
                  <div className={`text-xs font-medium flex items-center justify-end px-2 py-1 rounded-md ${
                    asset.price_change_percentage_24h >= 0 
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' 
                      : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'
                  }`}>
                    {asset.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {formatChange(asset.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full text-sm">
            View All Markets
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 