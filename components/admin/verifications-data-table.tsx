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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { approveVerificationAction, rejectVerificationAction } from '@/server/actions/admin/verifications'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import Image from 'next/image'

interface Verification {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  identity_document_type: string | null
  identity_document_number: string | null
  verification_documents: any
  kyc_submitted_at: string | null
  kyc_status: string | null
}

interface VerificationsDataTableProps {
  verifications: Verification[]
}

export function VerificationsDataTable({ verifications }: VerificationsDataTableProps) {
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this verification?')) return

    setLoading(true)
    const result = await approveVerificationAction(userId)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleReject = async () => {
    if (!selectedVerification) return
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    const result = await rejectVerificationAction(selectedVerification.id, rejectReason)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setRejectDialogOpen(false)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>ID Type</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No pending verifications
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{verification.first_name} {verification.last_name}</p>
                      <p className="text-sm text-muted-foreground">{verification.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {verification.identity_document_type?.replace('-', ' ')}
                  </TableCell>
                  <TableCell>{verification.identity_document_number}</TableCell>
                  <TableCell>
                    {verification.kyc_submitted_at ? new Date(verification.kyc_submitted_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge>{verification.kyc_status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedVerification(verification)
                          setViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(verification.id)}
                        disabled={loading}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedVerification(verification)
                          setRejectDialogOpen(true)
                        }}
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Documents Dialog */}
      {selectedVerification && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Verification Documents</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p><strong>Name:</strong> {selectedVerification.first_name} {selectedVerification.last_name}</p>
                <p><strong>ID Type:</strong> {selectedVerification.identity_document_type}</p>
                <p><strong>ID Number:</strong> {selectedVerification.identity_document_number}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Front of ID</Label>
                  {selectedVerification.verification_documents?.front_image_url && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <Image
                        src={selectedVerification.verification_documents.front_image_url}
                        alt="Front of ID"
                        width={400}
                        height={300}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Back of ID</Label>
                  {selectedVerification.verification_documents?.back_image_url && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <Image
                        src={selectedVerification.verification_documents.back_image_url}
                        alt="Back of ID"
                        width={400}
                        height={300}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      {selectedVerification && (
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Verification</DialogTitle>
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
                  Reject Verification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
