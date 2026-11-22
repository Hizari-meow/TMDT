const Redis = require('ioredis');
const { execSync } = require('child_process');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redis_secure_password';

const FLASH_SALE_ID = '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID = '22222222-2222-2222-2222-222222222222';
const TOTAL_USERS = 5000;
const INITIAL_STOCK = 100;

function getUserId(index) {
  return '00000000-0000-4000-8000-' + index.toString(16).padStart(12, '0');
}

async function reset() {
  console.log('=== STEP 1: CLEANING REDIS IN-MEMORY QUEUES & STATE ===');
  const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  });

  // Flush Redis keys
  const keys = await redis.keys('bull:*');
  const actionKeys = await redis.keys('token:action:*');
  const idempKeys = await redis.keys('idemp*');
  const orderKeys = await redis.keys('order:*');
  const toDel = [...keys, ...actionKeys, ...idempKeys, ...orderKeys];
  if (toDel.length > 0) {
    await redis.del(...toDel);
  }
  console.log(`✓ Cleared ${toDel.length} ephemeral Redis keys.`);

  // Set initial stock to 100
  await redis.set(`stock:flash_sale:${FLASH_SALE_ID}`, INITIAL_STOCK.toString());
  console.log(`✓ Redis stock initialized: stock:flash_sale:${FLASH_SALE_ID} = ${INITIAL_STOCK}`);

  // Seed 5,000 valid single-use action tokens
  console.log(`✓ Seeding ${TOTAL_USERS} single-use action tokens for valid user UUIDs...`);
  const pipeline = redis.pipeline();
  for (let i = 0; i < TOTAL_USERS; i++) {
    const userId = getUserId(i);
    const token = `token-${i}-valid`;
    pipeline.set(`token:action:${userId}:${FLASH_SALE_ID}`, token, 'EX', 1800); // 30m TTL
  }
  await pipeline.exec();
  console.log(`✓ 5,000 action tokens loaded.`);

  await redis.quit();

  console.log('=== STEP 2: CLEANING POSTGRESQL TABLES ===');
  execSync(`docker compose exec -T postgres psql -U flashsale -d flashsale_db -c "
    TRUNCATE order_items, processed_payments, idempotency_keys CASCADE;
    TRUNCATE orders CASCADE;
    UPDATE products SET stock = 100 WHERE id = '${PRODUCT_ID}';
    INSERT INTO users (id, email, password_hash, full_name)
    SELECT 
      ('00000000-0000-4000-8000-' || LPAD(to_hex(i), 12, '0'))::uuid,
      'stress_' || i || '@test.com',
      'hash',
      'Stress User ' || i
    FROM generate_series(0, 4999) AS i
    ON CONFLICT DO NOTHING;
  "`, { stdio: 'inherit' });

  console.log('=== CLEAN RESET COMPLETED SUCCESSFULLY ===');
}

reset().catch(console.error);
