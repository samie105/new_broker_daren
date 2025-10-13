"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, TrendingUp, Zap } from 'lucide-react'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getCryptosBySymbols, type CryptoData } from '@/lib/crypto-actions'

const exchangeCryptos = ['BTC', 'ETH', 'SOL', 'ADA', 'USDT', 'USDC', 'MATIC', 'LINK']

export function ExchangeSection() {
  const [fromCrypto, setFromCrypto] = useState('BTC')
  const [toCrypto, setToCrypto] = useState('ETH')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [cryptoOptions, setCryptoOptions] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)

  const fromCryptoData = cryptoOptions.find(c => c.symbol.toUpperCase() === fromCrypto)
  const toCryptoData = cryptoOptions.find(c => c.symbol.toUpperCase() === toCrypto)

  const fetchCryptoData = async () => {
    try {
      const data = await getCryptosBySymbols(exchangeCryptos)
      setCryptoOptions(data)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
  }, [])

  const handleSwap = () => {
    setFromCrypto(toCrypto)
    setToCrypto(fromCrypto)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const calculateExchange = (amount: string) => {
    if (!amount || !fromCryptoData || !toCryptoData) return ''
    const fromValue = parseFloat(amount) * fromCryptoData.current_price
    const toValue = fromValue / toCryptoData.current_price
    return toValue.toFixed(6)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    setToAmount(calculateExchange(value))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Quick Exchange</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Zap className="w-4 h-4 mr-1" />
            Instant
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-16 mb-2"></div>
              <div className="flex space-x-2">
                <div className="w-32 h-10 bg-muted rounded"></div>
                <div className="flex-1 h-10 bg-muted rounded"></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-16 mb-2"></div>
              <div className="flex space-x-2">
                <div className="w-32 h-10 bg-muted rounded"></div>
                <div className="flex-1 h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* From Section */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="flex space-x-2">
                <Select value={fromCrypto} onValueChange={setFromCrypto}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol.toUpperCase()}>
                        <div className="flex items-center space-x-2">
                          <div className="relative w-5 h-5">
                            <Image
                              src={crypto.localIcon || `/assets/crypto/${crypto.symbol.toUpperCase()}.svg`}
                              alt={crypto.name}
                              fill
                              className="rounded-full object-contain"
                            />
                          </div>
                          <span>{crypto.symbol.toUpperCase()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1"
                />
              </div>
              {fromCryptoData && fromAmount && (
                <div className="text-xs text-muted-foreground">
                  ≈ ${(parseFloat(fromAmount) * fromCryptoData.current_price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="rounded-full w-10 h-10 p-0"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Section */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">To</div>
              <div className="flex space-x-2">
                <Select value={toCrypto} onValueChange={setToCrypto}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol.toUpperCase()}>
                        <div className="flex items-center space-x-2">
                          <div className="relative w-5 h-5">
                            <Image
                              src={crypto.localIcon || `/assets/crypto/${crypto.symbol.toUpperCase()}.svg`}
                              alt={crypto.name}
                              fill
                              className="rounded-full object-contain"
                            />
                          </div>
                          <span>{crypto.symbol.toUpperCase()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="flex-1 bg-muted/50"
                />
              </div>
              {toCryptoData && toAmount && (
                <div className="text-xs text-muted-foreground">
                  ≈ ${(parseFloat(toAmount) * toCryptoData.current_price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Exchange Rate */}
            {fromCryptoData && toCryptoData && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    <span>1 {fromCrypto} = {(fromCryptoData.current_price / toCryptoData.current_price).toFixed(6)} {toCrypto}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Exchange Button */}
            <Button className="w-full" disabled={!fromAmount || !toAmount}>
              Exchange {fromCrypto} to {toCrypto}
            </Button>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => handleFromAmountChange('0.1')}>
                0.1
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFromAmountChange('0.5')}>
                0.5
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFromAmountChange('1.0')}>
                1.0
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 