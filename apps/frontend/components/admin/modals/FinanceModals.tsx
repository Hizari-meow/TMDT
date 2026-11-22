'use client';

import React from 'react';

import {
  FileText,
  CreditCard,
  Building,
  X
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const FinanceModals: React.FC = () => {
  const {
    isEInvoiceModalOpen,
    setIsEInvoiceModalOpen,
    isAdjustEInvoiceModalOpen,
    setIsAdjustEInvoiceModalOpen,
    selectedEInvoice,
    isArDebtModalOpen,
    setIsArDebtModalOpen,
    isApDebtModalOpen,
    setIsApDebtModalOpen,
    newEInvoiceForm,
    setNewEInvoiceForm,
    adjustEInvoiceForm,
    setAdjustEInvoiceForm,
    newArDebtForm,
    setNewArDebtForm,
    newApDebtForm,
    setNewApDebtForm,
    handleCreateArDebtSubmit,
    handleCreateApDebtSubmit,
    handleIssueEInvoiceSubmit,
    handleAdjustOrCancelEInvoiceSubmit
  } = useAdminContext();

  return (
    <>
            {isEInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0071e3]" />
                  <span>Phát Hành Hóa Đơn Điện Tử VAT (Nghị Định 123)</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Tự động cấp mã cơ quan thuế qua VNPT-Invoice, MISA meInvoice, Viettel Sinvoice
                </p>
              </div>
              <button
                onClick={() => setIsEInvoiceModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueEInvoiceSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Đơn Hàng Liên Kết</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 7D25C5B2"
                    value={newEInvoiceForm.orderTracking}
                    onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, orderTracking: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Hệ Thống Nhà Cung Cấp HĐĐT</label>
                  <select
                    value={newEInvoiceForm.provider}
                    onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, provider: e.target.value as any })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="VNPT">VNPT-Invoice (Ký hiệu 1C26TNV)</option>
                    <option value="MISA">MISA meInvoice (Ký hiệu 1C26TMI)</option>
                    <option value="VIETTEL">Viettel Sinvoice (Ký hiệu 1C26TVI)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Người Mua / Đơn Vị Công Ty</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Công ty Cổ phần Công Nghệ Mới"
                    value={newEInvoiceForm.customerName}
                    onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, customerName: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Số Thuế (Doanh Nghiệp / Cá Nhân)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0108923481"
                    value={newEInvoiceForm.taxCode}
                    onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, taxCode: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Địa Chỉ Doanh Nghiệp (Ghi trên hóa đơn)</label>
                <input
                  type="text"
                  placeholder="VD: Tầng 12, Keangnam Landmark 72, Nam Từ Liêm, Hà Nội"
                  value={newEInvoiceForm.buyerAddress}
                  onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, buyerAddress: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Hòm Thư Nhận Bản Thể Hiện PDF/XML</label>
                <input
                  type="email"
                  required
                  placeholder="ketoan@doanhnghiep.vn"
                  value={newEInvoiceForm.buyerEmail}
                  onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, buyerEmail: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tổng Giá Trị Đơn Hàng ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newEInvoiceForm.totalAmount}
                    onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Thuế Suất GTGT</label>
                  <select
                    value={newEInvoiceForm.vatRatePercent}
                    onChange={(e) => setNewEInvoiceForm({ ...newEInvoiceForm, vatRatePercent: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                  >
                    <option value={8}>8% (Giảm 2% theo Nghị quyết kích cầu)</option>
                    <option value={10}>10% (Thuế suất chuẩn quy định)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs">
                ✓ <strong>Ký số HSM tự động:</strong> Hóa đơn sẽ được ký số bảo mật trên thiết bị chuyên dụng HSM Cloud và gửi mã tra cứu CQT tức thì.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Ký Số &amp; Cấp Mã CQT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NGHIỆP VỤ HÓA ĐƠN ĐIỆN TỬ THEO NGHỊ ĐỊNH 123 (ĐIỀU CHỈNH / THAY THẾ / HỦY) */}

      {isAdjustEInvoiceModalOpen && selectedEInvoice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Nghiệp Vụ Hóa Đơn NĐ 123: {selectedEInvoice.einvoiceNo}
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Xử lý hóa đơn có sai sót: Điều chỉnh giá trị, Thay thế hóa đơn hoặc Hủy bỏ (Mẫu 04/SS-HĐĐT)
                </p>
              </div>
              <button
                onClick={() => setIsAdjustEInvoiceModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustOrCancelEInvoiceSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Chọn Nghiệp Vụ Cần Thực Hiện</label>
                <select
                  value={adjustEInvoiceForm.action}
                  onChange={(e) => setAdjustEInvoiceForm({ ...adjustEInvoiceForm, action: e.target.value as any })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold"
                >
                  <option value="ĐIỀU_CHỈNH">Lập Hóa Đơn Điều Chỉnh (Tăng/Giảm Giá Trị Hoặc Thuế)</option>
                  <option value="THAY_THẾ">Lập Hóa Đơn Thay Thế (Thay Cho HĐ Sai Sót Nghiêm Trọng)</option>
                  <option value="HỦY_BỎ">Hủy Hóa Đơn &amp; Lập Thông Báo Mẫu 04/SS-HĐĐT</option>
                </select>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Lý Do Xử Lý Sai Sót (Gửi Cơ Quan Thuế)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ghi rõ lý do sai sót theo biên bản thỏa thuận..."
                  value={adjustEInvoiceForm.reason}
                  onChange={(e) => setAdjustEInvoiceForm({ ...adjustEInvoiceForm, reason: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              {adjustEInvoiceForm.action === 'ĐIỀU_CHỈNH' && (
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">
                    Số Tiền Điều Chỉnh ($) (Dương = Tăng tiền, Âm = Giảm tiền do đổi trả)
                  </label>
                  <input
                    type="number"
                    required
                    value={adjustEInvoiceForm.adjustmentAmount}
                    onChange={(e) => setAdjustEInvoiceForm({ ...adjustEInvoiceForm, adjustmentAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold text-sm"
                  />
                </div>
              )}

              {adjustEInvoiceForm.action === 'THAY_THẾ' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Đơn Vị Mua Mới</label>
                    <input
                      type="text"
                      placeholder="Cập nhật tên công ty..."
                      value={adjustEInvoiceForm.newCustomerName}
                      onChange={(e) => setAdjustEInvoiceForm({ ...adjustEInvoiceForm, newCustomerName: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                    />
                  </div>
                  <div>
                    <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Số Thuế Mới</label>
                    <input
                      type="text"
                      placeholder="Cập nhật MST chuẩn..."
                      value={adjustEInvoiceForm.newTaxCode}
                      onChange={(e) => setAdjustEInvoiceForm({ ...adjustEInvoiceForm, newTaxCode: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustEInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-xs ${
                    adjustEInvoiceForm.action === 'HỦY_BỎ'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-[#0071e3] hover:bg-[#0077ed]'
                  }`}
                >
                  Xác Nhận Thực Hiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TẠO CÔNG NỢ PHẢI THU B2B (AR) */}

      {isArDebtModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Tạo Bản Ghi Công Nợ Phải Thu (AR B2B)</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">Khách hàng doanh nghiệp hoặc đối tác mua trả chậm Net 30/60</p>
              </div>
              <button
                onClick={() => setIsArDebtModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArDebtSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Doanh Nghiệp Mua Hàng</label>
                <input
                  type="text"
                  required
                  value={newArDebtForm.clientName}
                  onChange={(e) => setNewArDebtForm({ ...newArDebtForm, clientName: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Số Thuế (MST)</label>
                  <input
                    type="text"
                    required
                    value={newArDebtForm.taxCode}
                    onChange={(e) => setNewArDebtForm({ ...newArDebtForm, taxCode: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Số Hợp Đồng / Đơn Đặt Hàng</label>
                  <input
                    type="text"
                    value={newArDebtForm.contractNo}
                    onChange={(e) => setNewArDebtForm({ ...newArDebtForm, contractNo: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tổng Nợ Phải Thu ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newArDebtForm.totalAmount}
                    onChange={(e) => setNewArDebtForm({ ...newArDebtForm, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Kỳ Hạn</label>
                  <select
                    value={newArDebtForm.paymentTerm}
                    onChange={(e) => setNewArDebtForm({ ...newArDebtForm, paymentTerm: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  >
                    <option value="Net 15">Net 15 ngày</option>
                    <option value="Net 30">Net 30 ngày</option>
                    <option value="Net 60">Net 60 ngày</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Hạn Thanh Toán</label>
                  <input
                    type="date"
                    required
                    value={newArDebtForm.dueDate}
                    onChange={(e) => setNewArDebtForm({ ...newArDebtForm, dueDate: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Ghi Chú Hợp Đồng &amp; Thiết Bị</label>
                <input
                  type="text"
                  value={newArDebtForm.description}
                  onChange={(e) => setNewArDebtForm({ ...newArDebtForm, description: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsArDebtModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Công Nợ AR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: GHI NHẬN NỢ NHÀ CUNG CẤP (AP) */}

      {isApDebtModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <span>Ghi Nhận Công Nợ Phải Trả Nhà Cung Cấp (AP)</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">Hóa đơn đầu vào từ Apple Vietnam, Digiworld, Synnex FPT</p>
              </div>
              <button
                onClick={() => setIsApDebtModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApDebtSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Nhà Cung Cấp / Phân Phối</label>
                <input
                  type="text"
                  required
                  value={newApDebtForm.supplierName}
                  onChange={(e) => setNewApDebtForm({ ...newApDebtForm, supplierName: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Số Thuế (MST)</label>
                  <input
                    type="text"
                    required
                    value={newApDebtForm.taxCode}
                    onChange={(e) => setNewApDebtForm({ ...newApDebtForm, taxCode: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Số Hóa Đơn Đầu Vào</label>
                  <input
                    type="text"
                    required
                    value={newApDebtForm.invoiceNo}
                    onChange={(e) => setNewApDebtForm({ ...newApDebtForm, invoiceNo: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tổng Tiền Phải Trả ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newApDebtForm.totalAmount}
                    onChange={(e) => setNewApDebtForm({ ...newApDebtForm, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Kỳ Hạn</label>
                  <select
                    value={newApDebtForm.paymentTerm}
                    onChange={(e) => setNewApDebtForm({ ...newApDebtForm, paymentTerm: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  >
                    <option value="Net 30">Net 30 ngày</option>
                    <option value="Net 45">Net 45 ngày</option>
                    <option value="Net 60">Net 60 ngày</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Hạn Chi Trả</label>
                  <input
                    type="date"
                    required
                    value={newApDebtForm.dueDate}
                    onChange={(e) => setNewApDebtForm({ ...newApDebtForm, dueDate: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Mô Tả Lô Hàng Đầu Vào</label>
                <input
                  type="text"
                  value={newApDebtForm.description}
                  onChange={(e) => setNewApDebtForm({ ...newApDebtForm, description: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsApDebtModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Khoản Phải Trả AP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.7. MODAL: TẠO VẬN ĐƠN MỚI & ĐẨY SANG HÃNG VẬN CHUYỂN             */}
      {/* =================================================================== */}


    </>
  );
};
