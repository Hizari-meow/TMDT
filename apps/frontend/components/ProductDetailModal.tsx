'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag,
  Check,
  Heart,
  Share2,
  MessageSquare,
  ThumbsUp,
  UserCheck,
  CreditCard,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onBuyNowFlashSale?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onBuyNowFlashSale,
}) => {
  const { addItem, setIsCheckoutOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  const availableColors = React.useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      const colors = product.variants.map((v: any) => v.color).filter(Boolean);
      const unique = Array.from(new Set(colors)) as string[];
      if (unique.length > 0) return unique;
    }
    return product?.categoryType?.includes('Thời Trang') ? ['Đỏ', 'Xanh', 'Đen'] : ['Titan Tự Nhiên', 'Titan Sa Mạc', 'Titan Đen'];
  }, [product]);

  const availableSizes = React.useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      const sizes = product.variants.map((v: any) => v.size).filter(Boolean);
      const unique = Array.from(new Set(sizes)) as string[];
      if (unique.length > 0) return unique;
    }
    return product?.categoryType?.includes('Thời Trang') ? ['S', 'M', 'L', 'XL'] : ['256GB', '512GB', '1TB'];
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || 'Titan Tự Nhiên');
  const [selectedStorage, setSelectedStorage] = useState(availableSizes[0] || '256GB');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);

  useEffect(() => {
    if (availableColors.length > 0) setSelectedColor(availableColors[0]);
    if (availableSizes.length > 0) setSelectedStorage(availableSizes[0]);
  }, [product?.id, availableColors, availableSizes]);

  // Reviews state
  const [reviewsData, setReviewsData] = useState<{
    averageRating: number;
    totalCount: number;
    reviews: any[];
  }>({ averageRating: 5.0, totalCount: 0, reviews: [] });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    authorName: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (product?.id && isOpen) {
      fetch(`http://localhost:3001/api/v1/reviews/product/${product.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.reviews) {
            setReviewsData(data);
          }
        })
        .catch(() => {});
    }
  }, [product?.id, isOpen]);

  if (!isOpen || !product) return null;

  const hasFlashSale = product.flashSales && product.flashSales.length > 0;
  const flashSale = hasFlashSale ? product.flashSales[0] : null;
  const currentPrice = hasFlashSale ? Number(flashSale.flashPrice) : Number(product.price);
  const originalPrice = hasFlashSale ? Number(product.price) : undefined;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name} (${selectedColor}, ${selectedStorage})`,
      price: currentPrice,
      originalPrice,
      quantity,
      imageUrl: product.imageUrl,
      categoryName: product.category?.name || 'Công nghệ',
      variant: `${selectedColor} • ${selectedStorage}`,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleToggleHeart = () => {
    const added = toggleWishlist({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      imageUrl: product.imageUrl,
      categoryName: product.category?.name,
    });
    setWishlistToast(added ? 'Đã thêm vào danh sách yêu thích ❤️' : 'Đã xóa khỏi yêu thích');
    setTimeout(() => setWishlistToast(null), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.authorName || !newReview.comment) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: newReview.authorName,
          rating: newReview.rating,
          comment: newReview.comment,
          variant: `${selectedColor} / ${selectedStorage}`,
        }),
      });
      if (res.ok) {
        // Refetch reviews
        const updated = await fetch(`http://localhost:3001/api/v1/reviews/product/${product.id}`).then((r) => r.json());
        setReviewsData(updated);
        setNewReview({ authorName: '', rating: 5, comment: '' });
      }
    } catch {
      // ignore
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white border border-gray-200/80 rounded-3xl shadow-2xl overflow-hidden my-8 z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        {/* Left: Product Image Showcase */}
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
              onClick={handleToggleHeart}
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

        {/* Right: Product Details & Reviews Tabs */}
        <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-gray-100 text-[#6e6e73] border border-gray-200 font-semibold tracking-wider">
                  {product.category?.name || 'Electronics'}
                </span>
                <h2 className="text-xl font-bold text-[#1d1d1f] mt-1.5 leading-snug">
                  {product.name}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Buttons: Specs vs Reviews */}
            <div className="flex items-center gap-2 border-b border-gray-100 pt-4 pb-2.5 text-xs">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                  activeTab === 'details'
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Chi Tiết &amp; Đặt Mua
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Đánh Giá ({reviewsData.totalCount})</span>
              </button>
            </div>

            {/* TAB CONTENT: DETAILS */}
            {activeTab === 'details' && (
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
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 pt-3 max-h-[360px] overflow-y-auto pr-1">
                {/* Score summary */}
                <div className="p-3.5 bg-[#f5f5f7] rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-bold text-[#1d1d1f]">{reviewsData.averageRating}</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-[#6e6e73]">
                    {reviewsData.totalCount} đánh giá đã xác thực
                  </span>
                </div>

                {/* Review items */}
                <div className="space-y-2.5">
                  {reviewsData.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#1d1d1f]">{rev.authorName}</span>
                          {rev.verifiedPurchase && (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-semibold rounded-full flex items-center gap-0.5 border border-emerald-200">
                              <UserCheck className="w-3 h-3" />
                              Đã mua hàng
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#1d1d1f] leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#86868b] pt-1">
                        <span>{rev.variant || 'Tiêu chuẩn'}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leave Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="p-3.5 bg-[#f5f5f7] border border-gray-200 rounded-2xl space-y-2.5 mt-4"
                >
                  <p className="text-xs font-semibold text-[#1d1d1f]">Gửi Đánh Giá Của Bạn</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên của bạn"
                      value={newReview.authorName}
                      onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3]"
                    />
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 sao - Tuyệt vời)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 sao - Rất tốt)</option>
                      <option value={3}>⭐⭐⭐ (3 sao - Bình thường)</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Cảm nhận của bạn về sản phẩm, chất lượng đóng gói..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs rounded-full transition-colors shadow-sm"
                  >
                    {isSubmittingReview ? 'Đang gửi...' : 'Đăng Đánh Giá'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Action CTAs */}
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
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-full bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-[#1d1d1f] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 text-[#1d1d1f]" />
                <span>Thêm vào giỏ</span>
              </button>

              {hasFlashSale && onBuyNowFlashSale ? (
                <button
                  onClick={() => {
                    onClose();
                    onBuyNowFlashSale();
                  }}
                  className="py-3 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Mua Flash Deal ($499)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleAddToCart();
                    onClose();
                    setIsCheckoutOpen(true);
                  }}
                  className="py-3 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Mua ngay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
