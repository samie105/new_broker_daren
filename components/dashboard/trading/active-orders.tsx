"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ActiveOrder, OrderHistory } from '@/server/actions/portfolio'

interface ActiveOrdersProps {
  activeOrders: ActiveOrder[]
  orderHistory: OrderHistory[]
}

export function ActiveOrders({ activeOrders = [], orderHistory = [] }: ActiveOrdersProps) {
  const [filter, setFilter] = useState<'open' | 'history'>('open')

  const displayOrders = filter === 'open' ? activeOrders : orderHistory

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      filled: { variant: "default", label: "Filled" },
      cancelled: { variant: "outline", label: "Cancelled" },
      gain: { variant: "default", label: "Gain" },
      loss: { variant: "destructive", label: "Loss" }
    }
    
    const config = variants[status] || { variant: "outline", label: status }
    return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'buy' ? "default" : "destructive"} className="capitalize">
        {type}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{filter === 'open' ? 'Active Orders' : 'Order History'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filter === 'open' ? 'Monitor your pending orders' : 'View completed orders with P&L'}
            </p>
          </div>
          <div className="flex border border-border rounded-lg p-1">
            <Button
              variant={filter === 'open' ? 'default' : 'ghost'}
              size="sm"
              className="px-3 py-1 text-xs"
              onClick={() => setFilter('open')}
            >
              Open
            </Button>
            <Button
              variant={filter === 'history' ? 'default' : 'ghost'}
              size="sm"
              className="px-3 py-1 text-xs"
              onClick={() => setFilter('history')}
            >
              History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No {filter === 'open' ? 'active' : 'completed'} orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filter === 'open' ? (
              // Active Orders View
              activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeBadge(order.type)}
                      <span className="font-medium text-sm">{order.pair}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Amount: {order.amount} {order.symbol} @ ${order.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm mb-1">
                      ${order.total.toLocaleString()}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))
            ) : (
              // Order History View with P&L
              orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeBadge(order.type)}
                      <span className="font-medium text-sm">{order.pair}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div>Amount: {order.amount} {order.symbol}</div>
                      <div>Entry: ${order.entry_price.toLocaleString()} → Current: ${order.current_price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-sm mb-1 ${
                      order.profit > 0 ? 'text-emerald-600' : order.profit < 0 ? 'text-rose-600' : 'text-foreground'
                    }`}>
                      {order.profit > 0 ? '+' : ''}${order.profit.toFixed(2)}
                    </div>
                    <div className={`text-xs ${
                      order.profit_percent > 0 ? 'text-emerald-600' : order.profit_percent < 0 ? 'text-rose-600' : 'text-muted-foreground'
                    }`}>
                      {order.profit_percent > 0 ? '+' : ''}{order.profit_percent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
