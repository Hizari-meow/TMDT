export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://flashsale:flashsale_secret@localhost:5433/flashsale_db?schema=public',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || 'redis_secure_password',
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET || 'whsec_super_secret_hmac_sha256_key_998877',
  },
});
