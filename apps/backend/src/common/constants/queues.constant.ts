export const QUEUE_NAMES = {
  ORDER_PROCESSING: 'order-processing-queue',
  ORDER_TIMEOUT: 'order-timeout-delayed-queue',
  ORDER_DLQ: 'order-dead-letter-queue',
};

export const JOB_NAMES = {
  PROCESS_ORDER: 'process-order',
  ORDER_TIMEOUT: 'order-timeout',
};

export const QUEUE_SETTINGS = {
  ORDER_PROCESSING_CONCURRENCY: 50,
  ORDER_TIMEOUT_CONCURRENCY: 20,
  DEFAULT_TIMEOUT_DELAY_MS: 15 * 60 * 1000, // 15 minutes (900,000 ms)
  MAX_RETRIES: 3,
  BACKOFF_DELAY_MS: 500,
};
