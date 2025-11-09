'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUserBalanceAction } from '@/server/actions/admin/users'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface UpdateBalanceDialogProps {
  user: { id: string; first_name: string | null; last_name: string | null; wallet_balance: number | null }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateBalanceDialog({ user, open, onOpenChange }: UpdateBalanceDialogProps) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'add' | 'subtract' | 'set'>('add')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)
    const result = await updateUserBalanceAction(user.id, numAmount, type)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      onOpenChange(false)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Balance: {user.first_name} {user.last_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Current Balance</Label>
            <div className="text-2xl font-bold mt-1">${user.wallet_balance?.toFixed(2) || '0.00'}</div>
          </div>

          <div>
            <Label>Operation Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as any)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add">Add to Balance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtract" id="subtract" />
                <Label htmlFor="subtract">Subtract from Balance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="set" id="set" />
                <Label htmlFor="set">Set Balance</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              className="mt-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Balance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
