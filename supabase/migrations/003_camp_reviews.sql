CREATE TABLE IF NOT EXISTS camp_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('google', 'site')),
  external_id TEXT,
  author_name TEXT NOT NULL,
  author_city TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_date DATE,
  review_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, external_id)
);

CREATE INDEX IF NOT EXISTS camp_reviews_camp_id_idx ON camp_reviews(camp_id);
CREATE INDEX IF NOT EXISTS camp_reviews_featured_idx ON camp_reviews(camp_id, is_featured, sort_order, review_date DESC);

ALTER TABLE camp_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_featured_reviews" ON camp_reviews
  FOR SELECT USING (is_featured = true);

CREATE POLICY "owners_manage_own_camp_reviews" ON camp_reviews
  FOR ALL USING (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    camp_id IN (SELECT id FROM camps WHERE owner_id = auth.uid())
  );

