'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash, Copy, Eye, EyeOff } from 'lucide-react'
import { 
  updateCryptoDepositMethodAction, 
  addCryptoDepositMethodAction, 
  deleteCryptoDepositMethodAction 
} from '@/server/actions/admin/deposit-settings'
import { toast } from 'sonner'
import Image from 'next/image'

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '/assets/crypto/BTC.svg' },
  { symbol: 'ETH', name: 'Ethereum', icon: '/assets/crypto/ETH.svg' },
  { symbol: 'USDT', name: 'Tether', icon: '/assets/crypto/USDT.svg' },
  { symbol: 'USDC', name: 'USD Coin', icon: '/assets/crypto/USDC.svg' },
  { symbol: 'SOL', name: 'Solana', icon: '/assets/crypto/SOL.svg' },
  { symbol: 'ADA', name: 'Cardano', icon: '/assets/crypto/ADA.svg' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: '/assets/crypto/DOGE.svg' },
  { symbol: 'DOT', name: 'Polkadot', icon: '/assets/crypto/DOT.svg' },
  { symbol: 'MATIC', name: 'Polygon', icon: '/assets/crypto/MATIC.svg' },
  { symbol: 'LTC', name: 'Litecoin', icon: '/assets/crypto/LTC.svg' },
  { symbol: 'AVAX', name: 'Avalanche', icon: '/assets/crypto/AVAX.svg' },
  { symbol: 'SHIB', name: 'Shiba Inu', icon: '/assets/crypto/SHIB.svg' },
  { symbol: 'TRX', name: 'TRON', icon: '/assets/crypto/TRX.svg' },
  { symbol: 'UNI', name: 'Uniswap', icon: '/assets/crypto/UNI.svg' },
  { symbol: 'LINK', name: 'Chainlink', icon: '/assets/crypto/LINK.svg' },
  { symbol: 'XMR', name: 'Monero', icon: '/assets/crypto/XMR.svg' },
  { symbol: 'BCH', name: 'Bitcoin Cash', icon: '/assets/crypto/BCH.svg' },
  { symbol: 'XLM', name: 'Stellar', icon: '/assets/crypto/XLM.svg' },
  { symbol: 'ALGO', name: 'Algorand', icon: '/assets/crypto/ALGO.svg' },
  { symbol: 'VET', name: 'VeChain', icon: '/assets/crypto/VET.svg' },
  { symbol: 'AAVE', name: 'Aave', icon: '/assets/crypto/AAVE.svg' },
  { symbol: 'APE', name: 'ApeCoin', icon: '/assets/crypto/APE.svg' },
  { symbol: 'AXS', name: 'Axie Infinity', icon: '/assets/crypto/AXS.svg' },
  { symbol: 'CRO', name: 'Cronos', icon: '/assets/crypto/CRO.svg' },
  { symbol: 'DAI', name: 'Dai', icon: '/assets/crypto/DAI.svg' },
  { symbol: 'DASH', name: 'Dash', icon: '/assets/crypto/DASH.svg' },
  { symbol: 'ETC', name: 'Ethereum Classic', icon: '/assets/crypto/ETC.svg' },
  { symbol: 'GRT', name: 'The Graph', icon: '/assets/crypto/GRT.svg' },
  { symbol: 'MANA', name: 'Decentraland', icon: '/assets/crypto/MANA.svg' },
  { symbol: 'SUSHI', name: 'SushiSwap', icon: '/assets/crypto/SUSHI.svg' },
  { symbol: 'XTZ', name: 'Tezos', icon: '/assets/crypto/XTZ.svg' },
  { symbol: 'ZEC', name: 'Zcash', icon: '/assets/crypto/ZEC.svg' },
]

interface CryptoMethod {
  symbol: string
  name: string
  address: string
  network: string
  icon: string
  is_active: boolean
  min_deposit: number
  confirmations_required: number
}

interface CryptoDepositMethodsManagerProps {
  methods: CryptoMethod[]
}

export function CryptoDepositMethodsManager({ methods: initialMethods }: CryptoDepositMethodsManagerProps) {
  const [methods, setMethods] = useState<CryptoMethod[]>(initialMethods)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<CryptoMethod | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState('')
  const [icon, setIcon] = useState('')
  const [minDeposit, setMinDeposit] = useState('')
  const [confirmations, setConfirmations] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleCryptoSelect = (selectedSymbol: string) => {
    const crypto = CRYPTO_OPTIONS.find(c => c.symbol === selectedSymbol)
    if (crypto) {
      setSymbol(crypto.symbol)
      setName(crypto.name)
      setIcon(crypto.icon)
    }
  }

  const handleOpenDialog = (method?: CryptoMethod) => {
    if (method) {
      setEditingMethod(method)
      setSymbol(method.symbol)
      setName(method.name)
      setAddress(method.address)
      setNetwork(method.network)
      setIcon(method.icon)
      setMinDeposit(method.min_deposit.toString())
      setConfirmations(method.confirmations_required.toString())
      setIsActive(method.is_active)
    } else {
      setEditingMethod(null)
      setSymbol('')
      setName('')
      setAddress('')
      setNetwork('')
      setIcon('')
      setMinDeposit('0.001')
      setConfirmations('2')
      setIsActive(true)
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!symbol || !name || !address || !network) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    const methodData = {
      symbol,
      name,
      address,
      network,
      icon: icon || `/assets/crypto/${symbol}.svg`,
      min_deposit: parseFloat(minDeposit),
      confirmations_required: parseInt(confirmations),
      is_active: isActive
    }

    let result
    if (editingMethod) {
      result = await updateCryptoDepositMethodAction(editingMethod.symbol, methodData)
    } else {
      result = await addCryptoDepositMethodAction(methodData)
    }

    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setDialogOpen(false)
      // Refresh by updating local state
      if (editingMethod) {
        setMethods(methods.map(m => m.symbol === editingMethod.symbol ? result.data : m))
      } else {
        setMethods([...methods, result.data])
      }
    } else {
      toast.error(result.error)
    }
  }

  const handleToggleActive = async (method: CryptoMethod) => {
    const result = await updateCryptoDepositMethodAction(method.symbol, {
      ...method,
      is_active: !method.is_active
    })

    if (result.success) {
      toast.success(`${method.symbol} ${!method.is_active ? 'activated' : 'deactivated'}`)
      setMethods(methods.map(m => m.symbol === method.symbol ? result.data : m))
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (symbol: string) => {
    if (!confirm(`Are you sure you want to delete ${symbol}? This cannot be undone.`)) return

    const result = await deleteCryptoDepositMethodAction(symbol)

    if (result.success) {
      toast.success(result.message)
      setMethods(methods.filter(m => m.symbol !== symbol))
    } else {
      toast.error(result.error)
    }
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cryptocurrency Deposit Methods</CardTitle>
          <Button onClick={() => handleOpenDialog()} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Crypto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Min Deposit</TableHead>
                  <TableHead>Confirmations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No crypto deposit methods configured
                    </TableCell>
                  </TableRow>
                ) : (
                  methods.map((method) => (
                    <TableRow key={method.symbol}>
                      <TableCell className="font-bold">{method.symbol}</TableCell>
                      <TableCell>{method.name}</TableCell>
                      <TableCell>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {method.network}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs">
                            {method.address.slice(0, 8)}...{method.address.slice(-6)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress(method.address)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{method.min_deposit} {method.symbol}</TableCell>
                      <TableCell>{method.confirmations_required}</TableCell>
                      <TableCell>
                        <Badge variant={method.is_active ? 'default' : 'secondary'}>
                          {method.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(method)}
                            className="h-8 w-8 p-0"
                          >
                            {method.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(method)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(method.symbol)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? `Edit ${editingMethod.symbol}` : 'Add Cryptocurrency'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cryptocurrency *</Label>
              <Select
                value={symbol}
                onValueChange={handleCryptoSelect}
                disabled={!!editingMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency">
                    {symbol && (
                      <div className="flex items-center gap-2">
                        <Image src={icon} alt={symbol} width={20} height={20} />
                        <span>{name} ({symbol})</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {CRYPTO_OPTIONS.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center gap-2">
                        <Image src={crypto.icon} alt={crypto.symbol} width={20} height={20} />
                        <span>{crypto.name} ({crypto.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wallet Address *</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              />
            </div>

            <div className="space-y-2">
              <Label>Network *</Label>
              <Input
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                placeholder="Bitcoin"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Deposit</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(e.target.value)}
                  placeholder="0.001"
                />
              </div>
              <div className="space-y-2">
                <Label>Required Confirmations</Label>
                <Input
                  type="number"
                  value={confirmations}
                  onChange={(e) => setConfirmations(e.target.value)}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : editingMethod ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
