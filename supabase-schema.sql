-- ═══════════════════════════════════════════════════════════════
--  CADI STORE — Supabase Schema (Option A: anon full access)
--  Run this entire script in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1 ── PRODUCTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  name_en     TEXT,
  description TEXT NOT NULL DEFAULT '',
  price       NUMERIC NOT NULL DEFAULT 0,
  old_price   NUMERIC,
  image       TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '',
  rating      NUMERIC DEFAULT 4.5,
  reviews     INTEGER DEFAULT 0,
  in_stock    BOOLEAN DEFAULT true,
  featured    BOOLEAN DEFAULT false,
  details     JSONB DEFAULT '[]'::jsonb,
  brand       TEXT NOT NULL DEFAULT '',
  sku         TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2 ── CATEGORIES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '📦',
  image       TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3 ── ORDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  items            JSONB NOT NULL DEFAULT '[]'::jsonb,
  total            NUMERIC NOT NULL DEFAULT 0,
  customer_name    TEXT NOT NULL DEFAULT '',
  customer_phone   TEXT NOT NULL DEFAULT '',
  customer_address TEXT NOT NULL DEFAULT '',
  status           TEXT DEFAULT 'جديد',
  date             TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- 4 ── STORE SETTINGS (single-row) ──────────────────────────
CREATE TABLE IF NOT EXISTS store_settings (
  id                      INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name              TEXT NOT NULL DEFAULT 'قادي شوب',
  store_description       TEXT NOT NULL DEFAULT '',
  phone                   TEXT NOT NULL DEFAULT '',
  whatsapp                TEXT NOT NULL DEFAULT '',
  email                   TEXT NOT NULL DEFAULT '',
  address                 TEXT NOT NULL DEFAULT '',
  instagram               TEXT NOT NULL DEFAULT '',
  twitter                 TEXT NOT NULL DEFAULT '',
  free_shipping_threshold INTEGER DEFAULT 200,
  currency                TEXT DEFAULT 'د.م',
  logo_url                TEXT DEFAULT '/images/logo.png',
  admin_password          TEXT NOT NULL DEFAULT '90809080',
  created_at              TIMESTAMPTZ DEFAULT now()
);

-- 5 ── HERO SETTINGS (single-row) ───────────────────────────
CREATE TABLE IF NOT EXISTS hero_settings (
  id                 INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  badge              TEXT NOT NULL DEFAULT '',
  title              TEXT NOT NULL DEFAULT '',
  title_highlight    TEXT NOT NULL DEFAULT '',
  subtitle           TEXT NOT NULL DEFAULT '',
  primary_btn_text   TEXT NOT NULL DEFAULT '',
  secondary_btn_text TEXT NOT NULL DEFAULT '',
  background_image   TEXT NOT NULL DEFAULT '',
  stats              JSONB DEFAULT '[]'::jsonb,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- 6 ── FEATURES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS features (
  id          SERIAL PRIMARY KEY,
  icon        TEXT NOT NULL DEFAULT '📦',
  title       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER DEFAULT 0
);

-- 7 ── TESTIMONIALS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL DEFAULT '',
  text    TEXT NOT NULL DEFAULT '',
  rating  INTEGER DEFAULT 5
);

-- ═══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY — Option A: anon has full CRUD access
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE features       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_products"        ON products       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_categories"      ON categories     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_orders"          ON orders         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_store_settings"  ON store_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_hero_settings"   ON hero_settings  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_features"        ON features       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_testimonials"    ON testimonials   FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
--  SEED — Default settings rows
-- ═══════════════════════════════════════════════════════════════

INSERT INTO store_settings (id, store_name, store_description, phone, whatsapp, email, address, instagram, twitter, free_shipping_threshold, currency, logo_url, admin_password)
VALUES (1,
  'قادي شوب',
  'متجرك المفضل لمستلزمات الحلاقة والعناية الشخصية',
  '+212 6 12 34 56 78',
  '+212612345678',
  'info@cadistore.com',
  'الدار البيضاء، المملكة المغربية',
  'cadistore',
  'cadistore',
  200,
  'د.م',
  '/images/logo.png',
  '90809080'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO hero_settings (id, badge, title, title_highlight, subtitle, primary_btn_text, secondary_btn_text, background_image, stats)
VALUES (1,
  '✨ عروض حصرية تصل إلى 40% خصم',
  'أناقتك تبدأ من',
  'قادي شوب',
  'اكتشف أرقى مستلزمات الحلاقة ومنتجات العناية الشخصية. منتجات احترافية بأسعار مميزة مع توصيل سريع لباب منزلك.',
  'تسوق الآن',
  'تصفح الأقسام',
  'https://images.pexels.com/photos/7195821/pexels-photo-7195821.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  '[{"label":"منتج متنوع","value":"+500"},{"label":"عميل سعيد","value":"+10K"},{"label":"دعم متواصل","value":"24/7"},{"label":"توصيل سريع","value":"2 يوم"}]'
) ON CONFLICT (id) DO NOTHING;
