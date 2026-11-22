'use client';

import React from 'react';

import {
  ShoppingCart,
  Users,
  Boxes,
  Clock,
  Edit3,
  CreditCard,
  X,
  Warehouse,
  History,
  Barcode,
  ClipboardList,
  Store
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const InventoryModals: React.FC = () => {
  const {
    inventory,
    isStockModalOpen,
    setIsStockModalOpen,
    selectedOrderDetail,
    setSelectedOrderDetail,
    setPrintDocument,
    stockForm,
    setStockForm,
    fetchData,
    showToast
  } = useAdminContext();

  return (
    <>
            {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsStockModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f] my-8">
            <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#0071e3]" />
              <span>Lập Phiếu Kho Nghiệp Vụ (4.2. Nhập, Xuất, Chuyển, Kiểm Kê)</span>
            </h3>

            <form onSubmit={async (e) => {
              e.preventDefault();
              let finalDelta = stockForm.delta;
              if (stockForm.type === 'KIỂM_KÊ_ĐIỀU_CHỈNH') {
                finalDelta = stockForm.actualStock - stockForm.systemStock;
              } else if (stockForm.type.includes('XUẤT')) {
                finalDelta = -Math.abs(stockForm.delta);
              } else {
                finalDelta = Math.abs(stockForm.delta);
              }

              try {
                const effectiveProductId = stockForm.productId || (inventory[0]?.id || '');
                const res = await fetch('http://localhost:3001/api/v1/admin/inventory/transactions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    productId: effectiveProductId,
                    warehouse: stockForm.type === 'CHUYỂN_KHO' ? `${stockForm.warehouse} -> ${stockForm.toWarehouse}` : stockForm.warehouse,
                    type: stockForm.type,
                    delta: finalDelta,
                    referenceId: stockForm.referenceId,
                    batchNumber: stockForm.batchNumber,
                    expiryDate: stockForm.expiryDate,
                    notes: stockForm.notes,
                    performedBy: stockForm.performedBy,
                  }),
                });
                if (res.ok) {
                  showToast(`Đã ghi sổ cái phiếu ${stockForm.type} (Biến động: ${finalDelta > 0 ? '+' : ''}${finalDelta}) thành công!`);
                  setIsStockModalOpen(false);
                  fetchData();
                }
              } catch {
                showToast('Lỗi khi tạo giao dịch kho');
              }
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#1d1d1f] block mb-1 font-semibold">Chọn sản phẩm</label>
                <select
                  value={stockForm.productId || (inventory[0]?.id || '')}
                  onChange={(e) => {
                    const sel = inventory.find((p) => p.id === e.target.value);
                    setStockForm({
                      ...stockForm,
                      productId: e.target.value,
                      systemStock: sel ? sel.available : 0,
                      actualStock: sel ? sel.available : 0,
                    });
                  }}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-medium"
                >
                  {inventory.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku} • Tồn: {p.available} cái)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#1d1d1f] block mb-1 font-semibold">Loại Nghiệp Vụ Kho</label>
                <select
                  value={stockForm.type}
                  onChange={(e) => setStockForm({ ...stockForm, type: e.target.value as any })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-medium font-semibold text-[#0071e3]"
                >
                  <option value="NHẬP_KHO_NCC">1. Phiếu Nhập Kho (GRN từ Apple AASP)</option>
                  <option value="XUẤT_THỦ_CÔNG">2. Phiếu Xuất Kho (GIN Hàng mẫu / Hàng hỏng)</option>
                  <option value="CHUYỂN_KHO">3. Phiếu Chuyển Kho Nội Bộ (STN HN &rarr; HCM)</option>
                  <option value="KIỂM_KÊ_ĐIỀU_CHỈNH">4. Phiếu Kiểm Kê &amp; Cân Đối Tồn Kho</option>
                </select>
              </div>

              {/* Warehouse selector (From/To) */}
              <div className={stockForm.type === 'CHUYỂN_KHO' ? 'grid grid-cols-2 gap-3' : ''}>
                <div>
                  <label className="text-[#1d1d1f] block mb-1 font-semibold">
                    {stockForm.type === 'CHUYỂN_KHO' ? 'Từ Kho Nguồn' : 'Kho Giao Dịch'}
                  </label>
                  <select
                    value={stockForm.warehouse}
                    onChange={(e) => setStockForm({ ...stockForm, warehouse: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="Kho Hà Nội (Cầu Giấy)">Tổng Kho Hà Nội (Cầu Giấy)</option>
                    <option value="Kho TP.HCM (Quận 1)">Tổng Kho TP.HCM (Quận 1)</option>
                    <option value="Kho Đà Nẵng (Hải Châu)">Kho Đà Nẵng (Hải Châu)</option>
                    <option value="Flagship Store Bà Triệu">Flagship Store Bà Triệu</option>
                  </select>
                </div>

                {stockForm.type === 'CHUYỂN_KHO' && (
                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Đến Kho Đích</label>
                    <select
                      value={stockForm.toWarehouse}
                      onChange={(e) => setStockForm({ ...stockForm, toWarehouse: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-medium"
                    >
                      <option value="Kho TP.HCM (Quận 1)">Tổng Kho TP.HCM (Quận 1)</option>
                      <option value="Kho Hà Nội (Cầu Giấy)">Tổng Kho Hà Nội (Cầu Giấy)</option>
                      <option value="Kho Đà Nẵng (Hải Châu)">Kho Đà Nẵng (Hải Châu)</option>
                      <option value="Flagship Store Bà Triệu">Flagship Store Bà Triệu</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Dynamic inputs based on type */}
              {stockForm.type === 'KIỂM_KÊ_ĐIỀU_CHỈNH' ? (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-amber-800 block mb-1 font-semibold">Tồn trên Hệ Thống</label>
                      <input
                        type="number"
                        disabled
                        value={stockForm.systemStock}
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 font-mono font-bold text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-amber-800 block mb-1 font-semibold">Tồn Thực Tế Đếm Được</label>
                      <input
                        type="number"
                        required
                        value={stockForm.actualStock}
                        onChange={(e) => setStockForm({ ...stockForm, actualStock: Number(e.target.value) })}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 font-mono font-bold text-[#1d1d1f]"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-amber-800">
                    Chênh lệch điều chỉnh (&Delta;):{' '}
                    <span className={stockForm.actualStock - stockForm.systemStock >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {stockForm.actualStock - stockForm.systemStock > 0 ? '+' : ''}
                      {stockForm.actualStock - stockForm.systemStock} cái
                    </span>
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">
                      {stockForm.type.includes('XUẤT') ? 'Số lượng xuất (-)' : 'Số lượng thay đổi'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={stockForm.delta}
                      onChange={(e) => setStockForm({ ...stockForm, delta: Number(e.target.value) })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Mã Chứng Từ / PO</label>
                    <input
                      type="text"
                      value={stockForm.referenceId}
                      onChange={(e) => setStockForm({ ...stockForm, referenceId: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                    />
                  </div>
                </div>
              )}

              {/* Lot / Expiry for GRN */}
              {stockForm.type === 'NHẬP_KHO_NCC' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Số Lô Hàng (Batch/Lot)</label>
                    <input
                      type="text"
                      value={stockForm.batchNumber}
                      onChange={(e) => setStockForm({ ...stockForm, batchNumber: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                    />
                  </div>
                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Hạn Dùng / Bảo Hành</label>
                    <input
                      type="text"
                      value={stockForm.expiryDate}
                      onChange={(e) => setStockForm({ ...stockForm, expiryDate: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#1d1d1f] block mb-1 font-semibold">Lý do điều chỉnh / Ghi chú</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhập hàng Apple AASP hoặc Biên bản kiểm kê Q4"
                  value={stockForm.notes}
                  onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] block mb-1 font-semibold">Người lập phiếu</label>
                <input
                  type="text"
                  value={stockForm.performedBy}
                  onChange={(e) => setStockForm({ ...stockForm, performedBy: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Xác Nhận &amp; Ghi Sổ Cái
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* =================================================================== */}
      {/* 4.3 MODAL 1: Chi Tiết Đơn Hàng & Lịch Sử Vòng Đời (State Machine)     */}
      {/* =================================================================== */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedOrderDetail(null)}
          />
          <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 space-y-5 shadow-2xl z-10 text-[#1d1d1f] max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#0071e3]" />
                <div>
                  <h3 className="font-bold text-sm">
                    Chi Tiết Đơn Hàng #{selectedOrderDetail.trackingId}
                  </h3>
                  <p className="text-[11px] text-[#6e6e73]">
                    Kênh bán: <span className="font-semibold text-[#1d1d1f]">{selectedOrderDetail.channel}</span> • Vị trí lấy hàng:{' '}
                    <span className="font-bold text-amber-700">{selectedOrderDetail.shelfLocation}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="text-gray-400 hover:text-black p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Status and Tags */}
            <div className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-2xl text-xs">
              <div>
                <span className="text-[#6e6e73]">Trạng thái: </span>
                <span className="font-bold text-[#0071e3]">{selectedOrderDetail.status}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedOrderDetail.tags?.map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-gray-200 text-[#1d1d1f]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border border-gray-200 rounded-2xl space-y-1">
                <p className="font-bold text-[#1d1d1f] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Khách Hàng: {selectedOrderDetail.user?.fullName}</span>
                </p>
                <p className="text-[#6e6e73]">Email: {selectedOrderDetail.user?.email}</p>
                <p className="text-[#6e6e73] font-mono">Điện thoại: {selectedOrderDetail.customerPhone}</p>
                <p className="text-[#6e6e73]">Địa chỉ giao: {selectedOrderDetail.shippingAddress}</p>
              </div>

              <div className="p-3 border border-gray-200 rounded-2xl space-y-1">
                <p className="font-bold text-[#1d1d1f] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thanh Toán &amp; Vận Chuyển</span>
                </p>
                <p className="text-[#6e6e73]">Phương thức: <span className="font-bold text-[#1d1d1f]">{selectedOrderDetail.paymentMethod}</span></p>
                <p className="text-[#6e6e73]">Đơn vị vận chuyển: <span className="font-bold text-[#1d1d1f]">{selectedOrderDetail.carrier}</span></p>
                <p className="text-[#6e6e73] font-mono">Mã vận đơn: {selectedOrderDetail.waybillCode}</p>
                <p className="text-[#6e6e73]">Tổng tiền: <span className="font-mono font-bold text-emerald-700">${Number(selectedOrderDetail.totalAmount).toLocaleString()}</span></p>
              </div>
            </div>

            {/* Internal Note Banner */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-amber-700" />
                Ghi Chú Nội Bộ / Dặn Dò Đóng Hàng:
              </span>
              <p className="text-amber-800 italic">
                {selectedOrderDetail.internalNote || 'Chưa có ghi chú nội bộ.'}
              </p>
            </div>

            {/* State Machine Event History Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[#1d1d1f] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Nhật Ký Vòng Đời Đơn Hàng (Audit Trail Timeline):</span>
              </h4>

              <div className="space-y-2 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-gray-200">
                {selectedOrderDetail.timeline?.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-6 text-xs">
                    <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-[#0071e3] border-2 border-white -translate-x-1/2" />
                    <div className="flex-1 p-2.5 bg-[#f5f5f7] rounded-xl space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1d1d1f]">{step.title}</span>
                        <span className="text-[10px] text-[#86868b] font-mono">
                          {new Date(step.time).toLocaleTimeString('vi-VN')} {new Date(step.time).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73]">Thực hiện bởi: <span className="font-semibold text-[#1d1d1f]">{step.actor}</span></p>
                      {step.note && <p className="text-[10px] text-gray-500 italic">{step.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setPrintDocument({ type: 'WAYBILL', order: selectedOrderDetail, format: 'K80' });
                }}
                className="px-3 py-1.5 bg-blue-50 text-[#0071e3] border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 flex items-center gap-1.5"
              >
                <Barcode className="w-3.5 h-3.5" />
                <span>In Tem Vận Đơn</span>
              </button>
              <button
                onClick={() => {
                  setPrintDocument({ type: 'PICKING_LIST', order: selectedOrderDetail, format: 'A4' });
                }}
                className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 flex items-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>In Phiếu Lấy Hàng</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.3 MODAL 2: Hủy Đơn Hàng & Tự Động Hoàn Tồn Kho                      */}
      {/* =================================================================== */}


    </>
  );
};
