'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { ShoppingBag, Loader2, ShieldCheck, Clock } from 'lucide-react';

interface BuyButtonProps {
  onBuy: () => void;
  isSubmitting: boolean;
  isThrottled: boolean;
  isSoldOut: boolean;
  price: number;
}

export const BuyButton: React.FC<BuyButtonProps> = ({
  onBuy,
  isSubmitting,
  isThrottled,
  isSoldOut,
  price,
}) => {
  const isDisabled = isSoldOut || isSubmitting || isThrottled;

  return (
    <div className="w-full space-y-2">
      <button
        onClick={onBuy}
        disabled={isDisabled}
        className={cn(
          'w-full py-4 px-6 rounded-full font-medium text-sm tracking-normal transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.99]',
          isSoldOut
            ? 'bg-[#1c1c1e] text-zinc-500 cursor-not-allowed border border-white/10'
            : isDisabled
            ? 'bg-[#0071e3]/60 text-white/80 cursor-wait'
            : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm',
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Đang giữ chỗ tồn kho siêu tốc...</span>
          </>
        ) : isThrottled ? (
          <>
            <Clock className="w-4 h-4 text-white animate-spin" />
            <span>Đang xử lý yêu cầu...</span>
          </>
        ) : isSoldOut ? (
          <>
            <ShoppingBag className="w-4 h-4 text-zinc-500" />
            <span>Đợt mở bán đã hết hàng</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Đặt Mua Siêu Tốc • ${price.toFixed(2)}</span>
          </>
        )}
      </button>

      {/* Security defense assurance */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#86868b] font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
        <span>Giao dịch bảo mật bằng Action Token 30s &amp; Khóa phân tán Redis</span>
      </div>
    </div>
  );
};
