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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash, Eye, EyeOff, Building } from 'lucide-react'
import { 
  updateBankTransferMethodAction, 
  addBankTransferMethodAction, 
  deleteBankTransferMethodAction 
} from '@/server/actions/admin/deposit-settings'
import { toast } from 'sonner'

const BANK_ICONS = [
  { value: '🏦', label: 'Generic Bank' },
  { value: '🏛️', label: 'Traditional Bank' },
  { value: '💼', label: 'Business Bank' },
  { value: '🌐', label: 'Online Bank' },
  { value: '🔷', label: 'Modern Bank' },
  { value: '🔶', label: 'Regional Bank' },
  { value: '💎', label: 'Premium Bank' },
  { value: '🏢', label: 'Corporate Bank' },
]

interface BankMethod {
  id: string
  bank_name: string
  account_name: string
  account_number: string
  routing_number?: string
  swift_code?: string
  iban?: string
  bank_address?: string
  is_active: boolean
  instructions?: string
  icon?: string
}

interface BankTransferMethodsManagerProps {
  methods: BankMethod[]
}

export function BankTransferMethodsManager({ methods: initialMethods }: BankTransferMethodsManagerProps) {
  const [methods, setMethods] = useState<BankMethod[]>(initialMethods)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<BankMethod | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [swiftCode, setSwiftCode] = useState('')
  const [iban, setIban] = useState('')
  const [bankAddress, setBankAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [icon, setIcon] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleOpenDialog = (method?: BankMethod) => {
    if (method) {
      setEditingMethod(method)
      setBankName(method.bank_name)
      setAccountName(method.account_name)
      setAccountNumber(method.account_number)
      setRoutingNumber(method.routing_number || '')
      setSwiftCode(method.swift_code || '')
      setIban(method.iban || '')
      setBankAddress(method.bank_address || '')
      setInstructions(method.instructions || '')
      setIcon(method.icon || '🏦')
      setIsActive(method.is_active)
    } else {
      setEditingMethod(null)
      setBankName('')
      setAccountName('')
      setAccountNumber('')
      setRoutingNumber('')
      setSwiftCode('')
      setIban('')
      setBankAddress('')
      setInstructions('')
      setIcon('🏦')
      setIsActive(true)
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!bankName || !accountName || !accountNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    const methodData = {
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
      routing_number: routingNumber || undefined,
      swift_code: swiftCode || undefined,
      iban: iban || undefined,
      bank_address: bankAddress || undefined,
      instructions: instructions || undefined,
      icon: icon || undefined,
      is_active: isActive
    }

    let result
    if (editingMethod) {
      result = await updateBankTransferMethodAction(editingMethod.id, methodData)
    } else {
      result = await addBankTransferMethodAction(methodData)
    }

    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setDialogOpen(false)
      if (editingMethod) {
        setMethods(methods.map(m => m.id === editingMethod.id ? result.data : m))
      } else {
        setMethods([...methods, result.data])
      }
    } else {
      toast.error(result.error)
    }
  }

  const handleToggleActive = async (method: BankMethod) => {
    const result = await updateBankTransferMethodAction(method.id, {
      ...method,
      is_active: !method.is_active
    })

    if (result.success) {
      toast.success(`${method.bank_name} ${!method.is_active ? 'activated' : 'deactivated'}`)
      setMethods(methods.map(m => m.id === method.id ? result.data : m))
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this bank account?`)) return

    const result = await deleteBankTransferMethodAction(id)

    if (result.success) {
      toast.success(result.message)
      setMethods(methods.filter(m => m.id !== id))
    } else {
      toast.error(result.error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bank Transfer Methods</CardTitle>
          <Button onClick={() => handleOpenDialog()} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Routing/SWIFT</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No bank transfer methods configured
                    </TableCell>
                  </TableRow>
                ) : (
                  methods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{method.bank_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{method.account_name}</TableCell>
                      <TableCell>
                        <code className="text-xs">{method.account_number}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {method.routing_number && <span>R: {method.routing_number}</span>}
                          {method.swift_code && <span>S: {method.swift_code}</span>}
                        </div>
                      </TableCell>
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
                            onClick={() => handleDelete(method.id)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? `Edit ${editingMethod.bank_name}` : 'Add Bank Account'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name *</Label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Chase Bank"
                />
              </div>
              <div className="space-y-2">
                <Label>Account Name *</Label>
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Atlantic Pacific Capitals LLC"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Number *</Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Routing Number</Label>
                <Input
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="021000021"
                />
              </div>
              <div className="space-y-2">
                <Label>SWIFT Code</Label>
                <Input
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  placeholder="CHASUS33"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>IBAN (Optional)</Label>
              <Input
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="GB29NWBK60161331926819"
              />
            </div>

            <div className="space-y-2">
              <Label>Bank Address</Label>
              <Textarea
                value={bankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
                placeholder="270 Park Avenue, New York, NY 10017, USA"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Please include your user ID in the transfer reference..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Bank Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select icon">
                    {icon && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span>{BANK_ICONS.find(b => b.value === icon)?.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {BANK_ICONS.map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{bank.value}</span>
                        <span>{bank.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
