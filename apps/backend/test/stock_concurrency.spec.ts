import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config();

import Redis from 'ioredis';
import * as fs from 'fs';
import * as path from 'path';

describe('High-Concurrency Stock Deduction & Rollback Invariants', () => {
  let redis: Redis;
  let deductStockScript: string;
  let rollbackStockScript: string;
  let validateTokenScript: string;

  let deductStockSha: string;
  let rollbackStockSha: string;
  let validateTokenSha: string;

  const TEST_FLASH_SALE_ID = 'test-flash-sale-' + Date.now();
  const TEST_STOCK_KEY = `stock:flash_sale:${TEST_FLASH_SALE_ID}`;
  const INITIAL_STOCK = 100;
  const CONCURRENT_REQUESTS = 1000;

  beforeAll(async () => {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT || 6379);
    const password = process.env.REDIS_PASSWORD || 'redis_secure_password';

    redis = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    });

    const scriptsDir = path.join(__dirname, '../src/redis/scripts');
    deductStockScript = fs.readFileSync(path.join(scriptsDir, 'deduct_stock.lua'), 'utf-8');
    rollbackStockScript = fs.readFileSync(path.join(scriptsDir, 'rollback_stock.lua'), 'utf-8');
    validateTokenScript = fs.readFileSync(path.join(scriptsDir, 'validate_and_consume_token.lua'), 'utf-8');

    [deductStockSha, rollbackStockSha, validateTokenSha] = await Promise.all([
      redis.script('LOAD', deductStockScript) as Promise<string>,
      redis.script('LOAD', rollbackStockScript) as Promise<string>,
      redis.script('LOAD', validateTokenScript) as Promise<string>,
    ]);
  });

  afterAll(async () => {
    await redis.del(TEST_STOCK_KEY);
    await redis.quit();
  });

  it('INVARIANT 1: Zero overselling under 1,000 concurrent requests against 100 units', async () => {
    // 1. Initialize exact stock to 100
    await redis.set(TEST_STOCK_KEY, INITIAL_STOCK.toString());

    // 2. Launch 1,000 concurrent promises
    const promises = Array.from({ length: CONCURRENT_REQUESTS }).map(async () => {
      try {
        const res = await redis.evalsha(deductStockSha, 1, TEST_STOCK_KEY, 1);
        return Number(res);
      } catch (err: any) {
        if (err.message && err.message.includes('NOSCRIPT')) {
          const res = await redis.eval(deductStockScript, 1, TEST_STOCK_KEY, 1);
          return Number(res);
        }
        throw err;
      }
    });

    const results = await Promise.all(promises);

    // 3. Analyze results
    const successfulDeductions = results.filter((res) => res >= 0);
    const soldOutRejections = results.filter((res) => res === -1);

    // Verify invariants
    expect(successfulDeductions.length).toBe(100);
    expect(soldOutRejections.length).toBe(900);

    // Verify final stock is exactly 0
    const finalStock = Number(await redis.get(TEST_STOCK_KEY));
    expect(finalStock).toBe(0);
  });

  it('INVARIANT 2: Atomic rollback restores stock accurately on cancellation', async () => {
    const ROLLBACK_UNITS = 25;

    // Launch 25 concurrent rollback operations
    const rollbackPromises = Array.from({ length: ROLLBACK_UNITS }).map(async () => {
      return Number(await redis.evalsha(rollbackStockSha, 1, TEST_STOCK_KEY, 1));
    });

    await Promise.all(rollbackPromises);

    const restoredStock = Number(await redis.get(TEST_STOCK_KEY));
    expect(restoredStock).toBe(25);
  });

  it('INVARIANT 3: Single-use Action Token consumed exactly once under concurrent race', async () => {
    const tokenKey = `token:action:user-123:${TEST_FLASH_SALE_ID}`;
    const tokenValue = 'secure-single-use-token-xyz';
    await redis.set(tokenKey, tokenValue, 'EX', 30);

    // 50 concurrent attempts to consume the exact same token
    const tokenAttempts = Array.from({ length: 50 }).map(async () => {
      return Number(await redis.evalsha(validateTokenSha, 1, tokenKey, tokenValue));
    });

    const results = await Promise.all(tokenAttempts);
    const validCount = results.filter((r) => r === 1).length;
    const invalidCount = results.filter((r) => r === 0).length;

    // Exactly 1 consumer succeeds; 49 fail
    expect(validCount).toBe(1);
    expect(invalidCount).toBe(49);

    // Token must be destroyed
    const exists = await redis.exists(tokenKey);
    expect(exists).toBe(0);
  });
});
