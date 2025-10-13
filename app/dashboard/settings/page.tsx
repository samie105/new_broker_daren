import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProfileSettings } from '@/components/dashboard/settings/profile-settings'
import { SecuritySettings } from '@/components/dashboard/settings/security-settings'
import { NotificationSettings } from '@/components/dashboard/settings/notification-settings'
import { AppearanceSettings } from '@/components/dashboard/settings/appearance-settings'
import { AccountSettings } from '@/components/dashboard/settings/account-settings'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Settings Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <ProfileSettings />
          <SecuritySettings />
          <NotificationSettings />
          <AppearanceSettings />
          <AccountSettings />
        </div>
      </div>
    </DashboardLayout>
  )
}
