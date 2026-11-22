import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { orderMetadataStore } from './order-metadata.store';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Retrieves order status with cache-aside fallback to partitioned Postgres.
   */
  async getStatus(trackingId: string) {
    // 1. Check Redis in-memory cache first
    const redisStatus = await this.redisService.getOrderStatus(trackingId);
    if (redisStatus) {
      return {
        trackingId,
        source: 'cache',
        ...redisStatus,
      };
    }

    // 2. Query partitioned PostgreSQL
    const orders = await this.prisma.$queryRaw<Array<{
      id: string;
      tracking_id: string;
      status: string;
      total_amount: number;
      created_at: Date;
    }>>`
      SELECT id, tracking_id, status, total_amount, created_at 
      FROM orders 
      WHERE tracking_id = ${trackingId}::uuid
      LIMIT 1
    `;

    if (!orders || orders.length === 0) {
      return {
        trackingId,
        status: 'UNKNOWN',
        source: 'database',
      };
    }

    const order = orders[0];
    return {
      trackingId,
      orderId: order.id,
      status: order.status,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      source: 'database',
    };
  }

  /**
   * Retrieves all orders for a specific user from partitioned tables.
   */
  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        flashSale: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return orders.map((ord, idx) => {
      const meta = orderMetadataStore.get(ord.id);
      return {
        ...ord,
        metadata: meta || null,
        carrier: meta?.carrier || (idx % 2 === 0 ? 'Giao Hàng Nhanh (GHN)' : 'AhaMove / GrabExpress (Hỏa Tốc 2H)'),
        shippingAddress: meta?.shippingAddress || {
          fullName: 'Flash Sale Demo Buyer',
          phone: '0988 123 456',
          address: 'Tầng 18, Toà nhà Bitexco Financial Tower, Phường Bến Nghé',
          city: 'TP. Hồ Chí Minh',
        },
        timeline: meta?.timeline || [],
      };
    });
  }

  /**
   * Standard E-Commerce Cart Checkout (ACID transaction into partitioned tables).
   */
  async createStandardCheckout(data: {
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress?: { fullName: string; phone: string; address: string; city: string };
    paymentMethod?: string;
    carrier?: string;
  }) {
    if (!data.items || data.items.length === 0) {
      throw new Error('Cart is empty.');
    }

    const { v4: uuidv4 } = await import('uuid');
    const orderId = uuidv4();
    const trackingId = uuidv4();
    const now = new Date();

    const isCod = (data.paymentMethod || 'COD').toUpperCase() === 'COD';
    // COD orders start at PENDING_CONFIRMATION (Chờ xác nhận để gọi điện)
    // Online paid orders start at CONFIRMED (Đã xác nhận & thanh toán thành công)
    const initialStatus = isCod ? 'PENDING_CONFIRMATION' : 'CONFIRMED';

    return await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsToCreate: any[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${product?.name || item.productId} has insufficient stock.`);
        }

        // Decrement stock in DB with check constraint safety
        await tx.$executeRaw`
          UPDATE products 
          SET stock = stock - ${item.quantity}, updated_at = NOW() 
          WHERE id = ${item.productId}::uuid
        `;

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        orderItemsToCreate.push({
          orderId,
          orderCreatedAt: now,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          createdAt: now,
        });
      }

      // Create Order in partitioned table
      const order = await tx.order.create({
        data: {
          id: orderId,
          trackingId,
          userId: data.userId,
          orderType: 'STANDARD',
          status: initialStatus,
          totalAmount,
          createdAt: now,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItemsToCreate,
      });

      // Store persistent order metadata for OMS & Logistics
      const customerName = data.shippingAddress?.fullName || 'Khách hàng Storefront';
      const customerPhone = data.shippingAddress?.phone || '0988 123 456';
      const carrierName = data.carrier === 'AHAMOVE' ? 'AhaMove / GrabExpress (Hỏa Tốc 2H)' : data.carrier === 'GHTK' ? 'GHTK Express' : 'Giao Hàng Nhanh (GHN)';
      const carrierId = data.carrier === 'AHAMOVE' ? 'grabexpress' : data.carrier === 'GHTK' ? 'ghtk' : 'ghn';
      const shelfLoc = `Kệ A${Math.floor(1 + Math.random() * 4)}-Tầng ${Math.floor(1 + Math.random() * 3)}`;
      const waybillCode = `VN${order.trackingId.slice(0, 6).toUpperCase()}EX`;

      orderMetadataStore.set(order.id, {
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod || 'COD',
        carrier: carrierName,
        carrierId,
        waybillCode,
        packageDetails: {
          weightGrams: 450,
          lengthCm: 20,
          widthCm: 15,
          heightCm: 8,
          chargeableGrams: 480,
          shippingFee: 25000,
        },
        warehouse: {
          id: 'WH-HCM-01',
          name: 'Tổng Kho Tân Bình (TP.HCM)',
          address: 'Kho S18, KCN Tân Bình, Tây Thạnh, Tân Phú, TP. Hồ Chí Minh',
        },
        channel: 'Website TechZone',
        shelfLocation: shelfLoc,
        callVerification: isCod ? 'PENDING_CALL' : 'VERIFIED',
        internalNote: isCod ? 'Đơn hàng COD từ Website - Cần gọi xác minh số điện thoại' : 'Đơn hàng thanh toán Online qua ' + (data.paymentMethod || 'Cổng điện tử'),
        tags: [isCod ? 'COD_CHƯA_GỌI' : 'ONLINE_ĐÃ_TT', totalAmount > 2000 ? 'GIÁ_TRỊ_CAO' : 'TIÊU_CHUẨN'],
        timeline: [
          {
            time: now.toISOString(),
            title: 'Đặt hàng thành công',
            actor: customerName,
            note: `Đặt qua Website TechZone (Tổng: $${totalAmount.toLocaleString()})`,
            location: 'Storefront TechZone',
          },
          ...(!isCod ? [{
            time: new Date(now.getTime() + 1000).toISOString(),
            title: 'Thanh toán thành công',
            actor: 'Hệ thống tự động',
            note: `Xác nhận thanh toán qua ${data.paymentMethod}`,
            location: 'Cổng thanh toán điện tử',
          }] : []),
        ],
      });

      // Cache status in Redis
      await this.redisService.setOrderStatus(order.trackingId, order.status, {
        orderId: order.id,
        totalAmount: String(order.totalAmount),
      });

      return {
        success: true,
        orderId: order.id,
        trackingId: order.trackingId,
        totalAmount,
        status: order.status,
      };
    });
  }
}
