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
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react'
import {
  getInvestmentPlansAction,
  createInvestmentPlanAction,
  updateInvestmentPlanAction,
  deleteInvestmentPlanAction,
  type InvestmentPlan,
} from '@/server/actions/admin/investment-plans'
import { toast } from 'sonner'

interface InvestmentPlansManagerProps {
  plans: InvestmentPlan[]
}

export function InvestmentPlansManager({ plans: initialPlans }: InvestmentPlansManagerProps) {
  const [plans, setPlans] = useState<InvestmentPlan[]>(initialPlans)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    plan_type: '',
    min_amount: '',
    max_amount: '',
    roi_percentage: '',
    duration_days: '',
    risk_level: 'low' as 'low' | 'medium' | 'high',
    status: 'active' as 'active' | 'inactive',
    description: '',
  })

  useEffect(() => {
    setPlans(initialPlans)
  }, [initialPlans])

  const loadPlans = async () => {
    setLoading(true)
    const result = await getInvestmentPlansAction()
    if (result.success && result.data) {
      setPlans(result.data)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      plan_type: '',
      min_amount: '',
      max_amount: '',
      roi_percentage: '',
      duration_days: '',
      risk_level: 'low',
      status: 'active',
      description: '',
    })
    setEditingPlan(null)
  }

  const handleOpenDialog = (plan?: InvestmentPlan) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        name: plan.name,
        plan_type: plan.plan_type,
        min_amount: plan.min_amount.toString(),
        max_amount: plan.max_amount.toString(),
        roi_percentage: plan.roi_percentage.toString(),
        duration_days: plan.duration_days.toString(),
        risk_level: plan.risk_level,
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
      plan_type: formData.plan_type,
      min_amount: parseFloat(formData.min_amount),
      max_amount: parseFloat(formData.max_amount),
      roi_percentage: parseFloat(formData.roi_percentage),
      duration_days: parseInt(formData.duration_days),
      risk_level: formData.risk_level,
      status: formData.status,
      description: formData.description,
    }

    let result
    if (editingPlan) {
      result = await updateInvestmentPlanAction(editingPlan.id, planData)
    } else {
      result = await createInvestmentPlanAction(planData)
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
    if (!confirm('Are you sure you want to delete this investment plan?')) return

    const result = await deleteInvestmentPlanAction(planId)
    if (result.success) {
      toast.success(result.message)
      loadPlans()
    } else {
      toast.error(result.error)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return ''
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
              <CardTitle>Investment Plans</CardTitle>
              <CardDescription>
                Manage investment plans and strategies for your users
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
              <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No investment plans created yet</p>
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
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.plan_type}</p>
                      </div>
                      <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-semibold text-green-600">{plan.roi_percentage}%</p>
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
                    <div>
                      <Badge className={getRiskColor(plan.risk_level)}>
                        {plan.risk_level} Risk
                      </Badge>
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
              {editingPlan ? 'Edit Investment Plan' : 'Create Investment Plan'}
            </DialogTitle>
            <DialogDescription>
              {editingPlan ? 'Update the investment plan details' : 'Add a new investment plan for users'}
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
                  placeholder="Starter Plan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Plan Type</Label>
                <Input
                  id="type"
                  value={formData.plan_type}
                  onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                  placeholder="Real Estate, Stocks, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roi">ROI (%)</Label>
                <Input
                  id="roi"
                  type="number"
                  step="0.1"
                  value={formData.roi_percentage}
                  onChange={(e) => setFormData({ ...formData, roi_percentage: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  placeholder="90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Level</Label>
                <Select
                  value={formData.risk_level}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setFormData({ ...formData, risk_level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
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
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Max Amount ($)</Label>
                <Input
                  id="max"
                  type="number"
                  value={formData.max_amount}
                  onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                  placeholder="50000"
                />
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about this investment plan..."
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
