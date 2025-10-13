# Server Actions Documentation

Complete server-side logic for the New Broker trading platform using Next.js Server Actions, Supabase, and Nodemailer.

---

## 📁 Directory Structure

```
server/
├── actions/          # Server Actions (Next.js 14+)
│   ├── auth.ts      # Authentication actions
│   ├── user.ts      # User profile actions
│   ├── admin.ts     # Admin panel actions
│   ├── wallet.ts    # Wallet management (TODO)
│   ├── trading.ts   # Trading operations (TODO)
│   ├── staking.ts   # Staking operations (TODO)
│   └── investment.ts # Investment operations (TODO)
├── db/              # Database clients
│   └── supabase.ts  # Supabase client configuration
├── email/           # Email service
│   └── nodemailer.ts # Email templates & sending
├── types/           # TypeScript types
│   └── database.ts  # Database schema types
├── utils/           # Utility functions
└── config/          # Configuration files
```

---

## 🔐 Authentication Actions (`server/actions/auth.ts`)

### Available Functions:

#### 1. **signupAction(formData)**
Creates a new user account with OTP verification.

```typescript
const result = await signupAction({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe' // optional
});
```

**Returns:** `AuthResponse` with user data and OTP sent to email.

#### 2. **loginAction(formData)**
Authenticates user and creates session cookie.

```typescript
const result = await loginAction({
  email: 'user@example.com',
  password: 'password123'
});
```

**Returns:** `AuthResponse` with user data and session cookie.

#### 3. **logoutAction()**
Clears session cookie and logs out user.

```typescript
const result = await logoutAction();
```

#### 4. **verifyEmailAction(otp)**
Verifies user email with OTP code.

```typescript
const result = await verifyEmailAction('123456');
```

#### 5. **forgotPasswordAction(email)**
Sends password reset OTP to user email.

```typescript
const result = await forgotPasswordAction('user@example.com');
```

#### 6. **resetPasswordAction(formData)**
Resets user password with OTP verification.

```typescript
const result = await resetPasswordAction({
  email: 'user@example.com',
  otp: '123456',
  newPassword: 'newPassword123'
});
```

#### 7. **resendVerificationCodeAction()**
Resends OTP code to current user.

```typescript
const result = await resendVerificationCodeAction();
```

#### 8. **getCurrentUser()**
Gets currently authenticated user from session.

```typescript
const user = await getCurrentUser();
```

---

## 👤 User Profile Actions (`server/actions/user.ts`)

### Available Functions:

#### 1. **getUserProfileAction()**
Gets current user's full profile.

```typescript
const result = await getUserProfileAction();
```

#### 2. **updateUserProfileAction(updates)**
Updates user profile fields.

```typescript
const result = await updateUserProfileAction({
  first_name: 'John',
  last_name: 'Smith',
  phone: '+1234567890',
  country: 'United States'
});
```

#### 3. **updatePasswordAction(formData)**
Changes user password.

```typescript
const result = await updatePasswordAction({
  currentPassword: 'oldPassword',
  newPassword: 'newPassword123'
});
```

#### 4. **updatePreferencesAction(preferences)**
Updates user preferences and settings.

```typescript
const result = await updatePreferencesAction({
  preferred_language: 'en',
  preferred_currency: 'USD',
  marketing_emails_enabled: true,
  trading_notifications_enabled: true
});
```

#### 5. **updateAvatarAction(avatarUrl)**
Updates user avatar URL.

```typescript
const result = await updateAvatarAction('https://example.com/avatar.jpg');
```

#### 6. **deleteAccountAction(password)**
Soft deletes user account.

```typescript
const result = await deleteAccountAction('password123');
```

---

## 👨‍💼 Admin Actions (`server/actions/admin.ts`)

### Available Functions:

#### 1. **adminLoginAction(formData)**
Authenticates admin user.

```typescript
const result = await adminLoginAction({
  email: 'Alpha@adminsecure.private',
  password: 'secureAdminpass@private1.hidden'
});
```

#### 2. **adminLogoutAction()**
Logs out admin user.

```typescript
const result = await adminLogoutAction();
```

#### 3. **getUsersAction(filters)**
Gets all users with optional filters.

```typescript
const result = await getUsersAction({
  status: 'active',
  tier: 'premium',
  kyc_status: 'verified',
  search: 'john'
});
```

#### 4. **getUserByIdAction(userId)**
Gets single user by ID.

```typescript
const result = await getUserByIdAction('user-uuid');
```

#### 5. **suspendUserAction(userId, reason, duration)**
Suspends user account.

```typescript
const result = await suspendUserAction(
  'user-uuid',
  'Suspicious activity',
  30 // days (optional)
);
```

#### 6. **unsuspendUserAction(userId)**
Unsuspends user account.

```typescript
const result = await unsuspendUserAction('user-uuid');
```

#### 7. **verifyKYCAction(userId, status, rejectionReason)**
Approves or rejects user KYC.

```typescript
const result = await verifyKYCAction(
  'user-uuid',
  'verified', // or 'rejected'
  'Document not clear' // optional, for rejections
);
```

#### 8. **updateUserTierAction(userId, tier)**
Updates user account tier.

```typescript
const result = await updateUserTierAction('user-uuid', 'premium');
```

#### 9. **assignUserToAdminAction(userId, adminId)**
Assigns user to an admin.

```typescript
const result = await assignUserToAdminAction('user-uuid', 'admin-uuid');
```

#### 10. **getAdminStatsAction()**
Gets admin dashboard statistics.

```typescript
const result = await getAdminStatsAction();
// Returns: { totalUsers, activeUsers, suspendedUsers, pendingKYC, verifiedKYC }
```

#### 11. **getCurrentAdmin()**
Gets currently authenticated admin.

```typescript
const admin = await getCurrentAdmin();
```

---

## 📧 Email Service (`server/email/nodemailer.ts`)

### Available Functions:

#### 1. **sendOTPEmail(to, otp, type)**
Sends OTP verification email.

```typescript
await sendOTPEmail('user@example.com', '123456', 'verify');
// Types: 'verify', 'reset', 'withdraw', 'trade_confirm', '2fa'
```

#### 2. **sendWelcomeEmail(to, name)**
Sends welcome email after signup.

```typescript
await sendWelcomeEmail('user@example.com', 'John Doe');
```

#### 3. **sendPasswordResetConfirmation(to, name)**
Sends password reset confirmation.

```typescript
await sendPasswordResetConfirmation('user@example.com', 'John Doe');
```

#### 4. **sendWithdrawalNotification(to, amount, asset, address)**
Sends withdrawal notification.

```typescript
await sendWithdrawalNotification(
  'user@example.com',
  '0.5',
  'BTC',
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
);
```

#### 5. **verifyEmailConfig()**
Verifies SMTP configuration.

```typescript
const isValid = await verifyEmailConfig();
```

---

## 🗄️ Database Types (`server/types/database.ts`)

### Main Interfaces:

- **User** - Complete user model with 77 fields
- **Admin** - Admin model
- **ApiResponse<T>** - Standard API response wrapper
- **AuthResponse** - Authentication-specific response
- **AuthUser** - Minimal user data for auth
- **OTPData** - OTP code data structure

---

## 🔌 Supabase Client (`server/db/supabase.ts`)

### Available Exports:

```typescript
import { createClientSupabase, createServerSupabase, supabase } from '@/server/db/supabase';

// Client-side (anon key)
const clientSupabase = createClientSupabase();

// Server-side with admin privileges (service role key)
const serverSupabase = createServerSupabase();

// Default server client
import { supabase } from '@/server/db/supabase';
```

---

## 🚀 Usage Examples

### Example 1: User Signup Flow

```typescript
'use client';

import { signupAction, verifyEmailAction } from '@/server/actions/auth';

async function handleSignup() {
  const result = await signupAction({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  });

  if (result.success) {
    // Show OTP input
    const otp = '123456'; // From user input
    const verifyResult = await verifyEmailAction(otp);

    if (verifyResult.success) {
      // Redirect to dashboard
    }
  }
}
```

### Example 2: User Login with TanStack Query

```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { loginAction } from '@/server/actions/auth';

function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      if (data.success) {
        router.push('/dashboard');
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        loginMutation.mutate({
          email: 'user@example.com',
          password: 'password123',
        });
      }}
    >
      {/* Form fields */}
    </form>
  );
}
```

### Example 3: Admin Panel - Get Users

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsersAction } from '@/server/actions/admin';

function AdminUsersList() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => getUsersAction({ status: 'active' }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data?.map((user) => (
        <div key={user.id}>{user.full_name}</div>
      ))}
    </div>
  );
}
```

---

## 📦 Required Packages

Install the following packages:

```bash
pnpm install @supabase/supabase-js nodemailer @types/nodemailer @tanstack/react-query
```

---

## ⚙️ Environment Variables

Required variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://...

# SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@newbroker.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 TODO: Remaining Actions

The following action files still need to be created:

- ✅ `auth.ts` - Authentication (COMPLETED)
- ✅ `user.ts` - User profile (COMPLETED)
- ✅ `admin.ts` - Admin panel (COMPLETED)
- ⏳ `wallet.ts` - Wallet management
- ⏳ `trading.ts` - Trading operations
- ⏳ `staking.ts` - Staking operations
- ⏳ `investment.ts` - Investment operations
- ⏳ `transactions.ts` - Transaction history

---

## 🔒 Security Features

- **Cookie-based sessions** - HttpOnly, Secure, SameSite
- **OTP verification** - 6-digit codes with expiration
- **Rate limiting** - Login attempt tracking
- **Account locking** - Temporary locks after failed attempts
- **Email verification** - Required for account activation
- **Admin authorization** - Separate admin authentication
- **Plain text passwords** - As requested (⚠️ Use bcrypt in production!)

---

## 📝 Notes

1. **Passwords are stored as plain text** as requested. For production, implement bcrypt hashing.
2. **OTP codes** are stored directly in the users table (no separate table).
3. **Session management** uses Next.js cookies (not Supabase Auth).
4. **Admin accounts** are separate from user accounts.
5. **Email templates** are customizable in `server/email/nodemailer.ts`.

---

**Created:** October 7, 2025
**Last Updated:** October 7, 2025
