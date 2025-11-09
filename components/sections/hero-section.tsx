"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRight, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FlipWords } from '@/components/ui/flip-words'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { CountUpUsers } from '@/components/ui/count-up'
import { useTheme } from 'next-themes'

export function HeroSection() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Get current theme-appropriate dashboard image
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === 'dark'
  
  const dashboardImage = {
    src: isDark ? '/assets/home/dashboard-darkversion.png' : '/assets/home/dashboard-lightversion.png',
    alt: `Trans-Atlantic Capitals Dashboard - ${isDark ? 'Dark' : 'Light'} Theme`,
    title: `${isDark ? 'Dark' : 'Light'} Theme Dashboard`
  }

  // Ensure component is mounted before showing theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  const heroWords = [
    "Digital Currency",
    "Crypto Trading", 
    "Investment Hub",
    "Financial Freedom"
  ]

  return (
    <section className="relative pt-20 pb-16 lg:pt-24 lg:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left Content - Text */}
          <div className="space-y-6 md:space-y-8">
            <AnimateOnScroll animation="fadeInLeft" delay={0.2}>
              <div className="space-y-4 md:space-y-6">
                <Badge className="inline-flex items-center space-x-2 bg-background shadow-none border-border text-muted-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                  <Zap className="w-3 h-3 md:w-4 md:h-4" /> 
                  <span>Trusted by <CountUpUsers users={30000000} className="font-bold" /> users worldwide</span>
                </Badge>
                
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight">
                  <span className="block mb-2 md:mb-4">Your Gateway to</span>
                  <FlipWords 
                    words={heroWords}
                    duration={3000}
                    className="text-primary text-3xl md:text-4xl lg:text-6xl font-semibold"
                  />
                </h1>
                
                <div className="space-y-4">
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed">
                    Experience the future of finance with institutional-grade security, 
                    lightning-fast execution, and access to 200+ cryptocurrencies.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll animation="fadeInUp" delay={0.6}>
              <div className="flex gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 group text-sm md:text-base lg:text-lg px-6 py-3 md:px-8 md:py-4 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-auto rounded-full">
                    Start Trading Now
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Content - Dashboard Image */}
          {mounted && (
            <AnimateOnScroll animation="fadeInRight" delay={0.4}>
              <div className="relative">
                {/* macOS Window Frame */}
                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-background border border-border">
                  {/* macOS Title Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      Trans-Atlantic Capitals Dashboard
                    </div>
                    <div className="w-16"></div>
                  </div>
                  
                  {/* Dashboard Image */}
                  <div className="relative bg-background">
                    <Image
                      src={dashboardImage.src}
                      alt={dashboardImage.alt}
                      width={1200}
                      height={750}
                      className="object-contain object-top w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  )
} 