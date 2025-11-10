"use client"

import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Settings, 
  User, 
  Search,
  Menu,
  X,
  Home,
  BarChart3,
  Coins,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { NotificationBell } from '@/components/dashboard/notification-bell'
import { logoutAction } from '@/server/actions/auth'
import { useUserProfile } from '@/hooks/use-user'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'Portfolio',
    icon: Wallet,
    href: '/dashboard/portfolio'
  },
  {
    title: 'Live Trading',
    icon: TrendingUp,
    href: '/dashboard/trading'
  },
  {
    title: 'Staking',
    icon: Coins,
    href: '/dashboard/staking'
  },
  {
    title: 'Investment',
    icon: Briefcase,
    href: '/dashboard/investment'
  },
  {
    title: 'Verification',
    icon: CheckCircle,
    href: '/dashboard/verification'
  },
  {
    title: 'Withdraw',
    icon: ArrowDownLeft,
    href: '/dashboard/withdraw'
  },
  {
    title: 'Deposits',
    icon: ArrowUpRight,
    href: '/dashboard/deposits'
  },
  {
    title: 'History',
    icon: History,
    href: '/dashboard/history'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings'
  },
  {
    title: 'Help',
    icon: HelpCircle,
    href: '/dashboard/help'
  }
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  
  // Fetch user profile data
  const { data: user, isLoading: userLoading } = useUserProfile()
  
  // Get user display values
  const userName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'
  const userEmail = user?.email || 'user@example.com'
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logoutAction()
      if (result.success) {
        // Redirect to login page
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Function to check if a navigation item is active
  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card/95 backdrop-blur-md border-r border-border/50 transition-all duration-300 shadow-lg",
        sidebarCollapsed ? "w-20" : "w-64",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn(
            "flex h-16 items-center border-b border-border/50",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}>
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center group px-2">
                <Image 
                  src="/assets/apcaplogo.png" 
                  alt="Apcap Logo" 
                  width={100} 
                  height={21}
                  className="h-5 w-auto"
                  priority
                />
              </Link>
            )}
            
            {sidebarCollapsed && (
              <Link href="/" className="group">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
              </Link>
            )}
            
            {/* Collapse Button */}
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-2",
            sidebarCollapsed ? "p-2" : "p-4"
          )}>
            <div className={cn(
              "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3",
              sidebarCollapsed && "hidden"
            )}>
              Menu
            </div>
            
            {/* Expand Button for Collapsed State */}
            {sidebarCollapsed && (
              <div className="flex justify-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(false)}
                  className="h-9 w-9 p-0 rounded-xl hover:bg-accent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            {sidebarItems.map((item) => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    sidebarCollapsed 
                      ? "justify-center p-3 mx-1" 
                      : "space-x-3 px-3 py-3",
                    active 
                      ? "bg-primary text-white shadow-md shadow-primary/25" 
                      : "text-muted-foreground/40 hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "rounded-lg transition-colors flex-shrink-0",
                    sidebarCollapsed ? "p-2" : "p-2",
                    active 
                      ? "bg-white/20 text-white" 
                      : "bg-muted group-hover:bg-muted-foreground/10 text-muted-foreground/50"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 backdrop-blur-sm">
                      {item.title}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className={cn(
            "border-t border-border/50",
            sidebarCollapsed ? "p-2" : "p-4"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full h-auto rounded-xl hover:bg-accent",
                    sidebarCollapsed 
                      ? "justify-center p-3" 
                      : "justify-start space-x-3 p-3"
                  )}
                >
                  <Avatar className="w-9 h-9 ring-2 ring-primary/20">
                    <AvatarImage src={user?.avatar_url || "/avatars/user.jpg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{userInitials}</AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold">{userName}</div>
                      <div className="text-xs text-muted-foreground">{userEmail}</div>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 shadow-sm">
          {/* Mobile Menu Button */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-9 w-9 p-0"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex h-full flex-col">
                {/* Logo in Sheet */}
                <div className="flex h-16 items-center justify-center px-6 border-b border-border/50 bg-muted/30">
                  <Link href="/" className="flex items-center group">
                    <Image 
                      src="/assets/apcaplogo.png" 
                      alt="Apcap Logo" 
                      width={100} 
                      height={21}
                      className="h-5 w-auto"
                    />
                  </Link>
                </div>

                {/* User Profile Section - Mobile */}
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                      <AvatarImage src={user?.avatar_url || "/avatars/user.jpg"} alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-base font-semibold">{userName}</p>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Items - Mobile */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Navigation
                  </div>
                  {sidebarItems.map((item) => {
                    const active = isItemActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                          active 
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          active 
                            ? "bg-white/20" 
                            : "bg-muted group-hover:bg-muted-foreground/10"
                        )}>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="flex-1">{item.title}</span>
                        {active && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </Link>
                    )
                  })}
                </nav>

                {/* Theme Switch and Actions - Mobile */}
                <div className="border-t border-border/50 p-4 space-y-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Preferences
                  </div>
                  
                  <div className="flex items-center justify-between py-2 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {theme === 'dark' ? (
                          <Moon className="h-4 w-4 text-primary" />
                        ) : (
                          <Sun className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium">Dark Mode</span>
                        <p className="text-xs text-muted-foreground">Toggle theme appearance</p>
                      </div>
                    </div>
                    <ThemeSwitch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                  
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 pt-2">
                    Account
                  </div>
                  
                  <div className="space-y-2 px-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-12 px-3 rounded-xl"
                      onClick={() => {
                        setSheetOpen(false)
                        router.push('/dashboard/settings')
                      }}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 flex-shrink-0">
                          <User className="h-4 w-4 text-primary dark:text-primary" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">Profile</div>
                          <div className="text-xs text-muted-foreground">Manage your account</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-12 px-3 rounded-xl"
                      onClick={() => {
                        setSheetOpen(false)
                        router.push('/dashboard/settings')
                      }}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/20 flex-shrink-0">
                          <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">Settings</div>
                          <div className="text-xs text-muted-foreground">App preferences</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-12 px-3 rounded-xl text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={async () => {
                        setSheetOpen(false)
                        await handleLogout()
                      }}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 flex-shrink-0">
                          <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">Log out</div>
                          <div className="text-xs text-muted-foreground">Sign out of account</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search and Mobile Notifications */}
          <div className="flex items-center flex-1 max-w-md space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search cryptocurrencies, transactions..."
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 h-9"
              />
            </div>
          </div>

          {/* Header Actions - Right Side */}
          <div className="flex items-center space-x-2">
            {/* Notifications - Responsive (handles both mobile and desktop) */}
            <NotificationBell />

            {/* Theme Toggle - Desktop */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-2 px-2">
                <ThemeSwitch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </div>

            {/* User Menu - Desktop Only */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hidden lg:flex p-0 hover:bg-accent">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
                    <AvatarImage src={user?.avatar_url || "/avatars/user.jpg"} alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2 p-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar_url || "/avatars/user.jpg"} alt="User" />
                        <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 