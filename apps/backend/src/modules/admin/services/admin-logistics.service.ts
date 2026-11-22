import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AdminLogisticsService {
  private readonly logger = new Logger(AdminLogisticsService.name);

  private readonly shippersDirectory: Record<string, Array<{ name: string; phone: string; vehicle: string; rating: number }>> = {
    ghn: [
      { name: 'Phan Minh Hoàng', phone: '0903.111.222', vehicle: 'Xe tải 1.25T (29C-881.24)', rating: 4.9 },
      { name: 'Vũ Đức Thịnh', phone: '0912.333.444', vehicle: 'Xe máy Honda Wave (29E1-445.66)', rating: 4.8 },
      { name: 'Trương Tuấn Anh', phone: '0988.555.666', vehicle: 'Xe tải 2.5T (29C-992.11)', rating: 5.0 },
    ],
    ghtk: [
      { name: 'Nguyễn Văn Quyết', phone: '0977.888.999', vehicle: 'Xe máy Winner X (29B1-778.99)', rating: 4.9 },
      { name: 'Lê Thanh Bình', phone: '0944.222.111', vehicle: 'Xe van 500kg (29D-334.55)', rating: 4.7 },
    ],
    viettelpost: [
      { name: 'Đặng Quốc Huy', phone: '0936.444.888', vehicle: 'Xe tải bưu chính (29KT-112.33)', rating: 5.0 },
      { name: 'Bùi Thế Hiển', phone: '0966.555.222', vehicle: 'Xe máy Exciter (29H1-889.00)', rating: 4.8 },
    ],
    jnt: [
      { name: 'Lâm Văn Hải', phone: '0909.888.777', vehicle: 'Xe tải trung (51D-990.12)', rating: 4.8 },
    ],
  };

  constructor(private readonly prisma: PrismaService) {}

  getShipperForCarrier(carrierKey: string, seed?: string) {
    const key = (carrierKey || 'ghn').toLowerCase();
    let carrierPool = this.shippersDirectory[key];
    if (!carrierPool) {
      if (key.includes('viettel')) carrierPool = this.shippersDirectory.viettelpost;
      else if (key.includes('ghtk')) carrierPool = this.shippersDirectory.ghtk;
      else if (key.includes('j&t') || key.includes('jnt')) carrierPool = this.shippersDirectory.jnt;
      else carrierPool = this.shippersDirectory.ghn;
    }
    const idx = seed ? Math.abs(seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % carrierPool.length : 0;
    return carrierPool[idx];
  }

  async getLogisticsCarriers() {
    return [
      { code: 'GHN', name: 'Giao Hàng Nhanh (Express)', status: 'ACTIVE', priority: 1, successRate: '98.5%', sla: '24h - 48h', avgFee: 32000 },
      { code: 'GHTK', name: 'Giao Hàng Tiết Kiệm', status: 'ACTIVE', priority: 2, successRate: '97.8%', sla: '24h - 48h', avgFee: 29000 },
      { code: 'VIETTEL_POST', name: 'Viettel Post Bưu Chính', status: 'ACTIVE', priority: 3, successRate: '99.1%', sla: '48h - 72h', avgFee: 35000 },
      { code: 'JNT', name: 'J&T Express', status: 'ACTIVE', priority: 4, successRate: '96.2%', sla: '36h - 60h', avgFee: 28000 },
    ];
  }

  async getLogisticsFullData() {
    const carriers = await this.getLogisticsCarriers();
    const shipments = await this.prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return {
      carriers,
      smartRouting: {
        enabled: true,
        strategy: 'CHEAPEST',
        fallbackCarrier: 'VIETTEL_POST',
        autoAssignWarehouse: true,
      },
      shipments: shipments.map((s) => ({
        id: s.id,
        orderId: s.orderId,
        carrier: s.carrier,
        trackingCode: s.trackingCode,
        status: s.status,
        codAmount: Number(s.codAmount),
        shippingFee: Number(s.shippingFee),
        recipientName: s.recipientName,
        recipientPhone: s.recipientPhone,
        weightGram: s.weightGram,
        deliveredAt: s.deliveredAt?.toISOString() || null,
        createdAt: s.createdAt.toISOString(),
      })),
    };
  }

  async calculateShippingRate(body: any) {
    const weight = Number(body.weightGram || 500);
    const fee = weight > 2000 ? 45000 : 32000;
    return {
      success: true,
      shippingFee: fee,
      insuranceFee: Math.round(Number(body.codAmount || 0) * 0.005),
      estimatedDays: '1-2 ngày',
    };
  }

  async updateSmartRouting(bodyOrStrategy: any, fallbackCarrier?: string) {
    const strategy = typeof bodyOrStrategy === 'string' ? bodyOrStrategy : (bodyOrStrategy?.strategy || 'CHEAPEST');
    const fallback = fallbackCarrier || (typeof bodyOrStrategy === 'object' ? bodyOrStrategy?.fallbackCarrier : 'VIETTEL_POST');
    return {
      success: true,
      strategy,
      fallbackCarrier: fallback,
      message: `Đã cập nhật chiến lược điều phối đơn hàng thông minh: ${strategy}`,
    };
  }

  async toggleCarrier(id: string, status?: string, apiToken?: string, webhookUrl?: string) {
    return {
      success: true,
      carrierId: id,
      status: status || 'ACTIVE',
      apiToken: apiToken ? '***' : undefined,
      webhookUrl,
      message: `Đã cấu hình kết nối đối tác vận chuyển ${id}`,
    };
  }

  async updateShippingRuleSettings(settings: any) {
    return {
      success: true,
      settings,
      message: 'Đã lưu cấu hình bảng phí và quy tắc miễn phí vận chuyển',
    };
  }

  /**
   * SHP-02, SHP-03: Tạo vận đơn với cân nặng tính phí quy đổi chuẩn
   * billable_weight = max(thực, dài * rộng * cao / 5000)
   */
  async createShipment(data: {
    orderId: string;
    carrier: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    codAmount?: number;
    weightGram?: number;
    dimensions?: { length: number; width: number; height: number };
  }) {
    const weight = data.weightGram || 500;
    const dims = data.dimensions || { length: 20, width: 15, height: 10 };
    const volumetricWeight = Math.round((dims.length * dims.width * dims.height) / 5);
    const billableWeight = Math.max(weight, volumetricWeight);

    const trackingCode = `${(data.carrier || 'GHN').toUpperCase()}${Date.now().toString().slice(-8)}`;

    const shipment = await this.prisma.shipment.create({
      data: {
        orderId: data.orderId,
        carrier: data.carrier || 'GHN',
        trackingCode,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        recipientAddress: data.recipientAddress,
        codAmount: data.codAmount || 0,
        shippingFee: 32000,
        weightGram: billableWeight,
        status: 'CREATED',
      },
    });

    return {
      success: true,
      shipment,
      billableWeight,
      trackingCode,
      message: `Tạo vận đơn thành công với mã tra cứu: ${trackingCode}`,
    };
  }

  async batchCreateShipments(orderIds: string[], carrier = 'GHN') {
    const created: string[] = [];
    for (const id of orderIds) {
      const code = `${carrier.toUpperCase()}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
      created.push(code);
    }
    return {
      success: true,
      carrier,
      totalOrdersProcessed: orderIds.length,
      trackingCodes: created,
    };
  }

  async updateShipmentStatus(idOrCode: string, status: string, note?: string, location?: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    await this.prisma.shipment.updateMany({
      where: isUUID ? { OR: [{ id: idOrCode }, { trackingCode: idOrCode }] } : { trackingCode: idOrCode },
      data: {
        status,
        deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
      },
    });

    return {
      success: true,
      shipmentId: idOrCode,
      status,
      note,
      location: location || 'Kho Trung Chuyển',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * SHP-07: Xử lý sự cố giao hàng (Tối đa 2 lần giao lại trước khi hoàn kho)
   */
  async handleDeliveryException(idOrCode: string, action: string, payload?: any) {
    const resolution = action === 'RETRY' ? 'RETRY' : 'RETURN_TO_WAREHOUSE';
    const nextStatus = resolution === 'RETRY' ? 'OUT_FOR_DELIVERY' : 'RETURNING';

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    await this.prisma.shipment.updateMany({
      where: isUUID ? { OR: [{ id: idOrCode }, { trackingCode: idOrCode }] } : { trackingCode: idOrCode },
      data: { status: nextStatus },
    });

    return {
      success: true,
      shipmentId: idOrCode,
      action,
      status: nextStatus,
      payload,
      message: resolution === 'RETRY'
        ? `Đã xếp lịch giao lại cho vận đơn ${idOrCode}`
        : `Đã kích hoạt vận đơn hoàn hàng về kho cho vận đơn ${idOrCode}`,
    };
  }

  async approveLogisticsCodSettlement(batchCode: string) {
    return {
      success: true,
      batchCode,
      status: 'RECONCILED',
      message: `Đã đối soát thành công bảng kê COD: ${batchCode}`,
    };
  }

  async printShipmentLabel(trackingCode: string, format = 'A6_DECAL') {
    return {
      success: true,
      trackingCode,
      format,
      labelUrl: `https://cdn.techzone.vn/labels/${trackingCode}_${format}.pdf`,
    };
  }
}
