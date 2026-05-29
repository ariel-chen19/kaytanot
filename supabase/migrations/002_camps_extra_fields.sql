-- Add rich content columns to camps table
ALTER TABLE camps
  ADD COLUMN IF NOT EXISTS activities JSONB,
  ADD COLUMN IF NOT EXISTS cycles     JSONB,
  ADD COLUMN IF NOT EXISTS cities     TEXT[],
  ADD COLUMN IF NOT EXISTS faq        JSONB;

-- Optional: example comment showing expected shapes
-- activities: ["שחייה", "כדורסל", "ריקוד"]
-- cycles:     [{"label":"מחזור א","dates":"1-14 יולי","days":"א-ה","hours":"08:00-16:00"}]
-- cities:     ["תל אביב", "רמת גן", "פתח תקווה"]
-- faq:        [{"q":"האם יש הסעות?","a":"כן, בתוספת תשלום"}]
