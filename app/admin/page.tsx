import { createServerSupabase } from '@/server/db/supabase'
import { requireAdmin } from '@/lib/admin-helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react'

export default async function AdminDashboardPage() {
  await requireAdmin()
  
  const supabase = createServerSupabase()

  // Fetch key metrics
  const [
    { count: totalUsers },
    { count: pendingVerifications },
    { data: usersWithDeposits },
    { data: usersWithWithdrawals },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('kyc_status', 'pending'),
    supabase.from('users').select('deposits').not('deposits', 'is', null),
    supabase.from('users').select('withdrawals').not('withdrawals', 'is', null),
    supabase.from('users').select('id, first_name, last_name, email, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  // Count pending deposits from JSONB
  let pendingDepositsCount = 0
  usersWithDeposits?.forEach(user => {
    const deposits = (user.deposits as any[]) || []
    pendingDepositsCount += deposits.filter(d => d.status === 'pending').length
  })

  // Count pending withdrawals from JSONB
  let pendingWithdrawalsCount = 0
  usersWithWithdrawals?.forEach(user => {
    const withdrawals = (user.withdrawals as any[]) || []
    pendingWithdrawalsCount += withdrawals.filter(w => w.status === 'pending').length
  })

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers || 0,
      icon: Users,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Verifications',
      value: pendingVerifications || 0,
      icon: Clock,
      description: 'Awaiting review',
    },
    {
      title: 'Pending Deposits',
      value: pendingDepositsCount || 0,
      icon: TrendingUp,
      description: 'Awaiting approval',
    },
    {
      title: 'Pending Withdrawals',
      value: pendingWithdrawalsCount || 0,
      icon: DollarSign,
      description: 'Awaiting approval',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform from one central location
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} mt-1`}>
                  {stat.change} from last month
                </p>
              )}
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/verifications" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
              <span className="font-medium">Review Verifications</span>
              <span className="text-sm bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {pendingVerifications || 0}
              </span>
            </a>
            <a href="/admin/transactions/deposits" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
              <span className="font-medium">Review Deposits</span>
              <span className="text-sm bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {pendingDepositsCount || 0}
              </span>
            </a>
            <a href="/admin/transactions/withdrawals" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
              <span className="font-medium">Review Withdrawals</span>
              <span className="text-sm bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {pendingWithdrawalsCount || 0}
              </span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
