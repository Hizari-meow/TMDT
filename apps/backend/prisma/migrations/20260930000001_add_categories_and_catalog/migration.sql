-- ==============================================================================
-- 1. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "categories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "slug" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. ADD CATEGORY_ID & IMAGE_URL TO PRODUCTS
-- ==============================================================================
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "image_url" VARCHAR(512);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "products"("category_id");

-- ==============================================================================
-- 3. ADD ORDER_TYPE & ALLOW NULL FLASH_SALE_ID IN ORDERS
-- ==============================================================================
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "order_type" VARCHAR(32) NOT NULL DEFAULT 'FLASH_SALE';
ALTER TABLE "orders" ALTER COLUMN "flash_sale_id" DROP NOT NULL;
