import React from 'react';

interface ProductSpecsTabProps {
  product: any;
  currentPrice: number;
  originalPrice?: number;
  availableColors: string[];
  selectedColor: string;
  setSelectedColor: (val: string) => void;
  availableSizes: string[];
  selectedStorage: string;
  setSelectedStorage: (val: string) => void;
}

export const ProductSpecsTab: React.FC<ProductSpecsTabProps> = ({
  product,
  currentPrice,
  originalPrice,
  availableColors,
  selectedColor,
  setSelectedColor,
  availableSizes,
  selectedStorage,
  setSelectedStorage,
}) => {
  return (
    <div className="space-y-4 pt-4">
      {/* Price Box */}
      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-gray-200/80 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
          ${currentPrice.toFixed(2)}
        </span>
        {originalPrice && (
          <>
            <span className="text-sm text-[#86868b] line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              TIẾT KIỆM 50%
            </span>
          </>
        )}
      </div>

      <p className="text-xs text-[#6e6e73] leading-relaxed">
        {product.description ||
          'Trải nghiệm đẳng cấp công nghệ đỉnh cao với thiết kế hoàn mỹ, hiệu năng vượt trội và chế độ hậu mãi chuẩn Apple Authorized Store.'}
      </p>

      {/* Variant Selector: Color */}
      {availableColors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1d1d1f] block">
            Màu sắc: <span className="text-[#6e6e73] font-normal">{selectedColor}</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  selectedColor === color
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-sm'
                    : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variant Selector: Size / Storage */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1d1d1f] block">
            {product?.categoryType?.includes('Thời Trang') ? 'Kích cỡ (Size):' : 'Dung lượng bộ nhớ:'}{' '}
            <span className="text-[#6e6e73] font-normal">{selectedStorage}</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {availableSizes.map((storage) => (
              <button
                key={storage}
                type="button"
                onClick={() => setSelectedStorage(storage)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  selectedStorage === storage
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-sm'
                    : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Specifications & Attributes Table */}
      {product?.attributes && product.attributes.length > 0 && (
        <div className="p-3.5 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-2 mt-2">
          <span className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-wider block">
            Thông Số &amp; Thuộc Tính Chính Hãng
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {product.attributes.map((attr: any) => (
              <div key={attr.name} className="p-2 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
                <span className="text-[#86868b] block text-[10px]">{attr.name}</span>
                <span className="font-semibold text-[#1d1d1f] line-clamp-1">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
