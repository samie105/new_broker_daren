"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Send, ArrowUpDown, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { CountUpCurrency } from '@/components/ui/count-up'
import { getCryptosBySymbols, type CryptoData } from '@/lib/crypto-actions'

interface PortfolioHolding {
  symbol: string
  name: string
  balance: number
  avg_buy_price?: number
  icon: string
}

interface WalletBalancesProps {
  holdings: PortfolioHolding[]
}

export function WalletBalances({ holdings }: WalletBalancesProps) {
  const [balancesVisible, setBalancesVisible] = useState(true)
  const [walletData, setWalletData] = useState<Array<CryptoData & { balance: number; usdValue: number }>>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWalletData = async () => {
    try {
      setRefreshing(true)
      const symbols = holdings.map(h => h.symbol)
      const cryptoData = await getCryptosBySymbols(symbols)
      
      const walletWithValues = cryptoData.map(crypto => {
        const holding = holdings.find(h => h.symbol.toLowerCase() === crypto.symbol.toLowerCase())
        const balance = holding?.balance || 0
        const usdValue = balance * crypto.current_price
        
        return {
          ...crypto,
          balance,
          usdValue
        }
      })
      
      setWalletData(walletWithValues)
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (holdings.length > 0) {
      fetchWalletData()
    } else {
      setLoading(false)
    }
  }, [holdings])
  
  const totalValue = walletData.reduce((sum, wallet) => sum + wallet.usdValue, 0)

  const formatBalance = (balance: number, symbol: string) => {
    if (balance < 0.001) {
      return `${balance.toFixed(8)} ${symbol}`
    } else if (balance < 1) {
      return `${balance.toFixed(4)} ${symbol}`
    } else {
      return `${balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      })} ${symbol}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">My Wallets</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchWalletData}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalancesVisible(!balancesVisible)}
            >
              {balancesVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Balance</div>
          <div className="text-2xl font-bold">
            {balancesVisible ? (
              <CountUpCurrency amount={totalValue} duration={2000} />
            ) : (
              '••••••'
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div>
                    <div className="w-20 h-4 bg-muted rounded mb-1"></div>
                    <div className="w-24 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-4 bg-muted rounded mb-1"></div>
                  <div className="w-16 h-3 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {walletData.map((wallet, index) => (
              <div key={wallet.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10">
                    <Image
                      src={wallet.localIcon || `/assets/crypto/${wallet.symbol.toUpperCase()}.svg`}
                      alt={wallet.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {balancesVisible ? formatBalance(wallet.balance, wallet.symbol.toUpperCase()) : '••••••'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    {balancesVisible ? (
                      <CountUpCurrency 
                        amount={wallet.usdValue} 
                        duration={1500}
                        delay={index * 100}
                      />
                    ) : (
                      '••••••'
                    )}
                  </div>
                  <div className={`text-sm ${wallet.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {wallet.price_change_percentage_24h >= 0 ? '+' : ''}{wallet.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center justify-center">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 