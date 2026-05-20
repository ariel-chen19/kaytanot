-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Camps table
CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  city TEXT NOT NULL,
  age_min INT NOT NULL DEFAULT 6,
  age_max INT NOT NULL DEFAULT 18,
  price_basic NUMERIC(10,2),
  price_advanced NUMERIC(10,2),
  image_url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('basic', 'advanced')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Camps: owner sees only their own
CREATE POLICY "owners_see_own_camps" ON camps
  FOR ALL USING (auth.uid() = owner_id);

-- Public can read active camps
CREATE POLICY "public_read_active_camps" ON camps
  FOR SELECT USING (is_active = true);

-- Leads: owner sees leads for their camps only
CREATE POLICY "owners_see_own_leads" ON leads
  FOR SELECT USING (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  );

-- Leads: anyone can insert (contact form)
CREATE POLICY "anyone_can_insert_leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Payments: owners see their own
CREATE POLICY "owners_see_own_payments" ON payments
  FOR ALL USING (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  );
