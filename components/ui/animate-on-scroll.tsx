"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useAnimateOnScroll } from '@/hooks/use-animate-on-scroll'

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideUp'
  delay?: number
  duration?: number
  threshold?: number
  className?: string
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  },
  slideUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  }
}

export function AnimateOnScroll({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className
}: AnimateOnScrollProps) {
  const { ref, inView } = useAnimateOnScroll({ threshold, delay })
  
  const selectedAnimation = animations[animation]

  return (
    <motion.div
      ref={ref}
      initial={selectedAnimation.initial}
      animate={inView ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredAnimateOnScrollProps {
  children: React.ReactNode[]
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideUp'
  staggerDelay?: number
  duration?: number
  threshold?: number
  className?: string
}

export function StaggeredAnimateOnScroll({
  children,
  animation = 'fadeInUp',
  staggerDelay = 0.1,
  duration = 0.6,
  threshold = 0.1,
  className
}: StaggeredAnimateOnScrollProps) {
  const { ref, inView } = useAnimateOnScroll({ threshold })
  
  const selectedAnimation = animations[animation]

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={selectedAnimation.initial}
          animate={inView ? selectedAnimation.animate : selectedAnimation.initial}
          transition={{ 
            duration, 
            delay: index * staggerDelay 
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
} 