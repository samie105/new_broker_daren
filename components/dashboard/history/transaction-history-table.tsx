"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface CombinedTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade' | 'staking' | 'buy' | 'sell'
  symbol: string
  name: string
  amount: number
  value: number
  status: string
  date: string
  txHash?: string | null
  icon: string
}

interface TransactionHistoryTableProps {
  transactions: CombinedTransaction[]
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
    case 'withdrawal':
      return <ArrowUpRight className="w-4 h-4 text-red-600" />
    case 'trade':
      return <RefreshCw className="w-4 h-4 text-blue-600" />
    case 'staking':
      return <div className="w-4 h-4 rounded-full bg-purple-600" />
    default:
      return null
  }
}

const getTypeBadge = (type: string) => {
  const configs = {
    deposit: { label: 'Deposit', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' },
    withdrawal: { label: 'Withdrawal', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    trade: { label: 'Trade', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    staking: { label: 'Staking', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' }
  }
  
  const config = configs[type as keyof typeof configs]
  return (
    <Badge className={config?.class || 'bg-gray-100 text-gray-800'}>
      {config?.label || type}
    </Badge>
  )
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Completed</Badge>
    case 'pending':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Pending</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Failed</Badge>
    default:
      return null
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

export function TransactionHistoryTable({ transactions = [] }: TransactionHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || tx.type === filterType
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="trade">Trade</SelectItem>
                <SelectItem value="staking">Staking</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const { date, time } = formatDate(transaction.date)
            
            return (
              <div key={transaction.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={transaction.icon}
                        alt={transaction.name}
                        fill
                        className="rounded-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{date} at {time}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold text-sm ${
                      transaction.amount > 0 ? 'text-emerald-600' : 'text-foreground'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.value > 0 ? '+' : ''}${transaction.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getTypeBadge(transaction.type)}
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            )
          })}
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">No transactions found matching your criteria</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}