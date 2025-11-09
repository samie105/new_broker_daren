"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Mail, MessagesSquare, Send, Phone } from 'lucide-react'

interface Contact {
  id: string
  type: string
  label: string
  value: string
  icon: string
}

interface HelpSupportProps {
  contacts: Contact[]
}

export function HelpSupport({ contacts }: HelpSupportProps) {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const handleContactClick = (contact: Contact) => {
    switch (contact.type) {
      case 'whatsapp':
        const phoneNumber = contact.value.replace(/[^0-9]/g, '')
        const text = encodeURIComponent('Hello, I need help with my account')
        window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank')
        break
      case 'email':
        const subject = encodeURIComponent('Support Request')
        const body = encodeURIComponent(message || 'Please describe your issue here')
        window.location.href = `mailto:${contact.value}?subject=${subject}&body=${body}`
        break
      case 'telegram':
        window.open(`https://t.me/${contact.value}`, '_blank')
        break
      case 'phone':
        window.location.href = `tel:${contact.value}`
        break
      case 'live_chat':
        alert('Live chat feature coming soon!')
        break
    }
  }

  const getIconComponent = (type: string) => {
    const iconMap: Record<string, any> = {
      email: Mail,
      phone: Phone,
      whatsapp: MessageCircle,
      telegram: Send,
      live_chat: MessagesSquare,
    }
    return iconMap[type] || MessageCircle
  }

  const getColorClass = (type: string) => {
    const colorMap: Record<string, string> = {
      email: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      phone: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
      whatsapp: 'bg-green-50 dark:bg-green-900/20 text-green-600',
      telegram: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600',
      live_chat: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    }
    return colorMap[type] || 'bg-gray-50 dark:bg-gray-900/20 text-gray-600'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Options */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Choose your preferred way to reach us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No contact methods available at the moment.
              </p>
            ) : (
              contacts.map((contact) => {
                const IconComponent = getIconComponent(contact.type)
                return (
                  <button
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                    className="w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getColorClass(contact.type)}`}>
                        {contact.icon ? (
                          <span className="text-2xl">{contact.icon}</span>
                        ) : (
                          <IconComponent className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{contact.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contact.value}
                        </p>
                      </div>
                      <Send className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Support Info */}
        {contacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Support Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {contact.label}
                  </span>
                  <span className="text-sm font-medium">24/7</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Message Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>We'll get back to you as soon as possible</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              rows={8}
              placeholder="Describe your issue or question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              const emailContact = contacts.find((c) => c.type === 'email')
              if (emailContact) handleContactClick(emailContact)
            }}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>

          {contacts.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                For urgent matters, please use one of the contact methods above
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
