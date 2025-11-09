'use client'

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Eye, XCircle, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { terminateStakingPositionAction } from '@/server/actions/admin/staking-plans'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface StakingTableProps {
  stakes: any[]
}

export function StakingDataTable({ stakes }: StakingTableProps) {
  const router = useRouter()
  const [terminateDialog, setTerminateDialog] = useState(false)
  const [selectedStake, setSelectedStake] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'completed':
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
    })
  }

  const handleTerminate = async (payProfit: boolean) => {
    if (!selectedStake) return

    setLoading(true)
    try {
      const result = await terminateStakingPositionAction(selectedStake.id, payProfit)
      
      if (result.success) {
        toast.success(result.message)
        setTerminateDialog(false)
        setSelectedStake(null)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to terminate staking')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (stakes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No staking positions found</p>
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
              <TableHead>Symbol</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>APY</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Ends</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakes.map((stake) => (
              <TableRow key={stake.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {stake.users?.first_name} {stake.users?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stake.users?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{stake.symbol || 'N/A'}</TableCell>
                <TableCell className="font-medium">
                  {stake.amount?.toLocaleString()} {stake.symbol}
                </TableCell>
                <TableCell className="text-green-600 font-medium">
                  {stake.apy}%
                </TableCell>
                <TableCell>{stake.duration_days} days</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(stake.status)}>
                    {stake.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(stake.created_at)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {stake.end_date ? formatDate(stake.end_date) : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {stake.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStake(stake)
                          setTerminateDialog(true)
                        }}
                      >
                        <XCircle className="h-4 w-4 text-orange-500" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Terminate Dialog */}
      <Dialog open={terminateDialog} onOpenChange={setTerminateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Staking Position</DialogTitle>
            <DialogDescription>
              Choose how to terminate this staking position
            </DialogDescription>
          </DialogHeader>

          {selectedStake && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">User:</div>
                <div className="font-medium">
                  {selectedStake.users?.first_name} {selectedStake.users?.last_name}
                </div>
                <div className="text-muted-foreground">Symbol:</div>
                <div className="font-medium">{selectedStake.symbol}</div>
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">{selectedStake.amount?.toLocaleString()}</div>
                <div className="text-muted-foreground">APY:</div>
                <div className="font-medium text-green-600">{selectedStake.apy}%</div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleTerminate(false)}
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Terminate (No Profit)
            </Button>
            <Button
              onClick={() => handleTerminate(true)}
              disabled={loading}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Terminate & Pay Profit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
