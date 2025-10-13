"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Mail, Bell, ChevronDown, ChevronUp } from 'lucide-react'

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [isChannelsOpen, setIsChannelsOpen] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div className="space-y-4">
          <button
            onClick={() => setIsChannelsOpen(!isChannelsOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold">Notification Channels</h3>
            {isChannelsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isChannelsOpen && (
            <div className="space-y-4 border rounded-lg p-4">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <p className="text-sm font-medium">Email Notifications</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <p className="text-sm font-medium">In-App Notifications</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Receive notifications within the app
              </p>
            </div>
            <Switch
              checked={inAppNotifications}
              onCheckedChange={setInAppNotifications}
            />
          </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
