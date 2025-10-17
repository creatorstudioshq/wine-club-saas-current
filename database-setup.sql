-- Wine Club SaaS Database Setup
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Wine Club Clients (Multi-tenant support)
CREATE TABLE IF NOT EXISTS wine_clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id UUID NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
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

-- Members
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id UUID NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
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

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id UUID NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  ship_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, shipped, delivered
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Shipment Items (which Square wines go in which plan tier)
CREATE TABLE IF NOT EXISTS shipment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  square_item_id VARCHAR(255) NOT NULL, -- Store Square Item ID directly
  square_variation_id VARCHAR(255), -- Store Square Variation ID for pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;

-- Member Wine Selections & Approvals
CREATE TABLE IF NOT EXISTS member_selections (
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

-- Custom Preferences (for custom wine assignments)
CREATE TABLE IF NOT EXISTS custom_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_club_id UUID NOT NULL REFERENCES wine_clubs(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  wine_assignments JSONB NOT NULL, -- Array of {wine_id, wine_name, quantity}
  total_bottles INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE custom_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Wine Clubs: Allow all operations for now (will be restricted later)
CREATE POLICY "wine_clubs_policy" ON wine_clubs
  FOR ALL USING (true);

-- All other tables: Filter by wine_club_id
CREATE POLICY "subscription_plans_policy" ON subscription_plans
  FOR ALL USING (true);

CREATE POLICY "members_policy" ON members
  FOR ALL USING (true);

CREATE POLICY "shipments_policy" ON shipments
  FOR ALL USING (true);

CREATE POLICY "shipment_items_policy" ON shipment_items
  FOR ALL USING (true);

CREATE POLICY "member_selections_policy" ON member_selections
  FOR ALL USING (true);

CREATE POLICY "custom_preferences_policy" ON custom_preferences
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_wine_club_id ON members(wine_club_id);
CREATE INDEX IF NOT EXISTS idx_shipments_wine_club_id ON shipments(wine_club_id);
CREATE INDEX IF NOT EXISTS idx_shipment_items_square_item_id ON shipment_items(square_item_id);
CREATE INDEX IF NOT EXISTS idx_member_selections_approval_token ON member_selections(approval_token);
CREATE INDEX IF NOT EXISTS idx_member_selections_member_id ON member_selections(member_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_wine_club_id ON subscription_plans(wine_club_id);
CREATE INDEX IF NOT EXISTS idx_custom_preferences_wine_club_id ON custom_preferences(wine_club_id);

-- Insert Wine Club Client #1 (King Frosch)
INSERT INTO wine_clubs (id, name, email) VALUES 
('1', 'King Frosch Wine Club', 'admin@kingfrosch.com')
ON CONFLICT (id) DO NOTHING;

-- Insert Subscription Plans for Wine Club #1
INSERT INTO subscription_plans (wine_club_id, name, bottle_count, frequency, discount_percentage, description) VALUES
('1', 'Gold', 3, 'monthly', 10.00, ARRAY['Perfect for wine enthusiasts who want variety', 'Curated selection of premium wines']),
('1', 'Silver', 6, 'monthly', 15.00, ARRAY['Most popular choice for serious wine lovers', 'Expanded selection with exclusive bottles']),
('1', 'Platinum', 12, 'monthly', 20.00, ARRAY['Premium selection for collectors and connoisseurs', 'Largest selection with rare finds'])
ON CONFLICT DO NOTHING;
