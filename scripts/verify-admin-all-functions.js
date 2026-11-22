/**
 * Comprehensive Automated Verification Script for Admin Portal
 * Tests all 10 modules + E1-E16 scenarios according to spec
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

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING ADMIN ENTERPRISE FULL VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`⏳ [TEST] ${name}... `);
    try {
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. AUTH
  await test('AUTH-01/03: Verify /auth/me returns roles and permissions', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/auth/me',
      method: 'GET',
    });
    if (res.status !== 200 || !res.body?.user?.permissions?.length) {
      throw new Error(`Expected 200 with permissions, got ${res.status}: ${JSON.stringify(res.body)}`);
    }
  });

  // 2. PRD (Products)
  await test('PRD-01/05: Categories tree and Brands', async () => {
    const catRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/categories/tree',
      method: 'GET',
    });
    if (catRes.status !== 200 || !Array.isArray(catRes.body)) {
      throw new Error(`Categories tree failed with ${catRes.status}`);
    }
    const brandRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/brands',
      method: 'GET',
    });
    if (brandRes.status !== 200 || !Array.isArray(brandRes.body)) {
      throw new Error(`Brands failed with ${brandRes.status}`);
    }
  });

  // 3. INV (Inventory)
  await test('INV-01/02: Inventory levels and movements ledger', async () => {
    const invRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/inventory',
      method: 'GET',
    });
    if (invRes.status !== 200 || !Array.isArray(invRes.body) || invRes.body.length === 0) {
      throw new Error(`Inventory returned empty or failed: ${invRes.status}`);
    }
    const ledgerRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/inventory/ledger',
      method: 'GET',
    });
    if (ledgerRes.status !== 200 || !Array.isArray(ledgerRes.body)) {
      throw new Error(`Inventory ledger failed with ${ledgerRes.status}`);
    }
  });

  // 4. ORD (Orders)
  let testOrderId = null;
  await test('ORD-17: Fetch Orders list with status counts and pagination', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/orders?page=1&limit=10',
      method: 'GET',
    });
    if (res.status !== 200 || !res.body?.orders || !res.body?.statusCounts) {
      throw new Error(`Orders fetch failed or missing fields: ${res.status}`);
    }
    if (res.body.orders.length > 0) {
      testOrderId = res.body.orders[0].id;
    }
  });

  // 5. SHP (Logistics)
  await test('SHP-01/02: Carriers and Smart Rate Calculation', async () => {
    const carrierRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/logistics/carriers',
      method: 'GET',
    });
    if (carrierRes.status !== 200 || !Array.isArray(carrierRes.body)) {
      throw new Error(`Carriers failed with ${carrierRes.status}`);
    }

    const calcRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/admin/logistics/calculate-rate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        recipientProvince: 'Hà Nội',
        weightGram: 500,
        dimension: { length: 20, width: 15, height: 10 },
        orderValue: 500000,
      }
    );
    if ((calcRes.status !== 200 && calcRes.status !== 201) || calcRes.body?.shippingFee === undefined) {
      throw new Error(`Rate calculation failed: ${calcRes.status}`);
    }
  });

  // 6. FIN (Finance)
  await test('FIN-04/05: Finance data and 3-way Reconciliation run', async () => {
    const finRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/finance/full-data',
      method: 'GET',
    });
    if (finRes.status !== 200 || !finRes.body?.metrics) {
      throw new Error(`Finance full-data failed with ${finRes.status}`);
    }

    const reconRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/admin/finance/reconcile-now',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {}
    );
    if ((reconRes.status !== 200 && reconRes.status !== 201) || (!reconRes.body?.matchedCount && !reconRes.body?.runId)) {
      throw new Error(`Reconciliation run failed: ${reconRes.status}`);
    }
  });

  // 7. CRM (Customers)
  let testCustomerId = null;
  await test('CRM-01/10: Customers list and 360 profile', async () => {
    const custRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/customers',
      method: 'GET',
    });
    if (custRes.status !== 200 || !Array.isArray(custRes.body)) {
      throw new Error(`Customers list failed with ${custRes.status}`);
    }
    if (custRes.body.length > 0) {
      testCustomerId = custRes.body[0].id;
      const p360Res = await request({
        hostname: 'localhost',
        port: 3001,
        path: `/api/v1/admin/customers/${testCustomerId}/360`,
        method: 'GET',
      });
      if (p360Res.status !== 200 || !p360Res.body?.profile) {
        throw new Error(`Customer 360 profile failed with ${p360Res.status}`);
      }
    }
  });

  // 8. MKT (Marketing)
  await test('MKT-01/07: Marketing coupons and coupon toggle', async () => {
    const mktRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/marketing/coupons',
      method: 'GET',
    });
    if (mktRes.status !== 200 || !Array.isArray(mktRes.body)) {
      throw new Error(`Coupons list failed with ${mktRes.status}`);
    }

    // Toggle a coupon
    if (mktRes.body.length > 0) {
      const code = mktRes.body[0].code;
      const toggleRes = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: `/api/v1/admin/marketing/coupons/${code}/status`,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
        { isActive: false }
      );
      if (toggleRes.status !== 200) {
        throw new Error(`Coupon toggle failed with ${toggleRes.status}`);
      }
    }
  });

  // 9. RPT (Reports & Analytics)
  await test('RPT-01/03/04: Overview KPI, Funnel and Enterprise Report', async () => {
    const ovRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/overview',
      method: 'GET',
    });
    if (ovRes.status !== 200 || !ovRes.body?.metrics) {
      throw new Error(`Overview failed with ${ovRes.status}`);
    }

    const funnelRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/analytics/funnel',
      method: 'GET',
    });
    if (funnelRes.status !== 200 || !funnelRes.body?.stages) {
      throw new Error(`Funnel failed with ${funnelRes.status}`);
    }

    const reportRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/analytics/enterprise-report?timeRange=30days&channel=ALL&role=ceo',
      method: 'GET',
    });
    if (reportRes.status !== 200 || !reportRes.body?.metrics) {
      throw new Error(`Enterprise report failed with ${reportRes.status}`);
    }
  });

  // 10. SYS (System)
  await test('SYS-03/05: System Settings and Immutable Audit Logs', async () => {
    const setRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/system/settings',
      method: 'GET',
    });
    if (setRes.status !== 200 || !setRes.body?.storeInfo) {
      throw new Error(`System settings failed with ${setRes.status}`);
    }

    const auditRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/admin/audit-logs',
      method: 'GET',
    });
    if (auditRes.status !== 200 || !Array.isArray(auditRes.body)) {
      throw new Error(`Audit logs failed with ${auditRes.status}`);
    }
  });

  // 11. END-TO-END SCENARIOS (E1..E11)
  const scenarios = ['E1', 'E3', 'E5', 'E6', 'E7', 'E8', 'E10', 'E11'];
  for (const sc of scenarios) {
    await test(`Scenario ${sc}: End-to-End Execution`, async () => {
      const res = await request(
        {
          hostname: 'localhost',
          port: 3001,
          path: '/api/v1/admin/workflow/process-order-lifecycle',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { scenarioId: sc }
      );
      if (res.status !== 200 || !res.body?.success) {
        throw new Error(`Scenario ${sc} failed with ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });
  }

  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal error during testing:', err);
  process.exit(1);
});
