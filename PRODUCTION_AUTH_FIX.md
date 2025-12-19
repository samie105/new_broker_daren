# Production Authentication Fix Guide

## Problem
The application was experiencing `ERR_TOO_MANY_REDIRECTS` errors in production due to cookie configuration issues.

## Root Causes
1. **Cookie Security Misconfiguration**: The authentication cookie wasn't properly configured for production HTTPS
2. **Missing Domain Configuration**: Cookies need proper domain settings in production
3. **Incorrect SameSite Policy**: The `sameSite: 'lax'` setting can cause issues with secure cookies in production
4. **Missing App URL**: The `NEXT_PUBLIC_APP_URL` wasn't set to the production domain

## Fixes Applied

### 1. Updated Cookie Configuration (`server/actions/auth.ts`)
- ✅ Automatically detects production environment
- ✅ Sets `secure: true` for HTTPS in production
- ✅ Uses `sameSite: 'strict'` in production for better security
- ✅ Dynamically extracts domain from `NEXT_PUBLIC_APP_URL`
- ✅ Added detailed logging for debugging

### 2. Improved Middleware (`middleware.ts`)
- ✅ Better redirect loop detection
- ✅ Checks referer header to prevent infinite redirects
- ✅ Added console logs for debugging authentication flow

### 3. Environment Variable Documentation (`.env.local`)
- ✅ Added comments explaining the importance of `NEXT_PUBLIC_APP_URL`
- ✅ Highlighted that it must be set to production URL in production

## Production Deployment Steps

### Step 1: Set Environment Variables
In your production environment (Vercel, Netlify, etc.), set:

```bash
# CRITICAL: Set this to your actual production domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Your Supabase credentials
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Other configuration
NODE_ENV=production
```

### Step 2: Verify HTTPS
Ensure your production domain has a valid SSL certificate and is served over HTTPS. Most platforms (Vercel, Netlify, etc.) provide this automatically.

### Step 3: Clear Browser Cookies
If users are still experiencing issues after deployment:
1. Ask them to clear cookies for your domain
2. Or use incognito/private browsing mode to test

### Step 4: Test Authentication Flow
1. Try to login
2. Check browser DevTools → Application → Cookies
3. Verify the `auth_session` cookie is set with:
   - `Secure` flag (should be checked in production)
   - `HttpOnly` flag (should be checked)
   - `SameSite: Strict` (should show in production)
   - Correct domain

## Debugging Production Issues

### Check Cookie Settings
In browser DevTools → Application → Cookies, verify:
```
Name: auth_session
Value: [user_id]
Domain: yourdomain.com
Path: /
Secure: ✓ (in production)
HttpOnly: ✓
SameSite: Strict (production) or Lax (development)
```

### Check Server Logs
Look for these log messages in your production logs:
```
🍪 Setting cookie domain: yourdomain.com
🍪 Cookie set with config: { secure: true, sameSite: 'strict', ... }
```

### Common Issues

#### Issue: Cookie not being set
**Solution**: Verify `NEXT_PUBLIC_APP_URL` is set correctly in production environment variables

#### Issue: Cookie set but not sent with requests
**Solution**: 
- Ensure domain matches exactly (no www vs non-www mismatch)
- Check that all requests are over HTTPS
- Verify SameSite policy allows the cookie to be sent

#### Issue: Still getting redirect loops
**Solution**:
1. Clear all cookies for the domain
2. Check that middleware isn't blocking legitimate requests
3. Verify the user exists in database with correct ID matching cookie value

## Testing Locally with Production-like Setup

To test the production configuration locally:

1. Update `.env.local`:
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Build and start:
```bash
pnpm build
pnpm start
```

Note: Local testing with `NODE_ENV=production` will use `secure: false` since localhost is HTTP.

## Additional Security Recommendations

1. **Consider using `__Host-` prefix** for even stronger cookie security:
   - Requires `secure: true`
   - Requires `path: /`
   - Cannot specify domain (auto-binds to current host)

2. **Implement CSRF protection** for form submissions

3. **Add rate limiting** to prevent brute force attacks

4. **Monitor failed login attempts** and implement account lockout

## Support
If issues persist after following this guide, check:
1. Browser console for errors
2. Network tab for failed requests
3. Server logs for authentication errors
4. Cookie configuration in DevTools

## Related Files
- `server/actions/auth.ts` - Authentication logic and cookie setting
- `middleware.ts` - Route protection and redirect logic
- `.env.local` - Environment configuration (development)
- Production environment variables - Set in your hosting platform
