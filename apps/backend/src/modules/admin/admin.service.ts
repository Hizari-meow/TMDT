import { Injectable } from '@nestjs/common';
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

/**
 * AdminService acts as a Unified Facade delegating domain-specific requests
 * to bounded, modular sub-services following Clean Architecture.
 */
@Injectable()
export class AdminService {
  constructor(
    private readonly analyticsService: AdminAnalyticsService,
    private readonly orderService: AdminOrderService,
    private readonly inventoryService: AdminInventoryService,
    private readonly productService: AdminProductService,
    private readonly crmService: AdminCrmService,
    private readonly financeService: AdminFinanceService,
    private readonly logisticsService: AdminLogisticsService,
    private readonly marketingService: AdminMarketingService,
    private readonly systemService: AdminSystemService,
    private readonly lifecycleService: AdminLifecycleService,
  ) {}

  // =========================================================================
  // 1. Phân Hệ Báo Cáo & Phân Tích (RPT - Analytics & BI)
  // =========================================================================
  async getOverview() {
    return await this.analyticsService.getOverview();
  }

  async getEnterpriseAnalytics(timeRange?: string, channel?: string, role?: string) {
    return await this.analyticsService.getEnterpriseAnalytics(timeRange, channel, role);
  }

  async getAnalyticsFunnel() {
    return await this.analyticsService.getAnalyticsFunnel();
  }

  async scheduleAnalyticsReport(scheduleData: {
    name: string;
    frequency: string;
    recipients: string[];
    format: string;
    roleView: string;
  }) {
    return await this.analyticsService.scheduleAnalyticsReport(scheduleData);
  }

  // =========================================================================
  // 2. Phân Hệ Quản Lý Đơn Hàng (ORD - Orders OMS)
  // =========================================================================
  async getOrders(status?: string, search?: string, page = 1, limit = 20) {
    return await this.orderService.getOrders(status, search, page, limit);
  }

  async updateOrderStatus(orderId: string, status: string, internalNote?: string) {
    return await this.orderService.updateOrderStatus(orderId, status, internalNote);
  }

  async bulkUpdateOrders(orderIds: string[], status: string) {
    return await this.orderService.bulkUpdateOrders(orderIds, status);
  }

  async cancelOrder(orderId: string, reason: string) {
    return await this.orderService.cancelOrder(orderId, reason);
  }

  async updateCallVerification(orderId: string, status: 'VERIFIED' | 'NO_ANSWER' | 'UNREACHABLE') {
    return await this.orderService.updateCallVerification(orderId, status);
  }

  async updateOrderInternalNote(orderId: string, internalNote: string, tags?: string[]) {
    return await this.orderService.updateOrderInternalNote(orderId, internalNote, tags);
  }

  async getReturnRequests() {
    return await this.orderService.getReturnRequests();
  }

  async reviewReturnRequest(id: string, action: 'APPROVE' | 'REJECT', reason?: string) {
    return await this.orderService.reviewReturnRequest(id, action, reason);
  }

  async inspectReturnItem(id: string, result: 'RESTOCKED' | 'DAMAGED_WRITEOFF', notes?: string) {
    return await this.orderService.inspectReturnItem(id, result, notes);
  }

  async processOrderRefund(orderId: string, reasonOrAmount: any, amountOrReason?: any) {
    return await this.orderService.processOrderRefund(orderId, reasonOrAmount, amountOrReason);
  }

  // =========================================================================
  // 3. Phân Hệ Quản Lý Kho (INV - Inventory & Multi-Warehouse)
  // =========================================================================
  async getInventory() {
    return await this.inventoryService.getInventory();
  }

  async getStockLedger() {
    return await this.inventoryService.getStockLedger();
  }

  async getWarehouses() {
    return await this.inventoryService.getWarehouses();
  }

  async addOrUpdateWarehouse(data: any) {
    return await this.inventoryService.addOrUpdateWarehouse(data);
  }

  async getTemporaryHolds() {
    return await this.inventoryService.getTemporaryHolds();
  }

  async releaseTemporaryHold(id: string) {
    return await this.inventoryService.releaseTemporaryHold(id);
  }

  async triggerOmnichannelSync(bufferPercentage = 90) {
    return await this.inventoryService.triggerOmnichannelSync(bufferPercentage);
  }

  async dispatchInventoryAlert(body: any) {
    return await this.inventoryService.dispatchInventoryAlert(body);
  }

  async createStockTransaction(body: any) {
    return await this.inventoryService.createStockTransaction(body);
  }

  // =========================================================================
  // 4. Phân Hệ Sản Phẩm & Biến Thể (PRD - Products, Categories, Brands)
  // =========================================================================
  async createProduct(body: any) {
    return await this.productService.createProduct(body);
  }

  async updateProduct(id: string, body: any) {
    return await this.productService.updateProduct(id, body);
  }

  async deleteProduct(id: string) {
    return await this.productService.deleteProduct(id);
  }

  async batchUpdateProducts(body: any) {
    return await this.productService.batchUpdateProducts(body);
  }

  async validateAndImportCsv(rows: any[]) {
    return await this.productService.validateAndImportCsv(rows);
  }

  async getCategoryTree() {
    return await this.productService.getCategoryTree();
  }

  async reorderCategories(orderedIds: string[] | any) {
    return await this.productService.reorderCategories(orderedIds);
  }

  async getBrands() {
    return await this.productService.getBrands();
  }

  async getAttributes() {
    return await this.productService.getAttributes();
  }

  async toggleAttributeFilter(categoryType: string, attributeName: string, isFilter?: boolean) {
    return await this.productService.toggleAttributeFilter(categoryType, attributeName, isFilter);
  }

  async addAttribute(body: any) {
    return await this.productService.addAttribute(body);
  }

  async addOptionToAttribute(body: any) {
    return await this.productService.addOptionToAttribute(body);
  }

  // =========================================================================
  // 5. Phân Hệ Khách Hàng (CRM - Customer 360 & Loyalty)
  // =========================================================================
  async getCustomers(page?: any, limit?: any) {
    const p = page ? Number(page) : 1;
    const l = limit ? Number(limit) : 20;
    return await this.crmService.getCustomers(p, l);
  }

  async getCustomer360(id: string) {
    return await this.crmService.getCustomer360(id);
  }

  async saveCustomerNote(id: string, text: string, author?: string) {
    return await this.crmService.saveCustomerNote(id, text, author);
  }

  async updateCustomerTags(id: string, tags: string[]) {
    return await this.crmService.updateCustomerTags(id, tags);
  }

  async getCustomerSegmentsSummary() {
    return await this.crmService.getCustomerSegmentsSummary();
  }

  async syncRemarketingAudience(platform?: any, segment?: any) {
    return await this.crmService.syncRemarketingAudience(platform, segment);
  }

  async dispatchCustomerCampaign(body: any) {
    return await this.crmService.dispatchCustomerCampaign(body);
  }

  // =========================================================================
  // 6. Phân Hệ Tài Chính (FIN - Finance, Reconciliation & Invoices)
  // =========================================================================
  async getFinanceReconciliation() {
    return await this.financeService.getFinanceReconciliation();
  }

  async getFinanceFullData() {
    return await this.financeService.getFinanceFullData();
  }

  async runThreeWayReconciliation() {
    return await this.financeService.runThreeWayReconciliation();
  }

  async resolveDiscrepancy(itemCode: string, action: string, note?: string) {
    return await this.financeService.resolveDiscrepancy(itemCode, action, note);
  }

  async approveCodSettlement(batchId: string) {
    return await this.financeService.approveCodSettlement(batchId);
  }

  async createArDebt(body: any) {
    return await this.financeService.createArDebt(body);
  }

  async settleArDebt(customerId: string, amount: number, note?: string) {
    return await this.financeService.settleArDebt(customerId, amount, note);
  }

  async createApDebt(body: any) {
    return await this.financeService.createApDebt(body);
  }

  async payApDebt(supplierId: string, amount: number, note?: string) {
    return await this.financeService.payApDebt(supplierId, amount, note);
  }

  async approveVendorPayout(payoutId: string) {
    return await this.financeService.approveVendorPayout(payoutId);
  }

  async getEInvoices() {
    return await this.financeService.getEInvoices();
  }

  async issueEInvoiceFull(body: any) {
    return await this.financeService.issueEInvoiceFull(body);
  }

  async adjustOrCancelEInvoice(id: string, action: string, body?: any) {
    return await this.financeService.adjustOrCancelEInvoice(id, action, body);
  }

  async resendEInvoiceEmail(invoiceId: string, email?: string) {
    return await this.financeService.resendEInvoiceEmail(invoiceId, email);
  }

  async recordCodCollection(shipmentId: string, amount: number) {
    return await this.financeService.recordCodCollection(shipmentId, amount);
  }

  // =========================================================================
  // 7. Phân Hệ Vận Chuyển (SHP - Logistics & Carriers)
  // =========================================================================
  getShipperForCarrier(carrierKey: string, seed?: string) {
    return this.logisticsService.getShipperForCarrier(carrierKey, seed);
  }

  async getLogisticsCarriers() {
    return await this.logisticsService.getLogisticsCarriers();
  }

  async getLogisticsFullData() {
    return await this.logisticsService.getLogisticsFullData();
  }

  async calculateShippingRate(body: any) {
    return await this.logisticsService.calculateShippingRate(body);
  }

  async updateSmartRouting(body: any, fallbackCarrier?: string) {
    return await this.logisticsService.updateSmartRouting(body, fallbackCarrier);
  }

  async toggleCarrier(id: string, status?: string, apiToken?: string, webhookUrl?: string) {
    return await this.logisticsService.toggleCarrier(id, status, apiToken, webhookUrl);
  }

  async updateShippingRuleSettings(settings: any) {
    return await this.logisticsService.updateShippingRuleSettings(settings);
  }

  async createShipment(data: any) {
    return await this.logisticsService.createShipment(data);
  }

  async batchCreateShipments(orderIds: string[], carrierId?: string) {
    return await this.logisticsService.batchCreateShipments(orderIds, carrierId);
  }

  async updateShipmentStatus(id: string, status: string, note?: string, location?: string) {
    return await this.logisticsService.updateShipmentStatus(id, status, note, location);
  }

  async handleDeliveryException(id: string, action: string, payload?: any) {
    return await this.logisticsService.handleDeliveryException(id, action, payload);
  }

  async approveLogisticsCodSettlement(batchCode: string) {
    return await this.logisticsService.approveLogisticsCodSettlement(batchCode);
  }

  async printShipmentLabel(trackingCode: string, format = 'A6_DECAL') {
    return await this.logisticsService.printShipmentLabel(trackingCode, format);
  }

  // =========================================================================
  // 8. Phân Hệ Marketing & Khuyến Mãi (MKT - Marketing & Coupons)
  // =========================================================================
  async getCoupons() {
    return await this.marketingService.getCoupons();
  }

  async createCoupon(body: any) {
    return await this.marketingService.createCoupon(body);
  }

  async toggleCouponStatus(codeOrId: string, status?: string) {
    return await this.marketingService.toggleCouponStatus(codeOrId, status);
  }

  async deleteCoupon(id: string) {
    return await this.marketingService.deleteCoupon(id);
  }

  async adjustLoyaltyPoints(body: any) {
    return await this.marketingService.adjustLoyaltyPoints(body);
  }

  async getMarketingFullData() {
    return await this.marketingService.getMarketingFullData();
  }

  async createFlashSaleSlot(data: any) {
    return await this.marketingService.createFlashSaleSlot(data);
  }

  async createComboDeal(data: any) {
    return await this.marketingService.createComboDeal(data);
  }

  async createCrossSellRule(data: any) {
    return await this.marketingService.createCrossSellRule(data);
  }

  async createMarketingCampaign(data: any) {
    return await this.marketingService.createMarketingCampaign(data);
  }

  async createBanner(data: any) {
    return await this.marketingService.createBanner(data);
  }

  async createLandingPage(data: any) {
    return await this.marketingService.createLandingPage(data);
  }

  async payoutAffiliate(partnerId: string, amount?: number) {
    return await this.marketingService.payoutAffiliate(partnerId, amount);
  }

  async syncAdProductFeed(platform?: any) {
    return await this.marketingService.syncAdProductFeed(platform);
  }

  // =========================================================================
  // 9. Phân Hệ Quản Trị Hệ Thống & RBAC (SYS - System & Governance)
  // =========================================================================
  async getSystemSettings() {
    return await this.systemService.getSystemSettings();
  }

  async getAuditLogs() {
    return await this.systemService.getAuditLogs();
  }

  async updateSystemStoreInfo(data: any) {
    return await this.systemService.updateSystemStoreInfo(data);
  }

  async updateAdminUser(id: string, body: any) {
    return await this.systemService.updateAdminUser(id, body);
  }

  async createDatabaseBackup() {
    return await this.systemService.createDatabaseBackup();
  }

  async toggleMaintenanceMode(enabled: boolean, message?: string) {
    return await this.systemService.toggleMaintenanceMode(enabled, message);
  }

  async saveCmsPost(postData: any) {
    return await this.systemService.saveCmsPost(postData);
  }

  // =========================================================================
  // 10. Vòng Đời Doanh Nghiệp ACID (Enterprise Operational Lifecycle)
  // =========================================================================
  async executeOrderLifecycle(dto: {
    productId?: string;
    warehouseCode?: string;
    customerEmail?: string;
    carrier?: string;
    couponCode?: string;
    quantity?: number;
    paymentMethod?: string;
  }) {
    return await this.lifecycleService.executeOrderLifecycle(dto);
  }
}
