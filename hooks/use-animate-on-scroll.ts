import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseAnimateOnScrollOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
  delay?: number
}

export function useAnimateOnScroll(options: UseAnimateOnScrollOptions = {}) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px',
    delay = 0
  } = options

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  })

  return {
    ref,
    inView,
    animationProps: {
      initial: { opacity: 0, y: 50 },
      animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
      transition: { duration: 0.6, delay }
    }
  }
}

export function useStaggeredAnimateOnScroll(itemCount: number, options: UseAnimateOnScrollOptions = {}) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px',
    delay = 0
  } = options

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  })

  const getStaggeredProps = (index: number) => ({
    initial: { opacity: 0, y: 50 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: { 
      duration: 0.6, 
      delay: delay + (index * 0.1) 
    }
  })

  return {
    ref,
    inView,
    getStaggeredProps
  }
} 