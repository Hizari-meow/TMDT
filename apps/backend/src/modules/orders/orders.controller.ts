import { Controller, Get, Post, Body, Param, Res, Headers } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { OrderSseService } from './sse/order-sse.service';
import { OrdersService } from './orders.service';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(
    private readonly orderSseService: OrderSseService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Real-time order status SSE stream endpoint.
   * If client explicitly requests application/json, returns instantaneous JSON snapshot.
   */
  @Get(':id/status')
  async getOrderStatus(
    @Param('id') trackingId: string,
    @Headers('accept') acceptHeader: string,
    @Res() reply: FastifyReply,
  ) {
    if (acceptHeader && acceptHeader.includes('application/json')) {
      const status = await this.ordersService.getStatus(trackingId);
      return reply.send(status);
    }

    // Default: Stream via Server-Sent Events
    return await this.orderSseService.streamOrderStatus(trackingId, reply);
  }

  /**
   * Dedicated polling endpoint for clients falling back from SSE.
   */
  @Get(':id/poll')
  async pollOrderStatus(@Param('id') trackingId: string) {
    return await this.ordersService.getStatus(trackingId);
  }

  /**
   * Returns user order history from partitioned PostgreSQL orders table.
   */
  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return await this.ordersService.getUserOrders(userId);
  }

  /**
   * Standard cart checkout endpoint.
   */
  @Post('standard-checkout')
  async standardCheckout(
    @Body()
    body: {
      userId: string;
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress?: { fullName: string; phone: string; address: string; city: string };
      paymentMethod?: string;
      carrier?: string;
    },
  ) {
    return await this.ordersService.createStandardCheckout(body);
  }
}
