import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_KEYS, TTL } from '../common/constants/redis-keys.constant';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriberClient: Redis;

  private deductStockSha: string;
  private rollbackStockSha: string;
  private validateTokenSha: string;

  private deductStockScript: string;
  private rollbackStockScript: string;
  private validateTokenScript: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD', 'redis_secure_password');

    this.client = new Redis({
      host,
      port: Number(port),
      password,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (times) => Math.min(times * 100, 3000),
    });

    this.subscriberClient = new Redis({
      host,
      port: Number(port),
      password,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });

    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));
    this.client.on('connect', () => this.logger.log('Redis connected successfully'));

    await this.loadLuaScripts();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
    if (this.subscriberClient) {
      await this.subscriberClient.quit();
    }
  }

  public getClient(): Redis {
    return this.client;
  }

  public getSubscriberClient(): Redis {
    return this.subscriberClient;
  }

  /**
   * Pre-loads Lua scripts into Redis memory cache using SCRIPT LOAD.
   */
  private async loadLuaScripts() {
    try {
      let scriptsDir = path.join(__dirname, 'scripts');
      if (!fs.existsSync(scriptsDir)) {
        scriptsDir = path.join(process.cwd(), 'src/redis/scripts');
      }
      if (!fs.existsSync(scriptsDir)) {
        scriptsDir = path.join(__dirname, '../../src/redis/scripts');
      }

      this.deductStockScript = fs.readFileSync(path.join(scriptsDir, 'deduct_stock.lua'), 'utf-8');
      this.rollbackStockScript = fs.readFileSync(path.join(scriptsDir, 'rollback_stock.lua'), 'utf-8');
      this.validateTokenScript = fs.readFileSync(path.join(scriptsDir, 'validate_and_consume_token.lua'), 'utf-8');

      const [deductSha, rollbackSha, tokenSha] = await Promise.all([
        this.client.script('LOAD', this.deductStockScript) as Promise<string>,
        this.client.script('LOAD', this.rollbackStockScript) as Promise<string>,
        this.client.script('LOAD', this.validateTokenScript) as Promise<string>,
      ]);

      this.deductStockSha = deductSha;
      this.rollbackStockSha = rollbackSha;
      this.validateTokenSha = tokenSha;

      this.logger.log(`Lua scripts loaded. Deduct SHA: ${this.deductStockSha.substring(0, 8)}...`);
    } catch (error) {
      this.logger.error('Failed to load Lua scripts into Redis', error);
      throw error;
    }
  }

  /**
   * Safely executes a cached Lua script with auto-reload fallback if NOSCRIPT occurs.
   */
  private async evalScript(sha: string, script: string, numKeys: number, ...args: (string | number)[]): Promise<any> {
    try {
      return await this.client.evalsha(sha, numKeys, ...args);
    } catch (err: any) {
      if (err.message && err.message.includes('NOSCRIPT')) {
        this.logger.warn('NOSCRIPT encountered. Reloading script and falling back to EVAL...');
        return await this.client.eval(script, numKeys, ...args);
      }
      throw err;
    }
  }

  /**
   * Atomically decrements stock if sufficient.
   * Returns:
   *   { success: true, remainingStock: number }
   *   { success: false, code: -1 (SOLD_OUT) | -2 (NOT_FOUND) }
   */
  async deductStock(flashSaleId: string, quantity: number = 1): Promise<{ success: boolean; remainingStock: number; code: number }> {
    const stockKey = REDIS_KEYS.STOCK_FLASH_SALE(flashSaleId);
    const result = await this.evalScript(
      this.deductStockSha,
      this.deductStockScript,
      1,
      stockKey,
      quantity,
    );

    const resultCode = Number(result);
    if (resultCode >= 0) {
      return { success: true, remainingStock: resultCode, code: 0 };
    }
    return { success: false, remainingStock: 0, code: resultCode };
  }

  /**
   * Atomically increments stock on order cancellation/timeout.
   */
  async rollbackStock(flashSaleId: string, quantity: number = 1): Promise<number> {
    const stockKey = REDIS_KEYS.STOCK_FLASH_SALE(flashSaleId);
    const result = await this.evalScript(
      this.rollbackStockSha,
      this.rollbackStockScript,
      1,
      stockKey,
      quantity,
    );
    return Number(result);
  }

  /**
   * Generates a 30-second single-use Action Token for a given user & flash sale.
   */
  async createActionToken(userId: string, flashSaleId: string, ttlSeconds = TTL.ACTION_TOKEN_SECONDS): Promise<string> {
    const token = uuidv4();
    const tokenKey = REDIS_KEYS.ACTION_TOKEN(userId, flashSaleId);
    await this.client.set(tokenKey, token, 'EX', ttlSeconds);
    return token;
  }

  /**
   * Validates and immediately consumes the single-use Action Token.
   */
  async validateAndConsumeActionToken(userId: string, flashSaleId: string, token: string): Promise<boolean> {
    const tokenKey = REDIS_KEYS.ACTION_TOKEN(userId, flashSaleId);
    const result = await this.evalScript(
      this.validateTokenSha,
      this.validateTokenScript,
      1,
      tokenKey,
      token,
    );
    return Number(result) === 1;
  }

  /**
   * Idempotency handler: Attempts to acquire an idempotency lock for 24 hours.
   * If key already exists, returns the existing state.
   */
  async checkAndSetIdempotency(key: string, initialPayload: any, ttlSeconds = TTL.IDEMPOTENCY_SECONDS): Promise<{ isNew: boolean; payload?: any }> {
    const redisKey = REDIS_KEYS.IDEMPOTENCY(key);
    const payloadStr = typeof initialPayload === 'string' ? initialPayload : JSON.stringify(initialPayload);

    // SET key value EX ttl NX
    const acquired = await this.client.set(redisKey, payloadStr, 'EX', ttlSeconds, 'NX');

    if (acquired === 'OK') {
      return { isNew: true };
    }

    const existingData = await this.client.get(redisKey);
    let parsed = existingData;
    try {
      parsed = JSON.parse(existingData);
    } catch {
      // keep raw string
    }
    return { isNew: false, payload: parsed };
  }

  /**
   * Updates the cached idempotency result payload once processing finishes.
   */
  async updateIdempotencyPayload(key: string, payload: any, ttlSeconds = TTL.IDEMPOTENCY_SECONDS): Promise<void> {
    const redisKey = REDIS_KEYS.IDEMPOTENCY(key);
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await this.client.set(redisKey, payloadStr, 'EX', ttlSeconds);
  }

  /**
   * Releases or deletes an idempotency key (e.g. if pre-deduction failed).
   */
  async deleteIdempotencyKey(key: string): Promise<void> {
    const redisKey = REDIS_KEYS.IDEMPOTENCY(key);
    await this.client.del(redisKey);
  }

  /**
   * Updates transient order status in Redis hash.
   */
  async setOrderStatus(trackingId: string, status: string, meta: Record<string, string> = {}): Promise<void> {
    const key = REDIS_KEYS.ORDER_STATUS(trackingId);
    await this.client.hset(key, {
      status,
      updated_at: new Date().toISOString(),
      ...meta,
    });
    await this.client.expire(key, TTL.ORDER_STATUS_SECONDS);
  }

  /**
   * Retrieves transient order status.
   */
  async getOrderStatus(trackingId: string): Promise<Record<string, string> | null> {
    const key = REDIS_KEYS.ORDER_STATUS(trackingId);
    const data = await this.client.hgetall(key);
    if (!data || Object.keys(data).length === 0) {
      return null;
    }
    return data;
  }

  /**
   * Publishes an event to the order's real-time channel for SSE listeners.
   */
  async publishOrderEvent(trackingId: string, data: any): Promise<number> {
    const channel = REDIS_KEYS.ORDER_EVENTS(trackingId);
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    return await this.client.publish(channel, payload);
  }

  /**
   * Publishes general stock restored event for waiting queue participants.
   */
  async publishStockRestored(flashSaleId: string, quantity: number): Promise<number> {
    const channel = REDIS_KEYS.STOCK_RESTORED_CHANNEL;
    const payload = JSON.stringify({ flashSaleId, quantity, timestamp: new Date().toISOString() });
    return await this.client.publish(channel, payload);
  }
}
