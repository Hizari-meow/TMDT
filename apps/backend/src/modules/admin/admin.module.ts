import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAnalyticsService } from './services/admin-analytics.service';
import { AdminOrderService } from './services/admin-order.service';
import { AdminInventoryService } from './services/admin-inventory.service';
import { AdminProductService } from './services/admin-product.service';
import { AdminCrmService } from './services/admin-crm.service';
import { AdminFinanceService } from './services/admin-finance.service';
import { AdminLogisticsService } from './services/admin-logistics.service';
import { AdminMarketingService } from './services/admin-marketing.service';
import { AdminSystemService } from './services/admin-system.service';
import { AdminLifecycleService } from './services/admin-lifecycle.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminAnalyticsService,
    AdminOrderService,
    AdminInventoryService,
    AdminProductService,
    AdminCrmService,
    AdminFinanceService,
    AdminLogisticsService,
    AdminMarketingService,
    AdminSystemService,
    AdminLifecycleService,
  ],
  exports: [
    AdminService,
    AdminAnalyticsService,
    AdminOrderService,
    AdminInventoryService,
    AdminProductService,
    AdminCrmService,
    AdminFinanceService,
    AdminLogisticsService,
    AdminMarketingService,
    AdminSystemService,
    AdminLifecycleService,
  ],
})
export class AdminModule {}
