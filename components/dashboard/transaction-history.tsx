"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Image from 'next/image'

interface Transaction {
  id: number
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'transfer'
  symbol: string
  name: string
  amount: number
  total: number
  status: string
  date: string
  icon: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  // Show max 4 transactions
  const displayedTransactions = transactions.slice(0, 4)

  if (displayedTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {displayedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={transaction.icon}
                    alt={transaction.name}
                    fill
                    className="rounded-full object-contain"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                    transaction.type === 'buy' || transaction.type === 'deposit'
                      ? 'bg-emerald-500' 
                      : 'bg-blue-500'
                  }`}>
                    {transaction.type === 'buy' || transaction.type === 'deposit' ? (
                      <ArrowDownLeft className="w-3 h-3 text-white" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} {transaction.symbol}
                    </span>
                    {transaction.status === 'pending' && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.amount} {transaction.symbol} • {getTimeAgo(transaction.date)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold text-sm ${
                  transaction.type === 'buy' || transaction.type === 'withdraw' ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {transaction.type === 'buy' || transaction.type === 'withdraw' ? '-' : '+'}${transaction.total.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 