"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, QrCode, ArrowUpRight, CreditCard, Building, Wallet, Users } from 'lucide-react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'

const depositMethods = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Deposit from external wallet',
    icon: Wallet,
    fee: 'Network fees only',
    time: '10-30 minutes',
    available: true
  },
  {
    id: 'p2p',
    name: 'P2P Transfer',
    description: 'Peer-to-peer instant transfer',
    icon: Users,
    fee: 'Free',
    time: 'Instant',
    available: true
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Wire transfer or ACH',
    icon: Building,
    fee: 'Free',
    time: '1-3 business days',
    available: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Instant deposit',
    icon: CreditCard,
    fee: '2.5%',
    time: 'Instant',
    available: true
  }
]

const cryptoOptions = [
  { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', icon: '/assets/crypto/BTC.svg' },
  { symbol: 'ETH', name: 'Ethereum', address: '0x742d35Cc6634C0532925a3b8D3Ac92E5F7C1c83E', icon: '/assets/crypto/ETH.svg' },
  { symbol: 'SOL', name: 'Solana', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', icon: '/assets/crypto/SOL.svg' },
  { symbol: 'USDT', name: 'Tether', address: '0x742d35Cc6634C0532925a3b8D3Ac92E5F7C1c83E', icon: '/assets/crypto/USDT.svg' }
]

export function DepositMethods() {
  const [selectedMethod, setSelectedMethod] = useState('crypto')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [copied, setCopied] = useState(false)
  const [p2pUserId] = useState('USER-' + Math.random().toString(36).substr(2, 9).toUpperCase())

  const selectedCryptoData = cryptoOptions.find(crypto => crypto.symbol === selectedCrypto)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpRight className="w-5 h-5" />
          <span>Deposit Funds</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deposit Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Deposit Method</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {depositMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                disabled={!method.available}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : method.available
                    ? 'border-border hover:border-primary/50 hover:bg-muted/50'
                    : 'border-border/50 bg-muted/30 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedMethod === method.id ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <method.icon className={`w-4 h-4 ${
                      selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{method.name}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="font-medium">{method.fee}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{method.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedMethod === 'crypto' && (
          <>
            {/* Cryptocurrency Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Cryptocurrency</label>
              <div className="grid grid-cols-2 gap-3">
                {cryptoOptions.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedCrypto === crypto.symbol
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={crypto.icon}
                        alt={crypto.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-sm">{crypto.symbol}</div>
                        <div className="text-xs text-muted-foreground">{crypto.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Address */}
            {selectedCryptoData && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted/50 rounded-xl">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white dark:bg-white p-4 rounded-xl">
                      <QRCodeSVG
                        value={selectedCryptoData.address}
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Send only {selectedCryptoData.symbol} to this address
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deposit Address</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-muted/50 rounded-xl border">
                      <code className="text-sm break-all">{selectedCryptoData.address}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedCryptoData.address)}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4">
                  <div className="text-sm space-y-1">
                    <div className="font-semibold text-yellow-800 dark:text-yellow-400">Important:</div>
                    <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-xs">
                      <li>• Only send {selectedCryptoData.symbol} to this address</li>
                      <li>• Minimum deposit: 0.001 {selectedCryptoData.symbol}</li>
                      <li>• Deposits require 2 network confirmations</li>
                      <li>• Do not send from smart contracts</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {selectedMethod === 'p2p' && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-6 border">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">P2P Transfer</h3>
                <p className="text-sm text-muted-foreground">
                  Share your user ID or QR code with another user to receive funds instantly
                </p>
              </div>

              {/* QR Code Display */}
              <div className="flex justify-center mb-6">
                <div className="bg-white dark:bg-white p-6 rounded-xl">
                  <QRCodeSVG
                    value={`p2p:${p2pUserId}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/assets/crypto/BTC.svg",
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              {/* User ID Display */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your P2P User ID</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-4 bg-background rounded-xl border border-border">
                      <code className="text-base font-mono font-semibold tracking-wider">
                        {p2pUserId}
                      </code>
                    </div>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => copyToClipboard(p2pUserId)}
                      className="h-14"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
                  <div className="text-sm space-y-2">
                    <div className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4" />
                      How to receive funds via P2P:
                    </div>
                    <ol className="text-blue-700 dark:text-blue-300 space-y-1 text-xs pl-4 list-decimal">
                      <li>Share your User ID or QR code with the sender</li>
                      <li>Sender enters your ID in their withdrawal/transfer section</li>
                      <li>Funds will be credited instantly to your account</li>
                      <li>Check your transaction history for confirmation</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'bank' && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Bank Transfer Instructions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use the following details to send a wire transfer to your account
              </p>
              <Button>Get Bank Details</Button>
            </div>
          </div>
        )}

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Card Deposit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Instant deposit with your credit or debit card
              </p>
              <Button>Add Payment Method</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}