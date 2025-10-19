-- Fix Wine Club SaaS Database Schema
-- Run this in Supabase SQL Editor to fix UUID issues

-- First, let's check if we need to drop and recreate tables
-- This will fix the UUID vs string ID issue

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS member_selections CASCADE;
DROP TABLE IF EXISTS shipment_items CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS custom_preferences CASCADE;
DROP TABLE IF EXISTS global_preferences CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS wine_clubs CASCADE;

-- Recreate wine_clubs table with STRING ID instead of UUID
CREATE TABLE wine_clubs (
  id VARCHAR(50) PRIMARY KEY, -- Use string ID for wine clubs (1, 2, 3, etc.)
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  square_location_id VARCHAR(255),
  square_access_token TEXT, -- Encrypted in production
  branding_logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wine_clubs ENABLE ROW LEVEL SECURITY;

-- Recreate subscription_plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE, -- Changed to VARCHAR
  name VARCHAR(100) NOT NULL, -- Gold, Silver, Platinum
  bottle_count INTEGER NOT NULL,
  frequency VARCHAR(50) NOT NULL, -- monthly, bi-monthly
  discount_percentage DECIMAL(5,2) DEFAULT 0, -- 10.00, 15.00, 20.00
  description TEXT[], -- Array of description lines
  icon_url TEXT, -- URL to plan icon
  square_segment_id VARCHAR(255), -- Square customer group ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Recreate members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE, -- Changed to VARCHAR
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subscription_plan_id UUID REFERENCES subscription_plans(id),
  square_customer_id VARCHAR(255), -- Square Customer ID
  has_payment_method BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active', -- active, paused, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wine_club_id, email)
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Recreate shipments table
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE, -- Changed to VARCHAR
  name VARCHAR(255) NOT NULL,
  ship_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, shipped, delivered
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Recreate shipment_items table
CREATE TABLE shipment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  square_item_id VARCHAR(255) NOT NULL, -- Store Square Item ID directly
  square_variation_id VARCHAR(255), -- Store Square Variation ID for pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;

-- Recreate member_selections table
CREATE TABLE member_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  approved_at TIMESTAMP WITH TIME ZONE,
  delivery_date DATE,
  wine_preferences JSONB, -- Store wine swaps, bonus items, etc.
  approval_token UUID DEFAULT uuid_generate_v4(), -- For email/SMS approval links
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, shipped
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, shipment_id)
);

ALTER TABLE member_selections ENABLE ROW LEVEL SECURITY;

-- Recreate global_preferences table
CREATE TABLE global_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE, -- Changed to VARCHAR
  name VARCHAR(255) NOT NULL,
  description TEXT,
  wine_categories TEXT[], -- Array of wine categories
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE global_preferences ENABLE ROW LEVEL SECURITY;

-- Recreate custom_preferences table
CREATE TABLE custom_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE, -- Changed to VARCHAR
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  wine_assignments JSONB NOT NULL, -- Array of {wine_id, quantity} objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wine_club_id, member_id)
);

ALTER TABLE custom_preferences ENABLE ROW LEVEL SECURITY;

-- Recreate admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id VARCHAR(50) REFERENCES wine_clubs(id) ON DELETE CASCADE, -- Changed to VARCHAR, nullable for SaaS admin
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin', -- saas_admin, owner, admin, staff
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "wine_clubs_policy" ON wine_clubs FOR ALL USING (true);
CREATE POLICY "subscription_plans_policy" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "members_policy" ON members FOR ALL USING (true);
CREATE POLICY "shipments_policy" ON shipments FOR ALL USING (true);
CREATE POLICY "shipment_items_policy" ON shipment_items FOR ALL USING (true);
CREATE POLICY "member_selections_policy" ON member_selections FOR ALL USING (true);
CREATE POLICY "global_preferences_policy" ON global_preferences FOR ALL USING (true);
CREATE POLICY "custom_preferences_policy" ON custom_preferences FOR ALL USING (true);
CREATE POLICY "admin_users_policy" ON admin_users FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_subscription_plans_wine_club_id ON subscription_plans(wine_club_id);
CREATE INDEX idx_members_wine_club_id ON members(wine_club_id);
CREATE INDEX idx_members_subscription_plan_id ON members(subscription_plan_id);
CREATE INDEX idx_shipments_wine_club_id ON shipments(wine_club_id);
CREATE INDEX idx_shipment_items_shipment_id ON shipment_items(shipment_id);
CREATE INDEX idx_shipment_items_subscription_plan_id ON shipment_items(subscription_plan_id);
CREATE INDEX idx_member_selections_member_id ON member_selections(member_id);
CREATE INDEX idx_member_selections_shipment_id ON member_selections(shipment_id);
CREATE INDEX idx_global_preferences_wine_club_id ON global_preferences(wine_club_id);
CREATE INDEX idx_custom_preferences_wine_club_id ON custom_preferences(wine_club_id);
CREATE INDEX idx_custom_preferences_member_id ON custom_preferences(member_id);
CREATE INDEX idx_admin_users_wine_club_id ON admin_users(wine_club_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Insert sample data with STRING IDs
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

-- Insert sample global preferences
INSERT INTO global_preferences (wine_club_id, name, description, wine_categories) VALUES
('1', 'Red Wine Lovers', 'For members who prefer red wines', ARRAY['Cabernet Sauvignon', 'Merlot', 'Pinot Noir']),
('1', 'White Wine Enthusiasts', 'For members who prefer white wines', ARRAY['Chardonnay', 'Sauvignon Blanc', 'Pinot Grigio']),
('1', 'Mixed Selection', 'For members who enjoy variety', ARRAY['Red', 'White', 'Rosé', 'Sparkling'])
ON CONFLICT DO NOTHING;

-- Verify the data
SELECT 'Wine Clubs:' as table_name, count(*) as count FROM wine_clubs
UNION ALL
SELECT 'Subscription Plans:', count(*) FROM subscription_plans
UNION ALL
SELECT 'Members:', count(*) FROM members
UNION ALL
SELECT 'Admin Users:', count(*) FROM admin_users
UNION ALL
SELECT 'Global Preferences:', count(*) FROM global_preferences;
