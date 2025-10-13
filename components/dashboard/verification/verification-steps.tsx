"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertCircle, User, FileText, CreditCard, Shield } from 'lucide-react'

const verificationSteps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Verify your identity with government ID',
    status: 'completed',
    icon: User,
    completedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Document Upload',
    description: 'Upload proof of identity and address',
    status: 'completed',
    icon: FileText,
    completedAt: '2024-01-16'
  },
  {
    id: 3,
    title: 'Address Verification',
    description: 'Confirm your residential address',
    status: 'pending',
    icon: CreditCard,
    completedAt: null
  },
  {
    id: 4,
    title: 'Enhanced Security',
    description: 'Enable 2FA and security features',
    status: 'not_started',
    icon: Shield,
    completedAt: null
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-emerald-600" />
    case 'pending':
      return <Clock className="w-5 h-5 text-orange-600" />
    default:
      return <AlertCircle className="w-5 h-5 text-muted-foreground" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          Completed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
          In Review
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Not Started
        </Badge>
      )
  }
}

export function VerificationSteps() {
  const completedSteps = verificationSteps.filter(step => step.status === 'completed').length
  const progressPercent = (completedSteps / verificationSteps.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Verification</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedSteps}/{verificationSteps.length} completed</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {verificationSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index !== verificationSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-border" />
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl border-2 ${
                  step.status === 'completed' 
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/20' 
                    : step.status === 'pending'
                    ? 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20'
                    : 'border-border bg-muted/30'
                }`}>
                  <step.icon className={`w-6 h-6 ${
                    step.status === 'completed' 
                      ? 'text-emerald-600' 
                      : step.status === 'pending'
                      ? 'text-orange-600'
                      : 'text-muted-foreground'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                    {getStatusIcon(step.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(step.status)}
                    {step.completedAt && (
                      <span className="text-xs text-muted-foreground">
                        Completed {step.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}