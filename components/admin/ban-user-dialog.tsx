'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { banUserAction } from '@/server/actions/admin/users'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface BanUserDialogProps {
  user: { id: string; first_name: string | null; last_name: string | null }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BanUserDialog({ user, open, onOpenChange }: BanUserDialogProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBan = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for banning')
      return
    }

    setLoading(true)
    const result = await banUserAction(user.id, reason)
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
          <DialogTitle>Ban User: {user.first_name} {user.last_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Reason for Ban</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for banning this user..."
              rows={4}
              className="mt-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleBan} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ban User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
