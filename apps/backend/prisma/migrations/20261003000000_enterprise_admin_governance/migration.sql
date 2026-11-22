-- ==============================================================================
-- ENTERPRISE SYSTEM ADMINISTRATION & FULL LIFECYCLE LINKED GOVERNANCE
-- Products -> Inventory -> Orders -> Logistics -> COD Reconciliation
-- Orders -> CRM -> Loyalty / Tiers
-- Finance / E-Invoices -> COD Reconciliation -> Analytics
-- RBAC Admin Users -> Immutable Audit Trail -> System Configuration
-- ==============================================================================

-- 1. WAREHOUSES TABLE
CREATE TABLE IF NOT EXISTS "warehouses" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "manager" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    "capacity" INTEGER NOT NULL DEFAULT 10000,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. INVENTORY STOCKS TABLE (PER WAREHOUSE)
CREATE TABLE IF NOT EXISTS "inventory_stocks" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "warehouse_id" UUID NOT NULL REFERENCES "warehouses"("id") ON DELETE CASCADE,
    "on_hand" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "available" INTEGER NOT NULL DEFAULT 0,
    "safety_stock" INTEGER NOT NULL DEFAULT 10,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_product_warehouse" UNIQUE ("product_id", "warehouse_id"),
    CONSTRAINT "chk_stocks_non_negative" CHECK ("on_hand" >= 0 AND "reserved" >= 0 AND "available" >= 0)
);

-- 3. STOCK LEDGER TABLE (IMMUTABLE INVENTORY MOVEMENTS)
CREATE TABLE IF NOT EXISTS "stock_ledger" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "warehouse_id" UUID NOT NULL REFERENCES "warehouses"("id") ON DELETE CASCADE,
    "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "type" VARCHAR(32) NOT NULL, -- 'NHAP_KHO', 'XUAT_KHO', 'TAM_GIU', 'GIAI_PHONG', 'DIEU_CHUYEN'
    "quantity" INTEGER NOT NULL,
    "balance_before" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reference_type" VARCHAR(32) NOT NULL, -- 'ORDER', 'HOLD', 'MANUAL_IMPORT', 'RETURN'
    "reference_id" VARCHAR(255),
    "note" TEXT,
    "performed_by" VARCHAR(255) NOT NULL DEFAULT 'System',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_stock_ledger_product" ON "stock_ledger"("product_id");
CREATE INDEX IF NOT EXISTS "idx_stock_ledger_warehouse" ON "stock_ledger"("warehouse_id");
CREATE INDEX IF NOT EXISTS "idx_stock_ledger_created_at" ON "stock_ledger"("created_at");

-- 4. TEMPORARY HOLDS TABLE (STOCK RESERVATIONS FOR FLASH SALES & ORDERS)
CREATE TABLE IF NOT EXISTS "temporary_holds" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "warehouse_id" UUID NOT NULL REFERENCES "warehouses"("id") ON DELETE CASCADE,
    "quantity" INTEGER NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'HELD', -- 'HELD', 'COMMITTED', 'RELEASED'
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_temporary_holds_order" ON "temporary_holds"("order_id");
CREATE INDEX IF NOT EXISTS "idx_temporary_holds_expires" ON "temporary_holds"("expires_at");

-- 5. SHIPMENTS TABLE (LOGISTICS & WAYBILLS)
CREATE TABLE IF NOT EXISTS "shipments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "carrier" VARCHAR(50) NOT NULL, -- 'GHN', 'GHTK', 'VIETTEL_POST', 'FLASH_2H'
    "tracking_code" VARCHAR(100) NOT NULL UNIQUE,
    "status" VARCHAR(32) NOT NULL DEFAULT 'CREATED', -- 'CREATED', 'PICKED', 'DELIVERING', 'DELIVERED', 'RETURNED'
    "cod_amount" NUMERIC(12, 2) NOT NULL DEFAULT 0,
    "shipping_fee" NUMERIC(10, 2) NOT NULL DEFAULT 30000,
    "recipient_name" VARCHAR(255) NOT NULL,
    "recipient_phone" VARCHAR(50) NOT NULL,
    "recipient_address" TEXT NOT NULL,
    "weight_gram" INTEGER NOT NULL DEFAULT 500,
    "estimated_delivery_at" TIMESTAMPTZ,
    "delivered_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_shipments_order_id" ON "shipments"("order_id");
CREATE INDEX IF NOT EXISTS "idx_shipments_status" ON "shipments"("status");
CREATE INDEX IF NOT EXISTS "idx_shipments_tracking" ON "shipments"("tracking_code");

-- 6. COD RECONCILIATIONS TABLE
CREATE TABLE IF NOT EXISTS "cod_reconciliations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "batch_code" VARCHAR(50) NOT NULL UNIQUE,
    "carrier" VARCHAR(50) NOT NULL,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_cod_expected" NUMERIC(14, 2) NOT NULL DEFAULT 0,
    "total_cod_received" NUMERIC(14, 2) NOT NULL DEFAULT 0,
    "discrepancy_amount" NUMERIC(14, 2) NOT NULL DEFAULT 0,
    "status" VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'MATCHED', 'DISCREPANCY', 'SETTLED'
    "settled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. FINANCE TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS "finance_transactions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID,
    "shipment_id" UUID,
    "type" VARCHAR(32) NOT NULL, -- 'REVENUE', 'COD_COLLECTION', 'SHIPPING_FEE', 'REFUND', 'COGS_EXPENSE'
    "amount" NUMERIC(14, 2) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', -- 'PENDING', 'CONFIRMED', 'RECONCILED'
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_finance_order_id" ON "finance_transactions"("order_id");
CREATE INDEX IF NOT EXISTS "idx_finance_type" ON "finance_transactions"("type");

-- 8. E-INVOICES (HÓA ĐƠN ĐIỆN TỬ VAT)
CREATE TABLE IF NOT EXISTS "e_invoices" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL UNIQUE,
    "buyer_name" VARCHAR(255) NOT NULL,
    "buyer_tax_code" VARCHAR(50),
    "buyer_address" TEXT,
    "subtotal" NUMERIC(12, 2) NOT NULL,
    "vat_rate" NUMERIC(5, 2) NOT NULL DEFAULT 10,
    "vat_amount" NUMERIC(12, 2) NOT NULL,
    "total_amount" NUMERIC(12, 2) NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'ISSUED', -- 'DRAFT', 'ISSUED', 'CQT_VERIFIED'
    "cqt_code" VARCHAR(100),
    "issued_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_e_invoices_order_id" ON "e_invoices"("order_id");

-- 9. CUSTOMERS CRM TABLE
CREATE TABLE IF NOT EXISTS "customers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID UNIQUE REFERENCES "users"("id") ON DELETE SET NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(50),
    "address" TEXT,
    "tier" VARCHAR(32) NOT NULL DEFAULT 'STANDARD', -- 'STANDARD', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'
    "total_spent" NUMERIC(14, 2) NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "segment" VARCHAR(50) NOT NULL DEFAULT 'NEW', -- 'VIP_DIAMOND', 'POTENTIAL_GOLD', 'AT_RISK', 'NEW'
    "tags" TEXT[] NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_customers_tier" ON "customers"("tier");
CREATE INDEX IF NOT EXISTS "idx_customers_segment" ON "customers"("segment");

-- 10. CUSTOMER LOYALTY HISTORY
CREATE TABLE IF NOT EXISTS "customer_loyalty_history" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
    "order_id" UUID,
    "action" VARCHAR(50) NOT NULL, -- 'ORDER_EARN', 'TIER_UPGRADE_BONUS', 'REDEMPTION'
    "points_change" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_loyalty_customer" ON "customer_loyalty_history"("customer_id");

-- 11. COUPONS TABLE (MARKETING & PROMOTIONS)
CREATE TABLE IF NOT EXISTS "coupons" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "discount_type" VARCHAR(32) NOT NULL, -- 'PERCENT', 'FIXED'
    "discount_value" NUMERIC(10, 2) NOT NULL,
    "min_order_value" NUMERIC(12, 2) NOT NULL DEFAULT 0,
    "max_discount" NUMERIC(12, 2),
    "usage_limit" INTEGER NOT NULL DEFAULT 1000,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ,
    "status" VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. ADMIN USERS TABLE (RBAC)
CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "full_name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL, -- 'SUPER_ADMIN', 'MANAGER', 'ACCOUNTANT', 'WAREHOUSE', 'CSKH', 'MARKETING'
    "enforce_2fa" BOOLEAN NOT NULL DEFAULT TRUE,
    "ip_restricted" BOOLEAN NOT NULL DEFAULT FALSE,
    "allowed_ips" TEXT[] NOT NULL DEFAULT '{}',
    "status" VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMPTZ,
    "last_login_ip" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. IMMUTABLE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" VARCHAR(64) PRIMARY KEY,
    "actor_id" VARCHAR(64) NOT NULL,
    "actor_name" VARCHAR(255) NOT NULL,
    "actor_email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "resource" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(255) NOT NULL,
    "ip" VARCHAR(50) NOT NULL,
    "severity" VARCHAR(32) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARNING', 'CRITICAL'
    "is_sensitive" BOOLEAN NOT NULL DEFAULT FALSE,
    "before_value" TEXT,
    "after_value" TEXT,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_audit_logs_actor" ON "audit_logs"("actor_email");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_resource" ON "audit_logs"("resource");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_severity" ON "audit_logs"("severity");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_timestamp" ON "audit_logs"("timestamp");

-- 14. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS "system_settings" (
    "id" VARCHAR(100) PRIMARY KEY,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'Super Admin'
);

-- 15. CMS POSTS TABLE
CREATE TABLE IF NOT EXISTS "cms_posts" (
    "id" VARCHAR(64) PRIMARY KEY,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL UNIQUE,
    "category" VARCHAR(100) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED',
    "views" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seo_title" VARCHAR(500),
    "seo_desc" TEXT,
    "content" TEXT,
    "tags" TEXT[] NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
