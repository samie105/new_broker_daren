"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { TrendingUp, TrendingDown, Copy, ExternalLink, QrCode } from 'lucide-react'
import Image from 'next/image'

interface Holding {
  symbol: string
  name: string
  amount: number
  value: number
  allocation: number
  change: number
  isPositive: boolean
  icon: string
  walletAddress: string
}

interface AssetHoldingsProps {
  holdings: Holding[]
}

export function AssetHoldings({ holdings = [] }: AssetHoldingsProps) {
  const [selectedAsset, setSelectedAsset] = useState<Holding | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  React.useEffect(() => {
    const checkMobile = () => window.innerWidth < 768
    setIsMobile(checkMobile())
    
    const handleResize = () => setIsMobile(checkMobile())

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const handleAssetClick = (asset: typeof holdings[0]) => {
    setSelectedAsset(asset)
    setIsOpen(true)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToastMessage('Address copied to clipboard!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      setToastMessage('Failed to copy address')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const truncateAddress = (address: string, maxLength: number = 20) => {
    if (address.length <= maxLength) return address
    return `${address.slice(0, maxLength)}...`
  }

  const WalletAddressContent = ({ asset }: { asset: typeof holdings[0] }) => (
    <div className="space-y-6">
      {/* Asset Info */}
      <div className="flex items-center justify-between space-x-4 p-4 bg-muted/30 rounded-xl">
      <div  className="flex items-center space-x-4">
        <div className="relative w-12 h-12">
          <Image
            src={asset.icon}
            alt={asset.name}
            fill
            className="rounded-full object-contain"
          />
        </div>
        <div>
          <div className="font-semibold text-lg">{asset.symbol}</div>
          <div className="text-sm text-muted-foreground">{asset.name}</div>
        </div></div>
        <div className="ml-auto text-right">
          <div className="font-semibold">${asset.value.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{asset.amount.toLocaleString()}</div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Wallet Address</h3>
        </div>
        
        <div className="relative p-4 bg-muted/50 rounded-xl border-2 border-dashed border-border">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm break-all flex-1 mr-3">
              {truncateAddress(asset.walletAddress)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(asset.walletAddress)}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          This is your {asset.name} wallet address. Only send {asset.symbol} to this address.
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="space-y-3">
        <h3 className="font-semibold">QR Code</h3>
        <div className="flex justify-center p-8 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <div className="text-center space-y-2">
            <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">QR Code will be generated here</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </Button>
        <Button variant="outline" className="w-full">
          Transaction History
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Holdings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Click to view wallet address</p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {holdings.map((holding, index) => (
              <button
                key={holding.symbol}
                onClick={() => handleAssetClick(holding)}
                className={`w-full p-6 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0 text-left ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${index === holdings.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Asset Info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={holding.icon}
                        alt={holding.name}
                        fill
                        className="rounded-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-base">{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                    </div>
                  </div>

                  {/* Center: Amount & Allocation */}
                  <div className="hidden sm:block text-center">
                    <div className="font-medium">{holding.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{holding.allocation}% allocation</div>
                  </div>

                  {/* Right: Value & Change */}
                  <div className="text-right">
                    <div className="font-semibold text-base">${holding.value.toLocaleString()}</div>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      {holding.isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        holding.isPositive ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {holding.isPositive ? '+' : ''}{holding.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-border/30 bg-muted/20">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Buy More
              </Button>
              <Button variant="outline" className="w-full">
                Rebalance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Dialog */}
      <Dialog open={isOpen && !isMobile} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && <WalletAddressContent asset={selectedAsset} />}
        </DialogContent>
      </Dialog>

      {/* Mobile Drawer */}
      <Drawer open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Wallet Details</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            {selectedAsset && <WalletAddressContent asset={selectedAsset} />}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}