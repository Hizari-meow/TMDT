import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateReviewDto {
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  comment: string;
  variant?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductReviews(productId: string) {
    const reviews = await this.prisma.$queryRaw<Array<{
      id: string;
      product_id: string;
      author_name: string;
      rating: number;
      comment: string;
      variant: string | null;
      verified_purchase: boolean;
      created_at: Date;
    }>>`
      SELECT id, product_id, author_name, rating, comment, variant, verified_purchase, created_at
      FROM reviews
      WHERE product_id = ${productId}::uuid
      ORDER BY created_at DESC
    `;

    const stats = await this.prisma.$queryRaw<Array<{
      avg_rating: number;
      total_reviews: bigint;
    }>>`
      SELECT COALESCE(AVG(rating), 5.0) as avg_rating, COUNT(*) as total_reviews
      FROM reviews
      WHERE product_id = ${productId}::uuid
    `;

    const avgRating = stats[0] ? Number(stats[0].avg_rating) : 5.0;
    const totalCount = stats[0] ? Number(stats[0].total_reviews) : 0;

    return {
      productId,
      averageRating: Math.round(avgRating * 10) / 10,
      totalCount,
      reviews: reviews.map((r) => ({
        id: r.id,
        productId: r.product_id,
        authorName: r.author_name,
        rating: r.rating,
        comment: r.comment,
        variant: r.variant,
        verifiedPurchase: r.verified_purchase,
        createdAt: r.created_at,
      })),
    };
  }

  async createReview(dto: CreateReviewDto) {
    if (!dto.productId || !dto.authorName || !dto.comment || !dto.rating) {
      throw new BadRequestException('Vui lòng điền đầy đủ thông tin đánh giá.');
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Số sao đánh giá phải từ 1 đến 5 sao.');
    }

    const result = await this.prisma.$queryRaw<Array<{
      id: string;
      created_at: Date;
    }>>`
      INSERT INTO reviews (product_id, user_id, author_name, rating, comment, variant, verified_purchase, created_at)
      VALUES (
        ${dto.productId}::uuid, 
        ${dto.userId || '33333333-3333-3333-3333-333333333333'}::uuid, 
        ${dto.authorName}, 
        ${dto.rating}, 
        ${dto.comment}, 
        ${dto.variant || 'Tiêu chuẩn'}, 
        true, 
        NOW()
      )
      RETURNING id, created_at
    `;

    return {
      success: true,
      reviewId: result[0]?.id,
      createdAt: result[0]?.created_at,
    };
  }
}
