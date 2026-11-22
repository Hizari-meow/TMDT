import React from 'react';
import {
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ProductImageShowcaseProps {
  product: any;
  hasFlashSale: boolean;
  isFavorited: boolean;
  onToggleHeart: () => void;
}

export const ProductImageShowcase: React.FC<ProductImageShowcaseProps> = ({
  product,
  hasFlashSale,
  isFavorited,
  onToggleHeart,
}) => {
  return (
    <div className="relative bg-[#f5f5f7] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden">
      <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-md flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ShoppingBag className="w-16 h-16 text-gray-400" />
        )}

        {hasFlashSale && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-sm">
            <Zap className="w-3 h-3 fill-white text-white" />
            <span>ƯU ĐÃI GIỜ VÀNG</span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={onToggleHeart}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 border border-rose-200'
              : 'bg-white text-gray-400 hover:text-rose-500 border border-gray-200'
          }`}
          title={isFavorited ? 'Bỏ lưu yêu thích' : 'Lưu vào danh sách yêu thích'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Quick Assurance Badges */}
      <div className="w-full grid grid-cols-3 gap-2 mt-6">
        <div className="p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-sm text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <p className="text-[10px] text-[#1d1d1f] font-semibold">100% Chính Hãng</p>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-sm text-center">
          <Truck className="w-4 h-4 text-[#0071e3] mx-auto mb-1" />
          <p className="text-[10px] text-[#1d1d1f] font-semibold">Giao hàng 2H</p>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-sm text-center">
          <RotateCcw className="w-4 h-4 text-gray-500 mx-auto mb-1" />
          <p className="text-[10px] text-[#1d1d1f] font-semibold">Đổi trả 30 ngày</p>
        </div>
      </div>
    </div>
  );
};
