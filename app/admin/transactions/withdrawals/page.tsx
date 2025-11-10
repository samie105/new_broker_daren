import { requireAdmin } from '@/lib/admin-helpers'
import { getAllWithdrawalsAction } from '@/server/actions/admin/transactions'
import { WithdrawalsDataTable } from '@/components/admin/withdrawals-data-table'

export default async function AdminWithdrawalsPage() {
  await requireAdmin()
  
  const result = await getAllWithdrawalsAction()
  const withdrawals = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Withdrawal Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve withdrawal requests
        </p>
      </div>

      <WithdrawalsDataTable withdrawals={withdrawals || []} />
    </div>
  )
}
