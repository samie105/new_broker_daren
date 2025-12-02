'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function JivoChat() {
  const pathname = usePathname()
  
  // Don't render on admin pages
  const isAdminPage = pathname?.startsWith('/admin')
  
  useEffect(() => {
    // Skip if on admin pages
    if (isAdminPage) return
    
    // Check if script already exists
    if (document.querySelector('script[src*="jivosite.com"]')) return
    
    // Create and append the Jivo script
    const script = document.createElement('script')
    script.src = '//code.jivosite.com/widget/HOWNJJrYUv'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src*="jivosite.com"]')
      if (existingScript) {
        existingScript.remove()
      }
      // Also remove the Jivo widget container if it exists
      const jivoWidget = document.querySelector('jdiv')
      if (jivoWidget) {
        jivoWidget.remove()
      }
    }
  }, [isAdminPage])
  
  // Don't render anything on admin pages
  if (isAdminPage) return null
  
  return null
}
