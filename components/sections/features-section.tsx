"use client"

import React from 'react'
import { 
  Shield, 
  Zap, 
  BarChart3, 
  Smartphone, 
  Globe, 
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll, StaggeredAnimateOnScroll } from '@/components/ui/animate-on-scroll'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Multi-signature wallets, cold storage, and advanced encryption protect your assets"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Execute trades in milliseconds with our high-performance matching engine"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Professional trading tools and real-time market insights for better decisions"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Trade anywhere with our intuitive mobile app and responsive design"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Available worldwide with 24/7 support and local compliance"
    },
    {
      icon: TrendingUp,
      title: "DeFi Integration",
      description: "Access decentralized finance protocols directly from our platform"
    }
  ]

  return (
    <section id="features" className="py-20 lg:py-32 relative/ /overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 -z-2 right-10 opacity-30">
        <div className="grid grid-cols-12 md:gap-16 gap-10">
          {Array.from({ length: 1000 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-0.5 bg-foreground rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.05}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Additional scattered dots */}
      <div className="absolute top-32 right-1/4 w-0.5 h-0.5 bg-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-40 right-1/3 w-0.5 h-0.5 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-28 right-1/5 w-0.5 h-0.5 bg-foreground/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-16 right-2/5 w-0.5 h-0.5 bg-foreground/45 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-44 right-1/6 w-0.5 h-0.5 bg-foreground/25 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
      
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-semibold mb-6">
              Built for modern trading
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to trade cryptocurrencies with confidence and precision
            </p>
          </div>
        </AnimateOnScroll>

        {/* Features Grid */}
        <StaggeredAnimateOnScroll
          animation="fadeInUp"
          staggerDelay={0.1}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group text-center">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </StaggeredAnimateOnScroll>
      </div>
    </section>
  )
} 