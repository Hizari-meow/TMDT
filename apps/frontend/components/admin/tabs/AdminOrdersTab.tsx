'use client';

import React from 'react';

import {
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
  Zap,
  Search,
  Boxes,
  Printer,
  Edit3,
  ExternalLink,
  Download,
  FileCheck,
  Eye,
  X,
  Check,
  PhoneCall,
  CheckCheck,
  Undo2,
  XCircle,
  AlertOctagon,
  ShieldAlert,
  Barcode,
  ClipboardList,
  Phone,
  ShieldCheck,
  Video
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminOrdersTab: React.FC = () => {
  const {
    orders,
    orderStatusCounts,
    totalOrdersCount,
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearch,
    setOrderSearch,
    selectedOrderIds,
    setSelectedOrderIds,
    setIsTrackingModalOpen,
    setSelectedTrackingShipment,
    orderSubTab,
    setOrderSubTab,
    orderChannelFilter,
    setOrderChannelFilter,
    orderPaymentFilter,
    setOrderPaymentFilter,
    returnRequests,
    setSelectedOrderDetail,
    setCancelModalOrder,
    setInspectReturnModal,
    setInspectResult,
    setInspectNotes,
    setInternalNoteModal,
    setPrintDocument,
    fetchData,
    openEInvoiceModal,
    handleExportCSV,
    handleUpdateOrderStatus,
    handleBulkUpdate,
    handleCallVerification,
    handleReviewReturn
  } = useAdminContext();

  return (
          <div className="space-y-6">
            {/* 4.3 Sub-Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-[#f5f5f7] border border-gray-200/80 rounded-2xl">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setOrderSubTab('orders_list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    orderSubTab === 'orders_list'
                      ? 'bg-white text-[#1d1d1f] shadow-xs'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Danh Sách &amp; Vòng Đời Đơn Hàng</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-50 text-[#0071e3] font-bold">
                    {totalOrdersCount || orders.length}
                  </span>
                </button>

                <button
                  onClick={() => setOrderSubTab('returns_list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    orderSubTab === 'returns_list'
                      ? 'bg-white text-[#1d1d1f] shadow-xs'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Đổi Trả &amp; Thu Hồi Hàng (Reverse Logistics)</span>
                  {returnRequests.filter((r) => r.status === 'PENDING_REVIEW').length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                      {returnRequests.filter((r) => r.status === 'PENDING_REVIEW').length} Chờ Duyệt
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setOrderSubTab('fraud_shield')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    orderSubTab === 'fraud_shield'
                      ? 'bg-white text-[#1d1d1f] shadow-xs'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Lá Chắn Gian Lận &amp; Xác Minh COD</span>
                  {orders.filter((o) => o.isFraudRisk || (o.paymentMethod === 'COD' && o.callVerification === 'PENDING_CALL')).length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-100 text-rose-800 font-bold">
                      {orders.filter((o) => o.isFraudRisk || (o.paymentMethod === 'COD' && o.callVerification === 'PENDING_CALL')).length} Cần Chú Ý
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 px-2">
                <button
                  onClick={() => handleExportCSV('techzone_orders_oms', orders)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#1d1d1f] shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>Xuất Báo Cáo OMS</span>
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* SUB-TAB 1: TẤT CẢ ĐƠN HÀNG & STATE MACHINE PIPELINE                  */}
            {/* =================================================================== */}
            {orderSubTab === 'orders_list' && (
              <div className="space-y-5">
                {/* 1. Shopee-style State Machine Progression Pipeline */}
                <div className="p-4 bg-white border border-gray-200/80 rounded-3xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1d1d1f] flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#0071e3]" />
                      VÒNG ĐỜI ĐƠN HÀNG (FINITE STATE MACHINE PIPELINE)
                    </span>
                    <span className="text-[11px] text-[#86868b]">
                      Chống nhảy cóc trạng thái • Tự động hoàn tồn kho khi hủy/hoàn
                    </span>
                  </div>

                  {/* State Machine Flow Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {[
                      { id: 'PENDING_PAYMENT', label: '1. Chờ TT', count: orderStatusCounts.PENDING_PAYMENT || 0, color: 'amber' },
                      { id: 'PENDING_CONFIRMATION', label: '2. Chờ Xác Nhận', count: orderStatusCounts.PENDING_CONFIRMATION || 0, color: 'blue' },
                      { id: 'CONFIRMED', label: '3. Đã Xác Nhận', count: orderStatusCounts.CONFIRMED || 0, color: 'indigo' },
                      { id: 'PACKING', label: '4. Đóng Gói', count: orderStatusCounts.PACKING || 0, color: 'purple' },
                      { id: 'READY_FOR_PICKUP', label: '5. Chờ Lấy Hàng', count: orderStatusCounts.READY_FOR_PICKUP || 0, color: 'sky' },
                      { id: 'SHIPPING', label: '6. Đang Giao', count: orderStatusCounts.SHIPPING || 0, color: 'cyan' },
                      { id: 'DELIVERED', label: '7. Đã Giao', count: orderStatusCounts.DELIVERED || 0, color: 'emerald' },
                      { id: 'COMPLETED', label: '8. Hoàn Thành', count: (orderStatusCounts.COMPLETED || 0) + (orderStatusCounts.PAID || 0), color: 'emerald' },
                    ].map((st, idx) => {
                      const isActive = orderStatusFilter === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setOrderStatusFilter(isActive ? 'ALL' : st.id)}
                          className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                            isActive
                              ? 'border-[#0071e3] bg-blue-50/60 shadow-xs'
                              : 'border-gray-200/80 bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#6e6e73]">
                            <span className="truncate">{st.label}</span>
                            <span className="font-mono text-xs font-bold text-[#1d1d1f]">{st.count}</span>
                          </div>
                          {idx < 7 && (
                            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-gray-300 pointer-events-none text-[10px]">
                              ▶
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Secondary/Terminal Branches */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs">
                    <span className="text-[#86868b] text-[11px]">Nhánh kết thúc / Rẽ hướng:</span>
                    <button
                      onClick={() => setOrderStatusFilter(orderStatusFilter === 'CANCELLED' ? 'ALL' : 'CANCELLED')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        orderStatusFilter === 'CANCELLED'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Đã Hủy ({orderStatusCounts.CANCELLED || 0})</span>
                    </button>

                    <button
                      onClick={() => setOrderStatusFilter(orderStatusFilter === 'RETURNED' ? 'ALL' : 'RETURNED')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        orderStatusFilter === 'RETURNED'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Đổi Trả / Hoàn Tiền ({orderStatusCounts.RETURNED || 0})</span>
                    </button>

                    {orderStatusFilter !== 'ALL' && (
                      <button
                        onClick={() => setOrderStatusFilter('ALL')}
                        className="ml-auto text-[11px] text-[#0071e3] hover:underline font-semibold"
                      >
                        Hiển thị tất cả trạng thái
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Filters & Multi-channel Bar */}
                <div className="p-4 bg-white border border-gray-200/80 rounded-3xl shadow-xs space-y-3">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    {/* Sales Channel Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      <span className="text-xs text-[#86868b] mr-1 hidden sm:inline">Kênh bán:</span>
                      {[
                        { id: 'ALL', label: 'Tất cả kênh' },
                        { id: 'Website TechZone', label: 'TechZone Web' },
                        { id: 'Shopee Mall', label: 'Shopee Mall' },
                        { id: 'TikTok Shop', label: 'TikTok Shop' },
                        { id: 'Cửa Hàng POS', label: 'Showroom POS' },
                      ].map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => setOrderChannelFilter(ch.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                            orderChannelFilter === ch.id
                              ? 'bg-[#1d1d1f] text-white shadow-xs'
                              : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f]'
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>

                    {/* Payment Method Selector & Search */}
                    <div className="flex items-center gap-2">
                      <select
                        value={orderPaymentFilter}
                        onChange={(e) => setOrderPaymentFilter(e.target.value)}
                        className="bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                      >
                        <option value="ALL">Tất cả thanh toán</option>
                        <option value="COD">Thanh toán khi nhận (COD)</option>
                        <option value="VNPAY_QR">VNPAY QR</option>
                        <option value="CREDIT_CARD">Thẻ Tín Dụng</option>
                        <option value="APPLE_PAY">Apple Pay</option>
                      </select>

                      <div className="relative min-w-[220px]">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                          placeholder="Mã Tracking, SĐT, Khách..."
                          className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1d1d1f] placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bulk Action Controls */}
                  {selectedOrderIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0071e3] bg-blue-50 px-2.5 py-1 rounded-lg">
                          Đã chọn {selectedOrderIds.length} đơn hàng
                        </span>
                        <span className="text-[#86868b] text-[11px]">Thao tác hàng loạt:</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleBulkUpdate('CONFIRMED')}
                          className="px-3 py-1.5 bg-blue-50 text-[#0071e3] border border-blue-200 font-semibold rounded-xl hover:bg-blue-100 flex items-center gap-1.5"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Xác Nhận Hàng Loạt</span>
                        </button>
                        <button
                          onClick={() => handleBulkUpdate('PACKING')}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 font-semibold rounded-xl hover:bg-purple-100 flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Đóng Gói Hàng Loạt</span>
                        </button>
                        <button
                          onClick={() => handleBulkUpdate('SHIPPING')}
                          className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 font-semibold rounded-xl hover:bg-sky-100 flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Bàn Giao Vận Chuyển</span>
                        </button>
                        <button
                          onClick={() => {
                            const batch = orders.filter((o) => selectedOrderIds.includes(o.id));
                            setPrintDocument({ type: 'PICKING_LIST', batchOrders: batch, format: 'A4' });
                          }}
                          className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 font-semibold rounded-xl hover:bg-amber-100 flex items-center gap-1.5"
                          title="In phiếu lấy hàng theo vị trí kệ hàng kho"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>In Phiếu Lấy Hàng (Picking List)</span>
                        </button>
                        <button
                          onClick={() => {
                            const batch = orders.filter((o) => selectedOrderIds.includes(o.id));
                            setPrintDocument({ type: 'WAYBILL', batchOrders: batch, format: 'K80' });
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-[#1d1d1f] hover:bg-gray-200 font-semibold rounded-xl flex items-center gap-1.5"
                          title="In tem vận chuyển đồng loạt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In Tem Vận Đơn Hàng Loạt</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrderIds([])}
                          className="text-gray-400 hover:text-gray-600 px-2"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Comprehensive Orders Table */}
                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-3.5 px-4 w-10">
                            <input
                              type="checkbox"
                              checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedOrderIds(orders.map((o) => o.id));
                                else setSelectedOrderIds([]);
                              }}
                              className="rounded border-gray-300 text-[#0071e3]"
                            />
                          </th>
                          <th className="py-3.5 px-3 font-semibold">Mã Đơn / Kênh / Kệ Kho</th>
                          <th className="py-3.5 px-3 font-semibold">Khách Hàng &amp; Địa Chỉ</th>
                          <th className="py-3.5 px-3 font-semibold">Thanh Toán &amp; Xác Minh COD</th>
                          <th className="py-3.5 px-3 font-semibold">Vận Đơn &amp; Hãng Vận Chuyển</th>
                          <th className="py-3.5 px-3 font-semibold">Tổng Tiền &amp; Rủi Ro</th>
                          <th className="py-3.5 px-3 font-semibold">Trạng Thái Vòng Đời</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Thao Tác Xử Lý</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders
                          .filter((ord) => {
                            const matchChannel = orderChannelFilter === 'ALL' || ord.channel === orderChannelFilter;
                            const matchPayment = orderPaymentFilter === 'ALL' || ord.paymentMethod === orderPaymentFilter;
                            return matchChannel && matchPayment;
                          })
                          .map((ord) => {
                            const isSelected = selectedOrderIds.includes(ord.id);
                            return (
                              <tr
                                key={ord.id}
                                className={`hover:bg-gray-50/80 transition-colors ${
                                  isSelected ? 'bg-blue-50/30' : ''
                                }`}
                              >
                                <td className="py-3.5 px-4">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedOrderIds([...selectedOrderIds, ord.id]);
                                      else setSelectedOrderIds(selectedOrderIds.filter((id) => id !== ord.id));
                                    }}
                                    className="rounded border-gray-300 text-[#0071e3]"
                                  />
                                </td>

                                {/* Tracking ID, Channel & Shelf Location */}
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-[#1d1d1f] text-[11px]">
                                      #{ord.trackingId.slice(0, 8)}
                                    </span>
                                    <button
                                      onClick={() => setSelectedOrderDetail(ord)}
                                      className="text-[#0071e3] hover:text-[#0077ed]"
                                      title="Xem chi tiết & lịch sử vòng đời"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-[#86868b] font-mono">
                                    {new Date(ord.createdAt).toLocaleString('vi-VN')}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-[#1d1d1f]">
                                      {ord.channel || 'Website TechZone'}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                      {ord.shelfLocation || 'Kệ A1-Tầng 1'}
                                    </span>
                                  </div>
                                </td>

                                {/* Customer, Phone & Address */}
                                <td className="py-3.5 px-3 max-w-[200px]">
                                  <p className="font-semibold text-[#1d1d1f] truncate">
                                    {ord.user?.fullName || 'Khách Demo'}
                                  </p>
                                  <p className="text-[10px] text-[#6e6e73] font-mono flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>{ord.customerPhone || '0901 234 567'}</span>
                                  </p>
                                  <p className="text-[10px] text-[#86868b] truncate" title={ord.shippingAddress}>
                                    {ord.shippingAddress || 'TP. Hồ Chí Minh'}
                                  </p>
                                </td>

                                {/* Payment Method & COD Verification */}
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        ord.paymentMethod === 'COD'
                                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      }`}
                                    >
                                      {ord.paymentMethod || 'COD'}
                                    </span>
                                  </div>

                                  {ord.paymentMethod === 'COD' && (
                                    <div className="mt-1 flex items-center gap-1">
                                      {ord.callVerification === 'VERIFIED' ? (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                          <Check className="w-2.5 h-2.5" /> Đã xác nhận điện thoại
                                        </span>
                                      ) : ord.callVerification === 'NO_ANSWER' ? (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                          Không nghe máy (Thử lại)
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => handleCallVerification(ord.id, 'VERIFIED')}
                                          className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 transition-colors"
                                          title="Bấm để xác nhận đã gọi điện cho khách"
                                        >
                                          <PhoneCall className="w-2.5 h-2.5" /> Gọi Xác Nhận COD
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>

                                {/* Carrier & Tracking Waybill */}
                                <td className="py-3.5 px-3">
                                  <p className="font-semibold text-[#1d1d1f] text-xs">{ord.carrier || 'Giao Hàng Nhanh (GHN)'}</p>
                                  <button
                                    onClick={() => {
                                      setSelectedTrackingShipment({
                                        trackingCode: ord.waybillCode || `VN${ord.trackingId?.slice(0, 6).toUpperCase()}EX`,
                                        orderId: `#${ord.id?.slice(0, 8)}`,
                                        carrierName: ord.carrier || 'Giao Hàng Nhanh (GHN)',
                                        shipperInfo: ord.shipperInfo,
                                        customerName: ord.user?.fullName || 'Khách hàng',
                                        customerPhone: ord.customerPhone,
                                        deliveryAddress: ord.shippingAddress,
                                        warehouseName: ord.warehouse?.name || 'Tổng Kho Tân Bình (TP.HCM)',
                                        status: ord.status,
                                        timeline: ord.timeline,
                                        weightGrams: ord.packageDetails?.weightGrams || 450,
                                        chargeableGrams: ord.packageDetails?.chargeableGrams || 480,
                                        codAmount: (ord.paymentMethod === 'COD' || ord.status === 'PENDING_PAYMENT') ? Number(ord.totalAmount) : 0,
                                      });
                                      setIsTrackingModalOpen(true);
                                    }}
                                    className="text-[10px] font-mono text-[#0071e3] hover:underline font-bold flex items-center gap-1 mt-0.5"
                                    title="Nhấp để xem chi tiết hành trình shipper"
                                  >
                                    <Barcode className="w-3 h-3 text-[#0071e3]" />
                                    <span>{ord.waybillCode || `VN${ord.trackingId?.slice(0, 6).toUpperCase()}EX`}</span>
                                  </button>
                                  {ord.shipperInfo ? (
                                    <div
                                      onClick={() => {
                                        setSelectedTrackingShipment({
                                          trackingCode: ord.waybillCode || `VN${ord.trackingId?.slice(0, 6).toUpperCase()}EX`,
                                          orderId: `#${ord.id?.slice(0, 8)}`,
                                          carrierName: ord.carrier || 'Giao Hàng Nhanh (GHN)',
                                          shipperInfo: ord.shipperInfo,
                                          customerName: ord.user?.fullName || 'Khách hàng',
                                          customerPhone: ord.customerPhone,
                                          deliveryAddress: ord.shippingAddress,
                                          warehouseName: ord.warehouse?.name || 'Tổng Kho Tân Bình (TP.HCM)',
                                          status: ord.status,
                                          timeline: ord.timeline,
                                          weightGrams: ord.packageDetails?.weightGrams || 450,
                                          chargeableGrams: ord.packageDetails?.chargeableGrams || 480,
                                          codAmount: (ord.paymentMethod === 'COD' || ord.status === 'PENDING_PAYMENT') ? Number(ord.totalAmount) : 0,
                                        });
                                        setIsTrackingModalOpen(true);
                                      }}
                                      className="mt-1 flex items-center gap-1 text-[10px] text-gray-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded px-1.5 py-0.5 cursor-pointer transition-colors"
                                      title="Bưu tá phụ trách lấy & phát bưu kiện - Bấm xem hành trình"
                                    >
                                      <Truck className="w-2.5 h-2.5 text-[#0071e3]" />
                                      <span className="font-bold text-[#1d1d1f] truncate max-w-[110px]">{ord.shipperInfo.name}</span>
                                      <span className="text-gray-400 font-mono text-[9px]">({ord.shipperInfo.phone})</span>
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-gray-400 italic block mt-0.5">Chưa phân shipper</span>
                                  )}
                                </td>

                                {/* Amount & Fraud Alert */}
                                <td className="py-3.5 px-3">
                                  <p className="font-mono font-bold text-emerald-700 text-xs">
                                    ${Number(ord.totalAmount).toLocaleString()}
                                  </p>
                                  {ord.isFraudRisk ? (
                                    <span
                                      className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                                      title={ord.fraudReason || 'Đơn hàng bất thường'}
                                    >
                                      <AlertTriangle className="w-2.5 h-2.5" /> RỦI RO CAO
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-[#86868b] font-mono">Bình thường</span>
                                  )}
                                </td>

                                {/* State Machine Status */}
                                <td className="py-3.5 px-3">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                      ord.status === 'COMPLETED' || ord.status === 'PAID'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : ord.status === 'DELIVERED'
                                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                        : ord.status === 'SHIPPING'
                                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                        : ord.status === 'READY_TO_SHIP' || ord.status === 'READY_FOR_PICKUP'
                                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                        : ord.status === 'PACKING'
                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                        : ord.status === 'CONFIRMED'
                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                        : ord.status === 'PENDING_CONFIRM' || ord.status === 'PENDING_CONFIRMATION'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : ord.status === 'PENDING_PAYMENT'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : ord.status === 'CANCELLED' || ord.status === 'RETURNED'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {ord.status}
                                  </span>
                                </td>

                                {/* Actions & State Transitions */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                    {/* State Machine Transition Step */}
                                    {(ord.status === 'PENDING_PAYMENT' || ord.status === 'PENDING_CONFIRM' || ord.status === 'PENDING_CONFIRMATION') && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, 'CONFIRMED')}
                                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors"
                                      >
                                        Xác Nhận Đơn
                                      </button>
                                    )}
                                    {(ord.status === 'CONFIRMED' || ord.status === 'PAID') && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, 'PACKING')}
                                        className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold transition-colors"
                                      >
                                        Đóng Gói Hàng
                                      </button>
                                    )}
                                    {ord.status === 'PACKING' && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, 'READY_TO_SHIP')}
                                        className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[10px] font-bold transition-colors"
                                      >
                                        Sẵn Sàng Giao
                                      </button>
                                    )}
                                    {(ord.status === 'READY_TO_SHIP' || ord.status === 'READY_FOR_PICKUP') && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, 'SHIPPING')}
                                        className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg text-[10px] font-bold transition-colors"
                                      >
                                        Bàn Giao Vận Chuyển
                                      </button>
                                    )}
                                    {ord.status === 'SHIPPING' && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                                        className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-[10px] font-bold transition-colors"
                                      >
                                        Đã Giao Thành Công
                                      </button>
                                    )}
                                    {ord.status === 'DELIVERED' && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, 'COMPLETED')}
                                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors"
                                      >
                                        Hoàn Tất
                                      </button>
                                    )}

                                    {/* Printing Actions */}
                                    <button
                                      onClick={() => setPrintDocument({ type: 'WAYBILL', order: ord, format: 'K80' })}
                                      className="p-1.5 bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] rounded-lg transition-colors"
                                      title="In tem vận chuyển nhiệt K80 / A6"
                                    >
                                      <Barcode className="w-3.5 h-3.5 text-[#0071e3]" />
                                    </button>
                                    <button
                                      onClick={() => setPrintDocument({ type: 'PICKING_LIST', order: ord, format: 'A4' })}
                                      className="p-1.5 bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] rounded-lg transition-colors"
                                      title="In phiếu đóng gói & nhặt hàng theo kệ"
                                    >
                                      <ClipboardList className="w-3.5 h-3.5 text-amber-700" />
                                    </button>
                                    <button
                                      onClick={() => openEInvoiceModal(ord)}
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-colors"
                                      title="Xuất hóa đơn VAT điện tử"
                                    >
                                      <FileCheck className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Internal Note & Tags Modal */}
                                    <button
                                      onClick={() => setInternalNoteModal({ order: ord, note: ord.internalNote || '', tags: ord.tags || [] })}
                                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-[#6e6e73] rounded-lg transition-colors"
                                      title="Ghi chú nội bộ & gắn nhãn"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Cancellation (with stock restore) */}
                                    {ord.status !== 'CANCELLED' && ord.status !== 'COMPLETED' && (
                                      <button
                                        onClick={() => setCancelModalOrder(ord)}
                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-colors"
                                        title="Hủy đơn hàng (Tự động hoàn tồn kho)"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* SUB-TAB 2: ĐỔI TRẢ & THU HỒI HÀNG (SHOPEE REVERSE LOGISTICS)         */}
            {/* =================================================================== */}
            {orderSubTab === 'returns_list' && (
              <div className="space-y-5">
                {/* Shopee Reverse Logistics Process Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <p className="text-xs text-[#86868b] font-medium">1. Chờ Duyệt Yêu Cầu</p>
                    <p className="text-xl font-mono font-bold text-amber-600 mt-1">
                      {returnRequests.filter((r) => r.status === 'PENDING_REVIEW').length} Đơn
                    </p>
                    <p className="text-[11px] text-[#6e6e73] mt-1">Khách gửi video unboxing &amp; ảnh seal</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <p className="text-xs text-[#86868b] font-medium">2. Đang Thu Hồi (Vận Đơn Ngược)</p>
                    <p className="text-xl font-mono font-bold text-blue-600 mt-1">
                      {returnRequests.filter((r) => r.status === 'APPROVED_RETURNING').length} Đơn
                    </p>
                    <p className="text-[11px] text-[#6e6e73] mt-1">Shipper GHN/Viettel Post đang lấy hàng</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <p className="text-xs text-[#86868b] font-medium">3. Đã Kiểm Tra &amp; Hoàn Tiền</p>
                    <p className="text-xl font-mono font-bold text-emerald-600 mt-1">
                      {returnRequests.filter((r) => r.status === 'REFUNDED').length} Đơn
                    </p>
                    <p className="text-[11px] text-[#6e6e73] mt-1">Tự động hoàn tiền qua cổng gốc</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <p className="text-xs text-[#86868b] font-medium">4. Từ Chối Đổi Trả</p>
                    <p className="text-xl font-mono font-bold text-gray-600 mt-1">
                      {returnRequests.filter((r) => r.status === 'REJECTED').length} Đơn
                    </p>
                    <p className="text-[11px] text-[#6e6e73] mt-1">Không đủ điều kiện / Quá hạn 30 ngày</p>
                  </div>
                </div>

                {/* Returns Table */}
                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1d1d1f]">
                        Danh Sách Yêu Cầu Đổi Trả &amp; Quy Trình Thu Hồi Shopee-Standard
                      </h3>
                      <p className="text-xs text-[#86868b]">
                        Kiểm định tình trạng thực tế trước khi nhập lại kệ hoặc thanh lý phế phẩm
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Mã Yêu Cầu / Ngày</th>
                          <th className="py-3.5 px-3 font-semibold">Đơn Gốc &amp; Khách Hàng</th>
                          <th className="py-3.5 px-3 font-semibold">Sản Phẩm &amp; Số Lượng</th>
                          <th className="py-3.5 px-3 font-semibold">Lý Do &amp; Bằng Chứng Unboxing</th>
                          <th className="py-3.5 px-3 font-semibold">Vận Đơn Chiều Ngược</th>
                          <th className="py-3.5 px-3 font-semibold">Trạng Thái Xử Lý</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Thao Tác Duyệt &amp; Nhập Kho</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {returnRequests.map((ret) => (
                          <tr key={ret.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-mono font-bold text-[#1d1d1f]">{ret.id}</p>
                              <p className="text-[10px] text-[#86868b] font-mono">
                                {new Date(ret.createdAt).toLocaleString('vi-VN')}
                              </p>
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                Hoàn Tiền: ${ret.refundAmount}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <p className="font-mono font-bold text-[#0071e3]">#{ret.orderTracking}</p>
                              <p className="font-semibold text-[#1d1d1f]">{ret.customerName}</p>
                              <p className="text-[10px] text-[#6e6e73] font-mono">{ret.customerPhone}</p>
                            </td>

                            <td className="py-3.5 px-3">
                              <p className="font-semibold text-[#1d1d1f]">{ret.productName}</p>
                              <p className="text-[10px] text-[#6e6e73]">
                                Số lượng trả: <span className="font-bold text-[#1d1d1f]">{ret.quantity}</span> chiếc
                              </p>
                              <p className="text-[10px] text-amber-700 font-mono">Kho đích: {ret.warehouse}</p>
                            </td>

                            <td className="py-3.5 px-3 max-w-[200px]">
                              <p className="font-medium text-[#1d1d1f] text-xs">{ret.reason}</p>
                              {ret.videoProofUrl && (
                                <a
                                  href={ret.videoProofUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-[#0071e3] hover:underline font-semibold mt-1"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span>Xem Video Khui Hộp (Unboxing)</span>
                                </a>
                              )}
                            </td>

                            <td className="py-3.5 px-3">
                              {ret.reverseWaybillCode ? (
                                <div>
                                  <span className="font-mono font-bold text-purple-700 text-xs">
                                    {ret.reverseWaybillCode}
                                  </span>
                                  <p className="text-[10px] text-[#6e6e73]">{ret.carrier}</p>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">Chưa cấp vận đơn</span>
                              )}
                            </td>

                            <td className="py-3.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  ret.status === 'REFUNDED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : ret.status === 'APPROVED_RETURNING'
                                    ? 'bg-blue-50 text-[#0071e3] border border-blue-200'
                                    : ret.status === 'PENDING_REVIEW'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {ret.status === 'PENDING_REVIEW'
                                  ? 'Chờ Duyệt'
                                  : ret.status === 'APPROVED_RETURNING'
                                  ? 'Đang Thu Hồi'
                                  : ret.status === 'REFUNDED'
                                  ? 'Đã Hoàn Tiền'
                                  : 'Từ Chối'}
                              </span>
                              {ret.inspectionResult && (
                                <p className="text-[9px] font-mono mt-1 text-[#6e6e73]">
                                  QC: <span className="font-bold">{ret.inspectionResult}</span>
                                </p>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {ret.status === 'PENDING_REVIEW' && (
                                  <>
                                    <button
                                      onClick={() => handleReviewReturn(ret.id, 'APPROVE')}
                                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors"
                                    >
                                      Duyệt &amp; Cấp Vận Đơn
                                    </button>
                                    <button
                                      onClick={() => handleReviewReturn(ret.id, 'REJECT', 'Khách không cung cấp đủ bằng chứng seal vỡ')}
                                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-[10px] font-medium transition-colors"
                                    >
                                      Từ Chối
                                    </button>
                                  </>
                                )}

                                {ret.status === 'APPROVED_RETURNING' && (
                                  <button
                                    onClick={() => {
                                      setInspectReturnModal(ret);
                                      setInspectResult('RESTOCKED');
                                      setInspectNotes('Hàng nguyên seal, phụ kiện đầy đủ, đã nhập lại kệ hàng');
                                    }}
                                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                                  >
                                    <Boxes className="w-3 h-3" />
                                    <span>Kiểm Tra Hàng Về Kho</span>
                                  </button>
                                )}

                                {ret.status === 'REFUNDED' && (
                                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span>Hoàn tất đối soát</span>
                                  </span>
                                )}
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

            {/* =================================================================== */}
            {/* SUB-TAB 3: LÁ CHẮN GIAN LẬN & XÁC MINH COD (FRAUD SHIELD)            */}
            {/* =================================================================== */}
            {orderSubTab === 'fraud_shield' && (
              <div className="space-y-5">
                {/* Fraud Alert Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      <span>Cảnh Báo Đơn Giá Trị Lớn (&gt; $3,000)</span>
                    </div>
                    <p className="text-xs text-rose-700">
                      Tự động chặn xuất kho đối với tài khoản mới đặt hàng trên $3,000 để phòng ngừa thẻ đánh cắp hoặc địa chỉ ma.
                    </p>
                    <p className="text-lg font-mono font-bold text-rose-900">
                      {orders.filter((o) => o.isFraudRisk).length} Đơn nghi vấn
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                      <PhoneCall className="w-4 h-4 text-amber-600" />
                      <span>Trung Tâm Gọi Xác Nhận COD (Anti-Boom)</span>
                    </div>
                    <p className="text-xs text-amber-700">
                      Đơn hàng chọn phương thức COD cần được điện thoại viên xác nhận trước khi giao hàng để hạn chế tỷ lệ hoàn đơn.
                    </p>
                    <p className="text-lg font-mono font-bold text-amber-900">
                      {orders.filter((o) => o.paymentMethod === 'COD' && o.callVerification === 'PENDING_CALL').length} Đơn chờ gọi
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                      <span>Độ Tin Cậy Khách Hàng (Customer Trust Score)</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Hệ thống tự động chấm điểm uy tín dựa trên tỷ lệ nhận hàng thành công, lịch sử bom hàng và thâm niên mua sắm.
                    </p>
                    <p className="text-lg font-mono font-bold text-blue-900">96.8% Tỷ Lệ An Toàn</p>
                  </div>
                </div>

                {/* Queue of High Risk & COD Verification */}
                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1d1d1f]">
                        Danh Sách Đơn Cần Thẩm Định Thủ Công &amp; Xác Minh Điện Thoại
                      </h3>
                      <p className="text-xs text-[#86868b]">
                        Xác nhận điện thoại hoặc hủy đơn ngay lập tức để bảo vệ tồn kho
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Mã Đơn / Khách Hàng</th>
                          <th className="py-3.5 px-3 font-semibold">Số Điện Thoại &amp; Địa Chỉ</th>
                          <th className="py-3.5 px-3 font-semibold">Giá Trị / Hình Thức</th>
                          <th className="py-3.5 px-3 font-semibold">Dấu Hiệu Bất Thường</th>
                          <th className="py-3.5 px-3 font-semibold">Trạng Thái Xác Minh</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Hành Động Khẩn Cấp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders
                          .filter((o) => o.isFraudRisk || o.paymentMethod === 'COD')
                          .map((ord) => (
                            <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-mono font-bold text-[#1d1d1f]">#{ord.trackingId.slice(0, 8)}</p>
                                <p className="font-semibold text-[#1d1d1f]">{ord.user?.fullName || 'Khách Demo'}</p>
                                <p className="text-[10px] text-[#6e6e73]">{ord.user?.email}</p>
                              </td>

                              <td className="py-3.5 px-3">
                                <p className="font-mono font-bold text-[#1d1d1f] flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#0071e3]" />
                                  <span>{ord.customerPhone}</span>
                                </p>
                                <p className="text-[10px] text-[#6e6e73] max-w-[220px] truncate" title={ord.shippingAddress}>
                                  {ord.shippingAddress}
                                </p>
                              </td>

                              <td className="py-3.5 px-3">
                                <p className="font-mono font-bold text-rose-700 text-xs">
                                  ${Number(ord.totalAmount).toLocaleString()}
                                </p>
                                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  {ord.paymentMethod}
                                </span>
                              </td>

                              <td className="py-3.5 px-3 max-w-[220px]">
                                {ord.isFraudRisk ? (
                                  <div className="p-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-[10px] font-medium">
                                    ⚠️ {ord.fraudReason || 'Đơn hàng giá trị cao từ tài khoản mới'}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-[#6e6e73]">
                                    Đơn COD tiêu chuẩn • Cần xác minh số điện thoại
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    ord.callVerification === 'VERIFIED'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : ord.callVerification === 'NO_ANSWER'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {ord.callVerification === 'VERIFIED'
                                    ? 'Đã Nghe Máy'
                                    : ord.callVerification === 'NO_ANSWER'
                                    ? 'Không Bắt Máy'
                                    : 'Chưa Gọi'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  <button
                                    onClick={() => handleCallVerification(ord.id, 'VERIFIED')}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                                  >
                                    <PhoneCall className="w-3 h-3" />
                                    <span>Đã Gọi OK</span>
                                  </button>
                                  <button
                                    onClick={() => handleCallVerification(ord.id, 'NO_ANSWER')}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-medium transition-colors"
                                  >
                                    Không Máy
                                  </button>
                                  <button
                                    onClick={() => setCancelModalOrder(ord)}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                                    title="Hủy đơn nghi ngờ bom hàng / gian lận"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Hủy Đơn Ảo</span>
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
