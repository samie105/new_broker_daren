"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const tradingPairs = [
  {
    pair: 'BTC/USDT',
    price: 67420.50,
    change: 8.24,
    volume: '2.45B',
    isPositive: true
  },
  {
    pair: 'ETH/USDT',
    price: 3840.25,
    change: 5.67,
    volume: '1.82B',
    isPositive: true
  },
  {
    pair: 'SOL/USDT',
    price: 142.80,
    change: -2.14,
    volume: '890M',
    isPositive: false
  }
]

export function TradingInterface() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trading Pairs */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Live Markets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradingPairs.map((pair) => (
              <div key={pair.pair} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${pair.isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="font-semibold">{pair.pair}</div>
                    <div className="text-sm text-muted-foreground">Vol: {pair.volume}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${pair.price.toLocaleString()}</div>
                  <div className={`flex items-center text-sm ${pair.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {pair.isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {pair.isPositive ? '+' : ''}{pair.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
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

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <Input
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Price</label>
              <Input
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>

          <Button 
            className={`w-full ${
              orderType === 'buy' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}