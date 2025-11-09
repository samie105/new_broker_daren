import { requireAdmin } from '@/lib/admin-helpers'
import { getAllTransactionsAction } from '@/server/actions/admin/transactions'
import { DepositsDataTable } from '@/components/admin/deposits-data-table'

export default async function AdminDepositsPage() {
  await requireAdmin()
  
  const result = await getAllTransactionsAction('deposit')
  const deposits = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deposit Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve deposit requests
        </p>
      </div>

      <DepositsDataTable deposits={deposits || []} />
    </div>
  )
}
