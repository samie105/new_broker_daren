'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getStakingPlansAction,
  createStakingPlanAction,
  updateStakingPlanAction,
  deleteStakingPlanAction,
  type StakingPlan,
} from '@/server/actions/admin/staking-plans'
import { toast } from 'sonner'

interface StakingPlansManagerProps {
  plans: StakingPlan[]
}

export function StakingPlansManager({ plans: initialPlans }: StakingPlansManagerProps) {
  const [plans, setPlans] = useState<StakingPlan[]>(initialPlans)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<StakingPlan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    apy: '',
    min_amount: '',
    max_amount: '',
    duration_days: '',
    status: 'active' as 'active' | 'inactive',
    description: '',
  })

  useEffect(() => {
    setPlans(initialPlans)
  }, [initialPlans])

  const loadPlans = async () => {
    setLoading(true)
    const result = await getStakingPlansAction()
    if (result.success && result.data) {
      setPlans(result.data)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      symbol: '',
      apy: '',
      min_amount: '',
      max_amount: '',
      duration_days: '',
      status: 'active',
      description: '',
    })
    setEditingPlan(null)
  }

  const handleOpenDialog = (plan?: StakingPlan) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        name: plan.name,
        symbol: plan.symbol,
        apy: plan.apy.toString(),
        min_amount: plan.min_amount.toString(),
        max_amount: plan.max_amount.toString(),
        duration_days: plan.duration_days.toString(),
        status: plan.status,
        description: plan.description || '',
      })
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    const planData = {
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      apy: parseFloat(formData.apy),
      min_amount: parseFloat(formData.min_amount),
      max_amount: parseFloat(formData.max_amount),
      duration_days: parseInt(formData.duration_days),
      status: formData.status,
      description: formData.description,
    }

    let result
    if (editingPlan) {
      result = await updateStakingPlanAction(editingPlan.id, planData)
    } else {
      result = await createStakingPlanAction(planData)
    }

    if (result.success) {
      toast.success(result.message)
      setDialogOpen(false)
      resetForm()
      loadPlans()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this staking plan?')) return

    const result = await deleteStakingPlanAction(planId)
    if (result.success) {
      toast.success(result.message)
      loadPlans()
    } else {
      toast.error(result.error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading plans...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staking Plans</CardTitle>
              <CardDescription>
                Manage cryptocurrency staking plans for your users
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No staking plans created yet</p>
              <Button onClick={() => handleOpenDialog()} variant="outline" className="mt-4">
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.symbol}</p>
                      </div>
                      <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">APY</p>
                        <p className="font-semibold text-green-600">{plan.apy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">{plan.duration_days} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Amount</p>
                        <p className="font-semibold">${plan.min_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Amount</p>
                        <p className="font-semibold">${plan.max_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog(plan)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Staking Plan' : 'Create Staking Plan'}
            </DialogTitle>
            <DialogDescription>
              {editingPlan ? 'Update the staking plan details' : 'Add a new staking plan for users'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bitcoin Staking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="BTC"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apy">APY (%)</Label>
                <Input
                  id="apy"
                  type="number"
                  step="0.1"
                  value={formData.apy}
                  onChange={(e) => setFormData({ ...formData, apy: e.target.value })}
                  placeholder="12.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Min Amount ($)</Label>
                <Input
                  id="min"
                  type="number"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Max Amount ($)</Label>
                <Input
                  id="max"
                  type="number"
                  value={formData.max_amount}
                  onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                  placeholder="10000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about this staking plan..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
