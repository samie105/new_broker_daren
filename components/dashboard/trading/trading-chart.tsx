"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'

type AssetType = 'crypto' | 'stocks' | 'currencies'

export function TradingChart({ selectedPair = 'BTC/USDT', selectedSymbol = 'BTC', assetType = 'crypto' }: {
  selectedPair?: string
  selectedSymbol?: string
  assetType?: AssetType
}) {
  const currentPrice = 67420.50

  // Generate appropriate TradingView symbol based on asset type
  const getTradingViewSymbol = () => {
    if (assetType === 'crypto') {
      return `BINANCE:${selectedSymbol}USDT`
    } else if (assetType === 'stocks') {
      // Map common stocks to their exchanges
      const stockExchangeMap: Record<string, string> = {
        'AAPL': 'NASDAQ', 'MSFT': 'NASDAQ', 'GOOGL': 'NASDAQ', 'AMZN': 'NASDAQ',
        'NVDA': 'NASDAQ', 'TSLA': 'NASDAQ', 'META': 'NASDAQ', 'NFLX': 'NASDAQ',
        'AMD': 'NASDAQ', 'INTC': 'NASDAQ', 'PYPL': 'NASDAQ', 'ADBE': 'NASDAQ',
        'CRM': 'NYSE', 'ORCL': 'NYSE', 'CSCO': 'NASDAQ', 'IBM': 'NYSE',
        'DIS': 'NYSE', 'NKE': 'NYSE', 'BA': 'NYSE', 'JPM': 'NYSE'
      }
      const exchange = stockExchangeMap[selectedSymbol] || 'NASDAQ'
      return `${exchange}:${selectedSymbol}`
    } else {
      // Forex pairs - TradingView uses format like FX_IDC:EURUSD
      // selectedSymbol for forex is already the pair (e.g., EURUSD)
      return `FX_IDC:${selectedSymbol}`
    }
  }

  useEffect(() => {
    const widgetContainer = document.getElementById('tradingview-widget')
    if (widgetContainer) {
      widgetContainer.innerHTML = ''
      
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.async = true
      
      // Get the properly formatted symbol
      const symbolToUse = getTradingViewSymbol()
      
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: symbolToUse,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        gridColor: 'rgba(255, 255, 255, 0.06)',
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: 'tradingview-widget'
      })

      widgetContainer.appendChild(script)
    }
  }, [selectedSymbol, assetType])

  return (
    <div className="h-full w-full relative bg-background">
      <div id="tradingview-widget" className="h-full w-full"></div>
    </div>
  )
}
