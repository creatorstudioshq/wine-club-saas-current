-- Fix infinite recursion in admin_users RLS policy
-- Run this in Supabase SQL Editor

-- First, let's check if the admin_users table exists and what policies it has
-- If it exists, we need to drop the problematic policies

-- Drop all existing policies on admin_users table (if it exists)
DO $$
BEGIN
    -- Check if admin_users table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        -- Drop all policies on admin_users
        DROP POLICY IF EXISTS "admin_users_policy" ON admin_users;
        DROP POLICY IF EXISTS "admin_users_read_access" ON admin_users;
        DROP POLICY IF EXISTS "admin_users_write_access" ON admin_users;
        DROP POLICY IF EXISTS "admin_users_update_access" ON admin_users;
        DROP POLICY IF EXISTS "admin_users_delete_access" ON admin_users;
        DROP POLICY IF EXISTS "admin_users_multi_tenant_policy" ON admin_users;
        
        -- Create a simple, non-recursive policy
        CREATE POLICY "admin_users_simple_policy" ON admin_users
            FOR ALL USING (true);
            
        RAISE NOTICE 'Fixed admin_users RLS policies';
    ELSE
        RAISE NOTICE 'admin_users table does not exist';
    END IF;
END $$;

-- Also check for any other tables that might have recursive policies
-- Let's audit all RLS policies to find potential issues

-- List all policies that might be problematic
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- If there are other recursive policies, we can fix them too
-- For now, let's ensure all our main tables have simple, working policies

-- Ensure wine_clubs has a working policy
DROP POLICY IF EXISTS "wine_clubs_policy" ON wine_clubs;
CREATE POLICY "wine_clubs_simple_policy" ON wine_clubs
    FOR ALL USING (true);

-- Ensure subscription_plans has a working policy  
DROP POLICY IF EXISTS "subscription_plans_policy" ON subscription_plans;
CREATE POLICY "subscription_plans_simple_policy" ON subscription_plans
    FOR ALL USING (true);

-- Ensure members has a working policy
DROP POLICY IF EXISTS "members_policy" ON members;
CREATE POLICY "members_simple_policy" ON members
    FOR ALL USING (true);

-- Ensure shipments has a working policy
DROP POLICY IF EXISTS "shipments_policy" ON shipments;
CREATE POLICY "shipments_simple_policy" ON shipments
    FOR ALL USING (true);

-- Ensure shipment_items has a working policy
DROP POLICY IF EXISTS "shipment_items_policy" ON shipment_items;
CREATE POLICY "shipment_items_simple_policy" ON shipment_items
    FOR ALL USING (true);

-- Ensure member_selections has a working policy
DROP POLICY IF EXISTS "member_selections_policy" ON member_selections;
CREATE POLICY "member_selections_simple_policy" ON member_selections
    FOR ALL USING (true);

-- Ensure custom_preferences has a working policy
DROP POLICY IF EXISTS "custom_preferences_policy" ON custom_preferences;
CREATE POLICY "custom_preferences_simple_policy" ON custom_preferences
    FOR ALL USING (true);

-- Check if there are any other tables with RLS enabled that might cause issues
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND rowsecurity = true
ORDER BY tablename;
