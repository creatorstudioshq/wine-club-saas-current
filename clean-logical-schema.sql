-- CLEAN LOGICAL DATABASE SCHEMA
-- Left-to-Right Flow: Wine Clubs → Plans → Members → Shipments → Items
-- Run this in Supabase SQL Editor

-- ========================================
-- STEP 1: DROP ALL EXISTING TABLES
-- ========================================

-- Drop in reverse dependency order
DROP TABLE IF EXISTS plan_preference_matrix CASCADE;
DROP TABLE IF EXISTS plan_wine_assignments CASCADE;
DROP TABLE IF EXISTS member_selections CASCADE;
DROP TABLE IF EXISTS shipment_items CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS custom_preferences CASCADE;
DROP TABLE IF EXISTS global_preferences CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS wine_preferences CASCADE;
DROP TABLE IF EXISTS kv_store_9d538b9c CASCADE;
DROP TABLE IF EXISTS wine_clubs CASCADE;

-- ========================================
-- STEP 2: CREATE TABLES IN LOGICAL ORDER
-- ========================================

-- 1. WINE CLUBS (Root Entity - Left Side)
CREATE TABLE wine_clubs (
  id VARCHAR(50) PRIMARY KEY, -- Sequential: 1, 2, 3...
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  square_location_id VARCHAR(255),
  square_access_token TEXT,
  branding_logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SUBSCRIPTION PLANS (Directly from Wine Clubs)
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- Gold, Silver, Platinum
  bottle_count INTEGER NOT NULL,
  frequency VARCHAR(50) NOT NULL, -- monthly, bi-monthly
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  description TEXT[], -- Array of description lines
  icon_url TEXT,
  square_segment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MEMBERS (From Wine Clubs + Plans)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  subscription_plan_id UUID REFERENCES subscription_plans(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  square_customer_id VARCHAR(255),
  has_payment_method BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wine_club_id, email)
);

-- 4. SHIPMENTS (From Wine Clubs)
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  ship_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SHIPMENT ITEMS (From Shipments + Plans)
CREATE TABLE shipment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  square_item_id VARCHAR(255) NOT NULL,
  square_variation_id VARCHAR(255),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MEMBER SELECTIONS (From Members + Shipments)
CREATE TABLE member_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  approved_at TIMESTAMP WITH TIME ZONE,
  delivery_date DATE,
  wine_preferences JSONB,
  approval_token UUID DEFAULT uuid_generate_v4(),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, shipment_id)
);

-- 7. GLOBAL PREFERENCES (From Wine Clubs)
CREATE TABLE global_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  wine_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CUSTOM PREFERENCES (From Wine Clubs + Members)
CREATE TABLE custom_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  wine_assignments JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wine_club_id, member_id)
);

-- 9. ADMIN USERS (From Wine Clubs - nullable for SaaS admin)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) REFERENCES wine_clubs(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. WINE PREFERENCES (Global Reference Table)
CREATE TABLE wine_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PLAN PREFERENCE MATRIX (From Plans + Preferences)
CREATE TABLE plan_preference_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  preference_id UUID NOT NULL REFERENCES wine_preferences(id) ON DELETE CASCADE,
  category_ids TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscription_plan_id, preference_id)
);

-- 12. PLAN WINE ASSIGNMENTS (From Plans + Preferences)
CREATE TABLE plan_wine_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  preference_id UUID REFERENCES wine_preferences(id) ON DELETE CASCADE,
  square_item_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. KV STORE (From Wine Clubs)
CREATE TABLE kv_store_9d538b9c (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  wine_club_id VARCHAR(50) REFERENCES wine_clubs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- STEP 3: ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE wine_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_preference_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_wine_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_store_9d538b9c ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: CREATE SIMPLE RLS POLICIES
-- ========================================

CREATE POLICY "wine_clubs_policy" ON wine_clubs FOR ALL USING (true);
CREATE POLICY "subscription_plans_policy" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "members_policy" ON members FOR ALL USING (true);
CREATE POLICY "shipments_policy" ON shipments FOR ALL USING (true);
CREATE POLICY "shipment_items_policy" ON shipment_items FOR ALL USING (true);
CREATE POLICY "member_selections_policy" ON member_selections FOR ALL USING (true);
CREATE POLICY "global_preferences_policy" ON global_preferences FOR ALL USING (true);
CREATE POLICY "custom_preferences_policy" ON custom_preferences FOR ALL USING (true);
CREATE POLICY "admin_users_policy" ON admin_users FOR ALL USING (true);
CREATE POLICY "wine_preferences_policy" ON wine_preferences FOR ALL USING (true);
CREATE POLICY "plan_preference_matrix_policy" ON plan_preference_matrix FOR ALL USING (true);
CREATE POLICY "plan_wine_assignments_policy" ON plan_wine_assignments FOR ALL USING (true);
CREATE POLICY "kv_store_policy" ON kv_store_9d538b9c FOR ALL USING (true);

-- ========================================
-- STEP 5: CREATE PERFORMANCE INDEXES
-- ========================================

-- Wine club foreign key indexes
CREATE INDEX idx_subscription_plans_wine_club_id ON subscription_plans(wine_club_id);
CREATE INDEX idx_members_wine_club_id ON members(wine_club_id);
CREATE INDEX idx_shipments_wine_club_id ON shipments(wine_club_id);
CREATE INDEX idx_global_preferences_wine_club_id ON global_preferences(wine_club_id);
CREATE INDEX idx_custom_preferences_wine_club_id ON custom_preferences(wine_club_id);
CREATE INDEX idx_admin_users_wine_club_id ON admin_users(wine_club_id);
CREATE INDEX idx_kv_store_wine_club_id ON kv_store_9d538b9c(wine_club_id);

-- Other important indexes
CREATE INDEX idx_members_subscription_plan_id ON members(subscription_plan_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_shipment_items_shipment_id ON shipment_items(shipment_id);
CREATE INDEX idx_shipment_items_subscription_plan_id ON shipment_items(subscription_plan_id);
CREATE INDEX idx_member_selections_member_id ON member_selections(member_id);
CREATE INDEX idx_member_selections_shipment_id ON member_selections(shipment_id);
CREATE INDEX idx_custom_preferences_member_id ON custom_preferences(member_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_wine_preferences_code ON wine_preferences(code);
CREATE INDEX idx_plan_preference_matrix_plan_id ON plan_preference_matrix(subscription_plan_id);
CREATE INDEX idx_plan_preference_matrix_preference_id ON plan_preference_matrix(preference_id);
CREATE INDEX idx_plan_wine_assignments_plan_id ON plan_wine_assignments(subscription_plan_id);
CREATE INDEX idx_plan_wine_assignments_preference_id ON plan_wine_assignments(preference_id);

-- ========================================
-- STEP 6: INSERT CLEAN SAMPLE DATA
-- ========================================

-- Insert Wine Club #1 (King Frosch)
INSERT INTO wine_clubs (id, name, email) VALUES 
('1', 'King Frosch Wine Club', 'admin@kingfrosch.com')
ON CONFLICT (id) DO NOTHING;

-- Insert Subscription Plans for Wine Club #1
INSERT INTO subscription_plans (wine_club_id, name, bottle_count, frequency, discount_percentage, description) VALUES
('1', 'Gold', 3, 'monthly', 20.00, ARRAY['Premium wine selection', 'Monthly delivery', 'Exclusive access']),
('1', 'Silver', 6, 'monthly', 15.00, ARRAY['Curated wine selection', 'Monthly delivery', 'Member discounts']),
('1', 'Platinum', 12, 'monthly', 25.00, ARRAY['Premium wine collection', 'Monthly delivery', 'VIP access', 'Bonus wines'])
ON CONFLICT DO NOTHING;

-- Insert sample members for Wine Club #1
INSERT INTO members (wine_club_id, email, name, phone, subscription_plan_id, square_customer_id, has_payment_method, status) VALUES
('1', 'john.doe@example.com', 'John Doe', '+1-555-0123', (SELECT id FROM subscription_plans WHERE wine_club_id = '1' AND name = 'Gold' LIMIT 1), 'CUSTOMER_001', true, 'active'),
('1', 'jane.smith@example.com', 'Jane Smith', '+1-555-0124', (SELECT id FROM subscription_plans WHERE wine_club_id = '1' AND name = 'Silver' LIMIT 1), 'CUSTOMER_002', true, 'active'),
('1', 'bob.wilson@example.com', 'Bob Wilson', '+1-555-0125', (SELECT id FROM subscription_plans WHERE wine_club_id = '1' AND name = 'Platinum' LIMIT 1), 'CUSTOMER_003', false, 'active')
ON CONFLICT (wine_club_id, email) DO NOTHING;

-- Insert sample admin users
INSERT INTO admin_users (wine_club_id, email, name, role, is_active) VALUES
(NULL, 'jimmy@arccom.io', 'Jimmy Arc', 'saas_admin', true),
('1', 'klausbellinghausen@gmail.com', 'Klaus Bellinghausen', 'owner', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample global preferences (REAL DATA from wine club setup)
INSERT INTO global_preferences (wine_club_id, name, description, wine_categories) VALUES
('1', 'Red Wine Lovers', 'For members who prefer red wines', ARRAY['Cabernet Sauvignon', 'Merlot', 'Pinot Noir']),
('1', 'White Wine Enthusiasts', 'For members who prefer white wines', ARRAY['Chardonnay', 'Sauvignon Blanc', 'Pinot Grigio']),
('1', 'Mixed Selection', 'For members who enjoy variety', ARRAY['Red', 'White', 'Rosé', 'Sparkling'])
ON CONFLICT DO NOTHING;

-- Insert sample wine preferences (global reference)
INSERT INTO wine_preferences (code, label, description) VALUES
('RED_DRY', 'Dry Red Wines', 'Full-bodied red wines with minimal sweetness'),
('WHITE_CRISP', 'Crisp White Wines', 'Light, refreshing white wines'),
('SPARKLING', 'Sparkling Wines', 'Champagne and sparkling wine selections'),
('ROSE', 'Rosé Wines', 'Pink wines with balanced flavors')
ON CONFLICT (code) DO NOTHING;

-- Insert sample KV store entries (with proper wine_club_id)
INSERT INTO kv_store_9d538b9c (key, value, wine_club_id) VALUES
('square_config_1', '{"location_id": "L123456789", "access_token": "***", "connected": true}', '1'),
('shipping_zones_1', '{"zones": [{"name": "Zone 1", "rate": 15.99}, {"name": "Zone 2", "rate": 18.99}]}', '1')
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- STEP 7: VERIFICATION QUERIES
-- ========================================

-- Verify the data structure
SELECT 'Wine Clubs:' as table_name, count(*) as count FROM wine_clubs
UNION ALL
SELECT 'Subscription Plans:', count(*) FROM subscription_plans
UNION ALL
SELECT 'Members:', count(*) FROM members
UNION ALL
SELECT 'Admin Users:', count(*) FROM admin_users
UNION ALL
SELECT 'Global Preferences:', count(*) FROM global_preferences
UNION ALL
SELECT 'Wine Preferences:', count(*) FROM wine_preferences
UNION ALL
SELECT 'KV Store:', count(*) FROM kv_store_9d538b9c;

-- Verify foreign key relationships work
SELECT 
  wc.name as wine_club,
  COUNT(sp.id) as plans,
  COUNT(m.id) as members,
  COUNT(gp.id) as global_preferences
FROM wine_clubs wc
LEFT JOIN subscription_plans sp ON wc.id = sp.wine_club_id
LEFT JOIN members m ON wc.id = m.wine_club_id
LEFT JOIN global_preferences gp ON wc.id = gp.wine_club_id
GROUP BY wc.id, wc.name;

-- Verify KV store has proper wine_club_id associations
SELECT key, wine_club_id, created_at FROM kv_store_9d538b9c ORDER BY created_at;
