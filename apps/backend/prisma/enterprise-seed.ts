import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const WAREHOUSE_IDS = {
  HN: '10000000-0000-0000-0000-000000000001',
  HCM: '10000000-0000-0000-0000-000000000002',
  DN: '10000000-0000-0000-0000-000000000003',
};

async function main() {
  console.log('=== SEEDING ENTERPRISE ADMINISTRATIVE DATABASE & LINKED WORKFLOWS ===');

  // 1. WAREHOUSES
  const warehousesData = [
    {
      id: WAREHOUSE_IDS.HN,
      code: 'WH-HN-01',
      name: 'Tổng Kho Phía Bắc - Hà Nội',
      address: 'Lô B2, KCN Đài Tư, 386 Nguyễn Văn Linh, P. Sài Đồng, Q. Long Biên, Hà Nội',
      manager: 'Phạm Đức Duy',
      phone: '0988.112.233',
      status: 'ACTIVE',
      capacity: 15000,
    },
    {
      id: WAREHOUSE_IDS.HCM,
      code: 'WH-HCM-02',
      name: 'Tổng Kho Phía Nam - TP.HCM',
      address: 'Khu Công Nghệ Cao, Đỗ Xuân Hợp, P. Tăng Nhơn Phú B, TP. Thủ Đức, TP.HCM',
      manager: 'Trần Thị Bích',
      phone: '0977.445.566',
      status: 'ACTIVE',
      capacity: 25000,
    },
    {
      id: WAREHOUSE_IDS.DN,
      code: 'WH-DN-03',
      name: 'Kho Trung Chuyển Miền Trung - Đà Nẵng',
      address: 'KCN Hòa Cầm, P. Hòa Thọ Tây, Q. Cẩm Lệ, TP. Đà Nẵng',
      manager: 'Lê Hoàng Nam',
      phone: '0966.778.899',
      status: 'ACTIVE',
      capacity: 8000,
    },
  ];

  for (const wh of warehousesData) {
    await prisma.warehouse.upsert({
      where: { code: wh.code },
      update: wh,
      create: wh,
    });
  }
  console.log('✓ Warehouses seeded successfully');

  // 2. INVENTORY STOCKS & INITIAL STOCK LEDGER
  const products = await prisma.product.findMany();
  for (const prod of products) {
    const totalStock = prod.stock || 100;
    const hnStock = Math.floor(totalStock * 0.45);
    const hcmStock = Math.floor(totalStock * 0.45);
    const dnStock = totalStock - hnStock - hcmStock;

    const distributions = [
      { warehouseId: WAREHOUSE_IDS.HN, qty: hnStock },
      { warehouseId: WAREHOUSE_IDS.HCM, qty: hcmStock },
      { warehouseId: WAREHOUSE_IDS.DN, qty: dnStock },
    ];

    for (const dist of distributions) {
      const reserved = Math.min(5, Math.floor(dist.qty * 0.05));
      const available = dist.qty - reserved;

      await prisma.inventoryStock.upsert({
        where: {
          productId_warehouseId: {
            productId: prod.id,
            warehouseId: dist.warehouseId,
          },
        },
        update: {
          onHand: dist.qty,
          reserved,
          available,
          safetyStock: 10,
        },
        create: {
          productId: prod.id,
          warehouseId: dist.warehouseId,
          onHand: dist.qty,
          reserved,
          available,
          safetyStock: 10,
        },
      });

      // Stock Ledger initial entry
      const existingLedger = await prisma.stockLedger.findFirst({
        where: { productId: prod.id, warehouseId: dist.warehouseId },
      });
      if (!existingLedger) {
        await prisma.stockLedger.create({
          data: {
            warehouseId: dist.warehouseId,
            productId: prod.id,
            type: 'NHAP_KHO',
            quantity: dist.qty,
            balanceBefore: 0,
            balanceAfter: dist.qty,
            referenceType: 'MANUAL_IMPORT',
            referenceId: `INIT-PO-202610-${prod.id.slice(0, 6)}`,
            note: `Nhập kho ban đầu cho sản phẩm ${prod.name}`,
            performedBy: 'Hệ thống Khởi tạo',
          },
        });
      }
    }
  }
  console.log('✓ Inventory stocks & stock ledger seeded');

  // 3. CRM CUSTOMERS (LINKED TO USERS & LIFETIME VALUE)
  const users = await prisma.user.findMany({ take: 20 });
  const tiers = ['STANDARD', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  const segments = ['NEW', 'POTENTIAL_GOLD', 'VIP_DIAMOND', 'AT_RISK'];

  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const tier = i === 0 ? 'DIAMOND' : tiers[i % tiers.length];
    const segment = i === 0 ? 'VIP_DIAMOND' : segments[i % segments.length];
    const totalSpent = (i + 1) * 12500000;
    const totalOrders = (i + 1) * 3;
    const loyaltyPoints = Math.floor(totalSpent / 100000);

    const customer = await prisma.customer.upsert({
      where: { email: u.email },
      update: {
        userId: u.id,
        fullName: u.fullName,
        phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
        address: 'Hà Nội & TP.HCM, Việt Nam',
        tier,
        totalSpent,
        totalOrders,
        loyaltyPoints,
        segment,
        tags: [tier, 'KH_XÁC_THỰC', i % 2 === 0 ? 'DOANH_NGHIỆP' : 'CÁ_NHÂN'],
      },
      create: {
        userId: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
        address: 'Hà Nội & TP.HCM, Việt Nam',
        tier,
        totalSpent,
        totalOrders,
        loyaltyPoints,
        segment,
        tags: [tier, 'KH_XÁC_THỰC'],
      },
    });

    // Loyalty history
    const existingLoyalty = await prisma.customerLoyaltyHistory.findFirst({
      where: { customerId: customer.id },
    });
    if (!existingLoyalty) {
      await prisma.customerLoyaltyHistory.create({
        data: {
          customerId: customer.id,
          action: 'ORDER_EARN',
          pointsChange: Math.floor(loyaltyPoints * 0.8),
          balanceAfter: loyaltyPoints,
          description: `Tích lũy điểm thưởng từ chuỗi ${totalOrders} đơn hàng hoàn tất`,
        },
      });
    }
  }
  console.log('✓ CRM Customers & Loyalty History seeded');

  // 4. SHIPMENTS, COD RECONCILIATIONS, FINANCE & E-INVOICES (LINKED TO REAL ORDERS)
  const orders = await prisma.order.findMany({
    take: 15,
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const carriers = ['GHN', 'GHTK', 'VIETTEL_POST', 'FLASH_2H'];
  let totalCodExpectedAll = 0;
  let totalCodReceivedAll = 0;

  for (let i = 0; i < orders.length; i++) {
    const ord = orders[i];
    const carrier = carriers[i % carriers.length];
    const trackingCode = `${carrier}-VN-202610${String(i + 100).padStart(4, '0')}`;
    const codAmount = Number(ord.totalAmount) || 24900000;
    const shippingFee = 35000;
    const isDelivered = i % 3 !== 0;

    totalCodExpectedAll += codAmount;
    if (isDelivered) totalCodReceivedAll += codAmount;

    // Shipment
    const shipment = await prisma.shipment.upsert({
      where: { trackingCode },
      update: {
        orderId: ord.id,
        carrier,
        status: isDelivered ? 'DELIVERED' : 'DELIVERING',
        codAmount,
        shippingFee,
        recipientName: ord.user?.fullName || 'Khách Hàng TechZone',
        recipientPhone: '0988.777.666',
        recipientAddress: 'Tòa nhà Landmark 81, P. 22, Q. Bình Thạnh, TP.HCM',
        deliveredAt: isDelivered ? new Date() : null,
      },
      create: {
        orderId: ord.id,
        carrier,
        trackingCode,
        status: isDelivered ? 'DELIVERED' : 'DELIVERING',
        codAmount,
        shippingFee,
        recipientName: ord.user?.fullName || 'Khách Hàng TechZone',
        recipientPhone: '0988.777.666',
        recipientAddress: 'Tòa nhà Landmark 81, P. 22, Q. Bình Thạnh, TP.HCM',
        deliveredAt: isDelivered ? new Date() : null,
      },
    });

    // Finance Transaction (Revenue & COD)
    const existingFin = await prisma.financeTransaction.findFirst({
      where: { orderId: ord.id },
    });
    if (!existingFin) {
      await prisma.financeTransaction.create({
        data: {
          orderId: ord.id,
          shipmentId: shipment.id,
          type: 'REVENUE',
          amount: codAmount,
          description: `Ghi nhận doanh thu đơn hàng #${ord.id.slice(0, 8)} thanh toán COD qua ${carrier}`,
          status: isDelivered ? 'RECONCILED' : 'CONFIRMED',
        },
      });
    }

    // E-Invoice VAT
    const invoiceNumber = `HD-2026-10-${String(i + 1001)}`;
    const vatRate = 10;
    const subtotal = Math.round(codAmount / 1.1);
    const vatAmount = codAmount - subtotal;

    await prisma.eInvoice.upsert({
      where: { invoiceNumber },
      update: {
        orderId: ord.id,
        buyerName: ord.user?.fullName || 'Khách Hàng TechZone',
        buyerTaxCode: '0109988776',
        buyerAddress: 'Tòa nhà Landmark 81, TP.HCM',
        subtotal,
        vatRate,
        vatAmount,
        totalAmount: codAmount,
        status: isDelivered ? 'CQT_VERIFIED' : 'ISSUED',
        cqtCode: `CQT-202610-VN-${ord.id.slice(0, 8).toUpperCase()}`,
      },
      create: {
        orderId: ord.id,
        invoiceNumber,
        buyerName: ord.user?.fullName || 'Khách Hàng TechZone',
        buyerTaxCode: '0109988776',
        buyerAddress: 'Tòa nhà Landmark 81, TP.HCM',
        subtotal,
        vatRate,
        vatAmount,
        totalAmount: codAmount,
        status: isDelivered ? 'CQT_VERIFIED' : 'ISSUED',
        cqtCode: `CQT-202610-VN-${ord.id.slice(0, 8).toUpperCase()}`,
      },
    });
  }

  // COD Reconciliation Batches
  for (const carrier of carriers) {
    const batchCode = `REC-20261002-${carrier}`;
    await prisma.codReconciliation.upsert({
      where: { batchCode },
      update: {
        carrier,
        totalOrders: 15,
        totalCodExpected: totalCodExpectedAll / 4,
        totalCodReceived: totalCodReceivedAll / 4,
        discrepancyAmount: (totalCodExpectedAll - totalCodReceivedAll) / 4,
        status: 'MATCHED',
        settledAt: new Date(),
      },
      create: {
        batchCode,
        carrier,
        totalOrders: 15,
        totalCodExpected: totalCodExpectedAll / 4,
        totalCodReceived: totalCodReceivedAll / 4,
        discrepancyAmount: (totalCodExpectedAll - totalCodReceivedAll) / 4,
        status: 'MATCHED',
        settledAt: new Date(),
      },
    });
  }
  console.log('✓ Shipments, COD Reconciliations, Finance Transactions & E-Invoices seeded');

  // 5. COUPONS (MARKETING)
  const couponsData = [
    {
      code: 'TECHZONE_VIP_2M',
      discountType: 'FIXED',
      discountValue: 2000000,
      minOrderValue: 25000000,
      maxDiscount: 2000000,
      usageLimit: 500,
      usedCount: 142,
      status: 'ACTIVE',
    },
    {
      code: 'FLASHSALE10',
      discountType: 'PERCENT',
      discountValue: 10,
      minOrderValue: 5000000,
      maxDiscount: 1500000,
      usageLimit: 2000,
      usedCount: 890,
      status: 'ACTIVE',
    },
    {
      code: 'FREESHIP_EXPRESS',
      discountType: 'FIXED',
      discountValue: 50000,
      minOrderValue: 2000000,
      maxDiscount: 50000,
      usageLimit: 5000,
      usedCount: 2310,
      status: 'ACTIVE',
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log('✓ Coupons seeded');

  // 6. ADMIN USERS (RBAC 6 ENTERPRISE ROLES)
  const adminUsersData = [
    {
      email: 'admin.super@techzone.vn',
      fullName: 'Trần Hải Nam (CTO & Super Admin)',
      role: 'Super Admin',
      enforce2fa: true,
      ipRestricted: true,
      allowedIps: ['118.70.182.42', '14.232.19.88'],
      status: 'ACTIVE',
      lastLoginIp: '118.70.182.42',
      lastLoginAt: new Date(),
    },
    {
      email: 'manager.hoang@techzone.vn',
      fullName: 'Nguyễn Văn Hoàng',
      role: 'Quản lý',
      enforce2fa: true,
      ipRestricted: false,
      allowedIps: [],
      status: 'ACTIVE',
      lastLoginIp: '118.70.182.15',
      lastLoginAt: new Date(Date.now() - 3600000),
    },
    {
      email: 'accountant.phuong@techzone.vn',
      fullName: 'Lê Thu Phương',
      role: 'Kế toán',
      enforce2fa: true,
      ipRestricted: true,
      allowedIps: ['118.70.182.42'],
      status: 'ACTIVE',
      lastLoginIp: '118.70.182.42',
      lastLoginAt: new Date(Date.now() - 7200000),
    },
    {
      email: 'warehouse.duy@techzone.vn',
      fullName: 'Phạm Đức Duy',
      role: 'Thủ kho',
      enforce2fa: false,
      ipRestricted: true,
      allowedIps: ['14.232.19.88'],
      status: 'ACTIVE',
      lastLoginIp: '14.232.19.88',
      lastLoginAt: new Date(Date.now() - 1800000),
    },
    {
      email: 'cskh.mai@techzone.vn',
      fullName: 'Đặng Tuyết Mai',
      role: 'CSKH',
      enforce2fa: true,
      ipRestricted: false,
      allowedIps: [],
      status: 'ACTIVE',
      lastLoginIp: '113.190.22.4',
      lastLoginAt: new Date(Date.now() - 900000),
    },
    {
      email: 'marketing.quan@techzone.vn',
      fullName: 'Vũ Hoàng Quân',
      role: 'Marketing',
      enforce2fa: true,
      ipRestricted: false,
      allowedIps: [],
      status: 'ACTIVE',
      lastLoginIp: '171.244.18.9',
      lastLoginAt: new Date(Date.now() - 14400000),
    },
  ];

  for (const adm of adminUsersData) {
    await prisma.adminUser.upsert({
      where: { email: adm.email },
      update: adm,
      create: adm,
    });
  }
  console.log('✓ Admin RBAC Users seeded');

  // 7. IMMUTABLE AUDIT LOGS
  const auditLogsData = [
    {
      id: 'AUD-20261003-0001',
      actorId: 'ADM-01',
      actorName: 'Trần Hải Nam',
      actorEmail: 'admin.super@techzone.vn',
      role: 'Super Admin',
      action: 'ROLE_ELEVATION',
      resource: 'RBAC_SECURITY',
      entityId: 'USER-ADM-02',
      ip: '118.70.182.42',
      severity: 'CRITICAL',
      isSensitive: true,
      beforeValue: 'role: "Quản lý", 2FA: false',
      afterValue: 'role: "Quản lý Cấp Cao", 2FA: true, ipRestricted: true',
      description: 'Nâng cấp đặc quyền tài khoản Quản lý chi nhánh miền Bắc và kích hoạt bắt buộc 2FA',
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: 'AUD-20261003-0002',
      actorId: 'ADM-03',
      actorName: 'Lê Thu Phương',
      actorEmail: 'accountant.phuong@techzone.vn',
      role: 'Kế toán',
      action: 'APPROVE_REFUND_VAT',
      resource: 'FINANCE_SETTLEMENT',
      entityId: 'INV-2026-10-1002',
      ip: '118.70.182.42',
      severity: 'WARNING',
      isSensitive: true,
      beforeValue: 'status: "PENDING_REVIEW", refundAmount: 0',
      afterValue: 'status: "APPROVED", refundAmount: 32,990,000₫, vatDeduction: 3,299,000₫',
      description: 'Duyệt hoàn tiền và lập biên bản điều chỉnh hóa đơn điện tử VAT cho đơn hoàn trả MacBook Pro M3',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 'AUD-20261003-0003',
      actorId: 'ADM-04',
      actorName: 'Phạm Đức Duy',
      actorEmail: 'warehouse.duy@techzone.vn',
      role: 'Thủ kho',
      action: 'STOCK_COMMIT_DISPATCH',
      resource: 'INVENTORY_LEDGER',
      entityId: 'WH-HN-01 / IPHONE-16-PRO',
      ip: '14.232.19.88',
      severity: 'INFO',
      isSensitive: false,
      beforeValue: 'onHand: 150, reserved: 15, available: 135',
      afterValue: 'onHand: 135, reserved: 0, available: 135 (Waybill #GHN-VN-2026100100)',
      description: 'Xuất kho và bàn giao 15 kiện hàng iPhone 16 Pro Max cho đơn vị vận chuyển GHN Express',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: 'AUD-20261003-0004',
      actorId: 'ADM-06',
      actorName: 'Vũ Hoàng Quân',
      actorEmail: 'marketing.quan@techzone.vn',
      role: 'Marketing',
      action: 'EXPORT_CRM_DATA_SENSITIVE',
      resource: 'CUSTOMERS_CRM',
      entityId: 'SEGMENT-VIP-DIAMOND',
      ip: '171.244.18.9',
      severity: 'CRITICAL',
      isSensitive: true,
      beforeValue: 'N/A',
      afterValue: 'Exported: 1,420 VIP customer records (Phone, Email, Total Spent)',
      description: 'Xuất danh sách khách hàng VIP Diamond để chuẩn bị chiến dịch tri ân flash sale',
      timestamp: new Date(Date.now() - 14400000),
    },
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: log,
      create: log,
    });
  }
  console.log('✓ Immutable Audit Logs seeded');

  // 8. SYSTEM SETTINGS
  const systemSettingsData = [
    {
      id: 'STORE_INFO',
      value: {
        storeName: 'TechZone Premium Store',
        legalEntity: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHZONE VIỆT NAM',
        taxCode: '0109988776',
        legalRepresentative: 'Trần Hải Nam',
        hotline: '1900 8899',
        supportEmail: 'cskh@techzone.vn',
        headquarters: 'Tầng 18, Tòa nhà Landmark 81, 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM',
        maintenanceMode: false,
        maintenanceMessage: 'Hệ thống TechZone đang nâng cấp hạ tầng flash sale 10.10. Vui lòng quay lại sau 15 phút!',
      },
    },
    {
      id: 'SECURITY_GOVERNANCE',
      value: {
        enforce2fa: true,
        sessionTimeoutMinutes: 30,
        ipWhitelistEnabled: true,
        marketplaceMultiTenantIsolation: true,
        maxFailedLoginAttempts: 5,
      },
    },
    {
      id: 'TAX_AND_CURRENCY',
      value: {
        vatTelecomComputers: 10,
        vatAccessories: 8,
        currencies: [
          { code: 'VND', symbol: '₫', exchangeRate: 1, isDefault: true },
          { code: 'USD', symbol: '$', exchangeRate: 25450, isDefault: false },
          { code: 'EUR', symbol: '€', exchangeRate: 27600, isDefault: false },
        ],
        languages: [
          { code: 'vi', name: 'Tiếng Việt (Mặc định)', completeness: '100%', isDefault: true },
          { code: 'en', name: 'English (US)', completeness: '98%', isDefault: false },
        ],
      },
    },
    {
      id: 'ALERT_ROUTING',
      value: {
        slackWebhook: 'https://hooks.slack.com/services/T00/B00/X8892',
        emailRecipients: 'alerts@techzone.vn, oncall@techzone.vn',
        zaloOaEnabled: true,
        telegramBotConnected: true,
      },
    },
  ];

  for (const s of systemSettingsData) {
    await prisma.systemSetting.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log('✓ System Settings seeded');

  // 9. CMS POSTS
  const cmsPostsData = [
    {
      id: 'POST-01',
      title: 'Đánh Giá Chi Tiết iPhone 16 Pro Max: Nút Điều Khiển Camera Có Đáng Nâng Cấp?',
      slug: 'danh-gia-chi-tiet-iphone-16-pro-max',
      category: 'Đánh Giá Công Nghệ',
      author: 'Vũ Hoàng Quân (Tech Editor)',
      status: 'PUBLISHED',
      views: 18450,
      seoTitle: 'Đánh giá iPhone 16 Pro Max chính hãng Apple VN/A | TechZone',
      seoDesc: 'Trải nghiệm thực tế iPhone 16 Pro Max với camera 48MP và chip A18 Pro.',
      content: 'iPhone 16 Pro Max mang đến bước đột phá lớn với nút Camera Control cảm ứng lực...',
      tags: ['iPhone 16 Pro Max', 'Apple VN/A', 'Review'],
    },
    {
      id: 'POST-02',
      title: 'MacBook Pro M3 Max 16-inch: Cỗ Máy Quái Vật Dành Cho Lập Trình Viên & AI Engineer',
      slug: 'macbook-pro-m3-max-danh-cho-lap-trinh-vien',
      category: 'Tin Tức Apple',
      author: 'Nguyễn Văn Toàn',
      status: 'PUBLISHED',
      views: 12200,
      seoTitle: 'MacBook Pro M3 Max cho lập trình viên và đồ họa | TechZone',
      seoDesc: 'Hiệu năng thực tế khi chạy Docker, LLM cục bộ và biên dịch Xcode trên chip M3 Max.',
      content: 'Với 128GB Unified Memory và băng thông bộ nhớ lên đến 400GB/s, chip M3 Max...',
      tags: ['MacBook Pro', 'M3 Max', 'Developer'],
    },
  ];

  for (const p of cmsPostsData) {
    await prisma.cmsPost.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log('✓ CMS Posts seeded');

  console.log('=== ENTERPRISE SEED COMPLETED SUCCESSFULLY ===');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
