"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PlaceOrderProps {
  selectedPair?: string
  selectedSymbol?: string
  currentPrice?: number
}

export function PlaceOrder({ 
  selectedPair = 'BTC/USDT', 
  selectedSymbol = 'BTC',
  currentPrice = 67420.50
}: PlaceOrderProps) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [orderMode, setOrderMode] = useState<'market' | 'limit'>('market')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex gap-1.5 sm:gap-2">
        <Button
          variant={orderMode === 'market' ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8"
          onClick={() => setOrderMode('market')}
        >
          Market
        </Button>
        <Button
          variant={orderMode === 'limit' ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8"
          onClick={() => setOrderMode('limit')}
        >
          Limit
        </Button>
      </div>

      {orderMode === 'market' ? (
        <>
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant={orderType === 'buy' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8"
              onClick={() => setOrderType('buy')}
            >
              Buy
            </Button>
            <Button
              variant={orderType === 'sell' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8"
              onClick={() => setOrderType('sell')}
            >
              Sell
            </Button>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium">Amount ({selectedSymbol})</label>
            <Input
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            />
            <div className="flex space-x-1 sm:space-x-1.5">
              <Button variant="outline" size="sm" onClick={() => setAmount('0.001')} className="text-[9px] sm:text-[10px] flex-1 h-6 sm:h-7 px-1">
                0.001
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount('0.01')} className="text-[9px] sm:text-[10px] flex-1 h-6 sm:h-7 px-1">
                0.01
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount('0.1')} className="text-[9px] sm:text-[10px] flex-1 h-6 sm:h-7 px-1">
                0.1
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-2 sm:p-3 space-y-1 sm:space-y-1.5">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Market Price</span>
              <span className="font-medium">${currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-medium">
                ${amount ? (parseFloat(amount) * currentPrice).toLocaleString() : '0.00'}
              </span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Fee (0.1%)</span>
              <span className="font-medium">
                ${amount ? (parseFloat(amount) * currentPrice * 0.001).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <Button
            className={`w-full text-[10px] sm:text-xs h-8 sm:h-9 ${
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
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant={orderType === 'buy' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8"
              onClick={() => setOrderType('buy')}
            >
              Buy
            </Button>
            <Button
              variant={orderType === 'sell' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8"
              onClick={() => setOrderType('sell')}
            >
              Sell
            </Button>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium">Price (USDT)</label>
            <Input
              placeholder={currentPrice.toString()}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            />
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium">Amount ({selectedSymbol})</label>
            <Input
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            />
          </div>

          <div className="bg-muted/30 rounded-lg p-2 sm:p-3 space-y-1 sm:space-y-1.5">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Limit Price</span>
              <span className="font-medium">${price || currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-medium">
                ${amount && price ? (parseFloat(amount) * parseFloat(price)).toLocaleString() : '0.00'}
              </span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Fee (0.1%)</span>
              <span className="font-medium">
                ${amount && price ? (parseFloat(amount) * parseFloat(price) * 0.001).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <Button
            className={`w-full text-[10px] sm:text-xs h-8 sm:h-9 ${
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
    </div>
  )
}
