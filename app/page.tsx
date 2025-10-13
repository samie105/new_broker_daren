import React from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { TradingSection } from '@/components/sections/trading-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { StakingSection } from '@/components/sections/staking-section'
import { InvestmentSection } from '@/components/sections/investment-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { CTASection } from '@/components/sections/cta-section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TickerTape } from '@/components/widgets/ticker-tape'
import { CryptoCarousel } from '@/components/ui/crypto-carousel'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div id="home">
          <HeroSection />
        </div>
        
        {/* TradingView Ticker Tape - No spacing */}
        <div className="w-full bg-background">
          <TickerTape />
        </div>

        <div id="features">
          <FeaturesSection />
        </div>
        
        <div id="trading">
          <TradingSection />
        </div>
        <div id="portfolio">
          <PortfolioSection />
        </div>
        <div id="staking">
          <StakingSection />
        </div>

        {/* Crypto Token Carousel */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Trade 50+ Cryptocurrencies
              </h2>
              <p className="text-muted-foreground">
                Access a wide range of popular digital assets
              </p>
            </div>
            <CryptoCarousel />
          </div>
        </div>

        <div id="investment">
          <InvestmentSection />
        </div>
    
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
} 