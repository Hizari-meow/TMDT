import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return await this.reviewsService.getProductReviews(productId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() body: CreateReviewDto) {
    return await this.reviewsService.createReview(body);
  }
}
