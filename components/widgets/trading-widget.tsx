"use client"

import React, { useState, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, TrendingUp, TrendingDown, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchTopCryptos, type CryptoPrice } from '@/lib/crypto-api'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'

interface CurrencyOption {
  symbol: string
  name: string
  image?: string
  price?: number
  change?: number
  isFiat?: boolean
}

export function TradingWidget() {
  const [activeTab, setActiveTab] = useState('buy')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BTC')
  const [amount, setAmount] = useState('1000')
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  const fiatCurrencies: CurrencyOption[] = [
    { symbol: 'USD', name: 'US Dollar', isFiat: true },
    { symbol: 'EUR', name: 'Euro', isFiat: true },
    { symbol: 'GBP', name: 'British Pound', isFiat: true },
    { symbol: 'JPY', name: 'Japanese Yen', isFiat: true },
  ]

  const cryptoCurrencies: CurrencyOption[] = [
    { symbol: 'BTC', name: 'Bitcoin', image: '/assets/crypto/BTC.svg' },
    { symbol: 'ETH', name: 'Ethereum', image: '/assets/crypto/ETH.svg' },
    { symbol: 'SOL', name: 'Solana', image: '/assets/crypto/SOL.svg' },
    { symbol: 'ADA', name: 'Cardano', image: '/assets/crypto/ADA.svg' },
    { symbol: 'MATIC', name: 'Polygon', image: '/assets/crypto/MATIC.svg' },
    { symbol: 'DOT', name: 'Polkadot', image: '/assets/crypto/DOT.svg' },
    { symbol: 'LINK', name: 'Chainlink', image: '/assets/crypto/LINK.svg' },
    { symbol: 'UNI', name: 'Uniswap', image: '/assets/crypto/UNI.svg' },
    { symbol: 'AVAX', name: 'Avalanche', image: '/assets/crypto/AVAX.svg' },
    { symbol: 'LTC', name: 'Litecoin', image: '/assets/crypto/LTC.svg' },
  ]

  useEffect(() => {
    const loadCryptoData = async () => {
      try {
        const data = await fetchTopCryptos(10)
        setCryptos(data)
        
        // Update crypto currencies with live data
        cryptoCurrencies.forEach(crypto => {
          const liveData = data.find(d => d.symbol.toUpperCase() === crypto.symbol)
          if (liveData) {
            crypto.price = liveData.current_price
            crypto.change = liveData.price_change_percentage_24h
          }
        })
      } catch (error) {
        console.error('Failed to load crypto data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCryptoData()
  }, [])

  const currentCrypto = cryptos.find(c => c.symbol.toUpperCase() === toCurrency) || 
    { current_price: 67420.50, price_change_percentage_24h: 3.21 }
  
  const estimatedAmount = parseFloat(amount) / (currentCrypto?.current_price || 67420.50)

  const getFromCurrencies = () => {
    if (activeTab === 'buy') return fiatCurrencies
    if (activeTab === 'sell') return cryptoCurrencies
    return [...fiatCurrencies, ...cryptoCurrencies]
  }

  const getToCurrencies = () => {
    if (activeTab === 'buy') return cryptoCurrencies
    if (activeTab === 'sell') return fiatCurrencies
    return [...fiatCurrencies, ...cryptoCurrencies]
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const CurrencySelector = ({ 
    isOpen, 
    onToggle, 
    selectedCurrency, 
    onSelect, 
    currencies, 
    label 
  }: {
    isOpen: boolean
    onToggle: () => void
    selectedCurrency: string
    onSelect: (currency: string) => void
    currencies: CurrencyOption[]
    label: string
  }) => {
    const selected = currencies.find(c => c.symbol === selectedCurrency) || currencies[0]
    
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full bg-background/60 border border-border/40 rounded-xl px-4 py-3 hover:bg-background/80 hover:border-border/60 transition-all min-w-[140px] group"
        >
          <div className="flex items-center space-x-3">
            {selected?.image ? (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-background flex items-center justify-center">
                <Image
                  src={selected.image}
                  alt={selected.symbol}
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {selected?.symbol.slice(0, 2)}
              </div>
            )}
            <span className="font-semibold">{selected?.symbol}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border/40 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border/30">
                {label}
              </div>
              {currencies.map((currency) => (
                <button
                  key={currency.symbol}
                  onClick={() => {
                    onSelect(currency.symbol)
                    onToggle()
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 hover:bg-accent/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {currency.image ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-background flex items-center justify-center">
                        <Image
                          src={currency.image}
                          alt={currency.symbol}
                          width={24}
                          height={24}
                          className="w-5 h-5"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {currency.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-medium">{currency.symbol}</div>
                      <div className="text-xs text-muted-foreground">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {currency.price && (
                      <div className="text-sm font-medium">
                        ${currency.price.toLocaleString()}
                      </div>
                    )}
                    {currency.change !== undefined && (
                      <div className={`text-xs ${currency.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}%
                      </div>
                    )}
                    {selectedCurrency === currency.symbol && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto lg:max-w-none">
      <Card className="bg-background/80 backdrop-blur-xl border border-border/30 shadow-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Enhanced Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">Trade Instantly</h3>
            <p className="text-sm text-muted-foreground">Buy, sell, and exchange crypto with ease</p>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex bg-muted/30 rounded-xl p-1.5 backdrop-blur-sm">
            {['buy', 'sell', 'exchange'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-md transform scale-[0.98]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/30'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Enhanced Currency Exchange Interface */}
          <div className="space-y-4 relative">
            {/* From Currency */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-muted-foreground">
                You Pay
              </label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background/60 border border-border/40 rounded-xl px-4 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <CurrencySelector
                  isOpen={showFromDropdown}
                  onToggle={() => {
                    setShowFromDropdown(!showFromDropdown)
                    setShowToDropdown(false)
                  }}
                  selectedCurrency={fromCurrency}
                  onSelect={setFromCurrency}
                  currencies={getFromCurrencies()}
                  label="From Currency"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button 
                onClick={swapCurrencies}
                className="p-3 rounded-full bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                <ArrowUpDown className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* To Currency */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-muted-foreground">
                You Get
              </label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={estimatedAmount.toFixed(6)}
                    readOnly
                    className="w-full bg-muted/30 border border-border/30 rounded-xl px-4 py-4 text-lg font-semibold text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <CurrencySelector
                  isOpen={showToDropdown}
                  onToggle={() => {
                    setShowToDropdown(!showToDropdown)
                    setShowFromDropdown(false)
                  }}
                  selectedCurrency={toCurrency}
                  onSelect={setToCurrency}
                  currencies={getToCurrencies()}
                  label="To Currency"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Exchange Info */}
          <div className="bg-muted/20 rounded-xl p-4 space-y-3 border border-border/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <div className="text-right">
                <div className="font-semibold">
                  1 {toCurrency} = ${(currentCrypto?.current_price || 67420.50).toLocaleString()}
                </div>
                <div className={`text-xs flex items-center justify-end space-x-1 ${
                  (currentCrypto?.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {(currentCrypto?.price_change_percentage_24h || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {(currentCrypto?.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                    {(currentCrypto?.price_change_percentage_24h || 0).toFixed(2)}% (24h)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network Fee</span>
              <span className="font-medium text-sm">~$2.50</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Processing Time</span>
              <span className="font-medium text-sm">~2 minutes</span>
            </div>
          </div>

          {/* Enhanced Action Button */}
          <Button className="w-full gradient-bg py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            {activeTab === 'buy' ? 'Buy Now' : activeTab === 'sell' ? 'Sell Now' : 'Exchange Now'}
          </Button>

          {/* Enhanced Disclaimer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Prices update in real-time • Secure & regulated
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Market Data</span>
              </span>
              <span>•</span>
              <span>SSL Encrypted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 