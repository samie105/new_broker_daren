"use client"

import React, { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { 
  getNotificationsAction, 
  getUnreadCountAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction,
  clearAllNotificationsAction
} from '@/server/actions/notifications'
import type { UserNotification } from '@/server/types/database'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const notificationIcons: Record<UserNotification['type'], string> = {
  transaction: '💰',
  trade: '📈',
  staking: '🪙',
  investment: '💼',
  kyc: '✅',
  security: '🔒',
  system: '⚙️',
  announcement: '📢'
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true)
    const [notifResult, countResult] = await Promise.all([
      getNotificationsAction(),
      getUnreadCountAction()
    ])

    if (notifResult.success && notifResult.data) {
      setNotifications(notifResult.data)
    }

    if (countResult.success) {
      setUnreadCount(countResult.data)
    }

    setLoading(false)
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    const result = await markNotificationAsReadAction(notificationId)
    if (result.success) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsReadAction()
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } else {
      toast.error(result.error || 'Failed to mark all as read')
    }
  }

  // Delete notification
  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const result = await deleteNotificationAction(notificationId)
    if (result.success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      toast.success('Notification deleted')
    } else {
      toast.error(result.error || 'Failed to delete notification')
    }
  }

  // Clear all notifications
  const handleClearAll = async () => {
    const result = await clearAllNotificationsAction()
    if (result.success) {
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications cleared')
    } else {
      toast.error(result.error || 'Failed to clear notifications')
    }
  }

  // Handle notification click
  const handleNotificationClick = async (notification: UserNotification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id)
    }

    // Navigate if action_url exists
    if (notification.action_url) {
      setOpen(false)
      router.push(notification.action_url)
    }
  }

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  // Render notification list content
  const renderNotificationList = () => (
    <ScrollArea className={cn(isMobile ? "h-[60vh]" : "h-[400px]")}>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No notifications</h3>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            You're all caught up! We'll notify you when something important happens.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "p-4 transition-colors relative group",
                notification.is_read 
                  ? "hover:bg-accent/50" 
                  : "bg-primary/5 hover:bg-primary/10",
                notification.action_url && "cursor-pointer"
              )}
            >
              {/* Unread indicator */}
              {!notification.is_read && (
                <div className="absolute left-2 top-6 w-2 h-2 bg-primary rounded-full" />
              )}

              <div className="flex gap-3 pl-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center text-xl">
                  {notification.icon || notificationIcons[notification.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                      "text-sm leading-tight",
                      !notification.is_read && "font-semibold"
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(notification.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Metadata */}
                  {notification.metadata && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {notification.metadata.amount && (
                        <span className="font-medium">
                          ${notification.metadata.amount.toLocaleString()}
                          {notification.metadata.currency && ` ${notification.metadata.currency}`}
                        </span>
                      )}
                      {notification.metadata.status && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.metadata.status}
                        </Badge>
                      )}
                    </div>
                  )}

                  {notification.action_url && (
                    <div className="flex items-center gap-1 text-xs text-primary font-medium pt-1">
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  )

  // Mobile version - Drawer
  if (isMobile) {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DrawerTitle>Notifications</DrawerTitle>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="h-8 text-xs"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-8 text-xs text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DrawerHeader>
          
          {renderNotificationList()}
          
          {notifications.length > 0 && (
            <DrawerFooter className="border-t pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setDrawerOpen(false)
                  router.push('/dashboard/notifications')
                }}
              >
                View all notifications
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop version - Dropdown
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="h-8 text-xs"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 text-xs text-destructive hover:text-destructive"
                >
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>

        {renderNotificationList()}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-sm"
              onClick={() => {
                setOpen(false)
                router.push('/dashboard/notifications')
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
