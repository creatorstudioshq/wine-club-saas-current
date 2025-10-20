-- Fix Wine Club IDs and User Accounts
-- This script sets up the correct wine club IDs and user authentication

-- 1. Update wine clubs with correct IDs
INSERT INTO wine_clubs (id, name, email, created_at, updated_at) 
VALUES 
  ('1', 'Demo Wine Club', 'demo@wineclub.com', NOW(), NOW()),
  ('2', 'King Frosch Wine Club', 'klausbellinghausen@gmail.com', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  updated_at = NOW();

-- 2. Create admin users with correct roles
INSERT INTO admin_users (id, wine_club_id, email, name, role, is_active, created_at, updated_at)
VALUES 
  -- SaaS Parent Admin (no wine_club_id - platform admin)
  (uuid_generate_v4(), NULL, 'jimmy@arccom.io', 'Jimmy Arc', 'superadmin', true, NOW(), NOW()),
  
  -- King Frosch Wine Club Owner (wine_club_id = 2)
  (uuid_generate_v4(), '2', 'klausbellinghausen@gmail.com', 'Klaus Bellinghausen', 'owner', true, NOW(), NOW()),
  
  -- Demo Wine Club Admin (wine_club_id = 1)
  (uuid_generate_v4(), '1', 'demo@wineclub.com', 'Demo Admin', 'admin', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  wine_club_id = EXCLUDED.wine_club_id,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 3. Create sample subscription plans for both wine clubs
INSERT INTO subscription_plans (id, wine_club_id, name, bottle_count, frequency, discount_percentage, description, created_at, updated_at)
VALUES 
  -- Demo Wine Club Plans (ID: 1)
  (uuid_generate_v4(), '1', 'Bronze', 3, 'monthly', 10, ARRAY['Perfect for wine enthusiasts', '3 bottles monthly'], NOW(), NOW()),
  (uuid_generate_v4(), '1', 'Silver', 6, 'monthly', 15, ARRAY['Great for sharing', '6 bottles monthly'], NOW(), NOW()),
  (uuid_generate_v4(), '1', 'Gold', 12, 'monthly', 20, ARRAY['Premium experience', '12 bottles monthly'], NOW(), NOW()),
  
  -- King Frosch Wine Club Plans (ID: 2)
  (uuid_generate_v4(), '2', 'Classic', 3, 'monthly', 10, ARRAY['Curated German wines', '3 bottles monthly'], NOW(), NOW()),
  (uuid_generate_v4(), '2', 'Premium', 6, 'monthly', 15, ARRAY['Premium German selection', '6 bottles monthly'], NOW(), NOW()),
  (uuid_generate_v4(), '2', 'Elite', 12, 'monthly', 20, ARRAY['Exclusive German wines', '12 bottles monthly'], NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 4. Create sample members for King Frosch Wine Club
INSERT INTO members (id, wine_club_id, email, name, phone, subscription_plan_id, square_customer_id, has_payment_method, status, created_at, updated_at)
SELECT 
  uuid_generate_v4(),
  '2',
  'member1@kingfrosch.com',
  'Hans Mueller',
  '+49 123 456 7890',
  sp.id,
  'sq_customer_1',
  true,
  'active',
  NOW(),
  NOW()
FROM subscription_plans sp 
WHERE sp.wine_club_id = '2' AND sp.name = 'Classic'
LIMIT 1;

INSERT INTO members (id, wine_club_id, email, name, phone, subscription_plan_id, square_customer_id, has_payment_method, status, created_at, updated_at)
SELECT 
  uuid_generate_v4(),
  '2',
  'member2@kingfrosch.com',
  'Anna Schmidt',
  '+49 987 654 3210',
  sp.id,
  'sq_customer_2',
  true,
  'active',
  NOW(),
  NOW()
FROM subscription_plans sp 
WHERE sp.wine_club_id = '2' AND sp.name = 'Premium'
LIMIT 1;

-- 5. Create sample global preferences for both wine clubs
INSERT INTO global_preferences (id, wine_club_id, name, description, wine_categories, created_at, updated_at)
VALUES 
  ('1', '1', 'Red Wine Lover', 'Prefers bold red wines', ARRAY['red', 'bold'], NOW(), NOW()),
  ('1', '1', 'White Wine Enthusiast', 'Enjoys crisp white wines', ARRAY['white', 'crisp'], NOW(), NOW()),
  ('1', '2', 'German Wine Specialist', 'Expert in German wine regions', ARRAY['german', 'regional'], NOW(), NOW()),
  ('1', '2', 'Riesling Connoisseur', 'Passionate about Riesling varieties', ARRAY['riesling', 'sweet'], NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 6. Verify the setup
SELECT 'Wine Clubs:' as info;
SELECT id, name, email FROM wine_clubs ORDER BY id;

SELECT 'Admin Users:' as info;
SELECT wine_club_id, email, name, role FROM admin_users ORDER BY wine_club_id, role;

SELECT 'Subscription Plans:' as info;
SELECT wine_club_id, name, bottle_count FROM subscription_plans ORDER BY wine_club_id, bottle_count;

SELECT 'Members:' as info;
SELECT wine_club_id, email, name, status FROM members ORDER BY wine_club_id;
