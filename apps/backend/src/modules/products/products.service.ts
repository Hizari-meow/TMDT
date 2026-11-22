import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { REDIS_KEYS } from '../../common/constants/redis-keys.constant';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Retrieves all catalog products with optional category, search, and sort filters.
   */
  async getProducts(categoryId?: string, search?: string, sort?: string) {
    const whereClause: any = {};
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    }

    const products = await this.prisma.product.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        category: true,
        flashSales: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
      orderBy,
    });

    return products.map((p) => this.enrichProductData(p));
  }

  enrichProductData(p: any) {
    let attributes: Array<{ name: string; value: string }> = [];
    let variants: Array<any> = [];
    let brand = { name: 'Apple Inc.', logo: '🍎' };
    let rating = 4.9;
    let reviewCount = 120;
    let categoryType = 'Thiết Bị Điện Tử & Di Động';

    const name = p.name || '';

    if (name.includes('iPhone 16 Pro')) {
      categoryType = 'Thiết Bị Điện Tử & Di Động';
      brand = { name: 'Apple Inc.', logo: '🍎' };
      rating = 4.9;
      reviewCount = 1240;
      attributes = [
        { name: 'Chíp Xử Lý (CPU/SoC)', value: 'Apple A18 Pro' },
        { name: 'Dung Lượng Bộ Nhớ', value: '256GB' },
        { name: 'Dung Lượng RAM', value: '8GB' },
        { name: 'Chất Liệu Khung Viền', value: 'Titanium Cấp 5 Hàng Không' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng 1 Đổi 1 AASP' },
        { name: 'Tiêu Chuẩn Kháng Nước', value: 'IP68 (6m/30p)' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Mỹ' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Titan Tự Nhiên - 256GB', color: 'Titan Tự Nhiên', size: '256GB', price: 999, stock: 40 },
        { id: `${p.id}-v2`, name: 'Titan Sa Mạc - 512GB', color: 'Titan Sa Mạc', size: '512GB', price: 1199, stock: 35 },
        { id: `${p.id}-v3`, name: 'Titan Đen - 1TB', color: 'Titan Đen', size: '1TB', price: 1399, stock: 25 },
      ];
    } else if (name.includes('MacBook Pro')) {
      categoryType = 'Thiết Bị Điện Tử & Di Động';
      brand = { name: 'Apple Inc.', logo: '🍎' };
      rating = 5.0;
      reviewCount = 680;
      attributes = [
        { name: 'Chíp Xử Lý (CPU/SoC)', value: 'Apple M3 Max' },
        { name: 'Dung Lượng Bộ Nhớ', value: '1TB' },
        { name: 'Dung Lượng RAM', value: '36GB' },
        { name: 'Chất Liệu Khung Viền', value: 'Nhôm Tái Chế 100%' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng 1 Đổi 1 AASP' },
        { name: 'Tiêu Chuẩn Kháng Nước', value: 'Không Kháng Nước' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Mỹ' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Space Black - 36GB/1TB', color: 'Space Black', size: '36GB', price: 3499, stock: 25 },
        { id: `${p.id}-v2`, name: 'Silver - 48GB/1TB', color: 'Silver', size: '48GB', price: 3999, stock: 20 },
      ];
    } else if (name.includes('AirPods Pro')) {
      categoryType = 'Thiết Bị Điện Tử & Di Động';
      brand = { name: 'Apple Inc.', logo: '🍎' };
      rating = 4.8;
      reviewCount = 2150;
      attributes = [
        { name: 'Chíp Xử Lý (CPU/SoC)', value: 'Apple H2' },
        { name: 'Chất Liệu Khung Viền', value: 'Polycarbonate' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng 1 Đổi 1 AASP' },
        { name: 'Tiêu Chuẩn Kháng Nước', value: 'IPX4 Chống Nước Bắn' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Việt Nam' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Trắng Tiêu Chuẩn (USB-C)', color: 'Trắng', size: 'FreeSize', price: 249, stock: 150 },
      ];
    } else if (name.includes('Watch Ultra')) {
      categoryType = 'Thiết Bị Điện Tử & Di Động';
      brand = { name: 'Apple Inc.', logo: '🍎' };
      rating = 4.9;
      reviewCount = 890;
      attributes = [
        { name: 'Chíp Xử Lý (CPU/SoC)', value: 'Apple S9 SiP' },
        { name: 'Dung Lượng Bộ Nhớ', value: '64GB' },
        { name: 'Chất Liệu Khung Viền', value: 'Titanium Cấp 5 Hàng Không' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng 1 Đổi 1 AASP' },
        { name: 'Tiêu Chuẩn Kháng Nước', value: 'IP68 (6m/30p)' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Mỹ' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Titan Tự Nhiên - Cam Alpine', color: 'Cam Alpine', size: 'Ultra 49mm', price: 799, stock: 40 },
        { id: `${p.id}-v2`, name: 'Titan Tự Nhiên - Xanh Trail', color: 'Xanh Trail', size: 'Ultra 49mm', price: 799, stock: 40 },
      ];
    } else if (name.includes('MagSafe')) {
      categoryType = 'Thiết Bị Điện Tử & Di Động';
      brand = { name: 'Apple Inc.', logo: '🍎' };
      rating = 4.7;
      reviewCount = 410;
      attributes = [
        { name: 'Chất Liệu Khung Viền', value: 'Nhôm Tái Chế 100%' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng 1 Đổi 1 AASP' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Việt Nam' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Bạc Kim Loại - 2m Cáp', color: 'Bạc', size: '2m', price: 39, stock: 300 },
      ];
    } else if (name.includes('Polo Thể Thao')) {
      categoryType = 'Thời Trang & Phụ Kiện Thể Thao';
      brand = { name: 'TechZone Activewear', logo: '👕' };
      rating = 4.9;
      reviewCount = 340;
      attributes = [
        { name: 'Chất Liệu Vải/Vật Liệu', value: 'Cotton 95% & Spandex 5%' },
        { name: 'Kích Cỡ / Size', value: 'M' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Việt Nam' },
        { name: 'Thời Gian Bảo Hành', value: '30 Ngày 1 Đổi 1' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Đỏ - S', color: 'Đỏ', size: 'S', price: 45, stock: 25 },
        { id: `${p.id}-v2`, name: 'Đỏ - M', color: 'Đỏ', size: 'M', price: 45, stock: 35 },
        { id: `${p.id}-v3`, name: 'Đỏ - L', color: 'Đỏ', size: 'L', price: 45, stock: 20 },
        { id: `${p.id}-v4`, name: 'Xanh - M', color: 'Xanh', size: 'M', price: 45, stock: 20 },
        { id: `${p.id}-v5`, name: 'Đen - M', color: 'Đen', size: 'M', price: 45, stock: 20 },
      ];
    } else if (name.includes('Áo Khoác Gió') || name.includes('Bomber')) {
      categoryType = 'Thời Trang & Phụ Kiện Thể Thao';
      brand = { name: 'TechZone Activewear', logo: '🧥' };
      rating = 4.8;
      reviewCount = 195;
      attributes = [
        { name: 'Chất Liệu Vải/Vật Liệu', value: 'Polycarbonate Chống Gió' },
        { name: 'Kích Cỡ / Size', value: 'L' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Việt Nam' },
        { name: 'Thời Gian Bảo Hành', value: '30 Ngày 1 Đổi 1' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Đen Stealth - M', color: 'Đen Stealth', size: 'M', price: 89, stock: 30 },
        { id: `${p.id}-v2`, name: 'Đen Stealth - L', color: 'Đen Stealth', size: 'L', price: 89, stock: 35 },
      ];
    } else if (name.includes('Quần Short')) {
      categoryType = 'Thời Trang & Phụ Kiện Thể Thao';
      brand = { name: 'Nike Sport', logo: '👟' };
      rating = 4.9;
      reviewCount = 280;
      attributes = [
        { name: 'Chất Liệu Vải/Vật Liệu', value: 'Vải Dệt FineWoven' },
        { name: 'Kích Cỡ / Size', value: 'L' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Hàn Quốc' },
        { name: 'Thời Gian Bảo Hành', value: '30 Ngày 1 Đổi 1' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Xám Khói - M', color: 'Xám', size: 'M', price: 35, stock: 45 },
        { id: `${p.id}-v2`, name: 'Xám Khói - L', color: 'Xám', size: 'L', price: 35, stock: 45 },
      ];
    } else if (name.includes('Alpine Loop') || name.includes('Dây Đeo')) {
      categoryType = 'Thời Trang & Phụ Kiện Thể Thao';
      brand = { name: 'Apple Inc.', logo: '🍎' };
      rating = 4.8;
      reviewCount = 520;
      attributes = [
        { name: 'Chất Liệu Vải/Vật Liệu', value: 'Vải Dệt FineWoven' },
        { name: 'Kích Cỡ / Size', value: 'Ultra 49mm' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Mỹ' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng Chính Hãng' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: 'Xanh Rêu - 49mm', color: 'Xanh Rêu', size: 'Ultra 49mm', price: 49, stock: 45 },
        { id: `${p.id}-v2`, name: 'Cam - 49mm', color: 'Cam', size: 'Ultra 49mm', price: 49, stock: 40 },
      ];
    } else {
      attributes = [
        { name: 'Chất Liệu Khung Viền', value: 'Nhôm Tái Chế 100%' },
        { name: 'Thời Gian Bảo Hành', value: '12 Tháng 1 Đổi 1 AASP' },
        { name: 'Xuất Xứ Sản Xuất', value: 'Việt Nam' },
      ];
      variants = [
        { id: `${p.id}-v1`, name: `${p.name} - Tiêu Chuẩn`, color: 'Mặc Định', size: 'Tiêu Chuẩn', price: Number(p.price), stock: p.stock },
      ];
    }

    return {
      ...p,
      categoryType,
      brand,
      rating,
      reviewCount,
      attributes,
      variants,
    };
  }

  /**
   * Retrieves product details using Cache-Aside pattern with randomized TTL jitter.
   * Prevents cache stampede / thundering herd problem.
   */
  async getProduct(productId: string) {
    const cacheKey = REDIS_KEYS.CACHE_PRODUCT(productId);

    // 1. In-memory Cache check
    const cached = await this.redisService.getClient().get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Fallback to DB
      }
    }

    // 2. Database query on cache miss
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        flashSales: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    // 3. Anti-stampede TTL jitter: 300s + rand(1..30)s
    const jitterSeconds = 300 + Math.floor(Math.random() * 30) + 1;
    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(product), 'EX', jitterSeconds);

    this.logger.debug(`Cache populated for product ${productId} with ${jitterSeconds}s TTL jitter`);
    return this.enrichProductData(product);
  }

  /**
   * Admin mutation: Updates product and immediately executes cache invalidation.
   */
  async updateProduct(productId: string, data: { name?: string; price?: number; stock?: number; description?: string }) {
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data,
    });

    // Immediate Cache Invalidation
    const cacheKey = REDIS_KEYS.CACHE_PRODUCT(productId);
    await this.redisService.getClient().del(cacheKey);
    this.logger.log(`Cache invalidated for product ${productId} following administrative mutation.`);

    return updated;
  }
}
