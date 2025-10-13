"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Image from 'next/image'

type AssetType = 'crypto' | 'stocks' | 'currencies'

export function TradingChart({ selectedPair = 'BTC/USDT', selectedSymbol = 'BTC', assetType = 'crypto' }: {
  selectedPair?: string
  selectedSymbol?: string
  assetType?: AssetType
}) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [orderMode, setOrderMode] = useState<'market' | 'limit'>('market')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  const currentPrice = 67420.50
  const priceChange = 8.24
  const isPositive = true

  // Generate appropriate TradingView symbol based on asset type
  const getTradingViewSymbol = () => {
    if (assetType === 'crypto') {
      return `BINANCE:${selectedSymbol}USDT`
    } else if (assetType === 'stocks') {
      // Use NASDAQ for tech stocks, fallback to generic ticker
      return `NASDAQ:${selectedSymbol}`
    } else {
      // Forex pairs - TradingView uses format like FX:EURUSD
      return `FX_IDC:${selectedSymbol}`
    }
  }

  useEffect(() => {
    const widgetContainer = document.getElementById('tradingview-widget')
    if (widgetContainer) {
      widgetContainer.innerHTML = ''
      
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: getTradingViewSymbol(),
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        gridColor: 'rgba(255, 255, 255, 0.06)',
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: 'tradingview-widget'
      })

      widgetContainer.appendChild(script)
    }
  }, [selectedSymbol, assetType])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={`/assets/${assetType === 'crypto' ? 'crypto' : assetType === 'stocks' ? 'stock' : 'currencies'}/${selectedSymbol}.svg`}
                  alt={selectedSymbol}
                  fill
                  className="rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="text-lg font-semibold">{selectedPair}</div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              ${currentPrice.toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full relative">
            <div id="tradingview-widget" className="h-full w-full"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={orderMode === 'market' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setOrderMode('market')}
            >
              Market
            </Button>
            <Button
              variant={orderMode === 'limit' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setOrderMode('limit')}
            >
              Limit
            </Button>
          </div>

          {orderMode === 'market' ? (
            <>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={orderType === 'buy' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setOrderType('buy')}
                >
                  Buy
                </Button>
                <Button
                  variant={orderType === 'sell' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setOrderType('sell')}
                >
                  Sell
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Amount ({selectedSymbol})</label>
                <Input
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setAmount('0.001')}>
                    0.001
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount('0.01')}>
                    0.01
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount('0.1')}>
                    0.1
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Price</span>
                  <span className="font-medium">${currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-medium">
                    ${amount ? (parseFloat(amount) * currentPrice).toLocaleString() : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee (0.1%)</span>
                  <span className="font-medium">
                    ${amount ? (parseFloat(amount) * currentPrice * 0.001).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <Button
                className={`w-full ${
                  orderType === 'buy'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={!amount}
              >
                {orderType === 'buy' ? `Buy ${selectedSymbol}` : `Sell ${selectedSymbol}`}
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={orderType === 'buy' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setOrderType('buy')}
                >
                  Buy
                </Button>
                <Button
                  variant={orderType === 'sell' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setOrderType('sell')}
                >
                  Sell
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Price (USDT)</label>
                <Input
                  placeholder={currentPrice.toString()}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Amount ({selectedSymbol})</label>
                <Input
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Limit Price</span>
                  <span className="font-medium">${price || currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-medium">
                    ${amount && price ? (parseFloat(amount) * parseFloat(price)).toLocaleString() : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee (0.1%)</span>
                  <span className="font-medium">
                    ${amount && price ? (parseFloat(amount) * parseFloat(price) * 0.001).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <Button
                className={`w-full ${
                  orderType === 'buy'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={!amount || !price}
              >
                Place {orderType === 'buy' ? 'Buy' : 'Sell'} Limit Order
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
