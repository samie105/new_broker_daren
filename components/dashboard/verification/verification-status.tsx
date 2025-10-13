"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// Simulated pending verification status - replace with actual API call
const mockVerificationStatus = {
  hasPendingRequest: true,
  status: 'pending', // 'pending' | 'approved' | 'rejected' | 'none'
  submittedAt: '2024-01-20T10:30:00',
  idType: 'Passport',
  reviewMessage: 'Your documents are being reviewed. This typically takes 1-2 business days.'
}

export function VerificationStatus() {
  const { hasPendingRequest, status, submittedAt, idType, reviewMessage } = mockVerificationStatus

  if (!hasPendingRequest) {
    return null
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          badge: <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Pending Review</Badge>
        }
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          badge: <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Approved</Badge>
        }
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          badge: <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Rejected</Badge>
        }
      default:
        return {
          icon: AlertCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          badge: <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</Badge>
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <Card className={`border ${config.borderColor}`}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between md:hidden">
            <div className={`p-3 rounded-lg ${config.bgColor}`}>
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
            </div>
            {config.badge}
          </div>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${config.bgColor} hidden md:block`}>
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">Verification Request Status</h3>
                <div className="hidden md:block">{config.badge}</div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{reviewMessage}</p>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Document Type:</span>
                    <span className="font-semibold text-foreground">{idType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Submitted:</span>
                    <time className="font-semibold text-foreground" dateTime={submittedAt}>
                      {(() => {
                        const date = new Date(submittedAt)
                        const now = new Date()
                        const diffTime = Math.abs(now.getTime() - date.getTime())
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                        
                        if (diffDays === 0) {
                          return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                        } else if (diffDays === 1) {
                          return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                        } else if (diffDays < 7) {
                          return `${diffDays} days ago`
                        } else {
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        }
                      })()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
