CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  seller_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  quantity INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_category ON products(seller_id, category);
