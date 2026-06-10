-- Lead tracking and delivery foundation

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'closed', 'irrelevant')),
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'landing_form',
  ADD COLUMN IF NOT EXISTS source_page TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

CREATE INDEX IF NOT EXISTS leads_camp_created_idx
  ON leads(camp_id, created_at DESC);

CREATE INDEX IF NOT EXISTS leads_status_idx
  ON leads(status);

CREATE TABLE IF NOT EXISTS camp_lead_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID NOT NULL UNIQUE REFERENCES camps(id) ON DELETE CASCADE,
  google_sheets_enabled BOOLEAN NOT NULL DEFAULT false,
  google_sheet_id TEXT,
  google_sheet_tab_name TEXT NOT NULL DEFAULT 'Leads',
  owner_whatsapp TEXT,
  whatsapp_digest_frequency TEXT NOT NULL DEFAULT 'none'
    CHECK (whatsapp_digest_frequency IN ('none', 'immediate', 'hourly', 'daily')),
  internal_crm_enabled BOOLEAN NOT NULL DEFAULT false,
  external_webhook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS camp_lead_settings_camp_id_idx
  ON camp_lead_settings(camp_id);

ALTER TABLE camp_lead_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_manage_own_lead_settings" ON camp_lead_settings
  FOR ALL USING (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS lead_delivery_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('google_sheets', 'whatsapp_digest', 'external_webhook', 'admin_email')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed', 'retrying', 'skipped')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempts INT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_delivery_jobs_status_idx
  ON lead_delivery_jobs(status, next_attempt_at);

CREATE INDEX IF NOT EXISTS lead_delivery_jobs_lead_id_idx
  ON lead_delivery_jobs(lead_id);

CREATE INDEX IF NOT EXISTS lead_delivery_jobs_camp_id_idx
  ON lead_delivery_jobs(camp_id, created_at DESC);

ALTER TABLE lead_delivery_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_see_own_delivery_jobs" ON lead_delivery_jobs
  FOR SELECT USING (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  );
