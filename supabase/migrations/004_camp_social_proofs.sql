CREATE TABLE IF NOT EXISTS camp_social_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  proof_type TEXT NOT NULL CHECK (proof_type IN ('google_review', 'manual_text', 'image_testimonial')),
  source TEXT NOT NULL DEFAULT 'site' CHECK (source IN ('google', 'site', 'whatsapp', 'other')),
  author_name TEXT,
  author_city TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  body_text TEXT,
  image_url TEXT,
  review_date DATE,
  source_label TEXT,
  source_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT camp_social_proofs_content_check CHECK (
    (proof_type = 'image_testimonial' AND image_url IS NOT NULL) OR
    (proof_type IN ('google_review', 'manual_text') AND body_text IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS camp_social_proofs_camp_id_idx
  ON camp_social_proofs(camp_id);

CREATE INDEX IF NOT EXISTS camp_social_proofs_featured_idx
  ON camp_social_proofs(camp_id, is_featured, sort_order, review_date DESC);

ALTER TABLE camp_social_proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_featured_social_proofs" ON camp_social_proofs
  FOR SELECT USING (is_featured = true);

CREATE POLICY "owners_manage_own_social_proofs" ON camp_social_proofs
  FOR ALL USING (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  );