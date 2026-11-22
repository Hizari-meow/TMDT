/**
 * Live Mutation Verification Script for Admin Portal
 * Tests all user action buttons and write operations across the 10 modules
 */
const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runMutations() {
  console.log('====================================================');
  console.log('⚡ RUNNING LIVE ADMIN MUTATIONS & ACTIONS TEST');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`⏳ [MUTATION] ${name}... `);
    try {
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // Find a pending_confirm or test order to test state machine transitions
  const ordersRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/admin/orders?limit=50',
    method: 'GET',
  });
  const allOrders = ordersRes.body?.orders || [];
  const testOrder = allOrders.find(o => o.status === 'PENDING_CONFIRM' || o.status === 'PAID') || allOrders[0];

  if (testOrder) {
    // 1. ORD-06 / ORD-07: Transition order
    await test(`ORD-06: Transition order ${testOrder.id} to CONFIRMED`, async () => {
      const res = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: `/api/v1/admin/orders/${testOrder.id}/status`,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
        { status: 'CONFIRMED' }
      );
      if (res.status !== 200) {
        throw new Error(`Order transition failed: ${res.status} - ${JSON.stringify(res.body)}`);
      }
    });

    // 2. ORD-05: Call verification
    await test(`ORD-05: Update call verification for order ${testOrder.id}`, async () => {
      const res = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: `/api/v1/admin/orders/${testOrder.id}/call-verification`,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
        { status: 'VERIFIED', note: 'Đã gọi điện thoại xác nhận đơn hàng thành công với người mua' }
      );
      if (res.status !== 200) {
        throw new Error(`Call verification failed: ${res.status}`);
      }
    });

    // 3. ORD-17: Internal note
    await test(`ORD-17: Add internal note to order ${testOrder.id}`, async () => {
      const res = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: `/api/v1/admin/orders/${testOrder.id}/internal-note`,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
        { note: 'Đơn hàng VIP khách quen đã kiểm tra cẩn thận' }
      );
      if (res.status !== 200) {
        throw new Error(`Internal note failed: ${res.status}`);
      }
    });
  }

  // 4. INV-02: Inventory receipt
  await test('INV-02: Create warehouse receipt transaction', async () => {
    const invRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/inventory',
      method: 'GET',
    });
    const prod = invRes.body?.[0];
    if (!prod) throw new Error('No product found for inventory receipt');

    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/admin/inventory/transactions',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        type: 'INBOUND',
        productId: prod.id,
        warehouseId: prod.warehouseId || '10000000-0000-0000-0000-000000000001',
        quantity: 5,
        note: 'Nhập hàng định kỳ từ nhà phân phối ủy quyền',
      }
    );
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Inventory transaction failed: ${res.status} - ${JSON.stringify(res.body)}`);
    }
  });

  // 5. INV-11: Omnichannel sync
  await test('INV-11: Trigger Omnichannel 90% buffer sync', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/admin/inventory/omnichannel-sync',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {}
    );
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Omnichannel sync failed: ${res.status}`);
    }
  });

  // 6. SHP-01: Toggle carrier status
  await test('SHP-01: Toggle carrier active status', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/admin/logistics/carriers/GHN/toggle',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {}
    );
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Carrier toggle failed: ${res.status}`);
    }
  });

  // 7. CRM-09/10: Customer tags and Remarketing sync
  const custRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/admin/customers',
    method: 'GET',
  });
  const cust = custRes.body?.[0];
  if (cust) {
    await test(`CRM-10: Update tags for customer ${cust.id}`, async () => {
      const res = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: `/api/v1/admin/customers/${cust.id}/tags`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
        { tags: ['VIP', 'KHACH_THAN_THIET'] }
      );
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Update tags failed: ${res.status}`);
      }
    });

    await test('CRM-09: Sync remarketing audience with SHA-256 hash', async () => {
      const res = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: '/api/v1/admin/customers/remarketing/sync',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { channel: 'FACEBOOK_CUSTOM_AUDIENCE' }
      );
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Remarketing sync failed: ${res.status}`);
      }
    });
  }

  // 8. SYS-05: Update store settings
  await test('SYS-05: Update system settings', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/admin/system/settings',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        storeInfo: {
          storeName: 'TechZone High-Concurrency Apple Store',
          supportHotline: '1900 8888',
        },
      }
    );
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Update settings failed: ${res.status}`);
    }
  });

  console.log('\n====================================================');
  console.log(`🏁 MUTATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');
  if (failed > 0) process.exit(1);
}

runMutations().catch((err) => {
  console.error('Fatal error during mutations testing:', err);
  process.exit(1);
});
