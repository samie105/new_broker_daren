# Notification System Documentation

## Overview
The notification system allows you to send real-time notifications to users for various events throughout the application. Notifications are stored in the database and displayed in the navbar.

## Database Schema
Notifications are stored in the `users` table as a JSONB array field called `notifications`.

### Notification Structure
```typescript
interface UserNotification {
  id: string;                    // Unique notification ID
  type: 'transaction' | 'trade' | 'staking' | 'investment' | 'kyc' | 'security' | 'system' | 'announcement';
  title: string;                 // Notification title
  message: string;               // Notification message
  icon?: string;                 // Optional emoji icon
  action_url?: string;           // Optional URL to navigate to
  is_read: boolean;              // Read status
  created_at: string;            // ISO timestamp
  metadata?: {                   // Optional metadata
    transaction_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    [key: string]: any;
  };
}
```

## Components

### NotificationBell
The main notification component displayed in the navbar. Features:
- **Badge**: Shows unread count
- **Dropdown**: Lists all notifications
- **Empty State**: Beautiful empty state when no notifications
- **Auto-refresh**: Fetches new notifications every 30 seconds
- **Actions**: Mark as read, delete, clear all

**Usage:**
```tsx
import { NotificationBell } from '@/components/dashboard/notification-bell'

// In your layout or navbar
<NotificationBell />
```

## Server Actions

### Core Actions (`server/actions/notifications.ts`)

#### 1. Get All Notifications
```typescript
const result = await getNotificationsAction()
// Returns: { success: boolean, data: UserNotification[], error: string | null }
```

#### 2. Get Unread Count
```typescript
const result = await getUnreadCountAction()
// Returns: { success: boolean, data: number, error: string | null }
```

#### 3. Mark as Read
```typescript
const result = await markNotificationAsReadAction(notificationId)
// Returns: { success: boolean, data: UserNotification[], error: string | null }
```

#### 4. Mark All as Read
```typescript
const result = await markAllNotificationsAsReadAction()
// Returns: { success: boolean, data: UserNotification[], error: string | null }
```

#### 5. Delete Notification
```typescript
const result = await deleteNotificationAction(notificationId)
// Returns: { success: boolean, data: UserNotification[], error: string | null }
```

#### 6. Clear All Notifications
```typescript
const result = await clearAllNotificationsAction()
// Returns: { success: boolean, data: [], error: string | null }
```

#### 7. Add Notification
```typescript
const result = await addNotificationAction(userId, {
  type: 'transaction',
  title: 'Deposit Received',
  message: 'Your deposit of $1,000 has been processed.',
  icon: '💰',
  action_url: '/dashboard/history',
  metadata: {
    transaction_id: 'txn_123',
    amount: 1000,
    currency: 'USD',
    status: 'completed'
  }
})
```

### Helper Functions (`server/actions/notification-helpers.ts`)

These helpers make it easy to send notifications for common actions:

#### 1. Transaction Notifications
```typescript
import { notifyTransaction } from '@/server/actions/notification-helpers'

// Example: Notify deposit
await notifyTransaction(
  userId,
  'deposit',           // 'deposit' | 'withdrawal' | 'transfer'
  1000,                // amount
  'USD',               // currency
  'completed',         // 'pending' | 'completed' | 'failed'
  'txn_123'           // optional transaction ID
)
```

#### 2. Trade Notifications
```typescript
import { notifyTrade } from '@/server/actions/notification-helpers'

// Example: Notify trade closed with profit
await notifyTrade(
  userId,
  'closed',            // 'opened' | 'closed'
  'BTC/USD',          // trading pair
  5000,               // amount
  250,                // profit/loss (optional)
  'trade_456'         // optional trade ID
)
```

#### 3. Staking Notifications
```typescript
import { notifyStaking } from '@/server/actions/notification-helpers'

// Example: Notify staking rewards
await notifyStaking(
  userId,
  'rewards',          // 'started' | 'completed' | 'rewards'
  'Ethereum Pool',    // pool name
  100,                // staked amount
  5,                  // rewards earned (optional)
  'stake_789'         // optional staking ID
)
```

#### 4. Investment Notifications
```typescript
import { notifyInvestment } from '@/server/actions/notification-helpers'

// Example: Notify investment matured
await notifyInvestment(
  userId,
  'matured',          // 'started' | 'matured' | 'payout'
  'Gold Plan',        // plan name
  10000,              // amount
  2000,               // returns (optional)
  'inv_101'           // optional investment ID
)
```

#### 5. KYC Notifications
```typescript
import { notifyKYC } from '@/server/actions/notification-helpers'

// Example: Notify KYC approved
await notifyKYC(
  userId,
  'approved',         // 'submitted' | 'approved' | 'rejected'
  undefined           // optional rejection reason
)
```

#### 6. Security Notifications
```typescript
import { notifySecurity } from '@/server/actions/notification-helpers'

// Example: Notify new login
await notifySecurity(
  userId,
  'login',            // 'login' | 'password_changed' | '2fa_enabled' | '2fa_disabled' | 'suspicious_activity'
  'From New York, USA' // optional details
)
```

#### 7. System Notifications
```typescript
import { notifySystem } from '@/server/actions/notification-helpers'

// Example: System maintenance notification
await notifySystem(
  userId,
  'Scheduled Maintenance',
  'The system will be under maintenance on Sunday at 2 AM UTC.',
  '/dashboard/announcements'
)
```

#### 8. Announcements
```typescript
import { notifyAnnouncement } from '@/server/actions/notification-helpers'

// Example: New feature announcement
await notifyAnnouncement(
  userId,
  'New Feature: Copy Trading',
  'Check out our new copy trading feature and follow expert traders!',
  '/dashboard/trading-experts'
)
```

## Integration Examples

### Example 1: After Successful Deposit
```typescript
// In your deposit action
export async function processDepositAction(userId: string, amount: number) {
  // ... process deposit ...
  
  // Send notification
  await notifyTransaction(
    userId,
    'deposit',
    amount,
    'USD',
    'completed',
    depositId
  )
  
  return { success: true }
}
```

### Example 2: After Trade Execution
```typescript
// In your trading action
export async function closeTradeAction(userId: string, tradeId: string) {
  const trade = await getTrade(tradeId)
  const profitLoss = calculateProfitLoss(trade)
  
  // Close the trade
  await closeTrade(tradeId)
  
  // Send notification
  await notifyTrade(
    userId,
    'closed',
    trade.pair,
    trade.amount,
    profitLoss,
    tradeId
  )
  
  return { success: true }
}
```

### Example 3: After KYC Verification
```typescript
// In your KYC verification action (admin)
export async function verifyKYCAction(userId: string, approved: boolean, reason?: string) {
  await updateKYCStatus(userId, approved ? 'verified' : 'rejected')
  
  // Send notification
  await notifyKYC(
    userId,
    approved ? 'approved' : 'rejected',
    reason
  )
  
  return { success: true }
}
```

## Best Practices

1. **Always notify users about important actions**
   - Transactions (deposits, withdrawals, transfers)
   - Trades (opened, closed)
   - Staking (started, rewards, completed)
   - Investments (started, matured, payouts)
   - Security events (logins, password changes)
   - KYC status changes

2. **Use appropriate notification types**
   - Choose the correct `type` for proper categorization and icon display

3. **Include action URLs**
   - Always provide `action_url` so users can navigate to relevant details

4. **Add metadata**
   - Include relevant data in `metadata` for filtering and display purposes

5. **Handle errors gracefully**
   - Notification failures shouldn't break the main action
   - Log errors but continue execution

6. **Limit notification count**
   - The system automatically limits to the last 100 notifications per user
   - Old notifications are automatically removed

## UI Features

### Empty State
When users have no notifications, a beautiful empty state is displayed:
- Bell icon
- "No notifications" message
- Helpful description text

### Notification Items
Each notification displays:
- Type-specific icon
- Title and message
- Relative timestamp ("2m ago", "1h ago", etc.)
- Unread indicator (blue dot)
- Metadata (amount, status, etc.)
- Action URL (clickable)
- Quick actions (mark as read, delete)

### Dropdown Actions
- **Mark all read**: Marks all notifications as read
- **Clear all**: Deletes all notifications
- **View all**: Navigate to full notifications page (future)

## Database Migration

The notification system requires a database migration that has already been applied:

```sql
-- Add notifications field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_notifications ON users USING GIN (notifications);

-- Add comment
COMMENT ON COLUMN users.notifications IS 'Array of user notifications stored as JSONB';
```

## Notes

- Notifications auto-refresh every 30 seconds
- Maximum 100 notifications per user (older ones are removed)
- Notifications are sorted by creation date (newest first)
- Unread notifications are highlighted with a blue dot
- Clicking a notification marks it as read automatically
- The notification bell shows a badge with unread count

## Future Enhancements

- Push notifications (browser, mobile)
- Email notifications
- SMS notifications
- Notification preferences (enable/disable by type)
- Notification filtering and search
- Full notifications page
- Notification categories/tabs
- Bulk actions
