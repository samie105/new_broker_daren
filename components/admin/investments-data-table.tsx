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
import { terminateInvestmentAction } from '@/server/actions/admin/investment-plans'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface InvestmentsTableProps {
  investments: any[]
}

export function InvestmentsDataTable({ investments }: InvestmentsTableProps) {
  const router = useRouter()
  const [terminateDialog, setTerminateDialog] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null)
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return ''
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
    if (!selectedInvestment) return

    setLoading(true)
    try {
      const result = await terminateInvestmentAction(selectedInvestment.id, payProfit)
      
      if (result.success) {
        toast.success(result.message)
        setTerminateDialog(false)
        setSelectedInvestment(null)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to terminate investment')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (investments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No investments found</p>
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
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {investment.users?.first_name} {investment.users?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {investment.users?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{investment.plan_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">
                      {investment.plan_type || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${investment.amount?.toLocaleString()}
                </TableCell>
                <TableCell className="text-green-600 font-medium">
                  {investment.roi_percent}%
                </TableCell>
                <TableCell>
                  <span className={`font-medium capitalize ${getRiskColor(investment.risk_level)}`}>
                    {investment.risk_level || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>{investment.duration_days} days</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(investment.status)}>
                    {investment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(investment.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {investment.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInvestment(investment)
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
            <DialogTitle>Terminate Investment</DialogTitle>
            <DialogDescription>
              Choose how to terminate this investment
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">User:</div>
                <div className="font-medium">
                  {selectedInvestment.users?.first_name} {selectedInvestment.users?.last_name}
                </div>
                <div className="text-muted-foreground">Plan:</div>
                <div className="font-medium">{selectedInvestment.plan_name}</div>
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">${selectedInvestment.amount?.toLocaleString()}</div>
                <div className="text-muted-foreground">ROI:</div>
                <div className="font-medium text-green-600">{selectedInvestment.roi_percent}%</div>
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
