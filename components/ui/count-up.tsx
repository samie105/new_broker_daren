"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  separator?: string
  triggerOnce?: boolean
  threshold?: number
  delay?: number
}

// Easing function for smooth animation
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// Parse number from string (handles K, M, B suffixes)
const parseEndValue = (end: number | string): number => {
  if (typeof end === 'number') return end
  
  const numStr = end.toString().toLowerCase()
  const numValue = parseFloat(numStr)
  
  if (numStr.includes('k')) return numValue * 1000
  if (numStr.includes('m')) return numValue * 1000000
  if (numStr.includes('b')) return numValue * 1000000000
  
  return numValue
}

// Format number with proper separators
const formatNumber = (
  value: number, 
  decimals: number = 0, 
  separator: string = ','
): string => {
  if (decimals > 0) {
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  }
  return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export function CountUp({ 
  end, 
  start = 0,
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  className = "",
  separator = ",",
  triggerOnce = true,
  threshold = 0.1,
  delay = 0
}: CountUpProps) {
  const [count, setCount] = useState(start)
  const [hasAnimated, setHasAnimated] = useState(false)
  const animationRef = useRef<number>()
  
  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  })

  const endValue = parseEndValue(end)

  useEffect(() => {
    if (inView && (!hasAnimated || !triggerOnce)) {
      if (delay > 0) {
        setTimeout(() => startAnimation(), delay)
      } else {
        startAnimation()
      }
    }
  }, [inView, hasAnimated, triggerOnce, delay, endValue])

  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    let startTime: number
    const startCount = start
    const endCount = endValue
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Apply easing function for smooth animation
      const easedProgress = easeOutExpo(progress)
      const currentCount = startCount + (endCount - startCount) * easedProgress
      
      setCount(currentCount)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCount)
      } else {
        setHasAnimated(true)
      }
    }
    
    animationRef.current = requestAnimationFrame(updateCount)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const formattedCount = formatNumber(count, decimals, separator)

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {prefix}{formattedCount}{suffix}
    </span>
  )
}

// Specialized components for common use cases
export function CountUpCurrency({ 
  amount, 
  currency = '$', 
  ...props 
}: Omit<CountUpProps, 'end' | 'prefix'> & { 
  amount: number
  currency?: string 
}) {
  return (
    <CountUp 
      end={amount} 
      prefix={currency}
      separator=","
      {...props} 
    />
  )
}

export function CountUpPercentage({ 
  percentage, 
  ...props 
}: Omit<CountUpProps, 'end' | 'suffix'> & { 
  percentage: number 
}) {
  return (
    <CountUp 
      end={percentage} 
      suffix="%" 
      decimals={1}
      {...props} 
    />
  )
}

export function CountUpUsers({ 
  users, 
  ...props 
}: Omit<CountUpProps, 'end' | 'suffix'> & { 
  users: number 
}) {
  const formatUsers = (num: number) => {
    if (num >= 1000000) return { end: num / 1000000, suffix: 'M+' }
    if (num >= 1000) return { end: num / 1000, suffix: 'K+' }
    return { end: num, suffix: '+' }
  }

  const { end: formattedEnd, suffix } = formatUsers(users)

  return (
    <CountUp 
      end={formattedEnd} 
      suffix={suffix}
      decimals={formattedEnd < 10 ? 1 : 0}
      {...props} 
    />
  )
} 