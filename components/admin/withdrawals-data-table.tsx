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
import { approveWithdrawalAction, rejectWithdrawalAction } from '@/server/actions/admin/transactions'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface WithdrawalsDataTableProps {
  withdrawals: any[]
}

export function WithdrawalsDataTable({ withdrawals }: WithdrawalsDataTableProps) {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApprove = async (withdrawalId: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal?')) return

    setLoading(true)
    const result = await approveWithdrawalAction(withdrawalId)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleReject = async () => {
    if (!selectedWithdrawal) return
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    const result = await rejectWithdrawalAction(selectedWithdrawal.id, rejectReason)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setRejectDialogOpen(false)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'default',
      completed: 'success',
      failed: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {withdrawal.users?.first_name} {withdrawal.users?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.users?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${withdrawal.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {withdrawal.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(withdrawal.id)}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal)
                            setRejectDialogOpen(true)
                          }}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
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

      {selectedWithdrawal && (
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Reason for Rejection</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={loading}>
                  Reject Withdrawal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
