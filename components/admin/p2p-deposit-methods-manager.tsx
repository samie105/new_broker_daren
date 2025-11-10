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
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react'
import { 
  updateP2PDepositMethodAction, 
  addP2PDepositMethodAction, 
  deleteP2PDepositMethodAction 
} from '@/server/actions/admin/deposit-settings'
import { toast } from 'sonner'

const P2P_OPTIONS = [
  { id: 'cashapp', name: 'Cash App', icon: '💵' },
  { id: 'venmo', name: 'Venmo', icon: '💳' },
  { id: 'zelle', name: 'Zelle', icon: '⚡' },
  { id: 'paypal', name: 'PayPal', icon: '💰' },
  { id: 'applepay', name: 'Apple Pay', icon: '🍎' },
  { id: 'googlepay', name: 'Google Pay', icon: '🔵' },
  { id: 'skrill', name: 'Skrill', icon: '💸' },
  { id: 'neteller', name: 'Neteller', icon: '🌐' },
  { id: 'revolut', name: 'Revolut', icon: '🔷' },
  { id: 'wise', name: 'Wise', icon: '🌍' },
  { id: 'wechat', name: 'WeChat Pay', icon: '💬' },
  { id: 'alipay', name: 'Alipay', icon: '🅰️' },
]

interface P2PMethod {
  id: string
  name: string
  icon: string
  username: string
  account_id: string
  is_active: boolean
  instructions: string
}

interface P2PDepositMethodsManagerProps {
  methods: P2PMethod[]
}

export function P2PDepositMethodsManager({ methods: initialMethods }: P2PDepositMethodsManagerProps) {
  const [methods, setMethods] = useState<P2PMethod[]>(initialMethods)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<P2PMethod | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [username, setUsername] = useState('')
  const [accountId, setAccountId] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleP2PSelect = (selectedId: string) => {
    const p2p = P2P_OPTIONS.find(p => p.id === selectedId)
    if (p2p) {
      setId(p2p.id)
      setName(p2p.name)
      setIcon(p2p.icon)
    }
  }

  const handleOpenDialog = (method?: P2PMethod) => {
    if (method) {
      setEditingMethod(method)
      setId(method.id)
      setName(method.name)
      setIcon(method.icon)
      setUsername(method.username)
      setAccountId(method.account_id)
      setInstructions(method.instructions)
      setIsActive(method.is_active)
    } else {
      setEditingMethod(null)
      setId('')
      setName('')
      setIcon('')
      setUsername('')
      setAccountId('')
      setInstructions('')
      setIsActive(true)
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name || !username) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    const methodData = {
      id: id || name.toLowerCase().replace(/\s+/g, '_'),
      name,
      icon: icon || '/assets/payment/default.png',
      username,
      account_id: accountId,
      instructions: instructions || `Send payment to ${username} and include your User ID in the note`,
      is_active: isActive
    }

    let result
    if (editingMethod) {
      result = await updateP2PDepositMethodAction(editingMethod.id, methodData)
    } else {
      result = await addP2PDepositMethodAction(methodData)
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

  const handleToggleActive = async (method: P2PMethod) => {
    const result = await updateP2PDepositMethodAction(method.id, {
      ...method,
      is_active: !method.is_active
    })

    if (result.success) {
      toast.success(`${method.name} ${!method.is_active ? 'activated' : 'deactivated'}`)
      setMethods(methods.map(m => m.id === method.id ? result.data : m))
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this payment method?`)) return

    const result = await deleteP2PDepositMethodAction(id)

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
          <CardTitle>P2P Payment Methods</CardTitle>
          <Button onClick={() => handleOpenDialog()} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add P2P Method
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No P2P payment methods configured
                    </TableCell>
                  </TableRow>
                ) : (
                  methods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell>
                        <code className="text-sm">{method.username}</code>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{method.account_id}</span>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? `Edit ${editingMethod.name}` : 'Add P2P Payment Method'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select
                value={id}
                onValueChange={handleP2PSelect}
                disabled={!!editingMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method">
                    {id && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span>{name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {P2P_OPTIONS.map((p2p) => (
                    <SelectItem key={p2p.id} value={p2p.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p2p.icon}</span>
                        <span>{p2p.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username/Handle *</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="$CryptoVault"
                />
              </div>
              <div className="space-y-2">
                <Label>Account ID</Label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="CASH-APP-12345"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Send payment to $CryptoVault and include your User ID in the note"
                rows={3}
              />
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
