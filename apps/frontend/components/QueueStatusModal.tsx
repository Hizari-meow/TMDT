'use client';

import React, { useEffect, useState } from 'react';
import { useOrderStatusSSE } from '../hooks/useOrderStatusSSE';
import { apiClient } from '../lib/api-client';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldCheck,
  CreditCard,
  Loader2,
  Radio,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

interface QueueStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingId: string | null;
  errorMessage?: string | null;
  onSuccessPay?: () => void;
}

export const QueueStatusModal: React.FC<QueueStatusModalProps> = ({
  isOpen,
  onClose,
  trackingId,
  errorMessage,
  onSuccessPay,
}) => {
  const { status, details, isLive } = useOrderStatusSSE(trackingId);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState<string | null>(null);

  // Trigger celebratory confetti upon PAID
  useEffect(() => {
    if (status === 'PAID') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [status]);

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    if (!details?.orderId) return;
    setIsPaying(true);
    setPaymentMsg(null);
    try {
      const res = await apiClient.mockPayOrder(details.orderId, 499.0);
      setPaymentMsg('Payment settlement confirmed via HMAC webhook!');
      if (onSuccessPay) {
        onSuccessPay();
      }
    } catch (err: any) {
      setPaymentMsg('Payment failed: ' + err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const getStepProgress = () => {
    switch (status) {
      case 'INITIALIZING':
      case 'RESERVED':
        return 1;
      case 'PENDING_PAYMENT':
        return 2;
      case 'PAID':
        return 3;
      case 'CANCELLED':
      case 'FAILED':
      case 'SOLD_OUT':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = getStepProgress();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-[#1d1d1f]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-2.5 bg-[#0071e3] rounded-2xl text-white shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Tiến Trình Đơn Hàng Real-time</h3>
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mt-0.5">
              <span className={cn('w-2 h-2 rounded-full', isLive ? 'bg-emerald-500' : 'bg-gray-400')} />
              <span>{isLive ? 'Kết nối trực tiếp SSE' : 'Đang đồng bộ trạng thái'}</span>
            </div>
          </div>
        </div>

        {/* Error / Sold Out Banner */}
        {errorMessage && (
          <div className="p-4 mb-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Thông báo đơn hàng</p>
              <p className="text-xs text-rose-600 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Step Progress Tracker */}
        {currentStep > 0 && (
          <div className="relative flex items-center justify-between mb-8 px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />
            <div
              className="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#0071e3] transition-all duration-500 -z-0"
              style={{ width: `${((currentStep - 1) / 2) * 80}%` }}
            />

            {/* Step 1: In-Memory Reserved */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs border transition-all',
                  currentStep >= 1
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-sm'
                    : 'bg-[#f5f5f7] border-gray-300 text-[#86868b]',
                )}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-[11px] font-medium text-[#6e6e73]">Giữ tồn kho</span>
            </div>

            {/* Step 2: Database Persisted */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs border transition-all',
                  currentStep >= 2
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-sm'
                    : 'bg-[#f5f5f7] border-gray-300 text-[#86868b]',
                )}
              >
                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-[11px] font-medium text-[#6e6e73]">Tạo đơn hàng</span>
            </div>

            {/* Step 3: Payment Settled */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs border transition-all',
                  currentStep === 3
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-[#f5f5f7] border-gray-300 text-[#86868b]',
                )}
              >
                {currentStep === 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
              </div>
              <span className="text-[11px] font-medium text-[#6e6e73]">Thanh toán</span>
            </div>
          </div>
        )}

        {/* Detailed State Card */}
        <div className="bg-[#f5f5f7] border border-gray-200 rounded-2xl p-5 mb-6 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
            <span className="text-[#86868b] uppercase tracking-wider text-[11px]">Tracking ID</span>
            <span className="text-[#1d1d1f] font-semibold truncate max-w-[200px]">{trackingId || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
            <span className="text-[#86868b] uppercase tracking-wider text-[11px]">Trạng thái</span>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide text-[10px]',
                status === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : status === 'PENDING_PAYMENT'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : status === 'RESERVED'
                  ? 'bg-blue-100 text-[#0071e3] border border-blue-200'
                  : 'bg-gray-200 text-[#6e6e73]',
              )}
            >
              {status}
            </span>
          </div>

          {details?.orderId && (
            <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
              <span className="text-[#86868b] uppercase tracking-wider text-[11px]">Mã đơn hàng</span>
              <span className="text-[#1d1d1f] font-semibold truncate max-w-[200px]">{details.orderId}</span>
            </div>
          )}

          {details?.totalAmount && (
            <div className="flex justify-between items-center">
              <span className="text-[#86868b] uppercase tracking-wider text-[11px]">Tổng tiền</span>
              <span className="text-red-600 font-bold">${parseFloat(details.totalAmount as string).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Action Button Area */}
        <div className="space-y-3">
          {status === 'PENDING_PAYMENT' && (
            <button
              onClick={handleSimulatePayment}
              disabled={isPaying}
              className="w-full py-3 px-4 rounded-full font-semibold text-sm bg-[#0071e3] hover:bg-[#0077ed] text-white transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác nhận webhook HMAC...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Xác nhận thanh toán đơn hàng ($499)</span>
                </>
              )}
            </button>
          )}

          {status === 'PAID' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 text-sm font-semibold">
              🎉 Đơn hàng đã được thanh toán thành công!
            </div>
          )}

          {status === 'CANCELLED' && (
            <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl text-center text-[#6e6e73] text-sm">
              Đơn hàng đã hết hạn thanh toán và tự động hủy.
            </div>
          )}

          {paymentMsg && (
            <p className="text-center text-xs text-emerald-600 font-mono font-medium">{paymentMsg}</p>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-[#6e6e73] hover:text-[#1d1d1f] text-xs font-semibold hover:bg-gray-100 transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
