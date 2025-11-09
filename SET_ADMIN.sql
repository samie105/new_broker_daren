-- ADMIN SETUP SCRIPT
-- Run this to set a user as admin

-- Example: Set user with specific email as admin
-- Replace 'your-email@example.com' with your actual email

UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Or set the first user as admin
UPDATE users 
SET role = 'admin' 
WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);

-- Verify admin users
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
WHERE role IN ('admin', 'super_admin');
