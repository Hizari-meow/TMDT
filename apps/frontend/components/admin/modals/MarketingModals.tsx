'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  Zap,
  Tag,
  Send,
  Layers,
  Sparkles,
  X,
  Award,
  Target,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const MarketingModals: React.FC = () => {
  const {
    isCouponModalOpen,
    setIsCouponModalOpen,
    isFlashSaleModalOpen,
    setIsFlashSaleModalOpen,
    isComboModalOpen,
    setIsComboModalOpen,
    isCrossSellModalOpen,
    setIsCrossSellModalOpen,
    isLoyaltyAdjustModalOpen,
    setIsLoyaltyAdjustModalOpen,
    isMarketingCampaignModalOpen,
    setIsMarketingCampaignModalOpen,
    isBannerModalOpen,
    setIsBannerModalOpen,
    isLandingPageModalOpen,
    setIsLandingPageModalOpen,
    newCouponForm,
    setNewCouponForm,
    newFlashSaleForm,
    setNewFlashSaleForm,
    newComboForm,
    setNewComboForm,
    newCrossSellForm,
    setNewCrossSellForm,
    loyaltyAdjustForm,
    setLoyaltyAdjustForm,
    newMarketingCampaignForm,
    setNewMarketingCampaignForm,
    newBannerForm,
    setNewBannerForm,
    newLandingPageForm,
    setNewLandingPageForm,
    handleCreateCouponSubmit,
    handleCreateFlashSaleSubmit,
    handleCreateComboSubmit,
    handleCreateCrossSellSubmit,
    handleAdjustLoyaltySubmit,
    handleCreateCampaignSubmit,
    handleCreateBannerSubmit,
    handleCreateLandingPageSubmit
  } = useAdminContext();

  return (
    <>
            {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#0071e3]" />
                  <span>Tạo Mã Giảm Giá Mới (Coupon Engine)</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Thiết lập giảm %, giảm tiền mặt, miễn phí ship, điều kiện giỏ hàng và cộng dồn
                </p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Coupon (Code)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: TECHSALE20"
                    value={newCouponForm.code}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono font-bold uppercase tracking-wider"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Loại Giảm Giá</label>
                  <select
                    value={newCouponForm.type}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="PERCENTAGE">Giảm theo tỷ lệ % (Percentage)</option>
                    <option value="FIXED_AMOUNT">Giảm số tiền cố định (Fixed Cash)</option>
                    <option value="FREE_SHIPPING">Miễn phí vận chuyển (Free Shipping)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">
                    {newCouponForm.type === 'PERCENTAGE' ? 'Tỷ lệ giảm (%)' : 'Số tiền giảm ($)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCouponForm.discountValue}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Đơn tối thiểu ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponForm.minOrderAmount}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Giảm tối đa ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponForm.maxDiscountAmount}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, maxDiscountAmount: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Hạng Khách Hàng Áp Dụng</label>
                  <select
                    value={newCouponForm.targetCustomerTier}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, targetCustomerTier: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="ALL">Tất cả khách hàng</option>
                    <option value="BRONZE">Thành viên Đồng (Bronze trở lên)</option>
                    <option value="SILVER">Thành viên Bạc (Silver trở lên)</option>
                    <option value="GOLD">Thành viên Vàng (Gold trở lên)</option>
                    <option value="DIAMOND">Khách VIP Kim Cương (Diamond Only)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Danh Mục Áp Dụng</label>
                  <select
                    value={newCouponForm.applicableCategories}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, applicableCategories: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="ALL">Toàn bộ cửa hàng (All Catalog)</option>
                    <option value="Điện thoại">Điện thoại di động</option>
                    <option value="Laptop">Laptop &amp; Máy tính bảng</option>
                    <option value="Phụ kiện">Phụ kiện &amp; Âm thanh</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tổng lượt dùng tối đa</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponForm.totalUsageLimit}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, totalUsageLimit: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Lượt dùng / Mỗi khách</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponForm.perCustomerLimit}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, perCustomerLimit: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Ngày Bắt Đầu</label>
                  <input
                    type="date"
                    value={newCouponForm.startDate}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, startDate: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Ngày Hết Hạn</label>
                  <input
                    type="date"
                    value={newCouponForm.endDate}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, endDate: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <span className="font-bold text-blue-900 block">Quy tắc cộng dồn (Stacking Rules):</span>
                <label className="flex items-center gap-2 text-[#1d1d1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCouponForm.allowFlashSaleStack}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, allowFlashSaleStack: e.target.checked })}
                    className="rounded border-gray-300 text-[#0071e3] focus:ring-blue-500"
                  />
                  <span>Cho phép áp dụng chung với sản phẩm đang chạy Flash Sale</span>
                </label>
                <label className="flex items-center gap-2 text-[#1d1d1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCouponForm.allowMultiCouponStack}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, allowMultiCouponStack: e.target.checked })}
                    className="rounded border-gray-300 text-[#0071e3] focus:ring-blue-500"
                  />
                  <span>Cho phép cộng dồn với mã coupon giảm giá khác cùng giỏ hàng</span>
                </label>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Mô Tả Mã Giảm Giá</label>
                <input
                  type="text"
                  placeholder="VD: Tri ân khách hàng tháng 10 - Giảm 15% tối đa $50"
                  value={newCouponForm.description}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Tạo Mã Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM KHUNG GIỜ FLASH SALE */}

      {isFlashSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Thêm Khung Giờ Flash Sale Mới</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Tự động đồng bộ Redis Cache &amp; BullMQ hàng đợi chịu tải 50,000+ RPS
                </p>
              </div>
              <button
                onClick={() => setIsFlashSaleModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFlashSaleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Khung Giờ Chiến Dịch</label>
                <input
                  type="text"
                  required
                  value={newFlashSaleForm.title}
                  onChange={(e) => setNewFlashSaleForm({ ...newFlashSaleForm, title: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Khung Giờ Phát Sóng</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 12:00 - 14:00 Hôm Nay"
                  value={newFlashSaleForm.slotTime}
                  onChange={(e) => setNewFlashSaleForm({ ...newFlashSaleForm, slotTime: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Sản Phẩm Flash Sale</label>
                <input
                  type="text"
                  required
                  value={newFlashSaleForm.productName}
                  onChange={(e) => setNewFlashSaleForm({ ...newFlashSaleForm, productName: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Giá Gốc ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFlashSaleForm.originalPrice}
                    onChange={(e) => setNewFlashSaleForm({ ...newFlashSaleForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Giá Sale ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFlashSaleForm.salePrice}
                    onChange={(e) => setNewFlashSaleForm({ ...newFlashSaleForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold text-amber-600"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Số Lượng Kho Khóa</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFlashSaleForm.stock}
                    onChange={(e) => setNewFlashSaleForm({ ...newFlashSaleForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 text-xs">
                ⚡ <strong>Cơ chế khóa kho chống Oversell:</strong> Sản phẩm sẽ được cấp phát Atomic Token trên Redis key và chỉ xác nhận giảm tồn kho chính thức khi BullMQ xử lý thành công.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFlashSaleModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Kích Hoạt Flash Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TẠO GÓI COMBO / BUNDLE */}

      {isComboModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span>Tạo Gói Combo / Bundle Ưu Đãi</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Đóng gói nhiều sản phẩm giá tốt để gia tăng giá trị đơn hàng trung bình (AOV)
                </p>
              </div>
              <button
                onClick={() => setIsComboModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComboSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Gói Combo</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bộ Đôi Giải Trí Apple TV + HomePod mini"
                  value={newComboForm.name}
                  onChange={(e) => setNewComboForm({ ...newComboForm, name: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Mô Tả Gói Ưu Đãi</label>
                <input
                  type="text"
                  placeholder="VD: Mua trọn combo tiết kiệm ngay 25%"
                  value={newComboForm.description}
                  onChange={(e) => setNewComboForm({ ...newComboForm, description: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Sản Phẩm Trong Gói (Phân cách bởi dấu phẩy)</label>
                <textarea
                  rows={2}
                  required
                  value={newComboForm.items}
                  onChange={(e) => setNewComboForm({ ...newComboForm, items: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Tổng Giá Niêm Yết ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newComboForm.originalPrice}
                    onChange={(e) => setNewComboForm({ ...newComboForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Giá Bán Combo ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newComboForm.bundlePrice}
                    onChange={(e) => setNewComboForm({ ...newComboForm, bundlePrice: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold text-indigo-600"
                  />
                </div>
              </div>

              {newComboForm.originalPrice > newComboForm.bundlePrice && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-medium">
                  <span>Tiết kiệm cho khách hàng:</span>
                  <span className="font-bold text-sm">
                    ${newComboForm.originalPrice - newComboForm.bundlePrice} (Giảm{' '}
                    {Math.round(((newComboForm.originalPrice - newComboForm.bundlePrice) / newComboForm.originalPrice) * 100)}%)
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsComboModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu &amp; Xuất Bản Combo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CẤU HÌNH MUA KÈM & KHUYẾN MÃI TỰ ĐỘNG */}

      {isCrossSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Thêm Quy Tắc Mua Kèm &amp; Tự Động</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Cross-sell giảm %, Upsell nâng cấp hoặc Mua X tặng Y
                </p>
              </div>
              <button
                onClick={() => setIsCrossSellModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrossSellSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Loại Quy Tắc Khuyến Mãi</label>
                <select
                  value={newCrossSellForm.type}
                  onChange={(e) => setNewCrossSellForm({ ...newCrossSellForm, type: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                >
                  <option value="CROSS_SELL">Mua Kèm Giảm Giá (Cross-Sell)</option>
                  <option value="UPSELL">Nâng Cấp Phiên Bản Cao Hơn (Upsell)</option>
                  <option value="BUY_X_GET_Y">Mua 2 Tặng 1 (Buy X Get Y)</option>
                  <option value="GIFT_WITH_PURCHASE">Quà Tặng Kèm Đủ Điều Kiện (Free Gift)</option>
                </select>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Sản Phẩm Kích Hoạt (Trigger)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: iPhone 16 Pro Max"
                  value={newCrossSellForm.triggerProduct}
                  onChange={(e) => setNewCrossSellForm({ ...newCrossSellForm, triggerProduct: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Sản Phẩm Đề Xuất / Quà Tặng</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cáp sạc USB-C braided 240W"
                  value={newCrossSellForm.suggestedProduct}
                  onChange={(e) => setNewCrossSellForm({ ...newCrossSellForm, suggestedProduct: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Mức Ưu Đãi Áp Dụng</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Giảm ngay 30% khi mua cùng máy chính"
                  value={newCrossSellForm.discountOffer}
                  onChange={(e) => setNewCrossSellForm({ ...newCrossSellForm, discountOffer: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold text-purple-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCrossSellModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Kích Hoạt Quy Tắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ĐIỀU CHỈNH ĐIỂM THƯỞNG (LOYALTY ADJUSTMENT) */}

      {isLoyaltyAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Điều Chỉnh Điểm Thưởng Khách Hàng</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Lưu vết nhật ký kiểm toán minh bạch vào cơ sở dữ liệu Loyalty
                </p>
              </div>
              <button
                onClick={() => setIsLoyaltyAdjustModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustLoyaltySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Khách Hàng Áp Dụng</label>
                <input
                  type="text"
                  required
                  value={loyaltyAdjustForm.customerName}
                  onChange={(e) => setLoyaltyAdjustForm({ ...loyaltyAdjustForm, customerName: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Mã UUID Khách Hàng</label>
                <input
                  type="text"
                  required
                  value={loyaltyAdjustForm.customerId}
                  onChange={(e) => setLoyaltyAdjustForm({ ...loyaltyAdjustForm, customerId: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">
                  Số Điểm Điều Chỉnh (Dương = Cộng điểm, Âm = Trừ điểm)
                </label>
                <input
                  type="number"
                  required
                  value={loyaltyAdjustForm.deltaPoints}
                  onChange={(e) => setLoyaltyAdjustForm({ ...loyaltyAdjustForm, deltaPoints: Number(e.target.value) })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-bold text-base"
                />
                <span className="text-gray-400 mt-1 block">
                  Quy đổi giá trị: 100 điểm = $1.00 USD chiết khấu trực tiếp giỏ hàng.
                </span>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Lý Do Điều Chỉnh (Audit Note)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ghi chú lý do cộng/trừ điểm phục vụ kiểm toán..."
                  value={loyaltyAdjustForm.reason}
                  onChange={(e) => setLoyaltyAdjustForm({ ...loyaltyAdjustForm, reason: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLoyaltyAdjustModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Xác Nhận Điều Chỉnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: TẠO CHIẾN DỊCH MARKETING ĐA KÊNH */}

      {isMarketingCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#0071e3]" />
                  <span>Tạo Chiến Dịch Multi-Channel Marketing</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Gửi Email (SendGrid), SMS Brandname, Push Notification &amp; Zalo OA
                </p>
              </div>
              <button
                onClick={() => setIsMarketingCampaignModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Chiến Dịch</label>
                <input
                  type="text"
                  required
                  value={newMarketingCampaignForm.name}
                  onChange={(e) => setNewMarketingCampaignForm({ ...newMarketingCampaignForm, name: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Kênh Phát Sóng</label>
                  <select
                    value={newMarketingCampaignForm.channel}
                    onChange={(e) => setNewMarketingCampaignForm({ ...newMarketingCampaignForm, channel: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="EMAIL">Email (SendGrid/Mailchimp)</option>
                    <option value="SMS">SMS Brandname TechZone</option>
                    <option value="PUSH">App Push Notification</option>
                    <option value="ZALO">Zalo Official Account (ZNS)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Nhóm Khách Mục Tiêu</label>
                  <select
                    value={newMarketingCampaignForm.targetSegment}
                    onChange={(e) => setNewMarketingCampaignForm({ ...newMarketingCampaignForm, targetSegment: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="Khách VIP & Khách Thường Xuyên">Khách VIP &amp; Thường Xuyên</option>
                    <option value="Toàn bộ khách hàng đã đăng ký">Toàn bộ khách hàng đã đăng ký</option>
                    <option value="Khách bỏ quên giỏ hàng 24h qua">Khách bỏ quên giỏ hàng 24h qua</option>
                    <option value="Khách ngủ đông > 60 ngày">Khách ngủ đông &gt; 60 ngày</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tiêu Đề / Subject (Có chèn biến cá nhân hóa)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: {customer_name} ơi, món đồ trong giỏ hàng đang giảm 20%!"
                  value={newMarketingCampaignForm.subject}
                  onChange={(e) => setNewMarketingCampaignForm({ ...newMarketingCampaignForm, subject: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
                <span className="text-gray-400 mt-1 block">
                  Hỗ trợ biến động: <code>{'{customer_name}'}</code>, <code>{'{product_name}'}</code>, <code>{'{discount_code}'}</code>
                </span>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Thời Điểm Phát Sóng</label>
                <select
                  value={newMarketingCampaignForm.schedule}
                  onChange={(e) => setNewMarketingCampaignForm({ ...newMarketingCampaignForm, schedule: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                >
                  <option value="Gửi ngay">Gửi ngay tức thì (Instant Send)</option>
                  <option value="Hẹn giờ 20:00 hôm nay">Hẹn giờ 20:00 tối nay (Giờ vàng)</option>
                  <option value="Lên lịch 09:00 sáng mai">Lên lịch 09:00 sáng mai</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs">
                ✓ <strong>Tuân thủ &amp; Bảo mật:</strong> Tự động tích hợp nút hủy đăng ký (Unsubscribe) và tuân thủ chính sách Opt-in theo Nghị định 91/2020/NĐ-CP.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMarketingCampaignModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Phát Hành Chiến Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: TẠO BANNER QUẢNG BÁ */}

      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#0071e3]" />
                  <span>Tạo Banner Quảng Bá &amp; Popup</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Cấu hình vị trí hiển thị, thiết bị mục tiêu và thời hạn chạy
                </p>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBannerSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tiêu Đề Banner</label>
                <input
                  type="text"
                  required
                  value={newBannerForm.title}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Vị Trí Đặt</label>
                  <select
                    value={newBannerForm.placement}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, placement: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="HOMEPAGE_HERO_SLIDER">Slider Trang Chủ (Hero)</option>
                    <option value="MID_PAGE_BANNER">Banner Giữa Trang (Mid-Page)</option>
                    <option value="POPUP_PROMO">Popup Khuyến Mãi Đầu Trang</option>
                    <option value="HEADER_ANNOUNCEMENT">Thanh Thông Báo Header</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Thiết Bị Áp Dụng</label>
                  <select
                    value={newBannerForm.device}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, device: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="ALL">Toàn bộ thiết bị (All Devices)</option>
                    <option value="DESKTOP">Chỉ Máy tính (Desktop Only)</option>
                    <option value="MOBILE">Chỉ Điện thoại (Mobile Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">URL Hình Ảnh</label>
                <input
                  type="url"
                  required
                  value={newBannerForm.imageUrl}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, imageUrl: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Đường Dẫn Đích (Target Link)</label>
                <input
                  type="text"
                  required
                  value={newBannerForm.targetUrl}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, targetUrl: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Bắt Đầu</label>
                  <input
                    type="date"
                    value={newBannerForm.startDate}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, startDate: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#1d1d1f] font-semibold block mb-1">Kết Thúc</label>
                  <input
                    type="date"
                    value={newBannerForm.endDate}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, endDate: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Xuất Bản Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: TẠO LANDING PAGE CHIẾN DỊCH & A/B TESTING */}

      {isLandingPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Tạo Landing Page &amp; A/B Testing</span>
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Trang chuyên biệt chuyển đổi có đếm ngược, form thu thập và A/B testing
                </p>
              </div>
              <button
                onClick={() => setIsLandingPageModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLandingPageSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tiêu Đề Trang Chiến Dịch</label>
                <input
                  type="text"
                  required
                  value={newLandingPageForm.title}
                  onChange={(e) => setNewLandingPageForm({ ...newLandingPageForm, title: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-semibold"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Đường Dẫn URL (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="/campaign/mega-sale-2026"
                  value={newLandingPageForm.slug}
                  onChange={(e) => setNewLandingPageForm({ ...newLandingPageForm, slug: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono text-xs"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="flex items-center gap-2 text-[#1d1d1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLandingPageForm.hasLeadForm}
                    onChange={(e) => setNewLandingPageForm({ ...newLandingPageForm, hasLeadForm: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold">Bật Form Thu Thập Thông Tin Khách Hàng Tiềm Năng (Lead Form)</span>
                </label>
                <label className="flex items-center gap-2 text-[#1d1d1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLandingPageForm.enableAbTest}
                    onChange={(e) => setNewLandingPageForm({ ...newLandingPageForm, enableAbTest: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold">Kích Hoạt Thử Nghiệm A/B Testing 50/50 Traffic Split</span>
                </label>
              </div>

              {newLandingPageForm.enableAbTest && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div>
                    <label className="text-emerald-900 font-semibold block mb-1">Tiêu Đề Bản A (50% Traffic)</label>
                    <input
                      type="text"
                      value={newLandingPageForm.variantAName}
                      onChange={(e) => setNewLandingPageForm({ ...newLandingPageForm, variantAName: e.target.value })}
                      className="w-full bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-[#1d1d1f]"
                    />
                  </div>
                  <div>
                    <label className="text-emerald-900 font-semibold block mb-1">Tiêu Đề Bản B (50% Traffic)</label>
                    <input
                      type="text"
                      value={newLandingPageForm.variantBName}
                      onChange={(e) => setNewLandingPageForm({ ...newLandingPageForm, variantBName: e.target.value })}
                      className="w-full bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-[#1d1d1f]"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLandingPageModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Xuất Bản Landing Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.6. FINANCE & PAYMENTS MODALS (4 DIALOGS)                          */}
      {/* =================================================================== */}

      {/* MODAL 1: PHÁT HÀNH HÓA ĐƠN VAT ĐIỆN TỬ MỚI (NGHỊ ĐỊNH 123) */}


    </>
  );
};
