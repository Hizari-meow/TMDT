import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller(['api/v1/admin', 'api/admin/v1'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return await this.adminService.getOverview();
  }

  @Get('analytics/funnel')
  async getAnalyticsFunnel() {
    return await this.adminService.getAnalyticsFunnel();
  }

  @Get('analytics/enterprise-report')
  async getEnterpriseAnalytics(
    @Query('timeRange') timeRange?: string,
    @Query('channel') channel?: string,
    @Query('role') role?: string,
  ) {
    return await this.adminService.getEnterpriseAnalytics(timeRange, channel, role);
  }

  @Post('analytics/schedule-report')
  async scheduleAnalyticsReport(@Body() body: any) {
    return await this.adminService.scheduleAnalyticsReport(body);
  }

  @Get('orders')
  async getOrders(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 20;
    return await this.adminService.getOrders(status, search, p, l);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('internalNote') internalNote?: string,
  ) {
    return await this.adminService.updateOrderStatus(id, status, internalNote);
  }

  @Post('orders/bulk-update')
  async bulkUpdateOrders(
    @Body('orderIds') orderIds: string[],
    @Body('status') status: string,
  ) {
    return await this.adminService.bulkUpdateOrders(orderIds, status);
  }

  @Get('orders/returns')
  async getReturnRequests() {
    return await this.adminService.getReturnRequests();
  }

  @Post('orders/returns/:id/review')
  async reviewReturnRequest(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'REJECT',
    @Body('reason') reason?: string,
  ) {
    return await this.adminService.reviewReturnRequest(id, action, reason);
  }

  @Post('orders/returns/:id/inspect')
  async inspectReturnItem(
    @Param('id') id: string,
    @Body('result') result: 'RESTOCKED' | 'DAMAGED_WRITEOFF',
    @Body('notes') notes?: string,
  ) {
    return await this.adminService.inspectReturnItem(id, result, notes);
  }

  @Patch('orders/:id/call-verification')
  async updateCallVerification(
    @Param('id') id: string,
    @Body('status') status: 'VERIFIED' | 'NO_ANSWER' | 'UNREACHABLE',
  ) {
    return await this.adminService.updateCallVerification(id, status);
  }

  @Patch('orders/:id/internal-note')
  async updateOrderInternalNote(
    @Param('id') id: string,
    @Body('internalNote') internalNote: string,
    @Body('tags') tags?: string[],
  ) {
    return await this.adminService.updateOrderInternalNote(id, internalNote, tags);
  }

  @Post('orders/:id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return await this.adminService.cancelOrder(id, reason);
  }

  @Get('inventory')
  async getInventory() {
    return await this.adminService.getInventory();
  }

  @Get('inventory/ledger')
  async getStockLedger() {
    return await this.adminService.getStockLedger();
  }

  @Get('inventory/warehouses')
  async getWarehouses() {
    return await this.adminService.getWarehouses();
  }

  @Get('inventory/holds')
  async getTemporaryHolds() {
    return await this.adminService.getTemporaryHolds();
  }

  @Delete('inventory/holds/:id')
  async releaseTemporaryHold(@Param('id') id: string) {
    return await this.adminService.releaseTemporaryHold(id);
  }

  @Post('inventory/omnichannel-sync')
  async triggerOmnichannelSync(@Body('bufferPercentage') bufferPercentage: number) {
    return await this.adminService.triggerOmnichannelSync(bufferPercentage);
  }

  @Post('inventory/alerts/dispatch')
  async dispatchInventoryAlert(@Body() body: any) {
    return await this.adminService.dispatchInventoryAlert(body);
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: any) {
    return await this.adminService.createProduct(body);
  }

  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return await this.adminService.updateProduct(id, body);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.adminService.deleteProduct(id);
  }

  @Post('products/batch-update')
  async batchUpdateProducts(@Body() body: any) {
    return await this.adminService.batchUpdateProducts(body);
  }

  @Post('products/import-csv')
  async validateAndImportCsv(@Body('rows') rows: any[]) {
    return await this.adminService.validateAndImportCsv(rows);
  }

  @Get('categories/tree')
  async getCategoryTree() {
    return await this.adminService.getCategoryTree();
  }

  @Post('categories/reorder')
  async reorderCategories(@Body('orderedIds') orderedIds: string[]) {
    return await this.adminService.reorderCategories(orderedIds);
  }

  @Get('brands')
  async getBrands() {
    return await this.adminService.getBrands();
  }

  @Get('attributes')
  async getAttributes() {
    return await this.adminService.getAttributes();
  }

  @Patch('attributes/toggle')
  async toggleAttributeFilter(
    @Body('categoryType') categoryType: string,
    @Body('attributeName') attributeName: string,
    @Body('isFilter') isFilter?: boolean,
  ) {
    return await this.adminService.toggleAttributeFilter(categoryType, attributeName, isFilter);
  }

  @Post('attributes')
  async addAttribute(@Body() body: any) {
    return await this.adminService.addAttribute(body);
  }

  @Post('attributes/add-option')
  async addOptionToAttribute(@Body() body: any) {
    return await this.adminService.addOptionToAttribute(body);
  }

  @Post('inventory/transactions')
  @HttpCode(HttpStatus.CREATED)
  async createStockTransaction(@Body() body: any) {
    return await this.adminService.createStockTransaction(body);
  }

  @Post('orders/:id/refund')
  async processOrderRefund(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('refundAmount') refundAmount: number,
  ) {
    return await this.adminService.processOrderRefund(id, reason, refundAmount);
  }

  @Get('marketing/coupons')
  async getCoupons() {
    return await this.adminService.getCoupons();
  }

  @Post('marketing/coupons')
  @HttpCode(HttpStatus.CREATED)
  async createCoupon(@Body() body: any) {
    return await this.adminService.createCoupon(body);
  }

  @Get('marketing/full-data')
  async getMarketingFullData() {
    return await this.adminService.getMarketingFullData();
  }

  @Patch('marketing/coupons/:code/status')
  async toggleCouponStatus(@Param('code') code: string) {
    return await this.adminService.toggleCouponStatus(code);
  }

  @Delete('marketing/coupons/:code')
  async deleteCoupon(@Param('code') code: string) {
    return await this.adminService.deleteCoupon(code);
  }

  @Post('marketing/flash-sales')
  @HttpCode(HttpStatus.CREATED)
  async createFlashSaleSlot(@Body() body: any) {
    return await this.adminService.createFlashSaleSlot(body);
  }

  @Post('marketing/combos')
  @HttpCode(HttpStatus.CREATED)
  async createComboDeal(@Body() body: any) {
    return await this.adminService.createComboDeal(body);
  }

  @Post('marketing/cross-sells')
  @HttpCode(HttpStatus.CREATED)
  async createCrossSellRule(@Body() body: any) {
    return await this.adminService.createCrossSellRule(body);
  }

  @Post('marketing/loyalty/adjust')
  @HttpCode(HttpStatus.OK)
  async adjustLoyaltyPoints(@Body() body: any) {
    return await this.adminService.adjustLoyaltyPoints(body);
  }

  @Post('marketing/campaigns')
  @HttpCode(HttpStatus.CREATED)
  async createMarketingCampaign(@Body() body: any) {
    return await this.adminService.createMarketingCampaign(body);
  }

  @Post('marketing/banners')
  @HttpCode(HttpStatus.CREATED)
  async createBanner(@Body() body: any) {
    return await this.adminService.createBanner(body);
  }

  @Post('marketing/landing-pages')
  @HttpCode(HttpStatus.CREATED)
  async createLandingPage(@Body() body: any) {
    return await this.adminService.createLandingPage(body);
  }

  @Post('marketing/affiliate/payout')
  @HttpCode(HttpStatus.OK)
  async payoutAffiliate(@Body('partnerId') partnerId: string) {
    return await this.adminService.payoutAffiliate(partnerId);
  }

  @Post('marketing/ad-tracking/sync-feed')
  @HttpCode(HttpStatus.OK)
  async syncAdProductFeed(@Body('platform') platform: 'GOOGLE' | 'META' | 'TIKTOK') {
    return await this.adminService.syncAdProductFeed(platform || 'GOOGLE');
  }

  // 4.6. Thanh toán và Tài chính (Finance & Payments Enterprise Suite)
  @Get('finance/full-data')
  async getFinanceFullData() {
    return await this.adminService.getFinanceFullData();
  }

  @Post('finance/reconcile-now')
  @HttpCode(HttpStatus.OK)
  async runThreeWayReconciliation() {
    return await this.adminService.runThreeWayReconciliation();
  }

  @Post('finance/discrepancies/resolve')
  @HttpCode(HttpStatus.OK)
  async resolveDiscrepancy(
    @Body('discrepancyId') discrepancyId: string,
    @Body('action') action: string,
    @Body('note') note?: string,
  ) {
    return await this.adminService.resolveDiscrepancy(discrepancyId, action, note);
  }

  @Post('finance/cod/approve')
  @HttpCode(HttpStatus.OK)
  async approveCodSettlement(@Body('settlementId') settlementId: string) {
    return await this.adminService.approveCodSettlement(settlementId);
  }

  @Post('finance/debts/ar')
  @HttpCode(HttpStatus.CREATED)
  async createArDebt(@Body() body: any) {
    return await this.adminService.createArDebt(body);
  }

  @Post('finance/debts/ar/settle')
  @HttpCode(HttpStatus.OK)
  async settleArDebt(@Body('debtId') debtId: string, @Body('amount') amount: number) {
    return await this.adminService.settleArDebt(debtId, amount);
  }

  @Post('finance/debts/ap')
  @HttpCode(HttpStatus.CREATED)
  async createApDebt(@Body() body: any) {
    return await this.adminService.createApDebt(body);
  }

  @Post('finance/debts/ap/pay')
  @HttpCode(HttpStatus.OK)
  async payApDebt(@Body('debtId') debtId: string, @Body('amount') amount: number) {
    return await this.adminService.payApDebt(debtId, amount);
  }

  @Post('finance/marketplace/payout')
  @HttpCode(HttpStatus.OK)
  async approveVendorPayout(@Body('vendorId') vendorId: string) {
    return await this.adminService.approveVendorPayout(vendorId);
  }

  @Get('finance/invoices')
  async getEInvoices() {
    return await this.adminService.getEInvoices();
  }

  @Post('finance/invoices')
  @HttpCode(HttpStatus.CREATED)
  async issueEInvoice(@Body() body: any) {
    return await this.adminService.issueEInvoiceFull(body);
  }

  @Post('finance/invoices/:id/action')
  @HttpCode(HttpStatus.OK)
  async adjustOrCancelEInvoice(
    @Param('id') id: string,
    @Body('action') action: 'ĐIỀU_CHỈNH' | 'THAY_THẾ' | 'HỦY_BỎ',
    @Body() body: any,
  ) {
    return await this.adminService.adjustOrCancelEInvoice(id, action, body);
  }

  @Post('finance/invoices/:id/resend-email')
  @HttpCode(HttpStatus.OK)
  async resendEInvoiceEmail(@Param('id') id: string, @Body('email') email: string) {
    return await this.adminService.resendEInvoiceEmail(id, email);
  }

  @Post('logistics/calculate-rate')
  async calculateShippingRate(@Body() body: any) {
    return await this.adminService.calculateShippingRate(body);
  }

  @Post('customers/dispatch-campaign')
  async dispatchCustomerCampaign(@Body() body: any) {
    return await this.adminService.dispatchCustomerCampaign(body);
  }

  @Get('customers/segments/summary')
  async getCustomerSegmentsSummary() {
    return await this.adminService.getCustomerSegmentsSummary();
  }

  @Post('customers/remarketing/sync')
  async syncRemarketingAudience(@Body() body: { platform: 'FACEBOOK' | 'GOOGLE'; segment: string }) {
    return await this.adminService.syncRemarketingAudience(body.platform, body.segment);
  }

  @Get('customers/:id/360')
  async getCustomer360(@Param('id') id: string) {
    return await this.adminService.getCustomer360(id);
  }

  @Post('customers/:id/notes')
  async saveCustomerNote(
    @Param('id') id: string,
    @Body() body: { text: string; author?: string },
  ) {
    return await this.adminService.saveCustomerNote(id, body.text, body.author);
  }

  @Put('customers/:id/tags')
  async updateCustomerTags(
    @Param('id') id: string,
    @Body() body: { tags: string[] },
  ) {
    return await this.adminService.updateCustomerTags(id, body.tags);
  }

  @Get('customers')
  async getCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 20;
    return await this.adminService.getCustomers(p, l);
  }

  @Get('finance/reconciliation')
  async getFinanceReconciliation() {
    return await this.adminService.getFinanceReconciliation();
  }

  @Get('logistics/carriers')
  async getLogisticsCarriers() {
    return await this.adminService.getLogisticsCarriers();
  }

  @Get('logistics/full-data')
  async getLogisticsFullData() {
    return await this.adminService.getLogisticsFullData();
  }

  @Post('logistics/smart-routing')
  @HttpCode(HttpStatus.OK)
  async updateSmartRouting(@Body() body: any) {
    return await this.adminService.updateSmartRouting(body);
  }

  @Post('logistics/carriers/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async toggleCarrier(
    @Param('id') id: string,
    @Body('status') status?: string,
    @Body('apiToken') apiToken?: string,
    @Body('webhookUrl') webhookUrl?: string,
  ) {
    return await this.adminService.toggleCarrier(id, status, apiToken, webhookUrl);
  }

  @Post('logistics/warehouses')
  @HttpCode(HttpStatus.CREATED)
  async addOrUpdateWarehouse(@Body() body: any) {
    return await this.adminService.addOrUpdateWarehouse(body);
  }

  @Post('logistics/shipping-rules')
  @HttpCode(HttpStatus.OK)
  async updateShippingRuleSettings(@Body() body: any) {
    return await this.adminService.updateShippingRuleSettings(body);
  }

  @Post('logistics/shipments')
  @HttpCode(HttpStatus.CREATED)
  async createShipment(@Body() body: any) {
    return await this.adminService.createShipment(body);
  }

  @Post('logistics/shipments/batch')
  @HttpCode(HttpStatus.CREATED)
  async batchCreateShipments(@Body('orderIds') orderIds: string[], @Body('carrierId') carrierId?: string) {
    return await this.adminService.batchCreateShipments(orderIds || [], carrierId);
  }

  @Post('logistics/shipments/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateShipmentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note?: string,
    @Body('location') location?: string,
  ) {
    return await this.adminService.updateShipmentStatus(id, status, note, location);
  }

  @Post('logistics/shipments/:id/exception')
  @HttpCode(HttpStatus.OK)
  async handleDeliveryException(
    @Param('id') id: string,
    @Body('action') action: string,
    @Body('payload') payload?: any,
  ) {
    return await this.adminService.handleDeliveryException(id, action, payload);
  }

  @Post('logistics/shipments/:id/print')
  @HttpCode(HttpStatus.OK)
  async printShipmentLabel(@Param('id') id: string) {
    return await this.adminService.printShipmentLabel(id);
  }

  @Post('logistics/cod/approve')
  @HttpCode(HttpStatus.OK)
  async approveLogisticsCodSettlement(@Body('batchId') batchId: string) {
    return await this.adminService.approveLogisticsCodSettlement(batchId);
  }

  @Get('system/settings')
  async getSystemSettings() {
    return await this.adminService.getSystemSettings();
  }

  @Put('system/settings')
  async updateSystemStoreInfo(@Body() body: any) {
    return await this.adminService.updateSystemStoreInfo(body);
  }

  @Patch('system/rbac/users/:id')
  async updateAdminUser(@Param('id') id: string, @Body() body: any) {
    return await this.adminService.updateAdminUser(id, body);
  }

  @Post('system/backup/create')
  async createDatabaseBackup() {
    return await this.adminService.createDatabaseBackup();
  }

  @Post('system/maintenance/toggle')
  async toggleMaintenanceMode(
    @Body('enabled') enabled: boolean,
    @Body('message') message?: string,
  ) {
    return await this.adminService.toggleMaintenanceMode(enabled, message);
  }

  @Post('system/cms/posts')
  async saveCmsPost(@Body() body: any) {
    return await this.adminService.saveCmsPost(body);
  }

  @Get('audit-logs')
  async getAuditLogs() {
    return await this.adminService.getAuditLogs();
  }

  /**
   * Quy trình liên kết vận hành toàn diện qua 8 phân hệ doanh nghiệp
   */
  @Post('workflow/process-order-lifecycle')
  @HttpCode(HttpStatus.OK)
  async executeOrderLifecycle(@Body() body: any) {
    return await this.adminService.executeOrderLifecycle(body || {});
  }
}
