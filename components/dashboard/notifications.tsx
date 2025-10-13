"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  User, 
  Trash2,
  MoreHorizontal,
  CheckCheck,
  X,
  AlertCircle,
  Info
} from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getUserNotificationsAction, markNotificationAsReadAction, markAllNotificationsAsReadAction } from '@/server/actions/user'
import { toast } from 'sonner'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  link?: string
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCheck
    case 'warning':
      return AlertCircle
    case 'error':
      return X
    case 'info':
    default:
      return Info
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-600 bg-green-50 dark:bg-green-950/20'
    case 'warning':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
    case 'error':
      return 'text-red-600 bg-red-50 dark:bg-red-950/20'
    case 'info':
    default:
      return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
  }
}

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onRefresh: () => void
}

function NotificationItem({ notification, onMarkRead, onRefresh }: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type)
  const colorClass = getNotificationColor(notification.type)

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString()
  }

  const notificationContent = (
    <div className={`flex items-start space-x-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
      !notification.read ? 'bg-primary/5 border-l-2 border-primary' : ''
    }`}>
      <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <span className="text-xs text-muted-foreground mt-2 block">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 ml-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onMarkRead(notification.id)
              }}
            >
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={() => {
        if (!notification.read) onMarkRead(notification.id)
      }}>
        {notificationContent}
      </Link>
    )
  }

  return notificationContent
}

interface NotificationsProps {
  className?: string
}

export function Notifications({ className }: NotificationsProps) {
  const [notificationList, setNotificationList] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const unreadCount = notificationList.filter(n => !n.read).length

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const result = await getUserNotificationsAction()
      if (result.success && result.data) {
        setNotificationList(result.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    const result = await markNotificationAsReadAction(id)
    if (result.success) {
      setNotificationList(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
    } else {
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    const result = await markAllNotificationsAsReadAction()
    if (result.success) {
      setNotificationList(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } else {
      toast.error('Failed to mark all as read')
    }
  }

  const NotificationContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="w-full">
      {/* Header */}
      <div className={`flex items-center justify-between border-b ${isMobile ? 'p-6 pb-4' : 'p-4'}`}>
        <div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {notificationList.length > 0 && unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className={isMobile ? 'max-h-[60vh] overflow-y-auto' : ''}>
        <ScrollArea className={isMobile ? 'h-full' : 'h-[400px]'}>
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notificationList.length > 0 ? (
            <div className="divide-y">
              {notificationList.map((notification) => (
                <div key={notification.id} className="group">
                  <NotificationItem
                    notification={notification}
                    onMarkRead={markAsRead}
                    onRefresh={fetchNotifications}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
              <Bell className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground">We'll notify you when something important happens</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )

  return (
    <div className="relative">
      {/* Mobile - Drawer */}
      <div className="block sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative h-9 w-9 p-0 hover:bg-accent ${className || ''}`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-background">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Notifications</DrawerTitle>
            </DrawerHeader>
            <NotificationContent isMobile={true} />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop - Popover */}
      <div className="hidden sm:block">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative h-9 w-9 p-0 hover:bg-accent ${className || ''}`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-background">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <NotificationContent isMobile={false} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
} 