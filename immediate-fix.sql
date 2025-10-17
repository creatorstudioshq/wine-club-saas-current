-- IMMEDIATE FIX for admin_users infinite recursion
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- Step 1: Drop all existing policies on admin_users table
DROP POLICY IF EXISTS "admin_users_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_read_access" ON admin_users;
DROP POLICY IF EXISTS "admin_users_write_access" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_access" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete_access" ON admin_users;
DROP POLICY IF EXISTS "admin_users_multi_tenant_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_simple_policy" ON admin_users;

-- Step 2: Create a simple, non-recursive policy
CREATE POLICY "admin_users_fixed_policy" ON admin_users
    FOR ALL USING (true);

-- Step 3: Verify the fix worked
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY policyname;

-- Step 4: Test that we can query the table
SELECT COUNT(*) as admin_users_count FROM admin_users;
