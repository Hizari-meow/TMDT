'use client';

import React, { useState } from 'react';
import { StockLiveBadge } from './StockLiveBadge';
import { FlashSaleCountdown } from './FlashSaleCountdown';
import { BuyButton } from './BuyButton';
import { QueueStatusModal } from './QueueStatusModal';
import { useFlashSaleCheckout } from '../hooks/useFlashSaleCheckout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Shield,
  Cpu,
  Camera,
  BatteryCharging,
  ShoppingBag,
  Star,
  Check,
  Heart,
} from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    flashSalePrice: number;
    stock: number;
    flashSaleId: string;
    imageUrl?: string;
  };
  userId: string;
  onRefreshStock?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userId,
  onRefreshStock,
}) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState('Titan Tự Nhiên');
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    const added = toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.flashSalePrice,
      imageUrl: product.imageUrl,
      categoryName: 'Smartphones',
    });
    setWishlistToast(added ? 'Đã lưu vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích');
    setTimeout(() => setWishlistToast(null), 2000);
  };

  const {
    triggerCheckout,
    isSubmitting,
    isThrottled,
    trackingId,
    error,
    isModalOpen,
    closeModal,
  } = useFlashSaleCheckout(product.flashSaleId, product.id, userId);

  const discountPercentage = Math.round(
    ((product.price - product.flashSalePrice) / product.price) * 100,
  );

  const initialStock = 100;
  const soldCount = Math.max(0, initialStock - product.stock);
  const soldPercent = Math.min(100, Math.round((soldCount / initialStock) * 100));

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name} (${selectedColor})`,
      price: product.flashSalePrice,
      originalPrice: product.price,
      quantity: 1,
      imageUrl:
        product.imageUrl ||
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      categoryName: 'Smartphones',
      variant: selectedColor,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold uppercase tracking-wider">
            ⚡ SIÊU ƯU ĐÃI GIỜ VÀNG
          </div>
          <StockLiveBadge stock={product.stock} />
        </div>
        <FlashSaleCountdown />
      </div>

      {/* Main Grid: Visuals & Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-center">
        {/* Left: Product Hero Display (Col 5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full aspect-[4/5] max-w-[340px] rounded-3xl bg-[#f5f5f7] border border-gray-200/80 p-6 flex flex-col items-center justify-center shadow-inner group overflow-hidden">
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-red-600 text-white font-bold text-xs rounded-full shadow-sm">
              Giảm {discountPercentage}%
            </div>

            {/* Favorite Heart Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-sm transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-500 border border-rose-200'
                  : 'bg-white text-gray-400 hover:text-rose-500 border border-gray-200'
              }`}
              title={isFavorited ? 'Bỏ lưu yêu thích' : 'Lưu vào danh sách yêu thích'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Product Image */}
            <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img
                src={
                  product.imageUrl ||
                  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
                }
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]"
              />
            </div>
          </div>
        </div>

        {/* Right: Specifications & CTA (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div>
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="font-semibold text-[#0071e3] uppercase tracking-wider text-[11px]">
                Apple Authorised Reseller
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-[#1d1d1f]">4.9/5</span>
                <span className="text-[#86868b]">(1.4k đánh giá)</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight leading-tight">
              {product.name}
            </h2>
            <p className="text-[#6e6e73] text-xs mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#f5f5f7] border border-gray-200/80 rounded-2xl flex items-baseline gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-[#6e6e73]">Giá giờ vàng:</span>
              <span className="text-3xl font-bold text-red-600 tracking-tight font-mono">
                ${product.flashSalePrice.toFixed(2)}
              </span>
            </div>
            <span className="text-sm text-[#86868b] line-through font-mono">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-auto text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Tiết kiệm ${(product.price - product.flashSalePrice).toFixed(0)}
            </span>
          </div>

          {/* Stock Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#6e6e73]">Số lượng ưu đãi có hạn</span>
              <span className="text-[#1d1d1f] font-mono font-semibold">
                {product.stock > 0 ? `Còn ${product.stock} suất` : 'Tạm hết hàng'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0071e3] transition-all duration-500"
                style={{ width: `${Math.max(8, 100 - (product.stock / initialStock) * 100)}%` }}
              />
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <span className="text-xs text-[#6e6e73] font-medium">
              Màu sắc: <strong className="text-[#1d1d1f]">{selectedColor}</strong>
            </span>
            <div className="flex items-center gap-2">
              {['Titan Tự Nhiên', 'Titan Sa Mạc', 'Titan Đen'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedColor === color
                      ? 'bg-[#1d1d1f] text-white shadow-sm'
                      : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-gray-200/60 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
              <span className="text-[#1d1d1f] font-medium">Chip Apple A18 Pro 3nm</span>
            </div>
            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-gray-200/60 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
              <span className="text-[#1d1d1f] font-medium">Camera 48MP Fusion</span>
            </div>
            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-gray-200/60 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
              <span className="text-[#1d1d1f] font-medium">Khung viền Titan Cấp 5</span>
            </div>
            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-gray-200/60 flex items-center gap-2">
              <BatteryCharging className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
              <span className="text-[#1d1d1f] font-medium">Pin đến 27 giờ phát video</span>
            </div>
          </div>

          {/* Checkout CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <BuyButton
                onBuy={() => triggerCheckout(1)}
                isSubmitting={isSubmitting}
                isThrottled={isThrottled}
                isSoldOut={product.stock <= 0}
                price={product.flashSalePrice}
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="px-6 py-4 rounded-full bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-[#1d1d1f] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 text-[#1d1d1f]" />
              <span>Thêm vào giỏ</span>
            </button>
          </div>

          {addedToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Đã thêm {product.name} ({selectedColor}) vào giỏ hàng!</span>
            </div>
          )}

          {wishlistToast && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span>{wishlistToast}</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time SSE Queue Progress Modal */}
      <QueueStatusModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trackingId={trackingId}
        errorMessage={error}
        onSuccessPay={onRefreshStock}
      />
    </div>
  );
};
