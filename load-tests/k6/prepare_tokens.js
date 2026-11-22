const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redis_secure_password';

const FLASH_SALE_ID = '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID = '22222222-2222-2222-2222-222222222222';
const TOTAL_USERS = 5000;
const INITIAL_STOCK = 100;

async function prepare() {
  console.log(`[Token Preparation] Connecting to Redis...`);
  const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  });

  // 1. Reset Redis Stock to exactly 100
  await redis.set(`stock:flash_sale:${FLASH_SALE_ID}`, INITIAL_STOCK.toString());
  console.log(`[Token Preparation] Stock key stock:flash_sale:${FLASH_SALE_ID} reset to ${INITIAL_STOCK}`);

  // 2. Pre-generate 5,000 valid single-use action tokens in Redis pipeline
  console.log(`[Token Preparation] Generating ${TOTAL_USERS} single-use action tokens...`);
  const pipeline = redis.pipeline();
  for (let i = 0; i < TOTAL_USERS; i++) {
    const userId = `stress-user-${i}`;
    const token = `token-${i}-valid`;
    pipeline.set(`token:action:${userId}:${FLASH_SALE_ID}`, token, 'EX', 600); // 10m TTL
  }
  await pipeline.exec();
  console.log(`[Token Preparation] 5,000 tokens loaded into Redis successfully.`);

  await redis.quit();
}

prepare().catch(console.error);
