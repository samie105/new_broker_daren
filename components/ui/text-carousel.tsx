"use client"

import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TextCarouselProps {
  items: string[]
  autoplay?: boolean
  autoplayInterval?: number
  showControls?: boolean
  controlsPosition?: 'inside' | 'outside' | 'above'
  className?: string
  itemClassName?: string
}

export function TextCarousel({
  items,
  autoplay = true,
  autoplayInterval = 3000,
  showControls = true,
  controlsPosition = 'above',
  className = '',
  itemClassName = ''
}: TextCarouselProps) {
  const [api, setApi] = React.useState<any>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    if (!api || !autoplay) {
      return
    }

    const interval = setInterval(() => {
      api.scrollNext()
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [api, autoplay, autoplayInterval])

  const goToPrevious = () => {
    api?.scrollPrev()
  }

  const goToNext = () => {
    api?.scrollNext()
  }

  return (
    <div className={cn('relative', className)}>
      {/* Controls Above */}
      {showControls && controlsPosition === 'above' && (
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="h-8 w-8 rounded-full p-0 hover:bg-muted/80"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: count }, (_, index) => (
              <button
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-all duration-200',
                  index + 1 === current
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="h-8 w-8 rounded-full p-0 hover:bg-muted/80"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}

      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="text-center">
              <div className={cn('p-1', itemClassName)}>
                {item}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Controls Inside/Outside */}
        {showControls && controlsPosition !== 'above' && (
          <>
            <CarouselPrevious className={cn(
              'h-8 w-8',
              controlsPosition === 'inside' ? 'left-2' : '-left-12'
            )} />
            <CarouselNext className={cn(
              'h-8 w-8',
              controlsPosition === 'inside' ? 'right-2' : '-right-12'
            )} />
          </>
        )}
      </Carousel>

      {/* Dots Indicator (when controls are not above) */}
      {controlsPosition !== 'above' && (
        <div className="flex justify-center space-x-1 mt-4">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-200',
                index + 1 === current
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface TestimonialCarouselProps {
  testimonials: {
    id: string
    content: string
    name: string
    role: string
    company: string
    rating: number
    verified?: boolean
  }[]
  autoplay?: boolean
  autoplayInterval?: number
  className?: string
}

export function TestimonialCarousel({
  testimonials,
  autoplay = true,
  autoplayInterval = 5000,
  className = ''
}: TestimonialCarouselProps) {
  const [api, setApi] = React.useState<any>()

  React.useEffect(() => {
    if (!api || !autoplay) {
      return
    }

    const interval = setInterval(() => {
      api.scrollNext()
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [api, autoplay, autoplayInterval])

  return (
    <div className={cn('relative', className)}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="text-center">
              <div className="p-6">
                {/* Rating Stars */}
                <div className="flex justify-center space-x-1 mb-4">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg font-medium mb-4 text-foreground max-w-2xl mx-auto">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      {testimonial.verified && (
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="h-10 w-10 -left-16" />
        <CarouselNext className="h-10 w-10 -right-16" />
      </Carousel>
    </div>
  )
}
