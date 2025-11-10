'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  ArrowDownUp, 
  ShieldCheck, 
  TrendingUp, 
  Coins,
  Activity,
  Settings,
  LogOut,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AdminUser } from '@/lib/admin-helpers'

interface AdminSidebarProps {
  user: AdminUser
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Transactions',
    icon: ArrowDownUp,
    children: [
      { name: 'Deposits', href: '/admin/transactions/deposits' },
      { name: 'Withdrawals', href: '/admin/transactions/withdrawals' },
    ],
  },
  {
    name: 'Verifications',
    href: '/admin/verifications',
    icon: ShieldCheck,
  },
  {
    name: 'Plans',
    href: '/admin/plans',
    icon: Package,
  },
  {
    name: 'Investments',
    href: '/admin/investments',
    icon: TrendingUp,
  },
  {
    name: 'Staking',
    href: '/admin/staking',
    icon: Coins,
  },
  {
    name: 'Trades',
    href: '/admin/trades',
    icon: Activity,
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'Deposit Methods', href: '/admin/settings/deposit-methods' },
    ],
  },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user.fullName || user.email}
          </p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              if (item.children) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.name}
                    </div>
                    <div className="ml-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            pathname === child.href
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t p-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Exit Admin
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
