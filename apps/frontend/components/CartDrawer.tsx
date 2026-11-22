'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckSquare,
  Square,
  Truck,
  Sparkles,
  Coins,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    selectedItemIds,
    toggleSelectItem,
    selectAllItems,
    unselectAllItems,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    pointsDiscount,
    usePoints,
    setUsePoints,
    shippingFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode('');
  };

  const handleProceedToCheckout = () => {
    if (selectedItemIds.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const allSelected = items.length > 0 && selectedItemIds.length === items.length;
  const freeShipThreshold = 100;
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subtotal);
  const freeShipPercent = Math.min(100, Math.round((subtotal / freeShipThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between text-[#1d1d1f]">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] border border-gray-200 flex items-center justify-center text-[#1d1d1f]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1d1d1f]">Túi Mua Hàng Của Bạn</h2>
                <p className="text-xs text-[#6e6e73]">
                  {selectedItemIds.length}/{items.length} sản phẩm được chọn
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-[#f5f5f7] border-b border-gray-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#1d1d1f] font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#0071e3]" />
                  {remainingForFreeShip > 0 ? (
                    <span>
                      Mua thêm <strong className="text-[#1d1d1f] font-mono">${remainingForFreeShip.toFixed(2)}</strong> để được FreeShip
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      Đủ điều kiện Miễn Phí Vận Chuyển toàn quốc!
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-[#6e6e73] font-semibold">{freeShipPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0071e3] rounded-full transition-all duration-500"
                  style={{ width: `${freeShipPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Select All Toggle Bar */}
          {items.length > 0 && (
            <div className="px-5 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between text-xs">
              <button
                onClick={() => (allSelected ? unselectAllItems() : selectAllItems())}
                className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors"
              >
                {allSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#0071e3]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span>Chọn tất cả ({items.length})</span>
              </button>

              <button
                onClick={clearCart}
                className="text-[#86868b] hover:text-rose-600 text-[11px] transition-colors"
              >
                Xóa toàn bộ
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f5f5f7]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-[#6e6e73]">
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-[#1d1d1f]">Túi mua hàng đang trống</p>
                <p className="text-xs text-[#86868b] max-w-xs">
                  Khám phá các sản phẩm Apple chính hãng và thêm vào túi để mua sắm.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isSelected = selectedItemIds.includes(item.productId);
                return (
                  <div
                    key={item.productId}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white border-gray-200 shadow-sm'
                        : 'bg-white/60 border-gray-200/50 opacity-60'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelectItem(item.productId)}
                      className="mt-2 text-gray-400 hover:text-[#0071e3]"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0071e3]" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-[#f5f5f7] overflow-hidden flex-shrink-0 p-1 flex items-center justify-center border border-gray-200/60">
                      <img
                        src={
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
                        }
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-semibold text-[#1d1d1f] truncate">{item.name}</h4>
                      {item.variant && (
                        <p className="text-[10px] text-[#6e6e73]">Phân loại: {item.variant}</p>
                      )}
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-xs font-bold text-[#1d1d1f] font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[10px] text-[#86868b] line-through font-mono">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 bg-[#f5f5f7] border border-gray-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:text-[#1d1d1f] text-gray-500 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-semibold text-[#1d1d1f]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:text-[#1d1d1f] text-gray-500 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Panel */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-gray-100 space-y-3.5 shadow-lg">
              {/* Voucher Input */}
              <div className="space-y-1.5">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã ưu đãi (APPLEVIP, TECHZONE)"
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>

                {couponMsg && (
                  <p
                    className={`text-[11px] ${
                      couponMsg.error ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-700">
                    <span>Đã áp dụng mã: <strong>{appliedCoupon}</strong> (-10%)</span>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-[#1d1d1f] text-[11px] underline"
                    >
                      Bỏ
                    </button>
                  </div>
                )}
              </div>

              {/* Reward Points Checkbox */}
              <div className="p-3 bg-[#f5f5f7] border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    className="rounded border-gray-300 text-[#0071e3] focus:ring-0"
                  />
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[#1d1d1f] font-medium">Dùng 1,000 TechPoints (-$10)</span>
                </label>
                <span className="font-mono text-[#86868b] text-[11px]">Số dư: 7,990 pts</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6e6e73] pt-1">
                <div className="flex justify-between">
                  <span>Tạm tính ({selectedItemIds.length} món):</span>
                  <span className="font-mono text-[#1d1d1f] font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Giảm giá voucher:</span>
                    <span className="font-mono font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Điểm thưởng:</span>
                    <span className="font-mono font-semibold">-${pointsDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono text-[#1d1d1f]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold">Miễn phí</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-[#1d1d1f]">
                  <span>Tổng thanh toán:</span>
                  <span className="text-base font-bold text-red-600 font-mono">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedItemIds.length === 0}
                className="w-full py-3.5 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
              >
                <span>Thanh Toán ({selectedItemIds.length}) • ${totalAmount.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#86868b] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bảo mật chuẩn Apple Pay &amp; PCI-DSS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
