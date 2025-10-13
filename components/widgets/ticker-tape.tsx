"use client"

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export function TickerTape() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const currentTheme = resolvedTheme || theme
    const isDark = currentTheme === 'dark'
console.log(isDark)
    if (containerRef.current) {
      // Clear existing content
      containerRef.current.innerHTML = ''

      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = JSON.stringify({
        symbols: [
          {
            proName: "BITSTAMP:BTCUSD",
            title: "Bitcoin"
          },
          {
            proName: "BITSTAMP:ETHUSD",
            title: "Ethereum"
          },
          {
            proName: "BINANCE:SOLUSD",
            title: "Solana"
          },
          {
            proName: "BINANCE:BNBUSD",
            title: "BNB"
          },
          {
            proName: "COINBASE:ADAUSD",
            title: "Cardano"
          },
          {
            proName: "BINANCE:DOTUSD",
            title: "Polkadot"
          },
          {
            proName: "BINANCE:MATICUSD",
            title: "Polygon"
          },
          {
            proName: "BINANCE:AVAXUSD",
            title: "Avalanche"
          },
          {
            proName: "COINBASE:LINKUSD",
            title: "Chainlink"
          },
          {
            proName: "COINBASE:UNIUSD",
            title: "Uniswap"
          }
        ],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en"
      })

      containerRef.current.appendChild(script)
    }
  }, [theme, resolvedTheme])

  return (
    <div className="tradingview-widget-container w-full">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
    </div>
  )
}
