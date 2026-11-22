'use client';

import React from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Boxes,
  Printer,
  Edit3,
  X,
  Check,
  XCircle,
  AlertOctagon,
  Barcode
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const OrderModals: React.FC = () => {
  const {
    cancelModalOrder,
    setCancelModalOrder,
    cancelReason,
    setCancelReason,
    inspectReturnModal,
    setInspectReturnModal,
    inspectResult,
    setInspectResult,
    inspectNotes,
    setInspectNotes,
    selectedPrintFormat,
    setSelectedPrintFormat,
    internalNoteModal,
    setInternalNoteModal,
    printDocument,
    setPrintDocument,
    showToast,
    handleSaveInternalNote,
    handleCancelOrderConfirm,
    handleInspectReturn
  } = useAdminContext();

  return (
    <>
            {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCancelModalOrder(null)}
          />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertOctagon className="w-5 h-5" />
                <span>Hủy Đơn Hàng #{(cancelModalOrder.trackingId || cancelModalOrder.id || '').slice(0, 8)}</span>
              </div>
              <button
                onClick={() => setCancelModalOrder(null)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
              <p className="font-bold">⚠️ Cam Kết Khôi Phục Tồn Kho Tự Động</p>
              <p>
                Khi xác nhận hủy đơn, hệ thống sẽ thực thi transaction hoàn lại toàn bộ số lượng sản phẩm vào
                kho khả dụng (Available Stock), đồng thời hủy ủy quyền thu tiền.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#1d1d1f]">Lý do hủy đơn hàng (bắt buộc):</label>
              <div className="space-y-1.5">
                {[
                  'Khách hàng đổi ý / Thay đổi địa chỉ',
                  'Không liên lạc được số điện thoại (Nghi ngờ bom hàng)',
                  'Phát hiện đơn hàng ảo gian lận thẻ',
                  'Hết hàng trong kho phân phối',
                  'Khách yêu cầu hủy qua hotline CSKH',
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={cancelReason === reason}
                      onChange={() => setCancelReason(reason)}
                      className="text-rose-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Hoặc nhập lý do chi tiết khác..."
                className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl p-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-rose-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold"
              >
                Quay Lại
              </button>
              <button
                onClick={handleCancelOrderConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Xác Nhận Hủy Đơn &amp; Hoàn Kho</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.3 MODAL 3: Kiểm Tra Hàng Đổi Trả Về Kho & Hoàn Tiền                 */}
      {/* =================================================================== */}

      {inspectReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setInspectReturnModal(null)}
          />
          <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-sm">Kiểm Định Hàng Thu Hồi Về Kho</h3>
                  <p className="text-[11px] text-[#6e6e73]">Yêu cầu đổi trả #{inspectReturnModal.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectReturnModal(null)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-purple-900">
                Sản phẩm: {inspectReturnModal.productName} (x{inspectReturnModal.quantity})
              </p>
              <p className="text-purple-800">
                Mã đơn gốc: #{inspectReturnModal.orderTracking} • Khách hàng: {inspectReturnModal.customerName}
              </p>
              <p className="text-purple-800 font-bold">
                Số tiền hoàn tự động: ${inspectReturnModal.refundAmount}
              </p>
            </div>

            {/* Quality Control Decision */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#1d1d1f]">Kết quả thẩm định chất lượng sản phẩm (QC):</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInspectResult('RESTOCKED')}
                  className={`p-3 rounded-2xl border text-left space-y-1 transition-all ${
                    inspectResult === 'RESTOCKED'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nhập Lại Kệ Kho</span>
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Hàng nguyên seal, phụ kiện đầy đủ. Tự động tăng tồn kho khả dụng và ghi sổ cái kho.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectResult('DAMAGED_WRITEOFF')}
                  className={`p-3 rounded-2xl border text-left space-y-1 transition-all ${
                    inspectResult === 'DAMAGED_WRITEOFF'
                      ? 'border-rose-500 bg-rose-50/70 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Hàng Hỏng / Thanh Lý</span>
                  </p>
                  <p className="text-[11px] text-rose-700">
                    Sản phẩm trầy xước, vỡ seal hoặc lỗi do người dùng. Chuyển vào kho hàng loại B / Phế phẩm.
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-[#1d1d1f]">Ghi chú biên bản kiểm hàng:</label>
              <input
                type="text"
                value={inspectNotes}
                onChange={(e) => setInspectNotes(e.target.value)}
                placeholder="Nhập chi tiết tình trạng hàng khi mở hộp tại kho..."
                className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInspectReturnModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => handleInspectReturn(inspectReturnModal.id, inspectResult, inspectNotes)}
                className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Xác Nhận &amp; Kích Hoạt Hoàn Tiền</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.3 MODAL 4: Ghi Chú Nội Bộ & Gắn Nhãn Đơn Hàng                       */}
      {/* =================================================================== */}

      {internalNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setInternalNoteModal(null)}
          />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#0071e3]" />
                <h3 className="font-bold text-sm">
                  Ghi Chú &amp; Nhãn Đơn #{internalNoteModal.order?.trackingId?.slice(0, 8)}
                </h3>
              </div>
              <button
                onClick={() => setInternalNoteModal(null)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#1d1d1f]">Ghi chú nội bộ (chỉ nội bộ thấy):</label>
              <textarea
                value={internalNoteModal.note}
                onChange={(e) =>
                  setInternalNoteModal({ ...internalNoteModal, note: e.target.value })
                }
                rows={3}
                placeholder="Dặn dò đóng gói, hẹn giờ giao hàng, lưu ý khách quen..."
                className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#1d1d1f]">Gắn nhãn định danh đơn hàng:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  'VIP_HỎA_TỐC',
                  'GIÁ_TRỊ_CAO',
                  'NGUY_CƠ_GIAN_LẬN',
                  'COD_ĐÃ_GỌI',
                  'KHÁCH_QUEN',
                  'GIAO_GIỜ_HÀNH_CHÍNH',
                ].map((tag) => {
                  const hasTag = internalNoteModal.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const newTags = hasTag
                          ? internalNoteModal.tags.filter((t) => t !== tag)
                          : [...internalNoteModal.tags, tag];
                        setInternalNoteModal({ ...internalNoteModal, tags: newTags });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        hasTag
                          ? 'bg-[#0071e3] text-white border-[#0071e3]'
                          : 'bg-[#f5f5f7] text-[#6e6e73] border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {hasTag ? '✓ ' : '+ '}#{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInternalNoteModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={() =>
                  handleSaveInternalNote(
                    internalNoteModal.order.id,
                    internalNoteModal.note,
                    internalNoteModal.tags
                  )
                }
                className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.3 MODAL 5: In Tài Liệu (Tem Vận Đơn, Phiếu Lấy Hàng, Hóa Đơn VAT)   */}
      {/* =================================================================== */}
      {printDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPrintDocument(null)} />
          <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f] max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Header & Format Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#0071e3]" />
                <div>
                  <h3 className="font-bold text-sm">
                    {printDocument.type === 'WAYBILL'
                      ? 'Tem Vận Đơn Giao Hàng'
                      : printDocument.type === 'PICKING_LIST'
                      ? 'Phiếu Lấy Hàng & Đóng Gói (Theo Kệ Kho)'
                      : 'Hóa Đơn / Phiếu Thanh Toán'}
                  </h3>
                  <p className="text-[10px] text-[#6e6e73]">
                    {printDocument.batchOrders
                      ? `In hàng loạt ${printDocument.batchOrders.length} đơn hàng`
                      : `Đơn hàng #${printDocument.order?.trackingId?.slice(0, 8)}`}
                  </p>
                </div>
              </div>

              {/* Format Pills */}
              <div className="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-xl">
                {(['K80', 'A6_DECAL', 'A5', 'A4'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedPrintFormat(fmt)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      selectedPrintFormat === fmt
                        ? 'bg-white text-[#1d1d1f] shadow-xs'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Preview Box */}
            <div className="p-5 bg-[#f5f5f7] border border-dashed border-gray-300 rounded-2xl font-mono text-xs space-y-4">
              {/* DOCUMENT TYPE: 1. WAYBILL (TEM VẬN ĐƠN NHIỆT K80 / A6) */}
              {printDocument.type === 'WAYBILL' && (
                <div className="space-y-3">
                  <div className="text-center pb-2 border-b border-gray-300">
                    <p className="font-bold text-sm tracking-widest text-[#1d1d1f]">
                      TECHZONE LOGISTICS EXPRESS
                    </p>
                    <p className="text-[10px] text-[#6e6e73]">
                      Hãng vận chuyển: {printDocument.order?.carrier || 'Giao Hàng Nhanh (GHN)'}
                    </p>
                    {/* Simulated Code 128 Barcode */}
                    <div className="my-2 p-2 bg-white rounded-lg flex flex-col items-center justify-center">
                      <div className="h-10 w-48 flex items-center justify-center tracking-widest font-mono text-lg font-bold text-black border-y border-dashed border-gray-400 py-1">
                        ||| | |||| | | ||| || |||
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#1d1d1f] mt-1">
                        {printDocument.order?.waybillCode || 'VN89102EX'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans pb-2 border-b border-gray-300">
                    <div>
                      <p className="text-[10px] text-[#86868b] uppercase font-bold">Người gửi:</p>
                      <p className="font-bold text-[#1d1d1f]">Kho TechZone Flagship</p>
                      <p className="text-[10px] text-[#6e6e73]">Tòa Keangnam, Cầu Giấy, Hà Nội</p>
                      <p className="text-[10px] font-mono">Hotline: 1800 6975</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#86868b] uppercase font-bold">Người nhận:</p>
                      <p className="font-bold text-[#1d1d1f]">{printDocument.order?.user?.fullName || 'Trần Văn Khách'}</p>
                      <p className="text-[10px] text-[#6e6e73]">{printDocument.order?.shippingAddress || 'TP. Hồ Chí Minh'}</p>
                      <p className="text-[10px] font-mono">SĐT: {printDocument.order?.customerPhone || '0901 234 567'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-sans text-xs">
                    <div>
                      <p className="text-[10px] text-[#86868b]">Tiền thu hộ COD:</p>
                      <p className="text-sm font-bold text-rose-600 font-mono">
                        {printDocument.order?.paymentMethod === 'COD'
                          ? `$${Number(printDocument.order?.totalAmount).toLocaleString()}`
                          : '$0.00 (Đã thanh toán)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#86868b]">Kệ lấy hàng:</p>
                      <p className="text-xs font-bold text-amber-800 font-mono">
                        {printDocument.order?.shelfLocation || 'Kệ A1-02'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENT TYPE: 2. PICKING LIST (PHIẾU LẤY HÀNG THEO KỆ) */}
              {printDocument.type === 'PICKING_LIST' && (
                <div className="space-y-3 font-sans">
                  <div className="text-center pb-2 border-b border-gray-300">
                    <h3 className="font-bold text-sm tracking-wide text-[#1d1d1f]">
                      PHIẾU LẤY HÀNG VÀ ĐÓNG GÓI (WAREHOUSE PICKING LIST)
                    </h3>
                    <p className="text-[10px] text-[#6e6e73] font-mono">
                      Khổ in: {selectedPrintFormat} • Thời gian: {new Date().toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-300 text-[10px] text-[#86868b] uppercase font-mono">
                      <tr>
                        <th className="py-1">Vị Trí Kệ</th>
                        <th className="py-1">Mã SKU</th>
                        <th className="py-1">Tên Hàng Hóa</th>
                        <th className="py-1 text-center">SL</th>
                        <th className="py-1 text-right">Đã Nhặt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-mono text-[11px]">
                      {(printDocument.batchOrders || [printDocument.order || {}]).map((o, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 font-bold text-amber-800">{o.shelfLocation || `Kệ A${idx + 1}-01`}</td>
                          <td className="py-1.5 text-blue-700">SKU-APL-16P</td>
                          <td className="py-1.5 font-sans font-medium text-[#1d1d1f]">iPhone 16 Pro 256GB Titan</td>
                          <td className="py-1.5 text-center font-bold">1</td>
                          <td className="py-1.5 text-right">
                            <span className="inline-block w-4 h-4 border-2 border-gray-400 rounded" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-gray-300 text-[10px] text-[#6e6e73] flex items-center justify-between">
                    <span>Thủ kho kiểm tra: _____________________</span>
                    <span>Nhân viên giao nhận ký: _____________________</span>
                  </div>
                </div>
              )}

              {/* DOCUMENT TYPE: 3. VAT INVOICE */}
              {printDocument.type === 'VAT_INVOICE' && (
                <div className="space-y-3 font-sans">
                  <div className="text-center pb-2 border-b border-gray-300">
                    <h3 className="font-bold text-sm tracking-wide text-[#1d1d1f]">
                      HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT ELECTRONIC INVOICE)
                    </h3>
                    <p className="text-[10px] text-[#6e6e73]">
                      Ký hiệu: 1C26TTE • Số: {Math.floor(100000 + Math.random() * 900000)}
                    </p>
                  </div>

                  <div className="text-xs space-y-1">
                    <p><span className="text-[#6e6e73]">Đơn vị bán hàng:</span> <span className="font-bold">CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHZONE VIỆT NAM</span></p>
                    <p><span className="text-[#6e6e73]">Mã số thuế:</span> <span className="font-mono font-bold">0108923481</span></p>
                    <p><span className="text-[#6e6e73]">Người mua hàng:</span> <span className="font-bold">{printDocument.order?.user?.fullName}</span></p>
                    <p><span className="text-[#6e6e73]">Hình thức thanh toán:</span> {printDocument.order?.paymentMethod}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-300 flex items-center justify-between font-bold text-xs">
                    <span>Tổng tiền thanh toán (Đã gồm 10% VAT):</span>
                    <span className="font-mono text-emerald-700 text-sm">
                      ${Number(printDocument.order?.totalAmount || 999).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPrintDocument(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Đã gửi lệnh in ra máy in tem / xuất file PDF!');
                  setPrintDocument(null);
                }}
                className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Tài Liệu / Xuất PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: THÊM THUỘC TÍNH BỘ LỌC MỚI */}


    </>
  );
};
