"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface Deposit {
  id: number
  symbol: string
  name: string
  amount: number
  value: number
  status: string
  confirmations: string
  tx_hash: string
  date: string
  icon: string
}

interface DepositHistoryProps {
  deposits: Deposit[]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-emerald-600" />
    case 'pending':
      return <Clock className="w-4 h-4 text-orange-600" />
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-red-600" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          Completed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
          Confirming
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed
        </Badge>
      )
    default:
      return null
  }
}

export function DepositHistory({ deposits = [] }: DepositHistoryProps) {
  if (deposits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No deposits yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deposits.map((deposit) => (
            <div key={deposit.id} className="p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10">
                    <Image
                      src={deposit.icon}
                      alt={deposit.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{deposit.name}</div>
                    <div className="text-xs text-muted-foreground">{deposit.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-emerald-600">
                    +{deposit.amount} {deposit.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${deposit.value.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(deposit.status)}
                  {getStatusBadge(deposit.status)}
                </div>
                {deposit.status === 'pending' && (
                  <div className="text-xs text-muted-foreground">
                    Confirmations: {deposit.confirmations}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-mono text-xs">
                  {deposit.tx_hash.slice(0, 8)}...{deposit.tx_hash.slice(-8)}
                </span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full" size="sm">
            View All Deposits
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}