'use client';

import React from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Truck,
  Zap,
  Boxes,
  Tag,
  Shield,
  Clock,
  Plus,
  RefreshCw,
  Download,
  FileText,
  FileCheck,
  Building,
  Send,
  Globe,
  Lock,
  X,
  Warehouse,
  Bell,
  History,
  Store
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminInventoryTab: React.FC = () => {
  const {
    inventorySubTab,
    setInventorySubTab,
    warehouses,
    temporaryHolds,
    safeBufferPercent,
    setSafeBufferPercent,
    isOmnichannelSyncing,
    omnichannelSyncResult,
    alertChannels,
    setAlertChannels,
    selectedLedgerFilter,
    setSelectedLedgerFilter,
    selectedLedgerWarehouse,
    setSelectedLedgerWarehouse,
    inventory,
    stockLedger,
    setIsStockModalOpen,
    handleExportCSV,
    handleReleaseHold,
    handleTriggerOmnichannelSync,
    handleDispatchTestAlert,
    openStockModalForReorder
  } = useAdminContext();

  return (
          <div className="space-y-6">
            {/* 4.2 Header Bar with Sub-Tab Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-[#0071e3]" />
                  <span>4.2. Quản Lý Kho &amp; Trung Tâm Điều Phối Đa Kênh (Inventory Center)</span>
                </h3>
                <p className="text-xs text-[#6e6e73]">
                  Kiểm soát chính xác số lượng hàng, vị trí kho, giữ hàng checkout 15 phút, chống bán vượt (Zero Overselling).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsStockModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo Phiếu Kho (Nhập / Xuất / Chuyển / Kiểm Kê)</span>
                </button>
              </div>
            </div>

            {/* 5 Sub-Tabs Navigation for 4.2 */}
            <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setInventorySubTab('realtime')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  inventorySubTab === 'realtime'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white text-[#6e6e73] hover:bg-gray-100 hover:text-[#1d1d1f] border border-gray-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Theo Dõi Thời Gian Thực &amp; Giữ Hàng</span>
              </button>
              <button
                onClick={() => setInventorySubTab('alerts')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  inventorySubTab === 'alerts'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white text-[#6e6e73] hover:bg-gray-100 hover:text-[#1d1d1f] border border-gray-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-rose-500" />
                <span>Cảnh Báo Hết Hàng &amp; Gợi Ý Nhập</span>
                {inventory.filter((p) => (p.available || p.stock) <= (p.minThreshold || 25)).length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                    {inventory.filter((p) => (p.available || p.stock) <= (p.minThreshold || 25)).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setInventorySubTab('warehouses')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  inventorySubTab === 'warehouses'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white text-[#6e6e73] hover:bg-gray-100 hover:text-[#1d1d1f] border border-gray-200'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-blue-500" />
                <span>Mạng Lưới Kho &amp; Định Tuyến Xuất</span>
              </button>
              <button
                onClick={() => setInventorySubTab('ledger')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  inventorySubTab === 'ledger'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white text-[#6e6e73] hover:bg-gray-100 hover:text-[#1d1d1f] border border-gray-200'
                }`}
              >
                <History className="w-3.5 h-3.5 text-purple-500" />
                <span>Sổ Cái Biến Động (Stock Ledger)</span>
              </button>
              <button
                onClick={() => setInventorySubTab('omnichannel')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  inventorySubTab === 'omnichannel'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-white text-[#6e6e73] hover:bg-gray-100 hover:text-[#1d1d1f] border border-gray-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Đồng Bộ Đa Kênh (Omnichannel)</span>
              </button>
            </div>

            {/* ================================================================= */}
            {/* SUB-TAB 1: THEO DÕI TỒN KHO THỜI GIAN THỰC & CONCURRENCY ENGINE   */}
            {/* ================================================================= */}
            {inventorySubTab === 'realtime' && (
              <div className="space-y-6 animate-in fade-in">
                {/* 4 Loại Số Lượng Tồn Kho (On-hand, Reserved, Available, Incoming) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#6e6e73] mb-1">
                      <span className="font-semibold">Tồn Thực Tế (On-hand)</span>
                      <Boxes className="w-4 h-4 text-[#1d1d1f]" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-[#1d1d1f]">
                      {inventory.reduce((acc, p) => acc + (p.onHand || p.stock + 15), 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#86868b] mt-1">Số hàng thực sự đang có trong cụm kho</p>
                  </div>

                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#6e6e73] mb-1">
                      <span className="font-semibold text-amber-700">Đang Giữ (Reserved)</span>
                      <Lock className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-amber-700">
                      {inventory.reduce((acc, p) => acc + (p.reserved || 15), 0) + temporaryHolds.reduce((a, h) => a + h.quantity, 0)}
                    </p>
                    <p className="text-[10px] text-[#86868b] mt-1">Đơn chờ xuất + Giữ hàng checkout 15 phút</p>
                  </div>

                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#6e6e73] mb-1">
                      <span className="font-semibold text-emerald-700">Có Thể Bán (Available)</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-emerald-700">
                      {inventory.reduce((acc, p) => acc + (p.available || p.stock), 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#86868b] mt-1">= Tồn thực tế trừ Đang giữ</p>
                  </div>

                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#6e6e73] mb-1">
                      <span className="font-semibold text-[#0071e3]">Đang Về (Incoming)</span>
                      <Truck className="w-4 h-4 text-[#0071e3]" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-[#0071e3]">
                      +{inventory.reduce((acc, p) => acc + (p.incoming || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#86868b] mt-1">Đã đặt NCC Apple VN, đang vận chuyển</p>
                  </div>
                </div>

                {/* Bảng Theo Dõi Tồn Kho Chi Tiết Từng Sản Phẩm */}
                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1d1d1f]">Bảng Số Liệu Tồn Kho Từng Mã SKU</h4>
                      <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded-md font-mono">
                        {inventory.length} SKUs
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>An toàn (&gt;50)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Sắp hết (&le;50)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Nguy cấp (&le;10)</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Sản Phẩm &amp; SKU</th>
                          <th className="py-3 px-4 font-semibold text-center">Tồn Thực Tế</th>
                          <th className="py-3 px-4 font-semibold text-center">Đang Giữ</th>
                          <th className="py-3 px-4 font-semibold text-center">Có Thể Bán</th>
                          <th className="py-3 px-4 font-semibold text-center">Đang Về</th>
                          <th className="py-3 px-4 font-semibold">Mức Tồn Kho</th>
                          <th className="py-3 px-4 font-semibold">Phân Bổ Các Kho</th>
                          <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {inventory.map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#1d1d1f]">{prod.name}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#6e6e73] font-mono">
                                <span>SKU: {prod.sku}</span>
                                <span>&bull;</span>
                                <span>Lô: {prod.batchLot || 'LOT-2026-X1'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-[#1d1d1f]">
                              {prod.onHand}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-amber-600">
                              {prod.reserved}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700 text-sm">
                              {prod.available}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-[#0071e3]">
                              +{prod.incoming}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  prod.available <= 10
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : prod.available <= (prod.minThreshold || 25)
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {prod.available <= 10 ? 'NGUY CẤP' : prod.available <= (prod.minThreshold || 25) ? 'SẮP HẾT' : 'AN TOÀN'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[11px] text-[#6e6e73]">
                              <div className="space-y-0.5">
                                {prod.warehouses?.slice(0, 2).map((wh: any) => (
                                  <div key={wh.warehouse} className="flex items-center justify-between gap-2">
                                    <span className="truncate max-w-[130px]">{wh.warehouse.split('(')[0]}:</span>
                                    <span className="font-mono font-semibold text-[#1d1d1f]">{wh.stock}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => openStockModalForReorder(prod)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-[#0071e3] hover:text-white text-[#1d1d1f] rounded-lg text-[11px] font-semibold transition-colors"
                              >
                                Điều Chỉnh
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Giữ Hàng Tạm Thời (Temporary Checkout Holds - TTL 15 Phút) */}
                <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Phiên Giữ Hàng Tạm Thời Khi Khách Checkout (Temporary Holds - TTL 15 Phút)</span>
                      </h4>
                      <p className="text-xs text-[#6e6e73]">
                        Khi người mua bấm tiến hành thanh toán, hệ thống khóa giữ số lượng tạm thời trong 15 phút. Nếu không hoàn tất thanh toán, tồn kho tự động được giải phóng.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl font-mono">
                      {temporaryHolds.length} Phiên Đang Hold
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Mã Hold / Phiên</th>
                          <th className="py-2.5 px-3 font-semibold">Khách Hàng</th>
                          <th className="py-2.5 px-3 font-semibold">Sản Phẩm Giữ</th>
                          <th className="py-2.5 px-3 font-semibold text-center">SL</th>
                          <th className="py-2.5 px-3 font-semibold">Kho Lưu Giữ</th>
                          <th className="py-2.5 px-3 font-semibold">Lý Do Giữ</th>
                          <th className="py-2.5 px-3 font-semibold">Thời Gian Tạo</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                        {temporaryHolds.length > 0 ? (
                          temporaryHolds.map((h) => (
                            <tr key={h.id} className="hover:bg-amber-50/30">
                              <td className="py-2.5 px-3 font-bold text-[#1d1d1f]">{h.id}</td>
                              <td className="py-2.5 px-3 font-sans text-[#1d1d1f]">{h.customerEmail}</td>
                              <td className="py-2.5 px-3 font-sans font-medium text-[#1d1d1f]">{h.productName}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-amber-700">{h.quantity}</td>
                              <td className="py-2.5 px-3 font-sans text-[#6e6e73]">{h.warehouse}</td>
                              <td className="py-2.5 px-3 font-sans text-xs text-[#6e6e73]">{h.reason}</td>
                              <td className="py-2.5 px-3 text-[#6e6e73]">{new Date(h.createdAt).toLocaleTimeString('vi-VN')}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => handleReleaseHold(h.id)}
                                  className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-[10px] font-bold font-sans"
                                >
                                  Hủy Giữ / Thu Hồi
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-4 text-center text-gray-400 font-sans">
                              Không có phiên checkout nào đang giữ hàng tạm thời.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Concurrency & Zero Overselling Architecture Banner */}
                <div className="p-5 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-white border border-blue-200/80 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f]">
                    <Shield className="w-4 h-4 text-[#0071e3]" />
                    <span>Cơ Chế Xử Lý Đồng Thời &amp; Cam Kết Zero Overselling Trong Flash Sale</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white/90 rounded-2xl border border-blue-100 shadow-2xs">
                      <p className="font-bold text-[#0071e3] mb-1">1. Redis 7.2 Lua Scripting</p>
                      <p className="text-[#6e6e73]">
                        Kiểm tra và trừ tồn kho đơn tử (<code className="font-mono bg-blue-50 px-1 py-0.5 rounded">stock_deduct.lua</code>) chỉ trong 0.42ms, tuyệt đối không bị race condition khi 50,000 khách mua cùng giây.
                      </p>
                    </div>
                    <div className="p-3 bg-white/90 rounded-2xl border border-blue-100 shadow-2xs">
                      <p className="font-bold text-purple-700 mb-1">2. Row-Level Lock PostgreSQL</p>
                      <p className="text-[#6e6e73]">
                        Cơ chế <code className="font-mono bg-purple-50 px-1 py-0.5 rounded">SELECT FOR UPDATE</code> phân vùng bảng đảm bảo dữ liệu ghi vào database khớp 100% với bộ nhớ cache Redis.
                      </p>
                    </div>
                    <div className="p-3 bg-white/90 rounded-2xl border border-blue-100 shadow-2xs">
                      <p className="font-bold text-emerald-700 mb-1">3. Hàng Đợi BullMQ Đệm Tải</p>
                      <p className="text-[#6e6e73]">
                        Đơn hàng thanh toán được xếp vào hàng đợi bất đồng bộ với 50 worker song song, bảo vệ server không bị sập nguồn khi flash sale bùng nổ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUB-TAB 2: CẢNH BÁO SẮP HẾT HÀNG & GỢI Ý SỐ LƯỢNG CẦN NHẬP        */}
            {/* ================================================================= */}
            {inventorySubTab === 'alerts' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Alert Top Controls */}
                <div className="p-5 bg-white border border-gray-200/80 rounded-3xl shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Cảnh Báo Tồn Kho Dưới Ngưỡng Tối Thiểu &amp; Gợi Ý Nhập Hàng Tự Động</span>
                      </h4>
                      <p className="text-xs text-[#6e6e73]">
                        Hệ thống tự động tính toán số lượng cần nhập dựa trên tốc độ bán (Sales velocity) và thời gian giao hàng của NCC (Lead time 14 ngày).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDispatchTestAlert()}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi Thử Cảnh Báo Ngay</span>
                      </button>
                    </div>
                  </div>

                  {/* Kênh nhận cảnh báo */}
                  <div className="p-3.5 bg-[#f5f5f7] rounded-2xl flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-bold text-[#1d1d1f]">Kênh nhận cảnh báo tự động:</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={alertChannels.email}
                        onChange={(e) => setAlertChannels({ ...alertChannels, email: e.target.checked })}
                        className="rounded text-[#0071e3]"
                      />
                      <span>Email quản kho (warehouse@techzone.vn)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={alertChannels.slack}
                        onChange={(e) => setAlertChannels({ ...alertChannels, slack: e.target.checked })}
                        className="rounded text-[#0071e3]"
                      />
                      <span>Slack Webhook (#alerts-inventory)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={alertChannels.zalo}
                        onChange={(e) => setAlertChannels({ ...alertChannels, zalo: e.target.checked })}
                        className="rounded text-[#0071e3]"
                      />
                      <span>Zalo OA / Telegram Quản Trị</span>
                    </label>
                  </div>
                </div>

                {/* Danh Sách Mặt Hàng Chạm Ngưỡng & Gợi Ý Nhập */}
                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-sm font-bold text-[#1d1d1f]">
                      Danh Sách Sản Phẩm Chạm Ngưỡng Cần Tái Đặt Hàng (Reorder Recommendation)
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Sản Phẩm</th>
                          <th className="py-3 px-4 font-semibold text-center">Tồn Hiện Tại</th>
                          <th className="py-3 px-4 font-semibold text-center">Ngưỡng Tối Thiểu</th>
                          <th className="py-3 px-4 font-semibold text-center">Tốc Độ Bán / Ngày</th>
                          <th className="py-3 px-4 font-semibold text-center text-[#0071e3]">Gợi Ý Cần Nhập</th>
                          <th className="py-3 px-4 font-semibold">Hạn Lưu Kho (Aging)</th>
                          <th className="py-3 px-4 font-semibold text-right">Thao Tác Nhanh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {inventory.map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50/80">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-[#1d1d1f]">{prod.name}</p>
                              <p className="text-[10px] text-[#86868b] font-mono">SKU: {prod.sku}</p>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                prod.available <= 10
                                  ? 'bg-rose-100 text-rose-800'
                                  : prod.available <= (prod.minThreshold || 25)
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'text-gray-700'
                              }`}>
                                {prod.available} cái
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-[#6e6e73]">
                              {prod.minThreshold || 25} cái
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-[#1d1d1f]">
                              ~{prod.salesVelocity || 8} cái/ngày
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-sm text-[#0071e3]">
                              +{prod.recommendedReorder || 50} cái
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                (prod.agingDays || 30) > 60
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {prod.agingDays || 30} ngày
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openStockModalForReorder(prod)}
                                className="px-3 py-1 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                              >
                                Tạo Phiếu Nhập Nhanh
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cảnh Báo Hàng Tồn Lâu & Hạn Dùng / Số Lô */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-gray-200/80 rounded-3xl space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-700">
                      <Clock className="w-4 h-4" />
                      <span>Cảnh Báo Hàng Tồn Lâu (Aging Stock &gt; 60 Ngày)</span>
                    </div>
                    <p className="text-xs text-[#6e6e73]">
                      Phát hiện 2 mã phụ kiện đã lưu kho trên 60 ngày với vận tốc bán chậm. Đề xuất: kích hoạt chiến dịch Flash Sale giảm 15% hoặc gán kèm quà tặng combo.
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-gray-200/80 rounded-3xl space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-sm font-bold text-purple-700">
                      <Tag className="w-4 h-4" />
                      <span>Quản Lý Số Lô Hàng (Lot/Batch) &amp; Hạn Bảo Hành</span>
                    </div>
                    <p className="text-xs text-[#6e6e73]">
                      Toàn bộ 100% thiết bị nhập kho đều được gán mã lô hàng truy xuất nguồn gốc (ví dụ: <code className="font-mono bg-purple-50 px-1 py-0.5 rounded text-purple-800">LOT-2026-APL-Q4</code>) và kích hoạt bảo hành điện tử chính hãng 12 tháng tại Apple AASP.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUB-TAB 3: MẠNG LƯỚI KHO & ĐIỀU PHỐI (NHẬP, XUẤT, CHUYỂN, KIỂM KÊ)*/}
            {/* ================================================================= */}
            {inventorySubTab === 'warehouses' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Danh Sách Các Kho Thực Tế */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(warehouses.length > 0 ? warehouses : [
                    { id: 'wh-hn', name: 'Tổng Kho Hà Nội (Miền Bắc)', address: '12 Duy Tân, Cầu Giấy', manager: 'Nguyễn Văn Hùng', currentStock: 4250, capacity: 10000, utilization: 42.5 },
                    { id: 'wh-hcm', name: 'Tổng Kho TP.HCM (Miền Nam)', address: 'Khu CNC, Thủ Đức', manager: 'Trần Thị Mai', currentStock: 7890, capacity: 15000, utilization: 52.6 },
                    { id: 'wh-dn', name: 'Kho Trung Chuyển Đà Nẵng', address: '88 Nguyễn Văn Linh, Hải Châu', manager: 'Lê Hoàng Nam', currentStock: 1240, capacity: 5000, utilization: 24.8 },
                    { id: 'store-bt', name: 'Flagship Store Bà Triệu', address: '280 Bà Triệu, Hai Bà Trưng', manager: 'Phạm Thu Trang', currentStock: 860, capacity: 2000, utilization: 43.0 },
                  ]).map((wh: any) => (
                    <div key={wh.id} className="p-5 bg-white border border-gray-200/80 rounded-3xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-[#0071e3] font-bold rounded-md border border-blue-200">
                          {wh.code || 'KHO VẬN'}
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Đang hoạt động" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1d1d1f]">{wh.name}</h4>
                        <p className="text-xs text-[#86868b] mt-0.5 truncate">{wh.address}</p>
                      </div>
                      <div className="pt-2 border-t border-gray-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#6e6e73]">Tồn hiện tại:</span>
                          <span className="font-mono font-bold text-[#1d1d1f]">{wh.currentStock?.toLocaleString()} cái</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6e6e73]">Sức chứa tối đa:</span>
                          <span className="font-mono text-[#6e6e73]">{wh.capacity?.toLocaleString()} cái</span>
                        </div>
                        {/* Progress bar lấp đầy kho */}
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-[#0071e3] rounded-full"
                            style={{ width: `${wh.utilization || 45}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-right text-[#86868b]">Lấp đầy {wh.utilization || 45}%</p>
                      </div>
                      <div className="text-[11px] text-[#6e6e73]">
                        <span>Trưởng kho: </span>
                        <span className="font-medium text-[#1d1d1f]">{wh.manager}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4 Loại Nghiệp Vụ Phiếu Kho */}
                <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#0071e3]" />
                        <span>Nghiệp Vụ Phiếu Kho: Nhập, Xuất, Chuyển Kho &amp; Kiểm Kê</span>
                      </h4>
                      <p className="text-xs text-[#6e6e73]">
                        Mọi biến động số lượng đều bắt buộc thông qua phiếu có chữ ký, mã chứng từ và số lô kiểm soát.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsStockModalOpen(true)}
                      className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Lập Phiếu Kho Mới</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-[#f5f5f7] rounded-2xl space-y-1">
                      <p className="font-bold text-emerald-700">1. Phiếu Nhập Kho (GRN)</p>
                      <p className="text-[#6e6e73]">Nhập trực tiếp từ NCC Apple AASP, ghi rõ đơn giá vốn, số lô hàng và hạn dùng.</p>
                    </div>
                    <div className="p-3.5 bg-[#f5f5f7] rounded-2xl space-y-1">
                      <p className="font-bold text-rose-700">2. Phiếu Xuất Kho (GIN)</p>
                      <p className="text-[#6e6e73]">Tự sinh khi xuất đơn giao hàng, hoặc xuất thủ công cho hàng mẫu thử / hàng hỏng.</p>
                    </div>
                    <div className="p-3.5 bg-[#f5f5f7] rounded-2xl space-y-1">
                      <p className="font-bold text-purple-700">3. Phiếu Chuyển Kho (STN)</p>
                      <p className="text-[#6e6e73]">Điều chuyển nội bộ (HN &rarr; HCM), có trạng thái trung gian "Đang vận chuyển".</p>
                    </div>
                    <div className="p-3.5 bg-[#f5f5f7] rounded-2xl space-y-1">
                      <p className="font-bold text-blue-700">4. Phiếu Kiểm Kê (Stocktake)</p>
                      <p className="text-[#6e6e73]">Đối chiếu số liệu hệ thống với đếm thực tế, tự tính chênh lệch Delta kèm lý do.</p>
                    </div>
                  </div>
                </div>

                {/* Định Tuyến Xuất Kho Thông Minh (Smart Order Routing) */}
                <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#0071e3]" />
                    <h4 className="text-sm font-bold text-[#1d1d1f]">
                      Thuật Toán Định Tuyến Xuất Kho Tự Động (Smart Order Routing Matrix)
                    </h4>
                  </div>
                  <p className="text-xs text-[#6e6e73]">
                    Hệ thống tự động phân tích địa chỉ giao hàng của khách để chọn kho gần nhất còn hàng khả dụng, giúp tối ưu chi phí ship và cam kết giao 2H.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Khu Vực Giao Nhận Của Khách</th>
                          <th className="py-2.5 px-3 font-semibold">Kho Ưu Tiên Xuất Hàng (Priority 1)</th>
                          <th className="py-2.5 px-3 font-semibold">Thời Gian Giao Dự Kiến</th>
                          <th className="py-2.5 px-3 font-semibold">Cơ Chế Dự Phòng (Fallback Khi Hết Hàng)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3 px-3 font-medium text-[#1d1d1f]">Miền Bắc (Hà Nội, Hải Phòng, Quảng Ninh...)</td>
                          <td className="py-3 px-3 font-bold text-[#0071e3]">Tổng Kho Hà Nội (Cầu Giấy)</td>
                          <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">Siêu Tốc 2H / 24H</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Chuyển sang Flagship Store Bà Triệu hoặc Kho TP.HCM</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-medium text-[#1d1d1f]">Miền Nam (TP.HCM, Bình Dương, Cần Thơ...)</td>
                          <td className="py-3 px-3 font-bold text-[#0071e3]">Tổng Kho TP.HCM (Quận 1 / Thủ Đức)</td>
                          <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">Siêu Tốc 2H / 24H</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Chuyển sang Kho Trung Chuyển Đà Nẵng</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-medium text-[#1d1d1f]">Miền Trung (Đà Nẵng, Huế, Quảng Nam...)</td>
                          <td className="py-3 px-3 font-bold text-[#0071e3]">Kho Đà Nẵng (Hải Châu)</td>
                          <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">12H - 36H</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Chuyển đường bay từ Tổng Kho Hà Nội</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUB-TAB 4: SỔ CÁI BIẾN ĐỘNG KHO (IMMUTABLE STOCK LEDGER)           */}
            {/* ================================================================= */}
            {inventorySubTab === 'ledger' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Sổ cái kho Header & Filters */}
                <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0071e3]" />
                        <span>Sổ Cái Biến Động Kho Bất Biến (Immutable Stock Ledger Audit Trail)</span>
                      </h3>
                      <p className="text-xs text-[#6e6e73]">
                        Truy vết 100% biến động xuất/nhập/chuyển kho, không thể chỉnh sửa trực tiếp con số tồn mà luôn thông qua giao dịch có mã chứng từ.
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportCSV('So_Cai_Kho_TechZone', stockLedger)}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Xuất File Sổ Cái (.CSV)</span>
                    </button>
                  </div>

                  {/* Filters for Ledger */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-xs">
                    <span className="font-semibold text-[#1d1d1f]">Bộ lọc nghiệp vụ:</span>
                    <select
                      value={selectedLedgerFilter}
                      onChange={(e) => setSelectedLedgerFilter(e.target.value)}
                      className="bg-[#f5f5f7] border border-gray-200 rounded-lg px-2.5 py-1 text-xs"
                    >
                      <option value="ALL">Tất cả nghiệp vụ</option>
                      <option value="XUẤT_ĐƠN_HÀNG">Xuất Đơn Hàng</option>
                      <option value="NHẬP_KHO_NCC">Nhập Kho NCC</option>
                      <option value="CHUYỂN_KHO">Chuyển Kho Nội Bộ</option>
                      <option value="KIỂM_KÊ_ĐIỀU_CHỈNH">Kiểm Kê Điều Chỉnh</option>
                      <option value="XUẤT_THỦ_CÔNG">Xuất Mẫu / Hỏng</option>
                    </select>

                    <select
                      value={selectedLedgerWarehouse}
                      onChange={(e) => setSelectedLedgerWarehouse(e.target.value)}
                      className="bg-[#f5f5f7] border border-gray-200 rounded-lg px-2.5 py-1 text-xs"
                    >
                      <option value="ALL">Tất cả kho hàng</option>
                      <option value="Hà Nội">Kho Hà Nội</option>
                      <option value="TP.HCM">Kho TP.HCM</option>
                      <option value="Đà Nẵng">Kho Đà Nẵng</option>
                    </select>

                    <span className="text-[#86868b] ml-auto">
                      Hiển thị {stockLedger.filter((sl) => (selectedLedgerFilter === 'ALL' || sl.type === selectedLedgerFilter) && (selectedLedgerWarehouse === 'ALL' || sl.warehouse.includes(selectedLedgerWarehouse))).length} giao dịch
                    </span>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Mã Phiếu</th>
                          <th className="py-2.5 px-3 font-semibold">Thời Gian</th>
                          <th className="py-2.5 px-3 font-semibold">Sản Phẩm</th>
                          <th className="py-2.5 px-3 font-semibold">Kho Giao Dịch</th>
                          <th className="py-2.5 px-3 font-semibold">Loại Nghiệp Vụ</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Biến Động (&Delta;)</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Tồn Sau Giao Dịch</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Người Thực Hiện</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                        {stockLedger
                          .filter((sl) => (selectedLedgerFilter === 'ALL' || sl.type === selectedLedgerFilter) && (selectedLedgerWarehouse === 'ALL' || sl.warehouse.includes(selectedLedgerWarehouse)))
                          .map((sl) => (
                            <tr key={sl.id} className="hover:bg-gray-50/80">
                              <td className="py-2.5 px-3 font-bold text-[#1d1d1f]">{sl.id}</td>
                              <td className="py-2.5 px-3 text-[#6e6e73] font-sans">
                                {new Date(sl.createdAt).toLocaleTimeString('vi-VN')} {new Date(sl.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="py-2.5 px-3 text-[#1d1d1f] font-sans font-medium">{sl.productName}</td>
                              <td className="py-2.5 px-3 text-[#6e6e73] font-sans">{sl.warehouse}</td>
                              <td className="py-2.5 px-3 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  sl.type.includes('XUẤT')
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : sl.type.includes('NHẬP')
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                  {sl.type}
                                </span>
                              </td>
                              <td className={`py-2.5 px-3 text-center font-bold ${sl.delta < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {sl.delta > 0 ? `+${sl.delta}` : sl.delta}
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-[#1d1d1f]">{sl.balance}</td>
                              <td className="py-2.5 px-3 text-right text-[#6e6e73] font-sans">{sl.performedBy}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUB-TAB 5: ĐỒNG BỘ TỒN KHO ĐA KÊNH (OMNICHANNEL SYNC & SAFE BUFFER)*/}
            {/* ================================================================= */}
            {inventorySubTab === 'omnichannel' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Omnichannel Overview Card */}
                <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#0071e3]" />
                        <span>Đồng Bộ Tồn Kho Đa Kênh (Single Source of Truth - Master Inventory)</span>
                      </h4>
                      <p className="text-xs text-[#6e6e73]">
                        Bán đồng thời trên Website, Shopee, TikTok Shop, Lazada và POS Cửa Hàng. Mọi đơn từ bất kỳ sàn nào đều tự động trừ vào nguồn tồn kho trung tâm.
                      </p>
                    </div>

                    <button
                      onClick={handleTriggerOmnichannelSync}
                      disabled={isOmnichannelSyncing}
                      className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isOmnichannelSyncing ? 'animate-spin' : ''}`} />
                      <span>{isOmnichannelSyncing ? 'Đang Đồng Bộ Toàn Bộ Sàn...' : 'Đồng Bộ Đa Sàn Ngay'}</span>
                    </button>
                  </div>

                  {/* Safe Buffer Stock Slider Setting */}
                  <div className="p-4 bg-[#f5f5f7] rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1d1d1f]">Cấu Hình Tồn Kho An Toàn (Safe Buffer Stock):</span>
                      <span className="font-mono font-bold text-[#0071e3] text-sm">{safeBufferPercent}% Tồn Kho Thực Tế</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="75"
                        max="100"
                        step="5"
                        value={safeBufferPercent}
                        onChange={(e) => setSafeBufferPercent(Number(e.target.value))}
                        className="w-full accent-[#0071e3]"
                      />
                    </div>
                    <p className="text-[11px] text-[#6e6e73]">
                      Lý do kỹ thuật: Chỉ đẩy <span className="font-semibold text-[#1d1d1f]">{safeBufferPercent}%</span> số lượng tồn thực tế lên các sàn thương mại điện tử để dự phòng độ trễ đồng bộ (synchronization delay từ 30s - 2 phút) giữa các sàn khi có lượng đơn lớn dồn về cùng lúc.
                    </p>
                  </div>

                  {/* Connected Channels Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Kênh Phân Phối</th>
                          <th className="py-2.5 px-3 font-semibold">Cơ Chế Kết Nối</th>
                          <th className="py-2.5 px-3 font-semibold">Tồn Đẩy Lên Sàn</th>
                          <th className="py-2.5 px-3 font-semibold">Độ Trễ (Latency)</th>
                          <th className="py-2.5 px-3 font-semibold">Trạng Thái Kết Nối</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Lần Đồng Bộ Gần Nhất</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-sans">
                        <tr>
                          <td className="py-3 px-3 font-bold text-[#1d1d1f]">Website TechZone (Storefront)</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Native Redis Lua Cache</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700">100% Realtime</td>
                          <td className="py-3 px-3 font-mono text-[#6e6e73]">0.42 ms</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                              ACTIVE REALTIME
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[#6e6e73] font-mono">Vừa xong</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-bold text-[#1d1d1f]">Shopee Mall (TechZone Official)</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Shopee Open API v2 / Webhook</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">{safeBufferPercent}% Buffer</td>
                          <td className="py-3 px-3 font-mono text-[#6e6e73]">142 ms</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                              CONNECTED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[#6e6e73] font-mono">1 phút trước</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-bold text-[#1d1d1f]">TikTok Shop Vietnam</td>
                          <td className="py-3 px-3 text-[#6e6e73]">TikTok Partner Open API</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">{safeBufferPercent}% Buffer</td>
                          <td className="py-3 px-3 font-mono text-[#6e6e73]">215 ms</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                              CONNECTED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[#6e6e73] font-mono">2 phút trước</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-bold text-[#1d1d1f]">Lazada Flagship Store</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Lazada Open Platform</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">{safeBufferPercent}% Buffer</td>
                          <td className="py-3 px-3 font-mono text-[#6e6e73]">180 ms</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                              CONNECTED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[#6e6e73] font-mono">3 phút trước</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-bold text-[#1d1d1f]">Hệ Thống Cửa Hàng POS Offline</td>
                          <td className="py-3 px-3 text-[#6e6e73]">Local LAN + Cloud Sync</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700">100% Kho Showroom</td>
                          <td className="py-3 px-3 font-mono text-[#6e6e73]">45 ms</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                              CONNECTED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[#6e6e73] font-mono">Vừa xong</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Sync Receipt Feedback */}
                  {omnichannelSyncResult && (
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Kết Quả Đồng Bộ Đa Sàn Thành Công Lúc {new Date(omnichannelSyncResult.timestamp).toLocaleTimeString('vi-VN')}</span>
                      </div>
                      <p className="text-emerald-700">
                        Đã áp dụng mức tồn kho an toàn <span className="font-bold">{omnichannelSyncResult.bufferPercentage}%</span> lên {omnichannelSyncResult.totalChannels} kênh bán hàng. Không phát hiện xung đột dữ liệu tồn.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
  );
};
