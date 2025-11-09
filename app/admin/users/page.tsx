import { requireAdmin } from '@/lib/admin-helpers'
import { getAllUsersAction } from '@/server/actions/admin/users'
import { UsersDataTable } from '@/components/admin/users-data-table'

export default async function AdminUsersPage() {
  await requireAdmin()
  
  const result = await getAllUsersAction()
  const users = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage all platform users
          </p>
        </div>
      </div>

      <UsersDataTable users={users || []} />
    </div>
  )
}
