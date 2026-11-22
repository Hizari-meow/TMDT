import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Calculate total spend and reward points
    const orders = await this.prisma.order.findMany({
      where: { userId },
    });

    const totalSpent = orders
      .filter((o) => ['PAID', 'DELIVERED', 'SHIPPING'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const rewardPoints = Math.floor(totalSpent * 10); // 10 points per dollar spent

    let membershipTier = 'Thành viên Đồng (Bronze)';
    let discountPrivilege = '0%';
    if (totalSpent >= 5000) {
      membershipTier = 'Hội viên Kim Cương (Diamond VIP)';
      discountPrivilege = '15% mọi đơn hàng + FreeShip trọn đời';
    } else if (totalSpent >= 2000) {
      membershipTier = 'Hội viên Vàng (Gold)';
      discountPrivilege = '10% mọi đơn hàng';
    } else if (totalSpent >= 500) {
      membershipTier = 'Hội viên Bạc (Silver)';
      discountPrivilege = '5% mọi đơn hàng';
    }

    const savedAddresses = [
      {
        id: 'addr-1',
        isDefault: true,
        type: 'Nhà riêng',
        recipientName: user.fullName,
        phone: '0908 123 456',
        fullAddress: 'Số 128 Trần Hưng Đạo, Phường Phạm Ngũ Lão, Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      {
        id: 'addr-2',
        isDefault: false,
        type: 'Văn phòng',
        recipientName: user.fullName,
        phone: '0908 123 456',
        fullAddress: 'Tầng 18, Toà nhà Bitexco Financial Tower, Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
    ];

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      membershipTier,
      discountPrivilege,
      rewardPoints,
      totalOrders: orders.length,
      totalSpent,
      savedAddresses,
      memberSince: user.createdAt,
    };
  }
}
