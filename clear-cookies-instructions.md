# Clear Cookies Instructions

To fix the ERR_TOO_MANY_REDIRECTS error:

## Method 1: Clear Cookies in Browser (Recommended)

### Chrome/Edge:
1. Press `Cmd + Shift + Delete` (Mac) or `Ctrl + Shift + Delete` (Windows)
2. Select "Cookies and other site data"
3. Select "All time"
4. Click "Clear data"

### Firefox:
1. Press `Cmd + Shift + Delete` (Mac) or `Ctrl + Shift + Delete` (Windows)
2. Select "Cookies"
3. Select "Everything"
4. Click "Clear Now"

### Safari:
1. Safari Menu → Preferences → Privacy
2. Click "Manage Website Data"
3. Search for "localhost"
4. Click "Remove" then "Done"

## Method 2: Clear Specific Cookie via DevTools

1. Open DevTools (F12 or right-click → Inspect)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Expand "Cookies" in the left sidebar
4. Click on "http://localhost:3000"
5. Find and delete the cookie named `auth_session`
6. Refresh the page

## What Was Fixed

The issue was caused by:
- Both users and admins using the same cookie name (`auth_session`)
- Regular users stored in `users` table, admins in `admins` table
- When a user tried to access `/admin`, they had a valid cookie but weren't in the admins table
- This created a redirect loop: /admin → /admin-login → /admin → ...

The fix:
- Updated `requireAdmin()` to detect regular users and redirect them to `/dashboard`
- Updated middleware to allow proper authentication flow
- Now regular users accessing `/admin` will be redirected to `/dashboard`
- Admins will still access the admin panel normally

## After Clearing Cookies

1. Login as a regular user at http://localhost:3000/auth/login
2. You can now access the dashboard normally
3. Trying to access `/admin` as a user will redirect you to `/dashboard`
4. Admins should login at http://localhost:3000/admin-login
