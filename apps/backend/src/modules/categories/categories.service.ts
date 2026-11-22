import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly CACHE_KEY = 'cache:categories';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Retrieves all product categories with Redis cache-aside (1-hour TTL).
   */
  async getCategories() {
    const cached = await this.redisService.getClient().get(this.CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Fallback to DB
      }
    }

    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    await this.redisService.getClient().set(this.CACHE_KEY, JSON.stringify(categories), 'EX', 3600);
    this.logger.debug('Categories fetched from DB and cached for 1 hour');
    return categories;
  }
}
