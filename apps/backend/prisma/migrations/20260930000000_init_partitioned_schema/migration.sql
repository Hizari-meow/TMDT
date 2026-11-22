-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. PRODUCTS TABLE (WITH CHECK CONSTRAINT ON STOCK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "products" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" NUMERIC(10, 2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "check_stock_positive" CHECK ("stock" >= 0)
);

-- ==============================================================================
-- 3. FLASH SALES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "flash_sales" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "flash_price" NUMERIC(10, 2) NOT NULL,
    "allocated_stock" INTEGER NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. ORDERS TABLE (RANGE PARTITIONED BY MONTH ON created_at)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tracking_id" UUID NOT NULL,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "flash_sale_id" UUID NOT NULL REFERENCES "flash_sales"("id") ON DELETE RESTRICT,
    "status" VARCHAR(32) NOT NULL DEFAULT 'PENDING_PAYMENT',
    "total_amount" NUMERIC(10, 2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id", "created_at")
) PARTITION BY RANGE ("created_at");

-- Monthly Partitions
CREATE TABLE IF NOT EXISTS "orders_2026_09" PARTITION OF "orders"
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS "orders_2026_10" PARTITION OF "orders"
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS "orders_2026_11" PARTITION OF "orders"
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS "orders_2026_12" PARTITION OF "orders"
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS "orders_default" PARTITION OF "orders" DEFAULT;

-- Partitioned Table Indexes
CREATE INDEX IF NOT EXISTS "idx_orders_tracking_id" ON "orders" ("tracking_id");
CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "idx_orders_created_at" ON "orders" ("created_at");

-- ==============================================================================
-- 5. ORDER ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "order_created_at" TIMESTAMPTZ NOT NULL,
    "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" NUMERIC(10, 2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_order_items_orders" FOREIGN KEY ("order_id", "order_created_at") 
        REFERENCES "orders" ("id", "created_at") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_order_items_order_id" ON "order_items" ("order_id");

-- ==============================================================================
-- 6. PROCESSED PAYMENTS TABLE (WITH UNIQUE TRANSACTION_ID)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "processed_payments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "transaction_id" VARCHAR(128) NOT NULL,
    "order_id" UUID NOT NULL,
    "amount" NUMERIC(10, 2) NOT NULL,
    "status" VARCHAR(32) NOT NULL,
    "processed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_processed_payments_txn" UNIQUE ("transaction_id")
);

CREATE INDEX IF NOT EXISTS "idx_processed_payments_order_id" ON "processed_payments" ("order_id");

-- ==============================================================================
-- 7. IDEMPOTENCY KEYS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "idempotency_keys" (
    "key" VARCHAR(128) PRIMARY KEY,
    "order_id" UUID,
    "response_payload" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
