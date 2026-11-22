-- ==============================================================================
-- Partition & Constraint Verification Script
-- ==============================================================================

\echo '=== 1. VERIFY PARTITIONED TABLES & HIERARCHY ==='
SELECT 
    parent.relname AS parent_table,
    child.relname AS partition_name,
    pg_get_expr(child.relpartbound, child.oid) AS partition_expression
FROM pg_inherits
JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
JOIN pg_class child ON pg_inherits.inhrelid = child.oid
WHERE parent.relname = 'orders'
ORDER BY child.relname;

\echo '=== 2. VERIFY PRODUCTS CHECK CONSTRAINT (stock >= 0) ==='
SELECT 
    conname AS constraint_name,
    relname AS table_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'products' AND c.contype = 'c';

\echo '=== 3. VERIFY PROCESSED_PAYMENTS UNIQUE CONSTRAINT ==='
SELECT 
    conname AS constraint_name,
    relname AS table_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'processed_payments' AND c.contype = 'u';

\echo '=== 4. VERIFY TABLE RECORD COUNTS ==='
SELECT 'categories' AS table_name, count(*) AS total_rows FROM categories
UNION ALL
SELECT 'users', count(*) FROM users
UNION ALL
SELECT 'products', count(*) FROM products
UNION ALL
SELECT 'flash_sales', count(*) FROM flash_sales
UNION ALL
SELECT 'orders', count(*) FROM orders
UNION ALL
SELECT 'order_items', count(*) FROM order_items
UNION ALL
SELECT 'processed_payments', count(*) FROM processed_payments
UNION ALL
SELECT 'idempotency_keys', count(*) FROM idempotency_keys;
