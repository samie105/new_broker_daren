'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react'
import { createContactAction, updateContactAction, deleteContactAction } from '@/server/actions/admin/support'
import { toast } from 'sonner'

interface Contact {
  id: string
  type: string
  label: string
  value: string
  icon: string
  is_active: boolean
  order_index: number
}

interface ContactsManagementProps {
  contacts: Contact[]
}

export function ContactsManagement({ contacts }: ContactsManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [type, setType] = useState('email')
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [icon, setIcon] = useState('📧')
  const [orderIndex, setOrderIndex] = useState('0')
  const [loading, setLoading] = useState(false)

  const contactTypes = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'phone', label: 'Phone', icon: '📞' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { value: 'telegram', label: 'Telegram', icon: '✈️' },
    { value: 'live_chat', label: 'Live Chat', icon: '💭' },
  ]

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact)
      setType(contact.type)
      setLabel(contact.label)
      setValue(contact.value)
      setIcon(contact.icon || '📧')
      setOrderIndex(contact.order_index.toString())
    } else {
      setEditingContact(null)
      setType('email')
      setLabel('')
      setValue('')
      setIcon('📧')
      setOrderIndex('0')
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!label.trim() || !value.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    let result
    if (editingContact) {
      result = await updateContactAction(editingContact.id, {
        type,
        label,
        value,
        icon,
        order_index: parseInt(orderIndex),
      })
    } else {
      result = await createContactAction({
        type,
        label,
        value,
        icon,
        order_index: parseInt(orderIndex),
      })
    }

    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setDialogOpen(false)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    setLoading(true)
    const result = await deleteContactAction(id)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleToggleActive = async (contact: Contact) => {
    setLoading(true)
    const result = await updateContactAction(contact.id, {
      is_active: !contact.is_active,
    })
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {contacts.length} contact method{contacts.length !== 1 && 's'}
        </p>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No contacts found
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.order_index}</TableCell>
                  <TableCell className="text-2xl">{contact.icon}</TableCell>
                  <TableCell className="font-medium">{contact.label}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {contact.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.value}</TableCell>
                  <TableCell>
                    {contact.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(contact)}
                        disabled={loading}
                      >
                        {contact.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(contact)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(contact.id)}
                        disabled={loading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(val) => {
                setType(val)
                const selectedType = contactTypes.find(t => t.value === val)
                if (selectedType) setIcon(selectedType.icon)
              }}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contactTypes.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value}>
                      {ct.icon} {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Email Support"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Value</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., support@example.com"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon (Emoji)</Label>
                <Input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="📧"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  placeholder="0"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Contact'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
