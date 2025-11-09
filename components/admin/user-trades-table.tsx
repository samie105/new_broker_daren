'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { setTradeOutcomeAction, closeTradeAction } from '@/server/actions/admin/trades'
import { toast } from 'sonner'
import { TrendingUp, TrendingDown, XCircle } from 'lucide-react'

interface UserTradesTableProps {
  trades: any[]
  userId: string
}

export function UserTradesTable({ trades, userId }: UserTradesTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<any>(null)
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false)
  const [outcome, setOutcome] = useState<'win' | 'loss'>('win')
  const [exitPrice, setExitPrice] = useState('')
  const [profitLoss, setProfitLoss] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSetOutcome = async () => {
    if (!selectedTrade) return
    if (!exitPrice || !profitLoss) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const result = await setTradeOutcomeAction(
      selectedTrade.id,
      outcome,
      parseFloat(exitPrice),
      parseFloat(profitLoss)
    )
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setOutcomeDialogOpen(false)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleCloseTrade = async (tradeId: string) => {
    if (!confirm('Are you sure you want to close this trade?')) return

    setLoading(true)
    const result = await closeTradeAction(tradeId)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'default',
      closed: 'secondary',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Current P/L</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No trades found
                </TableCell>
              </TableRow>
            ) : (
              trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${trade.entry_price?.toFixed(2)}</TableCell>
                  <TableCell>${trade.amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={trade.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${trade.profit_loss?.toFixed(2) || '0.00'}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(trade.status)}</TableCell>
                  <TableCell>
                    {new Date(trade.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.status === 'open' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedTrade(trade)
                            setOutcome('win')
                            setExitPrice('')
                            setProfitLoss('')
                            setOutcomeDialogOpen(true)
                          }}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Set Outcome
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCloseTrade(trade.id)}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Close
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Set Outcome Dialog */}
      {selectedTrade && (
        <Dialog open={outcomeDialogOpen} onOpenChange={setOutcomeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Trade Outcome: {selectedTrade.symbol}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p><strong>Entry Price:</strong> ${selectedTrade.entry_price?.toFixed(2)}</p>
                <p><strong>Amount:</strong> ${selectedTrade.amount?.toFixed(2)}</p>
              </div>

              <div>
                <Label>Outcome</Label>
                <RadioGroup value={outcome} onValueChange={(v) => setOutcome(v as any)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="win" id="win" />
                    <Label htmlFor="win" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Win (Profit)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loss" id="loss" />
                    <Label htmlFor="loss" className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      Loss
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Exit Price</Label>
                <Input
                  type="number"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="Enter exit price..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Profit/Loss Amount</Label>
                <Input
                  type="number"
                  value={profitLoss}
                  onChange={(e) => setProfitLoss(e.target.value)}
                  placeholder={outcome === 'win' ? 'Enter profit amount...' : 'Enter loss amount (negative)...'}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {outcome === 'win' ? 'Enter positive amount for profit' : 'Enter negative amount for loss'}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOutcomeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSetOutcome} disabled={loading}>
                  Set Outcome
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
