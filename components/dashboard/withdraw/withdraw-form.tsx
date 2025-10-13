"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowDownLeft, Wallet, CreditCard, Building, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

const withdrawalMethods = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Withdraw to external wallet',
    icon: Wallet,
    fee: '0.0005 BTC',
    time: '10-30 minutes',
    available: true
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Direct to bank account',
    icon: Building,
    fee: '$5.00',
    time: '1-3 business days',
    available: true
  },
  {
    id: 'card',
    name: 'Debit Card',
    description: 'Instant to your card',
    icon: CreditCard,
    fee: '2.5%',
    time: 'Instant',
    available: false
  }
]

const cryptoOptions = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 2.45689, icon: '/assets/crypto/BTC.svg' },
  { symbol: 'ETH', name: 'Ethereum', balance: 12.8905, icon: '/assets/crypto/ETH.svg' },
  { symbol: 'SOL', name: 'Solana', balance: 245.67, icon: '/assets/crypto/SOL.svg' },
  { symbol: 'ADA', name: 'Cardano', balance: 8940.25, icon: '/assets/crypto/ADA.svg' }
]

export function WithdrawForm() {
  const [selectedMethod, setSelectedMethod] = useState('crypto')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [taxCodePin, setTaxCodePin] = useState('')
  const [withdrawalPin, setWithdrawalPin] = useState('')
  const [waitingForTaxPin, setWaitingForTaxPin] = useState(false)
  const [waitingForWithdrawalPin, setWaitingForWithdrawalPin] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState('form') // 'form', 'processing', 'success'

  const selectedCryptoData = cryptoOptions.find(crypto => crypto.symbol === selectedCrypto)

  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Stop at 80% if waiting for tax PIN
        if (prevProgress >= 80 && !taxCodePin) {
          setProgressMessage('Tax verification required')
          setWaitingForTaxPin(true)
          return 80
        }
        
        // Stop at 90% if waiting for withdrawal PIN
        if (prevProgress >= 90 && !withdrawalPin) {
          setProgressMessage('Final authorization required')
          setWaitingForWithdrawalPin(true)
          return 90
        }
        
        // Complete at 100%
        if (prevProgress >= 100) {
          setProgressMessage('Withdrawal completed successfully!')
          setCurrentStep('success')
          setShowSuccess(true)
          clearInterval(interval)
          return 100
        }

        // Normal progress increment
        const newProgress = prevProgress + 0.8
        
        // Update messages based on progress
        if (newProgress < 50) {
          setProgressMessage('Initializing withdrawal...')
        } else if (newProgress >= 50 && newProgress < 80) {
          setProgressMessage('Validating transaction details...')
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isProcessing, taxCodePin, withdrawalPin])

  const handleTaxPinSubmit = () => {
    if (taxCodePin.length === 6) {
      setWaitingForTaxPin(false)
      setProgressMessage('Processing tax verification...')
      // Continue progress from 80% to 90%
      setTimeout(() => {
        setProgress(85)
      }, 500)
    }
  }

  const handleWithdrawalPinSubmit = () => {
    if (withdrawalPin.length === 6) {
      setWaitingForWithdrawalPin(false)
      setProgressMessage('Finalizing withdrawal...')
      // Continue to completion
      setTimeout(() => {
        setProgress(95)
      }, 500)
    }
  }

  const initiateWithdrawal = () => {
    if (!amount || !address) return
    
    setCurrentStep('processing')
    setIsProcessing(true)
    setProgress(0)
    setProgressMessage('Starting withdrawal process...')
  }

  const resetForm = () => {
    setCurrentStep('form')
    setIsProcessing(false)
    setProgress(0)
    setProgressMessage('')
    setTaxCodePin('')
    setWithdrawalPin('')
    setWaitingForTaxPin(false)
    setWaitingForWithdrawalPin(false)
    setShowSuccess(false)
    setAmount('')
    setAddress('')
  }

  if (currentStep === 'success') {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Withdrawal Successful!</h3>
            <p className="text-muted-foreground">
              Your withdrawal of {amount} {selectedCrypto} has been processed successfully.
            </p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{amount} {selectedCrypto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-mono text-xs">{address.slice(0, 8)}...{address.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                Processing
              </Badge>
            </div>
          </div>
          <Button onClick={resetForm} className="w-full">
            Make Another Withdrawal
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === 'processing') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowDownLeft className="w-5 h-5" />
            <span>Processing Withdrawal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">{progressMessage}</p>
          </div>

          {/* Tax Code PIN Input */}
          {waitingForTaxPin && (
            <div className="space-y-4 p-4 border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800 dark:text-orange-400">Tax Verification Required</h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Please enter your 6-digit tax code PIN to continue
              </p>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Enter tax code PIN"
                  value={taxCodePin}
                  onChange={(e) => setTaxCodePin(e.target.value)}
                  maxLength={6}
                  className="flex-1"
                />
                <Button 
                  onClick={handleTaxPinSubmit}
                  disabled={taxCodePin.length !== 6}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

          {/* Withdrawal PIN Input */}
          {waitingForWithdrawalPin && (
            <div className="space-y-4 p-4 border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-400">Final Authorization Required</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Please enter your 6-digit withdrawal PIN to authorize this transaction
              </p>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Enter withdrawal PIN"
                  value={withdrawalPin}
                  onChange={(e) => setWithdrawalPin(e.target.value)}
                  maxLength={6}
                  className="flex-1"
                />
                <Button 
                  onClick={handleWithdrawalPinSubmit}
                  disabled={withdrawalPin.length !== 6}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Authorize
                </Button>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{amount} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-mono text-xs">{address.slice(0, 8)}...{address.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Fee:</span>
                <span className="font-medium">0.0005 {selectedCrypto}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowDownLeft className="w-5 h-5" />
          <span>Withdraw Funds</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Withdrawal Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Withdrawal Method</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {withdrawalMethods.map((method) => (
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
                {!method.available && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Coming Soon
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedMethod === 'crypto' && (
          <>
            {/* Cryptocurrency Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Cryptocurrency</label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={crypto.icon}
                          alt={crypto.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <div>
                          <span className="font-medium">{crypto.symbol}</span>
                          <span className="text-muted-foreground ml-2">
                            Balance: {crypto.balance}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Amount</label>
                <span className="text-sm text-muted-foreground">
                  Available: {selectedCryptoData?.balance} {selectedCrypto}
                </span>
              </div>
              <div className="relative">
                <Input
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {selectedCrypto}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(selectedCryptoData ? (selectedCryptoData.balance * 0.25).toString() : '')}
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(selectedCryptoData ? (selectedCryptoData.balance * 0.5).toString() : '')}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(selectedCryptoData ? (selectedCryptoData.balance * 0.75).toString() : '')}
                >
                  75%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(selectedCryptoData?.balance.toString() || '')}
                >
                  Max
                </Button>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Wallet Address</label>
              <Input
                placeholder="Enter your wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Transaction Summary */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm">Transaction Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{amount || '0.00'} {selectedCrypto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Fee:</span>
              <span className="font-medium">0.0005 {selectedCrypto}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium">You'll Receive:</span>
              <span className="font-semibold">
                {amount ? (parseFloat(amount) - 0.0005).toFixed(8) : '0.00'} {selectedCrypto}
              </span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full" 
          disabled={!amount || !address}
          onClick={initiateWithdrawal}
        >
          Initiate Withdrawal
        </Button>
      </CardContent>
    </Card>
  )
}