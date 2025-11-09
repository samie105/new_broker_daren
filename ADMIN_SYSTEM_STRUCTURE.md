# Admin System Structure - Complete Overview

## 🎯 System Architecture - UPDATED

### ✅ Two-Tier Structure (NOW WITH PROPER TABLES!)

The system has a **two-tier architecture** with dedicated relational tables:

1. **Tier 1: Admin Plans (Configuration)** - Stored in `admins` table JSONB
2. **Tier 2: User Positions (Active Records)** - Stored in **dedicated relational tables** ✅

---

## 📊 Data Flow - CORRECTED

### Investment System

```
Admin Creates Plan
    ↓
admins.investment_plans (JSONB array)
    ↓
User sees plan in /dashboard/investment
    ↓
User creates investment
    ↓
✅ investments TABLE (new record with user_id FK)
    ↓
Admin manages position in /admin/investments
    ↓
Admin can terminate & pay profit
```

**Database Structure:**
- **Plan Templates:** `admins.investment_plans` (JSONB array) - What users can choose from
- **User Positions:** `investments` table (relational) - What users have invested in ✅

**Files:**
- **Plan Management:** `server/actions/admin/investment-plans.ts`
  - Create/update/delete plans in `admins.investment_plans` JSONB
  - Terminate user positions in `investments` table ✅
- **Position Management:** `server/actions/admin/stats.ts`
  - `getAllInvestmentsAction()` - Fetch all from `investments` table ✅
  - `getInvestmentStatsAction()` - Calculate stats from `investments` table ✅
- **Admin UI:** `app/admin/investments/page.tsx`
- **User UI:** `app/dashboard/investment/page.tsx`

### Staking System

```
Admin Creates Staking Option
    ↓
admins.staking_plans (JSONB array)
    ↓
User sees option in /dashboard/staking
    ↓
User creates stake
    ↓
✅ staking TABLE (new record with user_id FK)
    ↓
Admin manages position in /admin/staking
    ↓
Admin can terminate & pay profit
```

**Database Structure:**
- **Plan Templates:** `admins.staking_plans` (JSONB array) - What users can stake
- **User Positions:** `staking` table (relational) - User staking positions ✅

**Files:**
- **Plan Management:** `server/actions/admin/staking-plans.ts`
  - Create/update/delete plans in `admins.staking_plans` JSONB
  - Terminate user positions in `staking` table ✅
- **Position Management:** `server/actions/admin/stats.ts`
  - `getAllStakingAction()` - Fetch all from `staking` table ✅
  - `getStakingStatsAction()` - Calculate stats from `staking` table ✅
- **Admin UI:** `app/admin/staking/page.tsx`
- **User UI:** `app/dashboard/staking/page.tsx`

### Trading System

```
User creates trade
    ↓
✅ user_trades TABLE (new record with user_id FK)
    ↓
Admin manages trade in /admin/trades
    ↓
Admin can set P/L, close position
```

**Database Structure:**
- **User Trades:** `user_trades` table (relational) - All user trading positions ✅

**Files:**
- **Trade Management:** `server/actions/admin/trades.ts`
  - `getAllTradesAction()` - Fetch all from `user_trades` table ✅
  - `setTradeProfitLossAction()` - Set P/L and optionally close ✅
  - `closeTradeAction()` - Close trade ✅
  - `updateTradeAction()` - Update stop loss, take profit ✅
- **Admin UI:** `app/admin/trades/page.tsx`
- **User UI:** `app/dashboard/trading/page.tsx`

---

## 🗄️ Database Tables - COMPLETE STRUCTURE

### ✅ admins table (Configuration)
```sql
-- JSONB columns for plan templates
staking_plans: JSONB[]      -- Array of staking plan objects
investment_plans: JSONB[]   -- Array of investment plan objects
```

**Sample staking_plans structure:**
```json
[{
  "id": "stake-btc-1",
  "name": "Bitcoin Staking Pro",
  "symbol": "BTC",
  "apy": 8.5,
  "min_amount": 0.01,
  "max_amount": 10,
  "duration_days": 90,
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}]
```

**Sample investment_plans structure:**
```json
[{
  "id": "inv-crypto-growth",
  "name": "Crypto Growth Portfolio",
  "plan_type": "Cryptocurrency",
  "min_investment": 1000,
  "max_investment": 100000,
  "duration_days": 90,
  "roi_percent": 25.8,
  "risk_level": "medium",
  "strategy": "Dollar-Cost Averaging",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}]
```

### ✅ investments table (User Positions) - NOW EXISTS!
```sql
CREATE TABLE investments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  admin_id UUID REFERENCES admins(id),
  
  -- Plan details
  plan_id VARCHAR(255),
  plan_name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(100) NOT NULL,
  
  -- Amounts and returns
  amount NUMERIC(20, 8) NOT NULL,
  roi_percentage NUMERIC(10, 2),
  profit_earned NUMERIC(20, 8),
  current_value NUMERIC(20, 8),
  
  -- Risk and strategy
  risk_level VARCHAR(50),
  strategy TEXT,
  
  -- Status and dates
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  duration_days INTEGER,
  
  -- Joint investment support
  is_joint BOOLEAN DEFAULT false,
  joint_participants JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ✅ staking table (User Positions) - NOW EXISTS!
```sql
CREATE TABLE staking (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  admin_id UUID REFERENCES admins(id),
  
  -- Plan details
  plan_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  
  -- Amounts and rewards
  amount NUMERIC(20, 8) NOT NULL,
  apy NUMERIC(10, 2),
  rewards_earned NUMERIC(20, 8),
  profit_earned NUMERIC(20, 8),
  current_value NUMERIC(20, 8),
  
  -- Status and dates
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  duration_days INTEGER,
  lock_period INTEGER,
  
  -- Joint staking support
  is_joint BOOLEAN DEFAULT false,
  joint_participants JSONB,
  
  -- Metadata
  icon TEXT,
  network VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ✅ user_trades table (User Positions) - NOW EXISTS!
```sql
CREATE TABLE user_trades (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  admin_id UUID REFERENCES admins(id),
  
  -- Trade details
  symbol VARCHAR(50) NOT NULL,
  pair VARCHAR(50),
  trade_type VARCHAR(50) DEFAULT 'spot',
  position_type VARCHAR(50) DEFAULT 'long',
  
  -- Price and amounts
  entry_price NUMERIC(20, 8) NOT NULL,
  exit_price NUMERIC(20, 8),
  amount NUMERIC(20, 8) NOT NULL,
  total_value NUMERIC(20, 8),
  
  -- Profit/Loss
  profit_loss NUMERIC(20, 8),
  profit_loss_percentage NUMERIC(10, 2),
  
  -- Risk management
  stop_loss NUMERIC(20, 8),
  take_profit NUMERIC(20, 8),
  leverage INTEGER DEFAULT 1,
  
  -- Status and dates
  status VARCHAR(50) DEFAULT 'open',
  opened_at TIMESTAMP,
  closed_at TIMESTAMP,
  
  -- Metadata
  strategy TEXT,
  notes TEXT,
  tags TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### users table (Cached Data - Legacy)
```sql
-- JSONB arrays that cache active positions (DEPRECATED - now in separate tables)
staking_positions: JSONB[]      -- Legacy, kept for backward compatibility
active_investments: JSONB[]     -- Legacy, kept for backward compatibility
trades: JSONB[]                 -- Legacy, kept for backward compatibility
```

---

## 🔄 Admin Actions & Cache Revalidation

### Investment Plans Actions
**File:** `server/actions/admin/investment-plans.ts`

| Action | Revalidates | Description |
|--------|-------------|-------------|
| `createInvestmentPlanAction` | `/admin/plans`<br>`/dashboard/investment` | Create new plan in admins.investment_plans |
| `updateInvestmentPlanAction` | `/admin/plans`<br>`/dashboard/investment` | Update existing plan |
| `deleteInvestmentPlanAction` | `/admin/plans`<br>`/dashboard/investment` | Delete plan |
| `terminateInvestmentAction` | `/admin/investments`<br>`/dashboard/investment` | Terminate user position, pay profit |

### Staking Plans Actions
**File:** `server/actions/admin/staking-plans.ts`

| Action | Revalidates | Description |
|--------|-------------|-------------|
| `createStakingPlanAction` | `/admin/plans`<br>`/dashboard/staking` | Create new plan in admins.staking_plans |
| `updateStakingPlanAction` | `/admin/plans`<br>`/dashboard/staking` | Update existing plan |
| `deleteStakingPlanAction` | `/admin/plans`<br>`/dashboard/staking` | Delete plan |
| `terminateStakingPositionAction` | `/admin/staking`<br>`/dashboard/staking` | Terminate user position, pay profit |

### Trade Actions
**File:** `server/actions/admin/trades.ts`

| Action | Revalidates | Description |
|--------|-------------|-------------|
| `setTradeProfitLossAction` | `/admin/trades`<br>`/admin/users/{userId}`<br>`/dashboard/trading` | Set P/L, optionally close |
| `closeTradeAction` | `/admin/trades` | Close trade |
| `updateTradeAction` | `/admin/trades` | Update stop loss, take profit |

---

## 🎨 Admin Navigation

**File:** `components/admin/admin-sidebar.tsx`

```
Dashboard       /admin
Users           /admin/users
Transactions    /admin/transactions
Verifications   /admin/verifications
Plans           /admin/plans          ← CREATE plans here
Investments     /admin/investments    ← MANAGE investments table
Staking         /admin/staking        ← MANAGE staking table
Trades          /admin/trades         ← MANAGE user_trades table
```

---

## ✅ Current Status - FULLY IMPLEMENTED!

### What Works ✅
- ✅ **Tables created:** `investments`, `staking`, `user_trades` all exist with proper structure
- ✅ **Sample data:** 3 investments, 3 staking positions, 4 trades seeded for testing
- ✅ **Foreign keys:** All tables properly linked to users and admins
- ✅ **Indexes:** Performance indexes on user_id, admin_id, status, created_at
- ✅ Admin can create/edit/delete investment plans
- ✅ Admin can create/edit/delete staking plans
- ✅ Admin can terminate investment positions with profit options
- ✅ Admin can terminate staking positions with profit options
- ✅ Admin can set trade P/L and close positions
- ✅ All admin actions immediately reflect in frontend (cache revalidation)
- ✅ Settings hidden from admin navigation
- ✅ No dummy data or "coming soon" messages
- ✅ All data from database

### Sample Data Available
**Investments (3 records):**
- Crypto Growth Portfolio - $15,000 @ 25.8% ROI (active)
- DeFi Innovation Fund - $8,000 @ 32.4% ROI (active)
- Stable Income Portfolio - $25,000 @ 12.5% ROI (active)

**Staking (3 records):**
- Bitcoin Staking Pro - 2.5 BTC @ 8.5% APY (active)
- Ethereum Yield Plus - 15 ETH @ 12.3% APY (active)
- Solana High Yield - 500 SOL @ 18.7% APY (active)

**Trades (4 records):**
- BTC/USDT - Closed with +$1,350 profit
- ETH/USDT - Open (swing trading)
- SOL/USDT - Open with +$425 profit (futures)
- ADA/USDT - Closed with -$150 loss

### Known Issues
- ⚠️ TypeScript type errors with Supabase client (pre-existing, not breaking)
- ℹ️ Users table has JSONB arrays (`staking_positions`, `active_investments`) for backward compatibility

---

## 🔍 Key Insights

### Why Two Storage Locations?

1. **Plans in `admins.investment_plans` JSONB:**
   - Configuration/templates
   - Admin creates once, users see many times
   - Fast to fetch (single admin row)
   - Easy to filter by admin_id

2. **Positions in `investments`/`staking` tables:**
   - Active user records
   - One record per user per position
   - Allows complex queries (count active, sum amounts, filter by status)
   - Proper relational data with user relationships
   - Admin can manage individual positions

### User Experience Flow

1. **User browses plans:**
   - Fetches from `admins.staking_plans`/`investment_plans` where `status === 'active'`
   - Filters by user's `admin_id`

2. **User creates position:**
   - New record in `staking`/`investments` table
   - References user_id and plan details

3. **Admin manages positions:**
   - Views all positions from `staking`/`investments` table
   - Can terminate, set profits, update status
   - Changes immediately reflect in user dashboard

---

## 📝 Summary

The system has **two distinct operations**:

### 1. Plan Management (`/admin/plans`)
- Admin creates **plan templates** stored in `admins` table JSONB
- These are the **options users can choose from**
- Actions: Create, Update, Delete, Toggle Active

### 2. Position Management (`/admin/investments`, `/admin/staking`, `/admin/trades`)
- Admin manages **actual user positions** stored in dedicated tables
- These are the **positions users have created**
- Actions: View, Terminate, Set P/L, Pay Profit

**Think of it like:**
- Plans = Menu items (what can be ordered)
- Positions = Orders (what customers have ordered)
- Admin creates menu items in `/admin/plans`
- Admin manages orders in `/admin/investments`, `/admin/staking`, `/admin/trades`
