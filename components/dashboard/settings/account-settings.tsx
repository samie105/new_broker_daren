"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export function AccountSettings() {
  const [isStatusOpen, setIsStatusOpen] = useState(true)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>Manage your account status and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Status */}
        <div className="space-y-4">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold">Account Status</h3>
            {isStatusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isStatusOpen && (
            <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Verification Status</p>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Your account is fully verified and ready to trade
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Type</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Premium</Badge>
                <span className="text-xs text-muted-foreground">
                  Upgraded on Jan 15, 2024
                </span>
              </div>
            </div>
          </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
