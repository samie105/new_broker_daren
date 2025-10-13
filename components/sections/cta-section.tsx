"use client"

import React, { useState } from 'react'
import { ArrowRight, Rocket, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CountUp, CountUpUsers, CountUpCurrency, CountUpPercentage } from '@/components/ui/count-up'

export function CTASection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden   ">
      {/* Background */}
      <div className="absolute inset-0 opac/ity-3"></div>
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main CTA */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Rocket className="w-4 h-4" />
              <span>Ready to Start Trading?</span>
            </div>
            
            <h2 className="text-3xl lg:text-6xl font-semibold">
              Join millions of traders
              <span className="block gradient-text">worldwide today</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your crypto journey with the most trusted and secure platform. 
              Get access to advanced tools, real-time data, and 24/7 support.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link href="/auth/signup">
              <Button size="lg" className="gradient-bg group text-lg px-8 py-4 rounded-full">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Newsletter Signup */}
          <div className="glass-effect bg-card/30 rounded-2xl p-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Mail className="w-5 h-5" />
                <span className="font-semibold">Stay Updated</span>
              </div>
              
              <h3 className="text-xl font-medium">
                Get the latest crypto news and market insights
              </h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
                <Button type="submit" className="gradient-bg px-6">
                  Subscribe
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground">
                Join 100,000+ subscribers. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                <CountUpUsers users={5000000} />
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                <CountUpCurrency amount={50} currency="$" suffix="B+" />
              </div>
              <div className="text-sm text-muted-foreground">Trading Volume</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                <CountUp end={200} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Cryptocurrencies</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                <CountUp end={24} suffix="/7" />
              </div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 