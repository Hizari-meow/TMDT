import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface CheckoutItem {
  productId: string;
  name: string;
  quantity: number;
  price: string | number;
}

interface OrderSummarySectionProps {
  checkoutItems: CheckoutItem[];
  discount: number;
  pointsDiscount: number;
  totalAmount: number;
  isSubmitting: boolean;
}

export const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  checkoutItems,
  discount,
  pointsDiscount,
  totalAmount,
  isSubmitting,
}) => {
  return (
    <>
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
    </>
  );
};
