-- Migration: add_email_unique_constraint
-- Description: Adds unique constraint to users.email to prevent duplicate accounts
-- Date: 2025-11-05

-- Step 1: Find and display duplicate emails (for audit purposes)
-- Uncomment to check for duplicates before cleaning:
-- SELECT email, COUNT(*) as count, array_agg(id) as user_ids
-- FROM users
-- GROUP BY email
-- HAVING COUNT(*) > 1
-- ORDER BY count DESC;

-- Step 2: Clean up duplicates (keep oldest user, delete newer ones)
-- Only run this if duplicates exist!
-- This deletes all but the first (oldest) user with each duplicate email
DELETE FROM users
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, email,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as row_num
    FROM users
  ) t
  WHERE t.row_num > 1
);

-- Step 3: Add unique constraint to email column
ALTER TABLE users 
ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Step 4: Add index for faster email lookups (if not already exists)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 5: Verify constraint was added
-- Uncomment to verify:
-- SELECT conname, contype, pg_get_constraintdef(oid) as definition
-- FROM pg_constraint
-- WHERE conrelid = 'users'::regclass
-- AND conname = 'users_email_unique';

-- Notes:
-- - This migration will fail if duplicate emails exist
-- - Run Step 1 first to identify duplicates
-- - Run Step 2 to clean them up (keeps oldest user)
-- - Then run Step 3 to add the constraint
-- - Future attempts to insert duplicate emails will fail with error:
--   "duplicate key value violates unique constraint users_email_unique"
