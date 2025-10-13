"use client"

import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, Shield, TrendingUp, Eye, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AnimateOnScroll, StaggeredAnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { useTheme } from 'next-themes'

export function DashboardShowcaseSection() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Get current theme-appropriate dashboard image
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === 'dark'
  
  const dashboardImage = {
    src: isDark ? '/assets/home/dashboard-darkversion.png' : '/assets/home/dashboard-lightversion.png',
    alt: `CryptoVault Dashboard - ${isDark ? 'Dark' : 'Light'} Theme`,
    title: `${isDark ? 'Dark' : 'Light'} Theme`,
    description: isDark 
      ? 'Professional dark interface designed for extended trading sessions'
      : 'Clean and modern light interface for optimal clarity'
  }

  // Ensure component is mounted before showing theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time portfolio tracking with detailed performance metrics'
    },
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'Bank-level security with multi-factor authentication'
    },
    {
      icon: TrendingUp,
      title: 'Live Market Data',
      description: 'Real-time price feeds and market analysis tools'
    },
    {
      icon: Eye,
      title: 'Intuitive Interface',
      description: 'User-friendly design with customizable layouts'
    }
  ]

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-background to-background" />
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-primary/3 blur-3xl animate-pulse-slow" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-16">
            <Badge className="inline-flex items-center space-x-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Monitor className="w-4 h-4" />
              <span>Dashboard Preview</span>
            </Badge>
            
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Experience the Future of
              <span className="block text-primary">Crypto Trading</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our advanced dashboard provides everything you need to trade, analyze, and manage your crypto portfolio 
              with professional-grade tools and real-time insights.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Dashboard Image */}
          <AnimateOnScroll animation="fadeInLeft" delay={0.2}>
            {mounted && (
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card/5 backdrop-blur-sm border border-border/20">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={dashboardImage.src}
                      alt={dashboardImage.alt}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          </AnimateOnScroll>

          {/* Features Grid */}
          <div className="space-y-8">
            <AnimateOnScroll animation="fadeInRight" delay={0.4}>
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold">
                  Built for Professional Traders
                </h3>
                <p className="text-muted-foreground text-lg">
                  Our dashboard combines powerful functionality with elegant design, 
                  giving you the tools you need to make informed trading decisions.
                </p>
              </div>
            </AnimateOnScroll>

            <StaggeredAnimateOnScroll
              animation="fadeInUp"
              staggerDelay={0.1}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/30 glass-effect border-border/20 hover:border-primary/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggeredAnimateOnScroll>

            <AnimateOnScroll animation="fadeInUp" delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  Try Dashboard Free
                  <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary/50">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Download Mobile App
                </Button>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Bottom Stats */}
        <AnimateOnScroll animation="fadeInUp" delay={1.0}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-border/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">&lt;1ms</div>
              <div className="text-sm text-muted-foreground">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
} 