"use client"

import React from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Portfolio Manager",
      company: "Goldman Sachs",
      content: "The best crypto trading platform I've used. The analytics are incredible and the interface is so intuitive. Made over 40% returns this year.",
      rating: 5,
      verified: true
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Crypto Investor",
      company: "Independent",
      content: "Security is top-notch and customer support is fantastic. Been using for 2 years and never had any issues. Highly recommended!",
      rating: 5,
      verified: true
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Fintech Entrepreneur",
      company: "BlockTech Ventures",
      content: "The DeFi integration is seamless. Love the advanced charting tools and the mobile app is perfect for trading on the go.",
      rating: 5,
      verified: true
    },
    {
      id: 4,
      name: "James Liu",
      role: "Day Trader",
      company: "Self-employed",
      content: "Lightning fast execution and the best spreads I've seen. The mobile app is incredibly smooth and reliable.",
      rating: 5,
      verified: true
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Blockchain Developer",
      company: "Ethereum Foundation",
      content: "Technical analysis tools are professional grade. API integration is well documented and their uptime is exceptional.",
      rating: 5,
      verified: true
    },
    {
      id: 6,
      name: "Alex Thompson",
      role: "Investment Analyst",
      company: "JP Morgan",
      content: "The staking rewards are competitive and the portfolio tracking features save me hours every week. Excellent platform!",
      rating: 5,
      verified: true
    }
  ]

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-semibold mb-4">
              What our <span className="gradient-text">users say</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of traders worldwide
            </p>
          </div>
        </AnimateOnScroll>

        {/* Carousel */}
        <AnimateOnScroll animation="fadeInUp" delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full border-border/50 hover:shadow-lg transition-all">
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Quote Icon */}
                        <div className="mb-4">
                          <Quote className="w-6 h-6 text-primary opacity-60" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>

                        {/* Content */}
                        <blockquote className="text-sm mb-6 leading-relaxed flex-1">
                          "{testimonial.content}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <div className="font-semibold text-sm truncate">{testimonial.name}</div>
                              {testimonial.verified && (
                                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {testimonial.role} • {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-8">
                <CarouselPrevious className="static" />
                <CarouselNext className="static" />
              </div>
            </Carousel>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
} 