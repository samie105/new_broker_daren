'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Ban, 
  CheckCircle, 
  DollarSign,
  Eye 
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  banUserAction, 
  unbanUserAction, 
  deleteUserAction,
  updateUserBalanceAction 
} from '@/server/actions/admin/users'
import { EditUserDialog } from './edit-user-dialog'
import { UpdateBalanceDialog } from './update-balance-dialog'
import { BanUserDialog } from './ban-user-dialog'
import { UserDetailsDialog } from './user-details-dialog'
import Link from 'next/link'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  country: string | null
  role: string | null
  is_banned: boolean | null
  kyc_status: string | null
  account_status: string | null
  is_suspended: boolean | null
  created_at: string | null
  wallet_balance: number | null
}

interface UsersDataTableProps {
  users: User[]
}

export function UsersDataTable({ users }: UsersDataTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query)
    )
  })

  const handleBan = (user: User) => {
    setSelectedUser(user)
    setBanDialogOpen(true)
  }

  const handleUnban = async (userId: string) => {
    const result = await unbanUserAction(userId)
    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    const result = await deleteUserAction(userId)
    if (result.success) {
      toast.success(result.message)
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const getKycBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'destructive'> = {
      not_started: 'secondary',
      pending: 'default',
      approved: 'success',
      rejected: 'destructive',
    }
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length} user{filteredUsers.length !== 1 && 's'}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{getKycBadge(user.kyc_status || 'not_started')}</TableCell>
                  <TableCell>${user.wallet_balance?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setDetailsDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setBalanceDialogOpen(true)
                          }}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Update Balance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}/trades`}>
                            Manage Trades
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.is_banned ? (
                          <DropdownMenuItem onClick={() => handleUnban(user.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleBan(user)}>
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id, `${user.first_name} ${user.last_name}`)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <UpdateBalanceDialog
            user={selectedUser}
            open={balanceDialogOpen}
            onOpenChange={setBalanceDialogOpen}
          />
          <BanUserDialog
            user={selectedUser}
            open={banDialogOpen}
            onOpenChange={setBanDialogOpen}
          />
          <UserDetailsDialog
            userId={selectedUser.id}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
        </>
      )}
    </div>
  )
}
