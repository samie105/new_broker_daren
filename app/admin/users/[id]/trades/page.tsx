import { requireAdmin } from '@/lib/admin-helpers'
import { getAllTradesAction } from '@/server/actions/admin/trades'
import { getUserByIdAction } from '@/server/actions/admin/users'
import { UserTradesTable } from '@/components/admin/user-trades-table'
import { notFound } from 'next/navigation'

export default async function UserTradesPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  
  const { id } = await params
  const userResult = await getUserByIdAction(id)
  if (!userResult.success) {
    notFound()
  }

  const tradesResult = await getAllTradesAction(id)
  const trades = tradesResult.success ? tradesResult.data : []

  const user = userResult.data as any

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manage Trades: {user.first_name} {user.last_name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Set trade outcomes, close trades, and manage positions
        </p>
      </div>

      <UserTradesTable trades={trades || []} userId={id} />
    </div>
  )
}
