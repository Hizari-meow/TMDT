import React from 'react';
import { Check, Heart, ShoppingBag, Zap, CreditCard } from 'lucide-react';

interface ProductDetailActionsProps {
  addedToast: boolean;
  wishlistToast: string | null;
  hasFlashSale: boolean;
  onBuyNowFlashSale?: () => void;
  onAddToCart: () => void;
  onBuyNowStandard: () => void;
}

export const ProductDetailActions: React.FC<ProductDetailActionsProps> = ({
  addedToast,
  wishlistToast,
  hasFlashSale,
  onBuyNowFlashSale,
  onAddToCart,
  onBuyNowStandard,
}) => {
  return (
    <div className="pt-4 border-t border-gray-100 space-y-2.5 mt-4">
      {addedToast && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
        </div>
      )}

      {wishlistToast && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <Heart className="w-4 h-4 fill-rose-600" />
          <span>{wishlistToast}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onAddToCart}
          className="py-3 px-4 rounded-full bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-[#1d1d1f] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4 text-[#1d1d1f]" />
          <span>Thêm vào giỏ</span>
        </button>

        {hasFlashSale && onBuyNowFlashSale ? (
          <button
            onClick={onBuyNowFlashSale}
            className="py-3 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Mua Flash Deal ($499)</span>
          </button>
        ) : (
          <button
            onClick={onBuyNowStandard}
            className="py-3 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" />
            <span>Mua ngay</span>
          </button>
        )}
      </div>
    </div>
  );
};
