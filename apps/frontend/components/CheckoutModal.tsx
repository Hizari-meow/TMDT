'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { apiClient } from '../lib/api-client';
import { useRouter } from 'next/navigation';
import {
  X,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Building,
  Clock,
  Printer,
  ChevronDown,
  Sparkles,
  MapPin,
} from 'lucide-react';

const DEFAULT_USER_ID =
  process.env.NEXT_PUBLIC_DEFAULT_USER_ID || '33333333-3333-3333-3333-333333333333';

const PRESET_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Nhà riêng (Mặc định)',
    fullName: 'Flash Sale Demo Buyer',
    phone: '0988 123 456',
    address: 'Số 128 Trần Hưng Đạo, Phường Phạm Ngũ Lão',
    city: 'TP. Hồ Chí Minh',
  },
  {
    id: 'addr-2',
    label: 'Văn phòng làm việc',
    fullName: 'Flash Sale Demo Buyer',
    phone: '0988 123 456',
    address: 'Tầng 18, Toà nhà Bitexco Financial Tower, Phường Bến Nghé',
    city: 'TP. Hồ Chí Minh',
  },
];

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    items,
    selectedItemIds,
    totalAmount,
    removeItem,
    shippingFee,
    discount,
    pointsDiscount,
  } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [fullName, setFullName] = useState(PRESET_ADDRESSES[0].fullName);
  const [phone, setPhone] = useState(PRESET_ADDRESSES[0].phone);
  const [address, setAddress] = useState(PRESET_ADDRESSES[0].address);
  const [city, setCity] = useState(PRESET_ADDRESSES[0].city);

  const [carrier, setCarrier] = useState<'GHN' | 'GHTK' | 'AHAMOVE'>('AHAMOVE');
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY_QR' | 'CREDIT_CARD' | 'COD'>('VNPAY_QR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const handleClose = () => {
    if (!isSubmitting) {
      setIsCheckoutOpen(false);
      setPlacedOrder(null);
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    if (!isCheckoutOpen) {
      setPlacedOrder(null);
      setErrorMessage(null);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleSelectPresetAddress = (id: string) => {
    setSelectedAddressId(id);
    const found = PRESET_ADDRESSES.find((a) => a.id === id);
    if (found) {
      setFullName(found.fullName);
      setPhone(found.phone);
      setAddress(found.address);
      setCity(found.city);
    }
  };

  const checkoutItems = items.filter((i) => selectedItemIds.includes(i.productId));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        userId: DEFAULT_USER_ID,
        items: checkoutItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
        },
        paymentMethod,
        carrier,
      };

      const result = await apiClient.checkoutStandardOrder(orderPayload);
      // Remove only the items that were purchased so other cart items remain intact
      checkoutItems.forEach((item) => removeItem(item.productId));
      setPlacedOrder(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại tồn kho.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8 z-10 flex flex-col max-h-[90vh] text-[#1d1d1f]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0071e3] flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f]">Thanh Toán &amp; Đặt Hàng</h2>
              <p className="text-xs text-[#6e6e73]">Giao dịch mã hóa chuẩn Apple Pay &amp; PCI-DSS</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {placedOrder ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-md font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ĐẶT HÀNG THÀNH CÔNG
              </span>
              <h3 className="text-xl font-bold text-[#1d1d1f]">Cảm ơn bạn đã mua hàng tại TechZone!</h3>
              <p className="text-xs text-[#6e6e73] max-w-md mx-auto">
                Hệ thống đã tự động bảo lưu tồn kho trong PostgreSQL 16 và gửi thông báo xác nhận đến email{' '}
                <strong className="text-[#1d1d1f]">buyer@flashsale.com</strong>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-5 bg-[#f5f5f7] border border-gray-200 rounded-2xl text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/80 font-mono">
                <span className="text-[#6e6e73]">Mã đơn hàng:</span>
                <span className="font-bold text-[#1d1d1f] text-[11px]">{placedOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-[#6e6e73]">Mã vận đơn (Tracking ID):</span>
                <span className="font-bold text-[#0071e3] text-[11px]">{placedOrder.trackingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6e6e73]">Địa chỉ giao:</span>
                <span className="font-medium text-[#1d1d1f]">{address}, {city}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6e6e73]">Dự kiến nhận hàng:</span>
                <span className="font-bold text-emerald-600">
                  {carrier === 'AHAMOVE' ? 'Trong 2 giờ (Hỏa Tốc)' : 'Ngày mai (Giao nhanh)'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200/80 font-bold text-sm">
                <span className="text-[#1d1d1f]">Tổng thanh toán:</span>
                <span className="font-mono text-red-600 font-bold">${placedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-xs font-semibold text-[#1d1d1f] flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>In Hóa Đơn Điện Tử</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  router.push('/orders');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Xem Tiến Trình Đơn Hàng</span>
                <Clock className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* FORM BODY */
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Address Selection Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0071e3]" />
                  <span>1. Địa chỉ nhận hàng</span>
                </h3>
              </div>

              {/* Preset Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {PRESET_ADDRESSES.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectPresetAddress(addr.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                        : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-[#1d1d1f] text-[11px]">{addr.label}</p>
                    <p className="text-[10px] text-[#6e6e73] truncate mt-0.5">{addr.address}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Họ và tên người nhận</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Tỉnh / Thành phố</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] outline-none focus:border-[#0071e3]"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Thời gian nhận hàng</label>
                  <div className="px-3.5 py-2 rounded-xl bg-[#f5f5f7] border border-gray-200 text-xs text-[#1d1d1f] font-medium">
                    Tất cả các ngày trong tuần
                  </div>
                </div>
              </div>
            </div>

            {/* Carrier Selection */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0071e3]" />
                <span>2. Đơn vị vận chuyển đối tác</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setCarrier('AHAMOVE')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    carrier === 'AHAMOVE'
                      ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                      : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#0071e3]">
                      HỎA TỐC 2H
                    </span>
                    {carrier === 'AHAMOVE' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-2">AhaMove / GrabExpress</p>
                  <p className="text-[10px] text-[#6e6e73]">Giao ngay trong 2 giờ</p>
                </div>

                <div
                  onClick={() => setCarrier('GHN')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    carrier === 'GHN'
                      ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                      : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-[#1d1d1f]">
                      TIÊU CHUẨN
                    </span>
                    {carrier === 'GHN' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-2">Giao Hàng Nhanh (GHN)</p>
                  <p className="text-[10px] text-[#6e6e73]">Giao trong 24h - 48h</p>
                </div>

                <div
                  onClick={() => setCarrier('GHTK')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    carrier === 'GHTK'
                      ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                      : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-[#1d1d1f]">
                      TIẾT KIỆM
                    </span>
                    {carrier === 'GHTK' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-2">GHTK Express</p>
                  <p className="text-[10px] text-[#6e6e73]">Giao tiết kiệm 2 - 3 ngày</p>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0071e3]" />
                <span>3. Phương thức thanh toán</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setPaymentMethod('VNPAY_QR')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'VNPAY_QR'
                      ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                      : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-5 h-5 text-[#0071e3]" />
                    {paymentMethod === 'VNPAY_QR' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-2">VietQR / VNPay QR</p>
                  <p className="text-[10px] text-[#6e6e73]">Quét mã app ngân hàng</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                      : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-[#0071e3]" />
                    {paymentMethod === 'CREDIT_CARD' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-2">Thẻ Quốc Tế</p>
                  <p className="text-[10px] text-[#6e6e73]">Visa, Master, JCB, Apple Pay</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                      : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building className="w-5 h-5 text-[#0071e3]" />
                    {paymentMethod === 'COD' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
                  </div>
                  <p className="text-xs font-semibold text-[#1d1d1f] mt-2">Thanh toán COD</p>
                  <p className="text-[10px] text-[#6e6e73]">Tiền mặt khi nhận máy</p>
                </div>
              </div>

              {/* VietQR Dynamic Code Preview */}
              {paymentMethod === 'VNPAY_QR' && (
                <div className="p-4 bg-[#f5f5f7] border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TECHZONE_PAY_${totalAmount}_${Date.now()}`}
                      alt="VietQR Payment Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 text-xs text-[#6e6e73]">
                    <p className="font-bold text-[#1d1d1f]">Quét mã VietQR chuyển khoản tức thì</p>
                    <p className="text-[11px]">Ngân hàng: <strong className="text-[#1d1d1f]">Vietcombank (VCB)</strong></p>
                    <p className="text-[11px]">Số tài khoản: <strong className="text-[#1d1d1f] font-mono">1029 8888 6868</strong></p>
                    <p className="text-[11px]">Số tiền: <strong className="text-red-600 font-mono font-bold">${totalAmount.toFixed(2)}</strong></p>
                    <p className="text-[10px] text-[#86868b]">Đơn hàng tự động xác nhận ngay khi nhận được biến động số dư.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Review */}
            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
              <h4 className="font-bold text-[#1d1d1f]">Sản phẩm trong đơn hàng ({checkoutItems.length})</h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center text-[#6e6e73]">
                    <span className="truncate max-w-[280px]">
                      {item.name} <strong className="text-[#1d1d1f]">x{item.quantity}</strong>
                    </span>
                    <span className="font-mono text-[#1d1d1f] font-semibold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary & Submit */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="space-y-1 text-xs text-[#6e6e73]">
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Giảm giá Voucher:</span>
                    <span className="font-mono font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Điểm thưởng TechZone Xu:</span>
                    <span className="font-mono font-semibold">-${pointsDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#1d1d1f]">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-lg font-bold text-red-600 font-mono">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || checkoutItems.length === 0}
                className="w-full py-3.5 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white font-semibold text-sm rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Xác Nhận &amp; Đặt Hàng (${totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
