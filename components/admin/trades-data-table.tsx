'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TrendingUp, TrendingDown, Eye, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { setTradeProfitLossAction } from '@/server/actions/admin/trades'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TradesTableProps {
  trades: any[]
}

export function TradesDataTable({ trades }: TradesTableProps) {
  const router = useRouter()
  const [plDialog, setPlDialog] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<any>(null)
  const [profitLoss, setProfitLoss] = useState('')
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default'
      case 'closed':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSetPL = async (closePosition: boolean) => {
    if (!selectedTrade || !profitLoss) return

    const plValue = parseFloat(profitLoss)
    if (isNaN(plValue)) {
      toast.error('Please enter a valid number')
      return
    }

    setLoading(true)
    try {
      const result = await setTradeProfitLossAction(selectedTrade.id, plValue, closePosition)
      
      if (result.success) {
        toast.success(result.message)
        setPlDialog(false)
        setSelectedTrade(null)
        setProfitLoss('')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to set P/L')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No trades found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Pair</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Current/Exit</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>P/L</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => {
              const profitLoss = trade.profit_loss || 0
              const isProfitable = profitLoss >= 0

              return (
                <TableRow key={trade.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {trade.users?.first_name} {trade.users?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trade.users?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {trade.symbol || trade.pair || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.type === 'buy' ? 'default' : 'outline'}>
                      {trade.type?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    ${trade.entry_price?.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono">
                    ${(trade.exit_price || trade.current_price || trade.entry_price)?.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${trade.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {trade.status === 'closed' ? (
                      <div className={`flex items-center gap-1 font-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfitable ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {isProfitable ? '+' : ''}${Math.abs(profitLoss).toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(trade.status)}>
                      {trade.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(trade.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {trade.status === 'open' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTrade(trade)
                            setPlDialog(true)
                          }}
                        >
                          <DollarSign className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Set P/L Dialog */}
      <Dialog open={plDialog} onOpenChange={setPlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Trade Profit/Loss</DialogTitle>
            <DialogDescription>
              Manually set the profit or loss for this trade
            </DialogDescription>
          </DialogHeader>

          {selectedTrade && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-muted-foreground">User:</div>
                <div className="font-medium">
                  {selectedTrade.users?.first_name} {selectedTrade.users?.last_name}
                </div>
                <div className="text-muted-foreground">Pair:</div>
                <div className="font-medium">{selectedTrade.symbol || selectedTrade.pair}</div>
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">${selectedTrade.amount?.toLocaleString()}</div>
                <div className="text-muted-foreground">Entry:</div>
                <div className="font-medium">${selectedTrade.entry_price?.toFixed(2)}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profitLoss">Profit/Loss ($)</Label>
                <Input
                  id="profitLoss"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount (use negative for loss)"
                  value={profitLoss}
                  onChange={(e) => setProfitLoss(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a positive value for profit, negative for loss
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleSetPL(false)}
              disabled={loading || !profitLoss}
            >
              Set P/L (Keep Open)
            </Button>
            <Button
              onClick={() => handleSetPL(true)}
              disabled={loading || !profitLoss}
            >
              Set P/L & Close Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
