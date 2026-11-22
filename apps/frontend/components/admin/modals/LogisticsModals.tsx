'use client';

import React from 'react';

import {
  Truck,
  Printer,
  Send,
  AlertCircle,
  X,
  Warehouse,
  PhoneCall,
  MapPin,
  Key
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const LogisticsModals: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    orders,
    setOrderSearch,
    setLogisticsSubTab,
    isNewShipmentModalOpen,
    setIsNewShipmentModalOpen,
    isWarehouseModalOpen,
    setIsWarehouseModalOpen,
    isExceptionModalOpen,
    setIsExceptionModalOpen,
    selectedShipmentForException,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    selectedTrackingShipment,
    isLabelModalOpen,
    setIsLabelModalOpen,
    selectedLabelData,
    setShipmentSearch,
    newShipmentForm,
    setNewShipmentForm,
    warehouseForm,
    setWarehouseForm,
    exceptionForm,
    setExceptionForm,
    showToast,
    handleCreateShipmentSubmit,
    handleDeliveryExceptionSubmit,
    handlePrintShipmentLabel,
    handleSaveWarehouseSubmit
  } = useAdminContext();

  return (
    <>
            {isNewShipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsNewShipmentModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-[#1d1d1f] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#0071e3]" />
                <h3 className="text-base font-bold text-[#1d1d1f]">Tạo Vận Đơn Mới &amp; Đẩy Sang Hãng Vận Chuyển</h3>
              </div>
              <button onClick={() => setIsNewShipmentModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShipmentSubmit} className="space-y-4 text-xs mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Đối Tác Vận Chuyển</label>
                  <select
                    value={newShipmentForm.carrierId}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, carrierId: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="ghn">Giao Hàng Nhanh (GHN)</option>
                    <option value="ghtk">Giao Hàng Tiết Kiệm (GHTK)</option>
                    <option value="viettelpost">Viettel Post</option>
                    <option value="jtexpress">J&amp;T Express</option>
                    <option value="ninjavan">Ninja Van</option>
                    <option value="grabexpress">GrabExpress Hỏa Tốc</option>
                    <option value="ahamove">Ahamove Fast Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Kho Xuất Hàng</label>
                  <select
                    value={newShipmentForm.warehouseId}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, warehouseId: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="WH-HN-01">Kho Tổng Hà Nội (88 Thái Hà)</option>
                    <option value="WH-HCM-01">Kho Tổng TP.HCM (120 Võ Văn Tần)</option>
                    <option value="WH-DN-01">Kho Đà Nẵng (45 Nguyễn Văn Linh)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Đơn Hàng</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.orderId}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, orderId: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Số Điện Thoại Khách</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.customerPhone}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, customerPhone: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Người Nhận</label>
                <input
                  type="text"
                  required
                  value={newShipmentForm.customerName}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, customerName: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Địa Chỉ Nhận Hàng Chi Tiết</label>
                <input
                  type="text"
                  required
                  value={newShipmentForm.deliveryAddress}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, deliveryAddress: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Cân Nặng (g)</label>
                  <input
                    type="number"
                    value={newShipmentForm.weightGrams}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, weightGrams: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Dài (cm)</label>
                  <input
                    type="number"
                    value={newShipmentForm.lengthCm}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, lengthCm: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Rộng (cm)</label>
                  <input
                    type="number"
                    value={newShipmentForm.widthCm}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, widthCm: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Cao (cm)</label>
                  <input
                    type="number"
                    value={newShipmentForm.heightCm}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, heightCm: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Phương Thức</label>
                  <select
                    value={newShipmentForm.shippingMethod}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, shippingMethod: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  >
                    <option value="STANDARD">Tiêu Chuẩn</option>
                    <option value="EXPRESS">Chuyển Phát Nhanh</option>
                    <option value="INSTANT_2H">Hỏa Tốc 2 Giờ</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Cước Phí (VND)</label>
                  <input
                    type="number"
                    value={newShipmentForm.shippingFee}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, shippingFee: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tiền COD ($)</label>
                  <input
                    type="number"
                    value={newShipmentForm.codAmount}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, codAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewShipmentModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Xác Nhận &amp; Lấy Mã Vận Đơn</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.7. MODAL: THÊM / CHỈNH SỬA KHO LẤY HÀNG (PICK-UP HUB)            */}
      {/* =================================================================== */}

      {isWarehouseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsWarehouseModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-[#1d1d1f] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-[#0071e3]" />
                <h3 className="text-base font-bold text-[#1d1d1f]">Thêm Kho Lấy Hàng Xuất Kho Mới</h3>
              </div>
              <button onClick={() => setIsWarehouseModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWarehouseSubmit} className="space-y-4 text-xs mt-4">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Kho Xuất Hàng</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  placeholder="Ví dụ: Kho Vệ Tinh Hải Phòng"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Địa Chỉ Chi Tiết</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.address}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  placeholder="Số nhà, tên đường, phường xã..."
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tỉnh / Thành</label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.province}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, province: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Quận / Huyện</label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.district}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, district: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Phường / Xã</label>
                  <input
                    type="text"
                    value={warehouseForm.ward}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, ward: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Người Quản Lý Kho</label>
                  <input
                    type="text"
                    value={warehouseForm.contactName}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, contactName: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Số Hotline Kho</label>
                  <input
                    type="text"
                    value={warehouseForm.contactPhone}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, contactPhone: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="whDefault"
                  checked={warehouseForm.isDefault}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, isDefault: e.target.checked })}
                  className="rounded text-[#0071e3]"
                />
                <label htmlFor="whDefault" className="text-xs text-[#1d1d1f] font-medium">
                  Đặt làm kho xuất hàng mặc định (Default Origin)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWarehouseModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Thông Tin Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.7. MODAL: XỬ LÝ SỰ CỐ GIAO HÀNG THẤT BẠI (DELIVERY EXCEPTION)    */}
      {/* =================================================================== */}

      {isExceptionModalOpen && selectedShipmentForException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsExceptionModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-[#1d1d1f] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-[#1d1d1f]">Trung Tâm Xử Lý Giao Thất Bại (Exception Handling)</h3>
              </div>
              <button onClick={() => setIsExceptionModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 mt-4 text-xs space-y-1">
              <div>Mã vận đơn: <strong className="font-mono text-[#0071e3]">{selectedShipmentForException.trackingCode}</strong></div>
              <div>Khách hàng: <strong className="text-[#1d1d1f]">{selectedShipmentForException.customerName}</strong> ({selectedShipmentForException.customerPhone})</div>
              <div>Địa chỉ: <span className="text-gray-600">{selectedShipmentForException.deliveryAddress}</span></div>
              <div className="text-rose-700 font-semibold pt-1">
                Lý do báo thất bại: {selectedShipmentForException.failedReason || 'Khách không nghe máy khi shipper gọi'}
              </div>
            </div>

            <form onSubmit={handleDeliveryExceptionSubmit} className="space-y-4 text-xs mt-4">
              <div>
                <label className="text-[#1d1d1f] font-bold block mb-2">Chọn Biện Pháp Xử Lý:</label>
                <div className="space-y-2">
                  {[
                    { id: 'RESCHEDULE', title: '1. Hẹn Ngày Giao Lại (Re-delivery)', desc: 'Lên lịch phát lại vào ngày giờ cụ thể theo yêu cầu khách' },
                    { id: 'CHANGE_ADDRESS', title: '2. Đổi Địa Chỉ / SĐT Người Nhận', desc: 'Khách đổi sang địa chỉ cơ quan hoặc người nhận hộ' },
                    { id: 'RETURN_TO_WAREHOUSE', title: '3. Chuyển Hoàn Về Kho (Return to Origin - RTO)', desc: 'Khách xác nhận hủy đơn / từ chối nhận, hoàn hàng về kho' },
                  ].map((act) => (
                    <label
                      key={act.id}
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                        exceptionForm.action === act.id
                          ? 'bg-blue-50 border-[#0071e3] ring-1 ring-blue-500/20'
                          : 'bg-[#f5f5f7] border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="exceptionAction"
                        checked={exceptionForm.action === act.id}
                        onChange={() => setExceptionForm({ ...exceptionForm, action: act.id as any })}
                        className="mt-0.5 accent-[#0071e3]"
                      />
                      <div>
                        <span className="font-bold text-[#1d1d1f] block">{act.title}</span>
                        <span className="text-[11px] text-[#6e6e73]">{act.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {exceptionForm.action === 'RESCHEDULE' && (
                <div className="space-y-3 bg-[#f5f5f7] p-3 rounded-2xl">
                  <div>
                    <label className="text-[#1d1d1f] font-semibold block mb-1">Thời Gian Hẹn Giao Lại</label>
                    <input
                      type="text"
                      value={exceptionForm.scheduledDate}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, scheduledDate: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                      placeholder="Ví dụ: Sáng mai 03/10 (08:30 - 11:30)"
                    />
                  </div>
                  <div>
                    <label className="text-[#1d1d1f] font-semibold block mb-1">Ghi Chú Cho Bưu Tá</label>
                    <input
                      type="text"
                      value={exceptionForm.note}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, note: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                    />
                  </div>
                </div>
              )}

              {exceptionForm.action === 'CHANGE_ADDRESS' && (
                <div className="space-y-3 bg-[#f5f5f7] p-3 rounded-2xl">
                  <div>
                    <label className="text-[#1d1d1f] font-semibold block mb-1">Địa Chỉ Giao Mới</label>
                    <input
                      type="text"
                      value={exceptionForm.newAddress}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, newAddress: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                      placeholder="Số nhà, tên đường, toà nhà..."
                    />
                  </div>
                  <div>
                    <label className="text-[#1d1d1f] font-semibold block mb-1">Số Điện Thoại Mới (Nếu Có)</label>
                    <input
                      type="text"
                      value={exceptionForm.newPhone}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, newPhone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                    />
                  </div>
                </div>
              )}

              {exceptionForm.action === 'RETURN_TO_WAREHOUSE' && (
                <div className="space-y-3 bg-rose-50 p-3 rounded-2xl border border-rose-200">
                  <div>
                    <label className="text-rose-900 font-semibold block mb-1">Lý Do Chuyển Hoàn Kho</label>
                    <input
                      type="text"
                      value={exceptionForm.reason}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, reason: e.target.value })}
                      className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                    />
                  </div>
                  <p className="text-[10px] text-rose-700">
                    * Kiện hàng sẽ được bưu cục xuất biên bản hoàn về kho xuất hàng gốc ({selectedShipmentForException.warehouseName}).
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsExceptionModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Thực Thi Lệnh Điều Phối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.7. MODAL: XEM TRƯỚC VÀ IN TEM BƯU PHẨM NHIỆT A6 (100x150mm)      */}
      {/* =================================================================== */}

      {isLabelModalOpen && selectedLabelData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLabelModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-[#1d1d1f] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#0071e3]" />
                <h3 className="text-base font-bold text-[#1d1d1f]">In Tem Vận Chuyển Nhiệt Chuẩn A6</h3>
              </div>
              <button onClick={() => setIsLabelModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            {/* Label preview container */}
            <div className="mt-4 p-4 bg-[#f5f5f7] rounded-2xl flex items-center justify-center">
              <div
                className="bg-white border-2 border-black p-4 rounded-lg shadow-md w-full max-w-xs text-xs space-y-3 font-sans"
              >
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <div className="font-black text-sm tracking-wider">TECHZONE LOGISTICS</div>
                  <div className="font-bold text-xs">{selectedLabelData.shipment?.carrierName}</div>
                </div>

                <div className="text-center py-2 border-b border-dashed border-black">
                  <div className="font-mono text-xl font-black tracking-widest">
                    *{selectedLabelData.shipment?.trackingCode}*
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    Mã bưu gửi: {selectedLabelData.shipment?.trackingCode}
                  </div>
                </div>

                <div className="text-[11px] space-y-1 border-b border-gray-300 pb-2">
                  <div>
                    <strong>TỪ:</strong> {selectedLabelData.shipment?.warehouseName} (024.7777.8888)
                  </div>
                  <div>
                    <strong>ĐẾN:</strong> {selectedLabelData.shipment?.customerName} - {selectedLabelData.shipment?.customerPhone}
                  </div>
                  <div className="text-gray-700 leading-snug">
                    {selectedLabelData.shipment?.deliveryAddress}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-xs font-bold">
                  <span>TIỀN THU HỘ (COD):</span>
                  <span className="font-mono text-sm">
                    {selectedLabelData.shipment?.codAmount > 0
                      ? '$' + selectedLabelData.shipment.codAmount.toLocaleString()
                      : '0 VNĐ (ĐÃ THANH TOÁN)'}
                  </span>
                </div>

                <div className="text-[10px] text-gray-500 text-center pt-1">
                  Khổ giấy in nhiệt A6 (100x150mm) • Cho xem hàng, không thử
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => setIsLabelModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl text-xs"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Đã gửi lệnh in tem bưu phẩm [${selectedLabelData.shipment?.trackingCode}] tới máy in nhiệt!`);
                  setIsLabelModalOpen(false);
                }}
                className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Gửi Tới Máy In Nhiệt A6</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: THEO DÕI HÀNH TRÌNH BƯU PHẨM & SHIPPER (LIVE TRACKING)       */}
      {/* =================================================================== */}

      {isTrackingModalOpen && selectedTrackingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsTrackingModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-[#1d1d1f] my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-[#0071e3] border border-blue-100">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1d1d1f]">Chi Tiết Vận Đơn &amp; Hành Trình Shipper</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {selectedTrackingShipment.status || 'SHIPPING'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6e6e73] mt-0.5">
                    <span>Mã vận đơn:</span>
                    <span className="font-mono font-bold text-[#0071e3] text-sm">{selectedTrackingShipment.trackingCode}</span>
                    <span>•</span>
                    <span>Đơn OMS:</span>
                    <span className="font-mono font-semibold text-gray-800">{selectedTrackingShipment.orderId}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Shipper Card */}
            {selectedTrackingShipment.shipperInfo && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-sky-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0071e3] to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {selectedTrackingShipment.shipperInfo.name?.slice(0, 1) || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1d1d1f] text-sm">{selectedTrackingShipment.shipperInfo.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {selectedTrackingShipment.shipperInfo.rating || '4.95★'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>BKS: <strong className="font-mono text-gray-800">{selectedTrackingShipment.shipperInfo.licensePlate || '59G2-472.91'}</strong></span>
                      <span>•</span>
                      <span className="text-[11px] text-gray-500">{selectedTrackingShipment.shipperInfo.hub || 'Bưu cục trung tâm'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedTrackingShipment.shipperInfo.phone?.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi {selectedTrackingShipment.shipperInfo.phone}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Key Delivery Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs">
              <div className="p-3 bg-[#f5f5f7] rounded-2xl">
                <span className="text-[10px] text-[#6e6e73] block mb-0.5">Đơn Vị Vận Chuyển</span>
                <span className="font-bold text-[#1d1d1f] truncate block">{selectedTrackingShipment.carrierName || 'Giao Hàng Nhanh (GHN)'}</span>
              </div>
              <div className="p-3 bg-[#f5f5f7] rounded-2xl">
                <span className="text-[10px] text-[#6e6e73] block mb-0.5">Kho Lấy Hàng</span>
                <span className="font-bold text-[#1d1d1f] truncate block">{selectedTrackingShipment.warehouseName || 'Tổng Kho Tân Bình'}</span>
              </div>
              <div className="p-3 bg-[#f5f5f7] rounded-2xl">
                <span className="text-[10px] text-[#6e6e73] block mb-0.5">Trọng Lượng Quy Đổi</span>
                <span className="font-bold text-[#1d1d1f] font-mono block">{selectedTrackingShipment.chargeableGrams || selectedTrackingShipment.weightGrams || 500}g</span>
              </div>
              <div className="p-3 bg-[#f5f5f7] rounded-2xl">
                <span className="text-[10px] text-[#6e6e73] block mb-0.5">Tiền Thu Hộ (COD)</span>
                <span className="font-bold text-emerald-700 font-mono block">
                  {selectedTrackingShipment.codAmount > 0 ? '$' + Number(selectedTrackingShipment.codAmount).toLocaleString() : '0 VNĐ (Đã TT)'}
                </span>
              </div>
            </div>

            {/* Recipient Address */}
            <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="font-semibold text-gray-700">Địa chỉ giao hàng:</span>
              </div>
              <p className="text-[#1d1d1f] font-medium pl-5">{selectedTrackingShipment.deliveryAddress}</p>
              <p className="text-gray-500 text-[11px] pl-5 mt-0.5">
                Người nhận: <strong>{selectedTrackingShipment.customerName}</strong> • {selectedTrackingShipment.customerPhone}
              </p>
            </div>

            {/* Tracking Journey Timeline */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-3">
                Nhật Ký Hành Trình Thời Gian Thực (Tracking Journey)
              </h4>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-3">
                {(selectedTrackingShipment.timeline || []).map((step: any, sIdx: number) => {
                  const isLatest = sIdx === (selectedTrackingShipment.timeline?.length || 1) - 1;
                  return (
                    <div key={sIdx} className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3.5 h-3.5 rounded-full mt-1 ${
                            isLatest ? 'bg-[#0071e3] ring-4 ring-blue-100' : 'bg-gray-300'
                          }`}
                        />
                        {sIdx < (selectedTrackingShipment.timeline?.length || 1) - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-bold ${isLatest ? 'text-[#0071e3]' : 'text-gray-800'}`}>
                            {step.title || step.description || step.status}
                          </span>
                          <span className="font-mono text-gray-400 text-[10px]">
                            {step.time ? new Date(step.time).toLocaleString('vi-VN') : ''}
                          </span>
                        </div>
                        {step.note && <p className="text-xs text-gray-600 mt-0.5">{step.note}</p>}
                        {step.actor && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Thực hiện bởi: <strong className="text-gray-600">{step.actor}</strong>
                            {step.location && ` • Tại: ${step.location}`}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  handlePrintShipmentLabel(selectedTrackingShipment.trackingCode || selectedTrackingShipment.id);
                }}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>In Tem A6</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTrackingModalOpen(false);
                    if (activeTab === 'orders') {
                      setActiveTab('logistics');
                      setLogisticsSubTab('tracking_exceptions');
                      setShipmentSearch(selectedTrackingShipment.trackingCode);
                    } else {
                      setActiveTab('orders');
                      setOrderSearch(selectedTrackingShipment.orderId?.replace('#', ''));
                    }
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  {activeTab === 'orders' ? 'Mở trong 4.7 Logistics Suite →' : 'Mở trong 4.3 Quản Lý Đơn Hàng →'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTrackingModalOpen(false)}
                  className="px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.8. MODAL: LẬP LỊCH GỬI EMAIL BÁO CÁO TỰ ĐỘNG ĐỊNH KỲ             */}
      {/* =================================================================== */}


    </>
  );
};
