'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, Star } from 'lucide-react';
import {
  ProductDetailModalProps,
  ReviewsData,
  NewReviewFormState,
} from './product-detail/types';
import { ProductImageShowcase } from './product-detail/ProductImageShowcase';
import { ProductSpecsTab } from './product-detail/ProductSpecsTab';
import { ProductReviewsTab } from './product-detail/ProductReviewsTab';
import { ProductDetailActions } from './product-detail/ProductDetailActions';

export type { ProductDetailModalProps };

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
    return product?.categoryType?.includes('Thời Trang')
      ? ['Đỏ', 'Xanh', 'Đen']
      : ['Titan Tự Nhiên', 'Titan Sa Mạc', 'Titan Đen'];
  }, [product]);

  const availableSizes = React.useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      const sizes = product.variants.map((v: any) => v.size).filter(Boolean);
      const unique = Array.from(new Set(sizes)) as string[];
      if (unique.length > 0) return unique;
    }
    return product?.categoryType?.includes('Thời Trang')
      ? ['S', 'M', 'L', 'XL']
      : ['256GB', '512GB', '1TB'];
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || 'Titan Tự Nhiên');
  const [selectedStorage, setSelectedStorage] = useState(availableSizes[0] || '256GB');
  const [quantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);

  useEffect(() => {
    if (availableColors.length > 0) setSelectedColor(availableColors[0]);
    if (availableSizes.length > 0) setSelectedStorage(availableSizes[0]);
  }, [product?.id, availableColors, availableSizes]);

  // Reviews state
  const [reviewsData, setReviewsData] = useState<ReviewsData>({
    averageRating: 5.0,
    totalCount: 0,
    reviews: [],
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState<NewReviewFormState>({
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
        <ProductImageShowcase
          product={product}
          hasFlashSale={hasFlashSale}
          isFavorited={isFavorited}
          onToggleHeart={handleToggleHeart}
        />

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
              <ProductSpecsTab
                product={product}
                currentPrice={currentPrice}
                originalPrice={originalPrice}
                availableColors={availableColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                availableSizes={availableSizes}
                selectedStorage={selectedStorage}
                setSelectedStorage={setSelectedStorage}
              />
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === 'reviews' && (
              <ProductReviewsTab
                reviewsData={reviewsData}
                newReview={newReview}
                setNewReview={setNewReview}
                isSubmittingReview={isSubmittingReview}
                onSubmitReview={handleSubmitReview}
              />
            )}
          </div>

          {/* Action CTAs */}
          <ProductDetailActions
            addedToast={addedToast}
            wishlistToast={wishlistToast}
            hasFlashSale={hasFlashSale}
            onBuyNowFlashSale={onBuyNowFlashSale ? () => {
              onClose();
              onBuyNowFlashSale();
            } : undefined}
            onAddToCart={handleAddToCart}
            onBuyNowStandard={() => {
              handleAddToCart();
              onClose();
              setIsCheckoutOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};
