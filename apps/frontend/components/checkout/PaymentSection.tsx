import React from 'react';
import { CreditCard, QrCode, CheckCircle2, Building } from 'lucide-react';
import { PaymentMethodType } from './types';

interface PaymentSectionProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (val: PaymentMethodType) => void;
  totalAmount: number;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  totalAmount,
}) => {
  return (
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
            <p className="text-[11px]">
              Ngân hàng: <strong className="text-[#1d1d1f]">Vietcombank (VCB)</strong>
            </p>
            <p className="text-[11px]">
              Số tài khoản: <strong className="text-[#1d1d1f] font-mono">1029 8888 6868</strong>
            </p>
            <p className="text-[11px]">
              Số tiền: <strong className="text-red-600 font-mono font-bold">${totalAmount.toFixed(2)}</strong>
            </p>
            <p className="text-[10px] text-[#86868b]">
              Đơn hàng tự động xác nhận ngay khi nhận được biến động số dư.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
