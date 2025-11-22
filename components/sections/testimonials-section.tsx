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
      name: "Elizabeth McLeod",
      role: "Homeowner",
      company: "Liverpool",
      content: "Had Sharon and Tony here today doing deep clean. Really pleased with their work. Here 3 hours and never stopped. Definitely recommend them.",
      rating: 5,
      verified: true
    },
    {
      id: 2,
      name: "Sher Ee Tan",
      role: "Regular Client",
      company: "Liverpool",
      content: "I've been using Cribs and Spaces Cleaning for my regular fortnightly cleans and have had three sessions so far – all of which have been excellent!",
      rating: 5,
      verified: true
    },
    {
      id: 3,
      name: "Joseph Fennelly",
      role: "Homeowner",
      company: "Liverpool",
      content: "We've been really impressed with the quality of the house cleaning service – everything is done to a high standard. Communication has been great from the start, and Faith, our cleaner, is consistently reliable and thorough. Highly recommended.",
      rating: 5,
      verified: true
    },
    {
      id: 4,
      name: "ellamillz juliet",
      role: "Customer",
      company: "Liverpool",
      content: "Excellent and prompt service—I'm thoroughly impressed!",
      rating: 5,
      verified: true
    },
    {
      id: 5,
      name: "Ahmed Ely El Kory",
      role: "Customer",
      company: "Liverpool",
      content: "It was an amazing experience with you guys and a great job. I'm very satisfied.",
      rating: 5,
      verified: true
    },
    {
      id: 6,
      name: "Chuksy Tony",
      role: "Customer",
      company: "Liverpool",
      content: "It was lovely working with the cribs and spaces team. Did a wonderful job for me. I highly recommend.",
      rating: 5,
      verified: true
    },
    {
      id: 7,
      name: "Tuna Mutlu",
      role: "Tenant",
      company: "Liverpool",
      content: "I hired Cribs & Spaces Cleaning Ltd. for an end-of-tenancy cleaning service, and they did an exceptional job. They put in great effort to deep clean the entire property from top to bottom. The bath was so spotless that I barely recognized it—it was shining! The floors, cabinets, kitchen, oven, and fridge were all thoroughly cleaned, and the oven glass was crystal clear.",
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