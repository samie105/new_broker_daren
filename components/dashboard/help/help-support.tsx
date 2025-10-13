"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Mail, MessagesSquare, Send, Phone } from 'lucide-react'

export function HelpSupport() {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const handleWhatsAppSupport = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = '1234567890' // Format: country code + number without + or spaces
    const text = encodeURIComponent('Hello, I need help with my account')
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank')
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent('Support Request')
    const body = encodeURIComponent(message || 'Please describe your issue here')
    window.location.href = `mailto:support@broker.com?subject=${subject}&body=${body}`
  }

  const handleLiveChat = () => {
    // Implement your live chat integration here
    console.log('Opening live chat...')
    alert('Live chat feature coming soon!')
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
            {/* WhatsApp Support */}
            <button
              onClick={handleWhatsAppSupport}
              className="w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">WhatsApp Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with us on WhatsApp
                  </p>
                </div>
                <Send className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

            {/* Email Support */}
            <button
              onClick={handleEmailSupport}
              className="w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">
                    support@broker.com
                  </p>
                </div>
                <Send className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

            {/* Live Chat */}
            <button
              onClick={handleLiveChat}
              className="w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <MessagesSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with our support team now
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </button>

            {/* Phone Support */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">
                    +1 (800) 123-4567
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mon-Fri, 9AM-6PM EST
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Support Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Live Chat</span>
              <span className="text-sm font-medium">24/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">WhatsApp</span>
              <span className="text-sm font-medium">24/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">24/7 (Response within 24hrs)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm font-medium">Mon-Fri, 9AM-6PM EST</span>
            </div>
          </CardContent>
        </Card>
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

          <Button className="w-full" onClick={handleEmailSupport}>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              For urgent matters, please use{' '}
              <button
                onClick={handleWhatsAppSupport}
                className="text-green-600 hover:underline font-medium"
              >
                WhatsApp
              </button>
              {' '}or{' '}
              <button
                onClick={handleLiveChat}
                className="text-purple-600 hover:underline font-medium"
              >
                Live Chat
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
