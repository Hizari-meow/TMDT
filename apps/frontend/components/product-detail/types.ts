export interface ProductDetailModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onBuyNowFlashSale?: () => void;
}

export interface ReviewItem {
  id: string | number;
  authorName: string;
  rating: number;
  comment: string;
  variant?: string;
  createdAt: string | Date;
  verifiedPurchase?: boolean;
}

export interface ReviewsData {
  averageRating: number;
  totalCount: number;
  reviews: ReviewItem[];
}

export interface NewReviewFormState {
  authorName: string;
  rating: number;
  comment: string;
}
