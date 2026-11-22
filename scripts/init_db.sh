#!/usr/bin/env bash
set -e

echo "Applying migration to PostgreSQL 16..."
docker compose exec -T postgres psql -U "${POSTGRES_USER:-flashsale}" -d "${POSTGRES_DB:-flashsale_db}" -f /apps/backend/prisma/migrations/20260930000000_init_partitioned_schema/migration.sql || \
docker compose exec -T postgres psql -U "${POSTGRES_USER:-flashsale}" -d "${POSTGRES_DB:-flashsale_db}" < apps/backend/prisma/migrations/20260930000000_init_partitioned_schema/migration.sql

echo "Database migrations applied successfully."
echo "Running partition verification..."
docker compose exec -T postgres psql -U "${POSTGRES_USER:-flashsale}" -d "${POSTGRES_DB:-flashsale_db}" < scripts/verify_partitions.sql
