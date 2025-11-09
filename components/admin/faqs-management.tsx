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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react'
import { createFaqAction, updateFaqAction, deleteFaqAction } from '@/server/actions/admin/support'
import { toast } from 'sonner'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order_index: number
  is_published: boolean
}

interface FaqsManagementProps {
  faqs: FAQ[]
}

export function FaqsManagement({ faqs }: FaqsManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('general')
  const [orderIndex, setOrderIndex] = useState('0')
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: 'account', label: 'Account' },
    { value: 'trading', label: 'Trading' },
    { value: 'deposits', label: 'Deposits' },
    { value: 'withdrawals', label: 'Withdrawals' },
    { value: 'verification', label: 'Verification' },
    { value: 'general', label: 'General' },
  ]

  const handleOpenDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq)
      setQuestion(faq.question)
      setAnswer(faq.answer)
      setCategory(faq.category)
      setOrderIndex(faq.order_index.toString())
    } else {
      setEditingFaq(null)
      setQuestion('')
      setAnswer('')
      setCategory('general')
      setOrderIndex('0')
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    let result
    if (editingFaq) {
      result = await updateFaqAction(editingFaq.id, {
        question,
        answer,
        category,
        order_index: parseInt(orderIndex),
      })
    } else {
      result = await createFaqAction({
        question,
        answer,
        category,
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
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    setLoading(true)
    const result = await deleteFaqAction(id)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleTogglePublished = async (faq: FAQ) => {
    setLoading(true)
    const result = await updateFaqAction(faq.id, {
      is_published: !faq.is_published,
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
          {faqs.length} FAQ{faqs.length !== 1 && 's'}
        </p>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No FAQs found
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.order_index}</TableCell>
                  <TableCell className="max-w-md truncate">{faq.question}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {faq.is_published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePublished(faq)}
                        disabled={loading}
                      >
                        {faq.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(faq.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question..."
                className="mt-2"
              />
            </div>

            <div>
              <Label>Answer</Label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter answer..."
                rows={6}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                {loading ? 'Saving...' : 'Save FAQ'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
