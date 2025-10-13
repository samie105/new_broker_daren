"use client"

import React from 'react'
import { Shield, Users, Globe, Award, Target, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll, StaggeredAnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { CountUp, CountUpUsers, CountUpPercentage } from '@/components/ui/count-up'

export function AboutSection() {
  const stats = [
    {
      icon: Users,
      number: '5M+',
      label: 'Active Users',
      description: 'Trusted globally'
    },
    {
      icon: Shield,
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable platform'
    },
    {
      icon: Globe,
      number: '150+',
      label: 'Countries',
      description: 'Global presence'
    },
    {
      icon: Award,
      number: '50+',
      label: 'Awards',
      description: 'Industry recognition'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Bank-grade security with multi-signature wallets and cold storage protection'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Intuitive design and 24/7 support focused on your trading success'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Cutting-edge technology and AI-powered trading tools'
    }
  ]

  const certifications = [
    'SOC 2 Type II Certified',
    'ISO 27001 Compliant',
    'CCSS Level 3 Security',
    'PCI DSS Compliant'
  ]

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Building the future of finance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're democratizing access to cryptocurrency markets with secure, 
              innovative trading solutions for everyone.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Stats */}
        <StaggeredAnimateOnScroll
          animation="fadeInUp"
          staggerDelay={0.1}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </StaggeredAnimateOnScroll>

        {/* Mission */}
        <AnimateOnScroll animation="fadeInUp" className="mb-20">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-12 text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                To democratize access to cryptocurrency markets by providing secure, innovative, 
                and user-friendly trading solutions that empower individuals and institutions 
                to build wealth through digital assets.
              </p>
            </CardContent>
          </Card>
        </AnimateOnScroll>

        {/* Values */}
        <StaggeredAnimateOnScroll
          animation="fadeInUp"
          staggerDelay={0.1}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {values.map((value, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 text-center group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </StaggeredAnimateOnScroll>

        {/* Security */}
        <AnimateOnScroll animation="fadeInUp">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold">Security & Compliance</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 text-lg">
                    We maintain the highest standards of security and regulatory compliance 
                    to protect your assets and ensure a trustworthy trading environment.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-primary/10">
                    <Shield className="w-16 h-16 text-primary mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">$100M+</div>
                    <div className="font-semibold">Insurance Coverage</div>
                    <div className="text-sm text-muted-foreground mt-1">Protecting user funds</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
    </section>
  )
} 