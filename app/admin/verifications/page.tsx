import { requireAdmin } from '@/lib/admin-helpers'
import { getPendingVerificationsAction } from '@/server/actions/admin/verifications'
import { VerificationsDataTable } from '@/components/admin/verifications-data-table'

export default async function AdminVerificationsPage() {
  await requireAdmin()
  
  const result = await getPendingVerificationsAction()
  const verifications = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ID Verifications</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve user identity verifications
        </p>
      </div>

      <VerificationsDataTable verifications={verifications || []} />
    </div>
  )
}
