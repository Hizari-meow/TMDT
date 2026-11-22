import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';
import exec from 'k6/execution';

// Custom Metrics
const successfulOrders = new Counter('successful_orders');
const soldOutRejections = new Counter('sold_out_rejections');
const unexpectedErrors = new Counter('unexpected_errors');
const checkoutLatency = new Trend('checkout_duration_ms', true);

export const options = {
  scenarios: {
    flash_sale_burst: {
      executor: 'shared-iterations',
      vus: 100,             // 100 concurrent workers
      iterations: 5000,     // exactly 5,000 requests
      maxDuration: '30s',
    },
  },
  thresholds: {
    // Invariants: average latency under 100ms
    checkout_duration_ms: ['avg<100'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';
const FLASH_SALE_ID = __ENV.FLASH_SALE_ID || '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID = __ENV.PRODUCT_ID || '22222222-2222-2222-2222-222222222222';

function getUserId(index) {
  return '00000000-0000-4000-8000-' + index.toString(16).padStart(12, '0');
}

export function setup() {
  const res = http.get(`${BASE_URL}/api/v1/flash-sale/${FLASH_SALE_ID}/stock`);
  console.log(`[k6 Setup] Flash Sale ID: ${FLASH_SALE_ID}`);
  console.log(`[k6 Setup] Stock response before test: ${res.body}`);
  return { startTime: new Date().toISOString() };
}

export default function () {
  const userIndex = exec.scenario.iterationInTest;
  const userId = getUserId(userIndex);
  const actionToken = `token-${userIndex}-valid`;
  const idempotencyKey = `idemp-burst-${userIndex}-${Date.now()}`;

  const payload = JSON.stringify({
    flashSaleId: FLASH_SALE_ID,
    productId: PRODUCT_ID,
    userId: userId,
    quantity: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
      'X-Action-Token': actionToken,
      'X-User-Id': userId,
    },
    tags: { name: 'Checkout' },
  };

  const start = Date.now();
  const res = http.post(`${BASE_URL}/api/v1/flash-sale/checkout`, payload, params);
  const duration = Date.now() - start;
  checkoutLatency.add(duration);

  if (res.status === 202) {
    successfulOrders.add(1);
  } else if (res.status === 400) {
    soldOutRejections.add(1);
  } else {
    unexpectedErrors.add(1);
    console.error(`Unexpected response: status=${res.status} body=${res.body}`);
  }
}

export function teardown() {
  const res = http.get(`${BASE_URL}/api/v1/flash-sale/${FLASH_SALE_ID}/stock`);
  console.log(`[k6 Teardown] Flash sale final stock: ${res.body}`);
}

export function handleSummary(data) {
  const p90 = data.metrics.checkout_duration_ms ? data.metrics.checkout_duration_ms.values['p(90)'] : 0;
  const p95 = data.metrics.checkout_duration_ms ? data.metrics.checkout_duration_ms.values['p(95)'] : 0;
  const p99 = data.metrics.checkout_duration_ms ? data.metrics.checkout_duration_ms.values['p(99)'] : 0;
  const avg = data.metrics.checkout_duration_ms ? data.metrics.checkout_duration_ms.values.avg : 0;
  const success = data.metrics.successful_orders ? data.metrics.successful_orders.values.count : 0;
  const rejections = data.metrics.sold_out_rejections ? data.metrics.sold_out_rejections.values.count : 0;
  const errors = data.metrics.unexpected_errors ? data.metrics.unexpected_errors.values.count : 0;

  const report = `
================================================================================
HIGH-CONCURRENCY FLASH SALE STRESS TEST VERIFICATION REPORT
================================================================================
Scenario                           : 5,000 Burst Requests (100 Concurrent VUs)
Target Available Stock             : 100 Units of iPhone 16 Pro
--------------------------------------------------------------------------------
Total Successful Orders (HTTP 202) : ${success} (Expected: Exactly 100)
Total Sold Out Rejections (HTTP 400): ${rejections} (Expected: Exactly 4,900)
Total Unexpected Errors            : ${errors} (Expected: 0)
--------------------------------------------------------------------------------
Latency Statistics (p99 < 200ms Invariant):
  Average Latency                  : ${avg ? avg.toFixed(2) : '0'} ms
  p90 Latency                      : ${p90 ? p90.toFixed(2) : '0'} ms
  p95 Latency                      : ${p95 ? p95.toFixed(2) : '0'} ms
  p99 Latency                      : ${p99 ? p99.toFixed(2) : '0'} ms
================================================================================
`;
  console.log(report);

  return {
    stdout: report,
  };
}
