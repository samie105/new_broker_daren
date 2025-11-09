import { requireAdmin } from '@/lib/admin-helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Bell, Shield, Database, Mail } from 'lucide-react'

export default async function AdminSettingsPage() {
  const admin = await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure admin panel settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Admin Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Profile
            </CardTitle>
            <CardDescription>Your administrator account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">{admin.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <p className="text-muted-foreground">{admin.fullName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-muted-foreground">
                {admin.isActive ? '🟢 Active' : '🔴 Inactive'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plans Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Plans & Services
            </CardTitle>
            <CardDescription>Manage your investment, staking, and subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Database className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">
                Plans are stored in your admin profile as JSONB arrays.
                Edit them directly in the database or through the admin API.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">Get notified when users sign up</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Deposit Requests</p>
                  <p className="text-xs text-muted-foreground">Alert on new deposit submissions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Withdrawal Requests</p>
                  <p className="text-xs text-muted-foreground">Alert on withdrawal submissions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">KYC Verifications</p>
                  <p className="text-xs text-muted-foreground">Alert on new KYC submissions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>Configure email notifications and templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">
                Email settings are configured through environment variables.
                Contact your system administrator to modify SMTP settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage security settings and access control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Change Password</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Update your admin password for enhanced security
                </p>
                <button className="text-sm text-primary hover:underline">
                  Change Password →
                </button>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">Session Management</p>
                <p className="text-xs text-muted-foreground">
                  Session timeout: 7 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
