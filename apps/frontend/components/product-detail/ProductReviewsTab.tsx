import React from 'react';
import { Star, UserCheck } from 'lucide-react';
import { ReviewsData, NewReviewFormState } from './types';

interface ProductReviewsTabProps {
  reviewsData: ReviewsData;
  newReview: NewReviewFormState;
  setNewReview: React.Dispatch<React.SetStateAction<NewReviewFormState>>;
  isSubmittingReview: boolean;
  onSubmitReview: (e: React.FormEvent) => void;
}

export const ProductReviewsTab: React.FC<ProductReviewsTabProps> = ({
  reviewsData,
  newReview,
  setNewReview,
  isSubmittingReview,
  onSubmitReview,
}) => {
  return (
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
        onSubmit={onSubmitReview}
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
  );
};
