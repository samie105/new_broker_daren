"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Wallet, Users, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export function DepositSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-12 lg:space-y-16">
          {/* Text Content */}
          <AnimateOnScroll animation="fadeInUp">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Wallet className="w-4 h-4" />
                  Multiple Deposit Options
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Flexible Deposit Methods for{' '}
                <span className="text-primary">
                  Every User
                </span>
              </h2>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 max-w-4xl mx-auto">
                <div className="flex flex-col items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">Crypto Deposits</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant deposits from your external wallet
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">Peer-to-Peer</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer funds directly from other users
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">Secure & Safe</h3>
                    <p className="text-sm text-muted-foreground">
                      Bank-level security for all transactions
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">Fast Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Quick verification and fund availability
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard/deposits">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Deposit Options
                  </Button>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Image Below */}
          <AnimateOnScroll animation="fadeInUp" delay={0.2}>
            <div className="relative max-w-7xl mx-auto">
              {/* macOS Window Frame */}
              <div className="rounded-xl overflow-hidden shadow-2xl bg-background border border-border">
                {/* macOS Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-foreground">Deposit Dashboard</div>
                  <div className="w-16"></div>
                </div>
                
                {/* Image Content */}
                <div className="relative bg-background">
                  <Image
                    src="/assets/home/deposit-page-light.png"
                    alt="Deposit page interface showing cryptocurrency and peer-to-peer deposit options"
                    width={5000}
                    height={3000}
                    className="object-contain object-top w-full h-auto dark:hidden"
                    priority
                  />
                  <Image
                    src="/assets/home/deposit-page-dark.png"
                    alt="Deposit page interface showing cryptocurrency and peer-to-peer deposit options"
                    width={5000}
                    height={3000}
                    className="object-contain object-top w-full h-auto hidden dark:block"
                    priority
                  />
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
