"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Mail, Bell, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { getUserProfileAction, updateUserPreferencesAction } from '@/server/actions/user'
import { toast } from 'sonner'

export function NotificationSettings() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [isChannelsOpen, setIsChannelsOpen] = useState(true)

  // Fetch user preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true)
      try {
        const response = await getUserProfileAction()
        if (response.success && response.data) {
          const user = response.data as any
          setEmailNotifications(user.marketing_emails_enabled ?? true)
          setInAppNotifications(user.trading_notifications_enabled ?? true)
        }
      } catch (error) {
        console.error('Error fetching preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [])

  const handleEmailNotificationsChange = async (checked: boolean) => {
    setEmailNotifications(checked)
    setUpdating(true)
    try {
      const response = await updateUserPreferencesAction({
        marketing_emails_enabled: checked,
      })
      if (response.success) {
        toast.success('Email notification preferences updated')
      } else {
        toast.error(response.error || 'Failed to update preferences')
        setEmailNotifications(!checked) // Revert on error
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
      setEmailNotifications(!checked) // Revert on error
    } finally {
      setUpdating(false)
    }
  }

  const handleInAppNotificationsChange = async (checked: boolean) => {
    setInAppNotifications(checked)
    setUpdating(true)
    try {
      const response = await updateUserPreferencesAction({
        trading_notifications_enabled: checked,
      })
      if (response.success) {
        toast.success('In-app notification preferences updated')
      } else {
        toast.error(response.error || 'Failed to update preferences')
        setInAppNotifications(!checked) // Revert on error
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
      setInAppNotifications(!checked) // Revert on error
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

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
              onCheckedChange={handleEmailNotificationsChange}
              disabled={updating}
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
              onCheckedChange={handleInAppNotificationsChange}
              disabled={updating}
            />
          </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
