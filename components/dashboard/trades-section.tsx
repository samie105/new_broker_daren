"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'

interface Trade {
  id: number
  type: 'BUY' | 'SELL'
  symbol: string
  name: string
  amount: number
  entry_price: number
  current_price?: number
  total: number
  profit: number
  profit_percent: number
  status: string
  opened_at: string
  icon: string
}

interface TradesSectionProps {
  trades: Trade[]
}

export function TradesSection({ trades = [] }: TradesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No trades yet</p>
        </CardContent>
      </Card>
    )
  }

  const nextTrade = () => {
    setCurrentIndex((prev) => (prev + 1) % trades.length)
  }
  
  const prevTrade = () => {
    setCurrentIndex((prev) => (prev - 1 + trades.length) % trades.length)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const currentTrade = trades[currentIndex]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTrade}
              disabled={trades.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextTrade}
              disabled={trades.length <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Indicators */}
        {trades.length > 1 && (
          <div className="flex justify-center space-x-2 mt-2">
            {trades.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Trade Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src={currentTrade.icon}
                  alt={currentTrade.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <div>
                <div className="font-medium">{currentTrade.name}</div>
                <div className="text-sm text-muted-foreground">{currentTrade.symbol}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge
                variant={currentTrade.type === 'BUY' ? 'default' : 'secondary'}
                className={currentTrade.type === 'BUY' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}
              >
                {currentTrade.type}
              </Badge>
              <Badge variant="outline" className={getStatusColor(currentTrade.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(currentTrade.status)}
                  <span className="capitalize">{currentTrade.status}</span>
                </div>
              </Badge>
            </div>
          </div>

          {/* Trade Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-medium">
                {currentTrade.amount.toLocaleString()} {currentTrade.symbol}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Entry Price</div>
              <div className="font-medium">
                ${currentTrade.entry_price.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">
                ${currentTrade.total.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium text-sm">
                {formatDate(currentTrade.opened_at)}
              </div>
            </div>
          </div>

          {/* Profit/Loss */}
          {currentTrade.status === 'completed' && currentTrade.profit !== 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">P&L</span>
                <div className={`flex items-center text-sm font-medium ${
                  currentTrade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentTrade.profit >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {currentTrade.profit >= 0 ? '+' : ''}${Math.abs(currentTrade.profit).toLocaleString()} 
                  ({currentTrade.profit >= 0 ? '+' : ''}{currentTrade.profit_percent.toFixed(2)}%)
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button variant="outline" className="w-full" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 