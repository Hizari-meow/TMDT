export const REDIS_KEYS = {
  STOCK_FLASH_SALE: (flashSaleId: string) => `stock:flash_sale:${flashSaleId}`,
  ACTION_TOKEN: (userId: string, flashSaleId: string) => `token:action:${userId}:${flashSaleId}`,
  IDEMPOTENCY: (key: string) => `idempotency:${key}`,
  CACHE_PRODUCT: (productId: string) => `cache:product:${productId}`,
  ORDER_STATUS: (trackingId: string) => `order:status:${trackingId}`,
  ORDER_EVENTS: (trackingId: string) => `order:events:${trackingId}`,
  STOCK_RESTORED_CHANNEL: 'flash_sale:stock:restored',
  LOCK_ORDER: (orderId: string) => `lock:order:${orderId}`,
};

export const TTL = {
  ACTION_TOKEN_SECONDS: 30,
  IDEMPOTENCY_SECONDS: 86400, // 24 hours
  ORDER_STATUS_SECONDS: 3600,  // 1 hour
  PRODUCT_CACHE_BASE_SECONDS: 300,
};
