"use client"

import React from 'react'
import { BarChart3, TrendingUp, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function TradingSection() {
  return (
    <section id="trade" className="relative py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Top Content - Text - Centralized */}
        <div className="max-w-4xl mx-auto mb-16 lg:mb-24 text-center">
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <BarChart3 className="w-4 h-4" />
                <span>Professional Trading</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-semibold">
                Trade like a
                <span className="block gradient-text">professional</span>
              </h2>
              
              <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
                Access institutional-grade trading tools and features. From beginner-friendly 
                interfaces to advanced charting, we have everything you need to succeed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-bg rounded-full">
                Start Trading
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                View Trading Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Content - Desktop Frame Image - Bigger */}
        <div className="animate-fade-in-right max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-background border-l border-t border-border">
            {/* macOS Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm font-medium text-foreground">Trading Dashboard</div>
              <div className="w-16"></div>
            </div>
            <div className="relative bg-background">
              <Image
                src="/assets/home/trading-page-light.png"
                alt="Trading Dashboard"
                width={1600}
                height={1000}
                className="object-contain object-top w-full h-auto dark:hidden"
                priority
              />
              <Image
                src="/assets/home/trading-page-dark.png"
                alt="Trading Dashboard"
                width={1600}
                height={1000}
                className="object-contain object-top w-full h-auto hidden dark:block"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 