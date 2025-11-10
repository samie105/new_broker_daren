import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Atlantic Pacific Capitals - Secure Digital Currency Exchange',
  description: 'Trade, buy, and sell cryptocurrencies with confidence. Advanced security, real-time data, and seamless trading experience.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
              theme="system"
              expand={false}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
} 