"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, QrCode, ArrowUpRight, CreditCard, Building, Wallet, Users, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { getCryptoDepositMethodsAction, getP2PDepositMethodsAction, getBankTransferInfoAction } from '@/server/actions/deposits'

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
    id: 'p2p-bank',
    name: 'P2P & Bank Transfer',
    description: 'Peer-to-peer or bank transfer',
    icon: Users,
    fee: 'Free',
    time: 'Varies',
    available: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Instant deposit',
    icon: CreditCard,
    fee: '2.5%',
    time: 'Instant',
    available: false
  }
]

const cryptoOptions = [
  { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', icon: '/assets/crypto/BTC.svg' },
  { symbol: 'ETH', name: 'Ethereum', address: '0x742d35Cc6634C0532925a3b8D3Ac92E5F7C1c83E', icon: '/assets/crypto/ETH.svg' },
  { symbol: 'SOL', name: 'Solana', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', icon: '/assets/crypto/SOL.svg' },
  { symbol: 'USDT', name: 'Tether', address: '0x742d35Cc6634C0532925a3b8D3Ac92E5F7C1c83E', icon: '/assets/crypto/USDT.svg' }
]

const p2pProviders = [
  { id: 'cashapp', name: 'Cash App', icon: '/assets/payment/cashapp.png' },
  { id: 'venmo', name: 'Venmo', icon: '/assets/payment/venmo.png' },
  { id: 'zelle', name: 'Zelle', icon: '/assets/payment/zelle.png' },
  { id: 'paypal', name: 'PayPal', icon: '/assets/payment/paypal.png' }
]

export function DepositMethods() {
  const [selectedMethod, setSelectedMethod] = useState('crypto')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [selectedP2PProvider, setSelectedP2PProvider] = useState('cashapp')
  const [selectedBankId, setSelectedBankId] = useState('')
  const [copied, setCopied] = useState(false)
  const [p2pUserId] = useState('USER-' + Math.random().toString(36).substr(2, 9).toUpperCase())
  const [activeTab, setActiveTab] = useState<'p2p' | 'bank'>('p2p')
  
  // Real data from database
  const [cryptoMethods, setCryptoMethods] = useState<any[]>([])
  const [p2pMethods, setP2PMethods] = useState<any[]>([])
  const [bankTransferInfo, setBankTransferInfo] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const selectedCryptoData = cryptoMethods.find(crypto => crypto.symbol === selectedCrypto) || cryptoOptions.find(crypto => crypto.symbol === selectedCrypto)
  const selectedProviderData = p2pMethods.find(provider => provider.id === selectedP2PProvider) || p2pProviders.find(provider => provider.id === selectedP2PProvider)
  const selectedBankData = bankTransferInfo.find(bank => bank.id === selectedBankId)

  // Fetch deposit methods from database
  useEffect(() => {
    const fetchDepositMethods = async () => {
      setLoading(true)
      try {
        const [cryptoResponse, p2pResponse, bankResponse] = await Promise.all([
          getCryptoDepositMethodsAction(),
          getP2PDepositMethodsAction(),
          getBankTransferInfoAction()
        ])

        if (cryptoResponse.success && cryptoResponse.data) {
          setCryptoMethods(cryptoResponse.data)
          if (cryptoResponse.data.length > 0) {
            setSelectedCrypto(cryptoResponse.data[0].symbol)
          }
        }

        if (p2pResponse.success && p2pResponse.data) {
          setP2PMethods(p2pResponse.data)
          if (p2pResponse.data.length > 0) {
            setSelectedP2PProvider(p2pResponse.data[0].id)
          }
        }

        if (bankResponse.success && bankResponse.data) {
          setBankTransferInfo(bankResponse.data)
          if (bankResponse.data.length > 0) {
            setSelectedBankId(bankResponse.data[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching deposit methods:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepositMethods()
  }, [])

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
              <div
                key={method.id}
                onClick={() => method.available && setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : method.available
                    ? 'border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer'
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
              </div>
            ))}
          </div>
        </div>

        {selectedMethod === 'crypto' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : cryptoMethods.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cryptocurrency deposit methods available</p>
              </div>
            ) : (
              <>
                {/* Cryptocurrency Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Cryptocurrency</label>
                  <div className="grid grid-cols-2 gap-3">
                    {cryptoMethods.map((crypto) => (
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
                      <li>• Network: {selectedCryptoData.network}</li>
                      <li>• Minimum deposit: {selectedCryptoData.min_deposit} {selectedCryptoData.symbol}</li>
                      <li>• Deposits require {selectedCryptoData.confirmations_required} network confirmations</li>
                      <li>• Do not send from smart contracts</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
              </>
            )}
          </>
        )}

        {selectedMethod === 'p2p-bank' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tab Selection */}
                <div className="flex space-x-2 p-1 bg-muted/50 rounded-xl">
                  <button
                    onClick={() => setActiveTab('p2p')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === 'p2p'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    P2P Transfer
                  </button>
                  <button
                    onClick={() => setActiveTab('bank')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === 'bank'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Building className="w-4 h-4 inline mr-2" />
                    Bank Transfer
                  </button>
                </div>

                {/* P2P Content */}
                {activeTab === 'p2p' && (
                  <>
                    {p2pMethods.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No P2P payment methods available</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* P2P Provider Selection */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Select Payment Provider</label>
                          <div className="grid grid-cols-2 gap-3">
                            {p2pMethods.map((provider) => (
                              <button
                                key={provider.id}
                                onClick={() => setSelectedP2PProvider(provider.id)}
                                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                                  selectedP2PProvider === provider.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Image
                                    src={provider.icon}
                                    alt={provider.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <div>
                                    <div className="font-semibold text-sm">{provider.name}</div>
                                    <div className="text-xs text-muted-foreground">Instant transfer</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected Provider Details */}
                        {selectedProviderData && (
                          <div className="bg-muted/50 rounded-xl p-6 border">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-100 rounded-xl mb-4">
                                <Image
                                  src={selectedProviderData.icon}
                                  alt={selectedProviderData.name}
                                  width={72}
                                  height={72}
                                  className="object-contain"
                                />
                              </div>
                              <h3 className="font-semibold text-lg mb-2">
                                {selectedProviderData.name} Transfer
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Share your user ID with the sender to receive funds via {selectedProviderData.name}
                              </p>
                            </div>

                            {/* QR Code Display */}
                            <div className="flex justify-center mb-6">
                              <div className="bg-white dark:bg-white p-6 rounded-xl">
                                <QRCodeSVG
                                  value={`p2p:${selectedP2PProvider}:${p2pUserId}`}
                                  size={200}
                                  level="H"
                                  includeMargin={true}
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
                                    How to receive funds via {selectedProviderData.name}:
                                  </div>
                                  <ol className="text-blue-700 dark:text-blue-300 space-y-1 text-xs pl-4 list-decimal">
                                    <li>{selectedProviderData.instructions}</li>
                                    <li>Funds will be credited instantly to your account</li>
                                    <li>Check your transaction history for confirmation</li>
                                  </ol>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Bank Transfer Content */}
                {activeTab === 'bank' && (
                  <>
                    {bankTransferInfo.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No bank transfer information available</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Bank Selection */}
                        {bankTransferInfo.length > 1 && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Select Bank</label>
                            <div className="grid grid-cols-1 gap-3">
                              {bankTransferInfo.map((bank) => (
                                <button
                                  key={bank.id}
                                  onClick={() => setSelectedBankId(bank.id)}
                                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                                    selectedBankId === bank.id
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    {bank.icon && (
                                      <Image
                                        src={bank.icon}
                                        alt={bank.bank_name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                      />
                                    )}
                                    <div>
                                      <div className="font-semibold text-sm">{bank.bank_name}</div>
                                      <div className="text-xs text-muted-foreground">{bank.account_name}</div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Selected Bank Details */}
                        {selectedBankData && (
                          <div className="bg-muted/50 rounded-xl p-6 border">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-xl mb-4">
                                <Building className="w-10 h-10 text-primary" />
                              </div>
                              <h3 className="font-semibold text-lg mb-2">
                                Bank Transfer Details
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Use the following bank details to transfer funds
                              </p>
                            </div>

                            {/* Bank Details */}
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Bank Name</label>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 p-3 bg-background rounded-xl border">
                                    <code className="text-sm font-semibold">{selectedBankData.bank_name}</code>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(selectedBankData.bank_name)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Account Name</label>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 p-3 bg-background rounded-xl border">
                                    <code className="text-sm font-semibold">{selectedBankData.account_name}</code>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(selectedBankData.account_name)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Account Number</label>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 p-3 bg-background rounded-xl border">
                                    <code className="text-sm font-semibold">{selectedBankData.account_number}</code>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(selectedBankData.account_number)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {selectedBankData.routing_number && (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Routing Number</label>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-background rounded-xl border">
                                      <code className="text-sm font-semibold">{selectedBankData.routing_number}</code>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(selectedBankData.routing_number)}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedBankData.swift_code && (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">SWIFT Code</label>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-background rounded-xl border">
                                      <code className="text-sm font-semibold">{selectedBankData.swift_code}</code>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(selectedBankData.swift_code)}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedBankData.iban && (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">IBAN</label>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-background rounded-xl border">
                                      <code className="text-sm font-semibold break-all">{selectedBankData.iban}</code>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(selectedBankData.iban)}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedBankData.bank_address && (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Bank Address</label>
                                  <div className="p-3 bg-background rounded-xl border">
                                    <p className="text-sm">{selectedBankData.bank_address}</p>
                                  </div>
                                </div>
                              )}

                              {/* Instructions */}
                              {selectedBankData.instructions && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mt-4">
                                  <div className="text-sm space-y-2">
                                    <div className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2">
                                      <ArrowUpRight className="w-4 h-4" />
                                      Instructions:
                                    </div>
                                    <p className="text-blue-700 dark:text-blue-300 text-xs">
                                      {selectedBankData.instructions}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Card Deposit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Instant deposit with your credit or debit card
              </p>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}