'use client';

import React from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Truck,
  DollarSign,
  BarChart3,
  Boxes,
  Plus,
  RefreshCw,
  ExternalLink,
  Download,
  FileText,
  FileCheck,
  CreditCard,
  Building,
  Send,
  Calculator,
  X,
  ArrowUpDown
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminFinanceTab: React.FC = () => {
  const {
    finance,
    setIsEInvoiceModalOpen,
    financeSubTab,
    setFinanceSubTab,
    isReconcileRunning,
    setIsAdjustEInvoiceModalOpen,
    setSelectedEInvoice,
    setIsArDebtModalOpen,
    setIsApDebtModalOpen,
    setAdjustEInvoiceForm,
    setSelectedCustomer,
    showToast,
    handleRunReconciliation,
    handleResolveDiscrepancy,
    handleApproveCod,
    handleSettleArDebt,
    handlePayApDebt,
    handleApproveVendorPayout,
    handleResendEInvoiceEmail
  } = useAdminContext();

  if (!finance) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Đang tải dữ liệu tài chính...
      </div>
    );
  }

          const rec = finance.reconciliation || {};
          const recSummary = rec.summary || {};
          const recRecords = rec.records || [];
          const discrepancies = finance.discrepancies || [];
          const codList = finance.codSettlement || [];
          const metrics = finance.metrics || {};
          const revenue = metrics.revenue || {};
          const expenses = metrics.expenses || {};
          const profit = metrics.profit || {};
          const arList = finance.accountsReceivable || [];
          const apList = finance.accountsPayable || [];
          const tax = finance.taxReport || {};
          const vatSummary = tax.quarterlySummary || {};
          const sellers = finance.marketplaceSellers || [];
          const invoices = finance.eInvoices || [];

          return (
            <div className="space-y-6">
              {/* TOP HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-[#0071e3]" />
                    <span>4.6. Thanh Toán &amp; Tài Chính (Finance &amp; Settlement Suite)</span>
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    Đảm bảo dòng tiền vào đúng, ra đúng; đối soát 3 nguồn tự động, phân tích doanh thu &amp; giá vốn, công nợ AR/AP, và hóa đơn điện tử Nghị định 123.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunReconciliation}
                    disabled={isReconcileRunning}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#1d1d1f] text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#0071e3] ${isReconcileRunning ? 'animate-spin' : ''}`} />
                    <span>{isReconcileRunning ? 'Đang So Khớp 3 Nguồn...' : 'Chạy Quét Đối Soát 3 Nguồn'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setIsEInvoiceModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Xuất Hóa Đơn VAT (NĐ 123)</span>
                  </button>
                </div>
              </div>

              {/* 5 SUB-TABS SELECTOR */}
              <div className="flex items-center gap-1.5 bg-[#f5f5f7] p-1.5 rounded-2xl overflow-x-auto no-scrollbar border border-gray-200/80">
                {[
                  {
                    id: 'reconciliation',
                    label: '1. Đối Soát Giao Dịch & COD',
                    icon: ArrowUpDown,
                    badge: discrepancies.filter((d: any) => d.status === 'CHỜ_XỬ_LÝ').length,
                  },
                  { id: 'revenue_profit', label: '2. Doanh Thu, Chi Phí & Lợi Nhuận', icon: BarChart3 },
                  {
                    id: 'debts_marketplace',
                    label: '3. Công Nợ AR/AP & Sàn Marketplace',
                    icon: Building,
                    badge: arList.filter((a: any) => a.status.includes('QUÁ_HẠN')).length,
                  },
                  { id: 'tax_reports', label: '4. Thuế VAT & Kê Khai 01/GTGT', icon: FileCheck },
                  { id: 'einvoices', label: '5. Hóa Đơn Điện Tử (Nghị Định 123)', icon: FileText, badge: invoices.length },
                ].map((st: any) => {
                  const Icon = st.icon;
                  const active = financeSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setFinanceSubTab(st.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                        active
                          ? 'bg-white text-[#1d1d1f] shadow-xs'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                      {st.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            active ? 'bg-rose-100 text-rose-700' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {st.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ======================================================== */}
              {/* SUB-TAB 1: ĐỐI SOÁT GIAO DỊCH & COD                       */}
              {/* ======================================================== */}
              {financeSubTab === 'reconciliation' && (
                <div className="space-y-6">
                  {/* Summary KPI 4 Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Doanh Thu Đơn Hàng Hệ Thống
                      </span>
                      <div className="text-xl font-bold text-[#1d1d1f]">
                        ${(recSummary.totalCapturedRevenue || 248500).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#86868b] block">
                        Ghi nhận từ {recSummary.systemOrdersCount || 1248} đơn hàng hợp lệ
                      </span>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Tiền Cổng Thanh Toán Chốt
                      </span>
                      <div className="text-xl font-bold text-blue-600">
                        ${(recSummary.gatewaySettledAmount || 244772.5).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-blue-500 block">Đã khấu trừ phí cổng trung bình 1.5%</span>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Sao Kê Ngân Hàng Ghi Có
                      </span>
                      <div className="text-xl font-bold text-emerald-600">
                        ${(recSummary.bankDepositedAmount || 244772.5).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 block">Khớp 100% với cổng thanh toán</span>
                    </div>

                    <div className="p-4 bg-white border border-rose-200 rounded-2xl shadow-xs space-y-1 bg-rose-50/20">
                      <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                        Chênh Lệch Cần Xử Lý
                      </span>
                      <div className="text-xl font-bold text-rose-600">
                        {discrepancies.filter((d: any) => d.status === 'CHỜ_XỬ_LÝ').length} Ca Phát Hiện
                      </div>
                      <span className="text-[10px] text-rose-500 block">
                        {recSummary.reconciliationStatus === 'MATCHED_100%' ? 'Tất cả đã xử lý' : 'Cần kế toán duyệt'}
                      </span>
                    </div>
                  </div>

                  {/* Discrepancy Resolution Center */}
                  <div className="p-5 bg-white border border-rose-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Trung Tâm Xử Lý Chênh Lệch Đối Soát (Discrepancy Resolution)
                        </h4>
                      </div>
                      <span className="text-xs text-[#86868b]">
                        Lịch quét: {recSummary.autoSchedule || 'Hàng ngày lúc 23:59'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {discrepancies.map((disc: any) => {
                        const isResolved = disc.status === 'ĐÃ_XỬ_LÝ';
                        return (
                          <div
                            key={disc.id}
                            className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                              isResolved
                                ? 'bg-gray-50 border-gray-200 opacity-60'
                                : 'bg-rose-50/40 border-rose-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-[#1d1d1f]">{disc.id}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isResolved
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {disc.type}
                              </span>
                            </div>

                            <div>
                              <div className="text-xs font-semibold text-[#1d1d1f]">
                                {disc.orderId} - {disc.customer}
                              </div>
                              <div className="text-[11px] text-[#6e6e73] mt-0.5">
                                Cổng: <strong>{disc.gateway}</strong> | Lệch:{' '}
                                <strong className="text-rose-600">${disc.amountDiff.toLocaleString()}</strong>
                              </div>
                              <p className="text-[11px] text-gray-600 mt-1 italic">{disc.details}</p>
                            </div>

                            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                              <span className="text-[10px] text-[#86868b]">{isResolved ? 'Đã giải quyết' : 'Đề xuất:'}</span>
                              {!isResolved ? (
                                <button
                                  onClick={() =>
                                    handleResolveDiscrepancy(
                                      disc.id,
                                      disc.recommendedAction,
                                      'Phê duyệt bởi Kế toán trưởng TechZone',
                                    )
                                  }
                                  className="px-2.5 py-1 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[11px] font-bold rounded-lg transition-colors"
                                >
                                  Xử Lý Ngay
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-600">✓ Đã Phê Duyệt</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3-Way Matching Records Table */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Sổ So Khớp 3 Nguồn (Đơn Hàng ↔ Cổng Thanh Toán ↔ Sao Kê Ngân Hàng)</span>
                      </h4>
                      <span className="text-xs text-[#86868b]">Cập nhật thời gian thực</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Mã Đơn</th>
                            <th className="py-2.5 px-3 font-semibold">Khách Hàng</th>
                            <th className="py-2.5 px-3 font-semibold">Cổng TT</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tiền Đơn</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tiền Cổng</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tiền Bank</th>
                            <th className="py-2.5 px-3 font-semibold">Mã Cổng Ref</th>
                            <th className="py-2.5 px-3 font-semibold">Mã Bank Ref</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {recRecords.map((r: any) => (
                            <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">{r.orderId}</td>
                              <td className="py-3 px-3 font-medium text-[#1d1d1f]">{r.customer}</td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-[#1d1d1f]">
                                  {r.gateway}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-semibold">${r.systemAmount}</td>
                              <td className="py-3 px-3 text-right font-mono font-semibold text-blue-600">${r.gatewayAmount}</td>
                              <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">${r.bankAmount}</td>
                              <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{r.gatewayRef}</td>
                              <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{r.bankRef}</td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    r.status === 'MATCHED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : r.status === 'DUPLICATE_CHARGE'
                                      ? 'bg-rose-100 text-rose-800'
                                      : r.status === 'MISSING_BANK_DEPOSIT'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* COD Settlement */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#0071e3]" />
                          <span>Đối Soát Tiền Thu Hộ COD (Cash-On-Delivery) Vận Chuyển</span>
                        </h4>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          So sánh tiền shipper thu thực tế với số tiền hãng vận chuyển chuyển về tài khoản TechZone theo chu kỳ
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg">
                        Tạm giữ COD: ${(recSummary.codPendingRemittance || 28450).toLocaleString()}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Đơn Vị Vận Chuyển</th>
                            <th className="py-2.5 px-3 font-semibold">Kỳ Đối Soát</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Số Kiện</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Shipper Đã Thu</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Cước Ship &amp; BH</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tiền Thực Nhận</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Hành Động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {codList.map((c: any) => (
                            <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-bold text-[#1d1d1f]">{c.carrier}</td>
                              <td className="py-3 px-3 text-[#6e6e73]">{c.cycle}</td>
                              <td className="py-3 px-3 text-center font-mono font-medium">{c.parcelsCount} kiện</td>
                              <td className="py-3 px-3 text-right font-mono font-bold">${c.collectedAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono text-gray-500">
                                -${(c.shippingFee + (c.insuranceFee || 0)).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                                ${c.netReceivable.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    c.status === 'ĐÃ_TẤT_TOÁN'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {c.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                {c.status !== 'ĐÃ_TẤT_TOÁN' ? (
                                  <button
                                    onClick={() => handleApproveCod(c.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                                  >
                                    Duyệt Tất Toán
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-medium">Hoàn tất</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 2: DOANH THU, CHI PHÍ & LỢI NHUẬN                 */}
              {/* ======================================================== */}
              {financeSubTab === 'revenue_profit' && (
                <div className="space-y-6">
                  {/* Top Revenue & Profit Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Doanh Thu Gộp (Gross)
                      </span>
                      <div className="text-xl font-bold text-[#1d1d1f]">
                        ${(revenue.grossRevenue || 248500).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 block">Lũy kế tháng hiện tại</span>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Doanh Thu Thuần (Net Revenue)
                      </span>
                      <div className="text-xl font-bold text-[#0071e3]">
                        ${(revenue.netRevenue || 228500).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#6e6e73] block">
                        Sau trừ Voucher ({revenue.discountsCoupons}) &amp; Hoàn ({revenue.returnsRefunds})
                      </span>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Lợi Nhuận Gộp (Gross Profit)
                      </span>
                      <div className="text-xl font-bold text-indigo-600">
                        ${(profit.grossProfit || 68550).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-indigo-500 font-semibold block">
                        Biên Lợi Nhuận Gộp: {profit.grossMargin || '30.0%'}
                      </span>
                    </div>

                    <div className="p-4 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-1 bg-emerald-50/20">
                      <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                        Lợi Nhuận Ròng (Net Profit)
                      </span>
                      <div className="text-xl font-bold text-emerald-600">
                        ${(profit.netProfit || 39075.7).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        Biên Lợi Nhuận Ròng: {profit.netMargin || '17.1%'}
                      </span>
                    </div>
                  </div>

                  {/* Comprehensive Expense Matrix */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-purple-600" />
                        <span>Bóc Tách Cơ Cấu Chi Phí Vận Hành Toàn Diện (COGS &amp; OpEx Matrix)</span>
                      </h4>
                      <span className="text-xs font-bold text-purple-700">
                        Tổng Chi Phí: ${(expenses.totalCost || 189424.3).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                        <span className="text-[10px] text-[#86868b] font-semibold uppercase block">Giá Vốn COGS (70%)</span>
                        <div className="text-base font-bold text-[#1d1d1f]">${(expenses.cogs || 159950).toLocaleString()}</div>
                        <span className="text-[10px] text-gray-500">Giá nhập nhà phân phối</span>
                      </div>

                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                        <span className="text-[10px] text-blue-800 font-semibold uppercase block">Phí Cổng TT (1.5%)</span>
                        <div className="text-base font-bold text-blue-600">${(expenses.gatewayFees || 3427.5).toLocaleString()}</div>
                        <span className="text-[10px] text-blue-500">VNPAY, MoMo, Stripe</span>
                      </div>

                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                        <span className="text-[10px] text-indigo-800 font-semibold uppercase block">Phí Sàn Ngoài</span>
                        <div className="text-base font-bold text-indigo-600">${(expenses.marketplaceFees || 1096.8).toLocaleString()}</div>
                        <span className="text-[10px] text-indigo-500">TikTok Shop, Shopee</span>
                      </div>

                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                        <span className="text-[10px] text-amber-800 font-semibold uppercase block">Phí Vận Chuyển</span>
                        <div className="text-base font-bold text-amber-600">${(expenses.logisticsFees || 4570).toLocaleString()}</div>
                        <span className="text-[10px] text-amber-500">GHN, Viettel, đóng gói</span>
                      </div>

                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                        <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Chi Phí Quảng Cáo</span>
                        <div className="text-base font-bold text-emerald-600">${(expenses.marketingAdSpend || 18280).toLocaleString()}</div>
                        <span className="text-[10px] text-emerald-500">Google Ads, Meta, TikTok</span>
                      </div>

                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-1">
                        <span className="text-[10px] text-rose-800 font-semibold uppercase block">Hạ Tầng Cloud/Redis</span>
                        <div className="text-base font-bold text-rose-600">${(expenses.cloudInfraFees || 2100).toLocaleString()}</div>
                        <span className="text-[10px] text-rose-500">Cluster chịu tải 50k RPS</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Breakdown & Period Trends */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                      <h4 className="text-sm font-bold text-[#1d1d1f]">Doanh Thu Theo Kênh Bán Hàng (Omnichannel)</h4>
                      <div className="space-y-3">
                        {(revenue.breakdownByChannel || []).map((ch: any) => (
                          <div key={ch.channel} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#1d1d1f]">{ch.channel}</span>
                              <span className="font-mono font-bold text-[#0071e3]">
                                ${ch.revenue.toLocaleString()} ({ch.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0071e3] h-full rounded-full transition-all"
                                style={{ width: `${ch.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                      <h4 className="text-sm font-bold text-[#1d1d1f]">Xu Hướng Doanh Thu &amp; Lợi Nhuận 3 Tháng Gần Nhất</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                              <th className="py-2 px-2 font-semibold">Kỳ Báo Cáo</th>
                              <th className="py-2 px-2 font-semibold text-right">Doanh Thu Gộp</th>
                              <th className="py-2 px-2 font-semibold text-right">Doanh Thu Thuần</th>
                              <th className="py-2 px-2 font-semibold text-right">Lợi Nhuận Ròng</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {(revenue.breakdownByPeriod || []).map((p: any) => (
                              <tr key={p.period} className="hover:bg-gray-50">
                                <td className="py-2.5 px-2 font-semibold text-[#1d1d1f]">{p.period}</td>
                                <td className="py-2.5 px-2 text-right font-mono text-gray-600">${p.gross.toLocaleString()}</td>
                                <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-600">${p.net.toLocaleString()}</td>
                                <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-600">
                                  ${p.profit.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 3: CÔNG NỢ AR/AP & SÀN MARKETPLACE                */}
              {/* ======================================================== */}
              {financeSubTab === 'debts_marketplace' && (
                <div className="space-y-6">
                  {/* Accounts Receivable (AR) */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>Công Nợ Phải Thu (Accounts Receivable - Khách B2B &amp; PayLater)</span>
                        </h4>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          Quản lý các khoản phải thu doanh nghiệp trả sau theo hợp đồng Net 15/30/60
                        </p>
                      </div>
                      <button
                        onClick={() => setIsArDebtModalOpen(true)}
                        className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tạo Công Nợ B2B Mới</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Mã CN</th>
                            <th className="py-2.5 px-3 font-semibold">Khách Hàng Doanh Nghiệp</th>
                            <th className="py-2.5 px-3 font-semibold">Mã Số Thuế</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tổng Nợ</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Đã Trả</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Còn Phải Thu</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Kỳ Hạn</th>
                            <th className="py-2.5 px-3 font-semibold">Hạn Thanh Toán</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thu Nợ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {arList.map((ar: any) => (
                            <tr key={ar.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-blue-600">{ar.id}</td>
                              <td className="py-3 px-3 font-bold text-[#1d1d1f]">
                                {ar.clientName}
                                <span className="block text-[10px] text-gray-500 font-normal">{ar.description}</span>
                              </td>
                              <td className="py-3 px-3 font-mono text-gray-600">{ar.taxCode}</td>
                              <td className="py-3 px-3 text-right font-mono font-semibold">${ar.totalAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-600">${ar.paidAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-amber-700">
                                ${ar.remainingAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold">{ar.paymentTerm}</span>
                              </td>
                              <td className="py-3 px-3 font-medium text-gray-600">{ar.dueDate}</td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    ar.status === 'ĐÃ_THU_HẾT'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ar.status.includes('QUÁ_HẠN')
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {ar.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                {ar.remainingAmount > 0 ? (
                                  <button
                                    onClick={() => handleSettleArDebt(ar.id, ar.remainingAmount)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                                  >
                                    Thu Tiền
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-400">Đã xong</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Accounts Payable (AP) */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Building className="w-4 h-4 text-purple-600" />
                          <span>Công Nợ Phải Trả (Accounts Payable - Nhà Cung Cấp Thiết Bị)</span>
                        </h4>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          Hóa đơn đầu vào từ Apple Vietnam, Digiworld, Synnex FPT cần chi trả
                        </p>
                      </div>
                      <button
                        onClick={() => setIsApDebtModalOpen(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ghi Nhận Nợ NCC Mới</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Mã AP</th>
                            <th className="py-2.5 px-3 font-semibold">Nhà Phân Phối</th>
                            <th className="py-2.5 px-3 font-semibold">Số Hóa Đơn Đầu Vào</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tổng Tiền</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Đã Chi</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Còn Nợ</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Kỳ Hạn</th>
                            <th className="py-2.5 px-3 font-semibold">Hạn Thanh Toán</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thanh Toán</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {apList.map((ap: any) => (
                            <tr key={ap.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-purple-600">{ap.id}</td>
                              <td className="py-3 px-3 font-bold text-[#1d1d1f]">
                                {ap.supplierName}
                                <span className="block text-[10px] text-gray-500 font-normal">{ap.description}</span>
                              </td>
                              <td className="py-3 px-3 font-mono text-gray-600">{ap.invoiceNo}</td>
                              <td className="py-3 px-3 text-right font-mono font-semibold">${ap.totalAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-600">${ap.paidAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                                ${ap.remainingAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold">{ap.paymentTerm}</span>
                              </td>
                              <td className="py-3 px-3 font-medium text-gray-600">{ap.dueDate}</td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    ap.status === 'ĐÃ_THANH_TOÁN_HẾT'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {ap.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                {ap.remainingAmount > 0 ? (
                                  <button
                                    onClick={() => handlePayApDebt(ap.id, ap.remainingAmount)}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                                  >
                                    Chi Trả
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-400">Đã tất toán</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Marketplace Multi-Vendor Settlement */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-emerald-600" />
                          <span>Quyết Toán Gian Hàng Sàn Nhiều Người Bán (Marketplace Seller Settlement)</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">
                          Tự động tính hoa hồng sàn (Take-rate 8%), giữ lại phí vận hành và giải ngân cho người bán theo chu kỳ
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Gian Hàng Đối Tác</th>
                            <th className="py-2.5 px-3 font-semibold">Chủ Sở Hữu</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Doanh Số Bán</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Hoa Hồng Sàn 8%</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Chờ Quyết Toán</th>
                            <th className="py-2.5 px-3 font-semibold">Chu Kỳ Thanh Toán</th>
                            <th className="py-2.5 px-3 font-semibold">Tài Khoản Thụ Hưởng</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Hành Động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {sellers.map((s: any) => (
                            <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-bold text-[#1d1d1f]">{s.shopName}</td>
                              <td className="py-3 px-3 text-[#6e6e73]">{s.ownerName}</td>
                              <td className="py-3 px-3 text-right font-mono font-semibold">${s.grossSales.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-blue-600">
                                +${s.commissionEarned.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                                ${s.pendingPayout.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-[11px] text-gray-500">{s.cycle}</td>
                              <td className="py-3 px-3 font-mono text-[10px] text-gray-600">{s.bankAccount}</td>
                              <td className="py-3 px-3 text-right">
                                {s.pendingPayout > 0 ? (
                                  <button
                                    onClick={() => handleApproveVendorPayout(s.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                                  >
                                    Duyệt Quyết Toán
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-medium">Đã quyết toán</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 4: THUẾ VAT & KÊ KHAI 01/GTGT                     */}
              {/* ======================================================== */}
              {financeSubTab === 'tax_reports' && (
                <div className="space-y-6">
                  {/* VAT Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Thuế GTGT Đầu Ra (Output VAT)
                      </span>
                      <div className="text-xl font-bold text-blue-600">
                        ${(vatSummary.outputVat || 18280).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#6e6e73] block">
                        Thu từ doanh thu bán lẻ (Thuế suất áp dụng: {tax.vatConfig?.reducedRate || 8}%)
                      </span>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-1">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Thuế GTGT Đầu Vào Khấu Trừ (Input VAT)
                      </span>
                      <div className="text-xl font-bold text-purple-600">
                        ${(vatSummary.inputVat || 12796).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#6e6e73] block">Từ hóa đơn mua hàng nhà phân phối</span>
                    </div>

                    <div className="p-4 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-1 bg-emerald-50/20">
                      <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                        Thuế VAT Phải Nộp Ngân Sách
                      </span>
                      <div className="text-xl font-bold text-emerald-600">
                        ${(vatSummary.vatPayable || 5484).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        = Thuế đầu ra - Thuế đầu vào được khấu trừ
                      </span>
                    </div>
                  </div>

                  {/* Tax Legal Basis and Configuration */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#0071e3]" />
                        <span>Cơ Sở Pháp Lý &amp; Cấu Hình Thuế Suất GTGT Doanh Nghiệp</span>
                      </h4>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                        ÁP DỤNG THUẾ SUẤT ƯU ĐÃI 8%
                      </span>
                    </div>

                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Căn cứ {tax.vatConfig?.legalBasis || 'Nghị quyết của Quốc hội và Nghị định 123/2020/NĐ-CP'}, hệ thống
                      áp dụng thuế suất giảm 8% cho nhóm thiết bị công nghệ và phụ kiện bán lẻ, đồng thời hỗ trợ kết xuất bảng
                      kê chuẩn Mẫu số 01/GTGT phục vụ nộp tờ khai định kỳ quý qua phần mềm HTKK của Tổng cục Thuế.
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => showToast('Đã kết xuất Bảng kê thuế GTGT Mẫu 01/GTGT (XML/Excel) thành công!')}
                        className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất File Báo Cáo Kê Khai Thuế XML (HTKK)</span>
                      </button>
                      <button
                        onClick={() => showToast('Đã lưu cấu hình thuế VAT mới thành công!')}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] text-xs font-semibold rounded-xl"
                      >
                        Cập Nhật Cấu Hình Thuế Suất
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 5: HÓA ĐƠN ĐIỆN TỬ (NGHỊ ĐỊNH 123/2020/NĐ-CP)     */}
              {/* ======================================================== */}
              {financeSubTab === 'einvoices' && (
                <div className="space-y-6">
                  {/* Invoices List Table */}
                  <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0071e3]" />
                          <span>Hệ Thống Hóa Đơn Điện Tử VAT Có Mã Cơ Quan Thuế (Nghị Định 123 &amp; Thông Tư 78)</span>
                        </h4>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          Tích hợp VNPT-Invoice, MISA meInvoice, Viettel Sinvoice; hỗ trợ lập hóa đơn điều chỉnh, thay thế và hủy
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCustomer(null);
                          setIsEInvoiceModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Phát Hành Hóa Đơn Mới</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#86868b] text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Ký Hiệu &amp; Số HĐ</th>
                            <th className="py-2.5 px-3 font-semibold">Mã Đơn Hàng</th>
                            <th className="py-2.5 px-3 font-semibold">Người Mua Hàng</th>
                            <th className="py-2.5 px-3 font-semibold">Mã Số Thuế</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tổng Tiền</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thuế VAT 8%</th>
                            <th className="py-2.5 px-3 font-semibold">Nhà Cung Cấp</th>
                            <th className="py-2.5 px-3 font-semibold">Mã CQT Cấp</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thao Tác NĐ 123</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {invoices.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">{inv.einvoiceNo}</td>
                              <td className="py-3 px-3 font-mono text-gray-600">{inv.orderTracking}</td>
                              <td className="py-3 px-3 font-bold text-[#1d1d1f]">
                                {inv.customerName}
                                <span className="block text-[10px] text-gray-500 font-normal">{inv.buyerEmail}</span>
                              </td>
                              <td className="py-3 px-3 font-mono text-gray-600">{inv.taxCode}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold">${inv.totalAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-600">${inv.vatAmount}</td>
                              <td className="py-3 px-3 font-semibold text-indigo-700">{inv.provider || 'VNPT'}</td>
                              <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{inv.cqtCode}</td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    inv.status === 'ĐÃ_CẤP_MÃ_CQT' || inv.status.includes('ĐÃ_KÝ')
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : inv.status === 'ĐÃ_HỦY_MẪU_04'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleResendEInvoiceEmail(inv.id, inv.buyerEmail || 'customer@gmail.com')}
                                    title="Gửi lại email hóa đơn PDF/XML"
                                    className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                  <a
                                    href={inv.gdtLookupUrl || 'https://hoadondientu.gdt.gov.vn'}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Tra cứu trực tiếp trên Cổng Hóa Đơn Điện Tử Tổng Cục Thuế"
                                    className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => {
                                      setSelectedEInvoice(inv);
                                      setAdjustEInvoiceForm({
                                        action: 'ĐIỀU_CHỈNH',
                                        reason: 'Điều chỉnh theo thỏa thuận đổi trả',
                                        adjustmentAmount: -50,
                                        newCustomerName: inv.customerName,
                                        newTaxCode: inv.taxCode,
                                      });
                                      setIsAdjustEInvoiceModalOpen(true);
                                    }}
                                    className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold text-[10px] rounded transition-colors"
                                  >
                                    Nghiệp Vụ NĐ 123
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
};
