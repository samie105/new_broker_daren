"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import type { Withdrawal } from '@/server/actions/portfolio'

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[]
}

export function WithdrawalHistory({ withdrawals = [] }: WithdrawalHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      cancelled: "outline"
    }
    
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    )
  }

  if (withdrawals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No withdrawals yet</p>
            <p className="text-sm mt-2">Your withdrawal history will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Withdrawals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Image
                    src={withdrawal.icon}
                    alt={withdrawal.symbol}
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm">{withdrawal.name}</div>
                  <div className="text-xs text-muted-foreground">{withdrawal.date}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusIcon(withdrawal.status)}
                    {getStatusBadge(withdrawal.status)}
                  </div>
                  {withdrawal.tx_hash && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-muted-foreground font-mono text-xs">
                        {withdrawal.tx_hash.slice(0, 8)}...{withdrawal.tx_hash.slice(-8)}
                      </span>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm text-rose-600">
                  -{withdrawal.amount} {withdrawal.symbol}
                </div>
                {withdrawal.fee && withdrawal.fee > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Fee: ${withdrawal.fee.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
