# Quick Reference - Convert Page to Real Data

## Fast Conversion Checklist ✅

### 1. Identify Component with Dummy Data
```typescript
// Look for this pattern:
const dummyData = [
  { id: 1, ... },
  { id: 2, ... }
]
```

### 2. Check If Server Action Exists
- Open `server/actions/portfolio.ts`
- Look for matching action (e.g., `getDepositsAction()`)
- If doesn't exist, create it

### 3. Update Component (Add Props)
```typescript
// Before
export function MyComponent() {
  const data = [/* hardcoded */]
  return <div>{data.map(...)}</div>
}

// After
interface MyComponentProps {
  data: DataType[]
}

export function MyComponent({ data }: MyComponentProps) {
  return <div>{data.map(...)}</div>
}
```

### 4. Create Server Wrapper
```typescript
// components/dashboard/my-component-server.tsx
import { getMyDataAction } from '@/server/actions/portfolio'
import { MyComponent } from './my-component'

export async function MyComponentServer() {
  const result = await getMyDataAction()
  
  if (!result.success || !result.data) {
    return <MyComponent data={[]} />
  }
  
  return <MyComponent data={result.data} />
}
```

### 5. Update Page Import
```typescript
// app/dashboard/my-page/page.tsx

// Before
import { MyComponent } from '@/components/dashboard/my-component'
<MyComponent />

// After
import { MyComponentServer } from '@/components/dashboard/my-component-server'
<MyComponentServer />
```

### 6. Test
```bash
# Login as test user
# Navigate to page
# Verify real data displays
# Check console for errors
```

---

## Available Server Actions

| Action | Returns | Use For |
|--------|---------|---------|
| `getPortfolioHoldingsAction()` | Crypto balances | Holdings, Wallets |
| `getTransactionsAction()` | Buy/sell/deposit/withdraw | Transaction lists |
| `getTradesAction()` | Trading history | Trade tables |
| `getStakingPositionsAction()` | Active stakes | Staking pages |
| `getPortfolioHistoryAction()` | Historical data | Charts |
| `getDashboardMetricsAction()` | Summary metrics | Overview cards |
| `getDepositsAction()` | Deposit history | Deposit pages |
| `getWithdrawalsAction()` | Withdrawal history | Withdraw pages |
| `getWalletAddressesAction()` | Wallet addresses | Address displays |

---

## Common Patterns

### Pattern 1: Simple Data Display
```typescript
// Server Wrapper
export async function DataListServer() {
  const result = await getDataAction()
  return <DataList data={result.success ? result.data : []} />
}
```

### Pattern 2: With Calculations
```typescript
// Server Wrapper
export async function MetricsServer() {
  const result = await getMetricsAction()
  const metrics = result.data
  
  const calculated = {
    total: metrics.value,
    change: metrics.value * 0.02, // Calculate from data
    percent: 2.0
  }
  
  return <Metrics {...calculated} />
}
```

### Pattern 3: Multiple Data Sources
```typescript
// Server Wrapper
export async function CombinedServer() {
  const [data1, data2] = await Promise.all([
    getDataAction1(),
    getDataAction2()
  ])
  
  // Combine/enrich data
  const enriched = data1.data.map(item => ({
    ...item,
    extra: data2.data[item.id]
  }))
  
  return <Combined data={enriched} />
}
```

---

## Type Definitions

### Common Interfaces (from portfolio.ts)

```typescript
interface PortfolioHolding {
  symbol: string
  name: string
  balance: number
  avg_buy_price: number
  current_value?: number
  icon: string
}

interface Transaction {
  id: number
  type: 'buy' | 'sell' | 'deposit' | 'withdraw'
  symbol: string
  amount: number
  price: number
  status: 'pending' | 'completed' | 'failed'
  date: string
}

interface Trade {
  id: number
  type: 'BUY' | 'SELL'
  symbol: string
  amount: number
  entry_price: number
  profit: number
  profit_percent: number
  status: string
  opened_at: string
}

interface StakingPosition {
  id: number
  symbol: string
  amount: number
  apy: number
  rewards: number
  start_date: string
  status: 'active' | 'completed'
  lock_period: number
}

interface DashboardMetrics {
  portfolio_value: number
  active_positions: number
  total_deposited: number
  total_withdrawn: number
  plan_bonus: number
}
```

---

## Database Field Names (snake_case)

Remember to use snake_case for database fields:

```typescript
// ✅ Correct
user.portfolio_value
user.total_deposited
user.active_positions

// ❌ Wrong
user.portfolioValue
user.totalDeposited
user.activePositions
```

---

## Test User

**Email**: test@example.com  
**Password**: Test123!@#

Has data for all fields - use for testing!

---

## Error Handling

Always handle errors in server wrappers:

```typescript
export async function ComponentServer() {
  try {
    const result = await getDataAction()
    
    if (!result.success || !result.data) {
      return <Component data={[]} />  // Empty state
    }
    
    return <Component data={result.data} />
  } catch (error) {
    console.error('Error fetching data:', error)
    return <Component data={[]} />  // Fallback
  }
}
```

---

## Common Mistakes to Avoid

1. ❌ Using JSON.parse() on cookie value
   ```typescript
   // Wrong
   const userId = JSON.parse(sessionCookie.value)
   
   // Right
   const userId = sessionCookie.value
   ```

2. ❌ Using camelCase for database fields
   ```typescript
   // Wrong
   metrics.portfolioValue
   
   // Right
   metrics.portfolio_value
   ```

3. ❌ Forgetting to handle null/undefined
   ```typescript
   // Wrong
   const total = holdings.reduce((sum, h) => sum + h.value, 0)
   
   // Right
   const total = holdings.reduce((sum, h) => sum + (h.value || 0), 0)
   ```

4. ❌ Not providing default props
   ```typescript
   // Wrong
   export function Component({ data }: Props) { ... }
   
   // Right
   export function Component({ data = [] }: Props) { ... }
   ```

---

## 5-Minute Conversion Example

**Goal**: Convert withdrawal history from dummy to real data

```typescript
// 1. Update component (5 lines changed)
interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[]
}
export function WithdrawalHistory({ withdrawals = [] }: WithdrawalHistoryProps) {
  return <div>{withdrawals.map(...)}</div>
}

// 2. Create server wrapper (new file, 15 lines)
import { getWithdrawalsAction } from '@/server/actions/portfolio'
import { WithdrawalHistory } from './withdrawal-history'

export async function WithdrawalHistoryServer() {
  const result = await getWithdrawalsAction()
  return <WithdrawalHistory withdrawals={result.success ? result.data : []} />
}

// 3. Update page import (1 line changed)
import { WithdrawalHistoryServer } from '@/components/dashboard/withdraw/withdrawal-history-server'
<WithdrawalHistoryServer />

// Done! ✅
```

---

## Verification

After conversion, check:
- ✅ No TypeScript errors
- ✅ Page loads without console errors
- ✅ Real data displays (not hardcoded values)
- ✅ Empty state works (if no data)
- ✅ Test user sees their actual data

---

## Need Help?

1. Check `server/actions/portfolio.ts` for available actions
2. Look at completed pages (dashboard, deposits, portfolio) for examples
3. Review `PORTFOLIO_PAGE_COMPLETE.md` for detailed walkthrough
4. Test with `test@example.com` user

---

**Remember**: Every page follows the same pattern! 
Once you've done one, the rest are quick and easy. 🚀
