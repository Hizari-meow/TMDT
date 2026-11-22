'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { Navbar } from '../components/Navbar';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ProductCompareModal } from '../components/ProductCompareModal';
import { QueueStatusModal } from '../components/QueueStatusModal';
import { FlashSaleCountdown } from '../components/FlashSaleCountdown';
import { useFlashSaleCheckout } from '../hooks/useFlashSaleCheckout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Eye,
  Check,
  Heart,
  Scale,
  ArrowRight,
  Star,
  ShoppingBag,
  CreditCard,
  Zap,
  SlidersHorizontal,
  Filter,
  X,
  Flame,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

const DEFAULT_FLASH_SALE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_FLASH_SALE_ID || '11111111-1111-1111-1111-111111111111';
const DEFAULT_PRODUCT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID || '22222222-2222-2222-2222-222222222222';
const DEFAULT_USER_ID =
  process.env.NEXT_PUBLIC_DEFAULT_USER_ID || '33333333-3333-3333-3333-333333333333';

export default function StorefrontPage() {
  const queryClient = useQueryClient();
  const { addItem, setIsCheckoutOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Industry & Category Filtering
  const [selectedIndustry, setSelectedIndustry] = useState<'ALL' | 'ELECTRONICS' | 'FASHION'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'ALL' | 'UNDER_50' | '50_200' | '200_1000' | 'OVER_1000'>('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating'>('newest');

  // Dynamic Attribute Filters State: { "Chất liệu": ["Titanium", "Cotton 95%"], "Xuất xứ": ["Mỹ"] }
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [attributeIndustryTab, setAttributeIndustryTab] = useState<'ELECTRONICS' | 'FASHION'>('ELECTRONICS');
  const [openAttributeAccordions, setOpenAttributeAccordions] = useState<Record<string, boolean>>({
    'Dung Lượng Bộ Nhớ': true,
    'Dung Lượng RAM': true,
    'Kích Cỡ / Size': true,
    'Chất Liệu Vải/Vật Liệu': true,
  });

  // Modals state
  const [detailProduct, setDetailProduct] = useState<any | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareProducts, setCompareProducts] = useState<any[]>([]);
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('techzone_recently_viewed');
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const addToRecentlyViewed = (prod: any) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== prod.id);
      const updated = [prod, ...filtered].slice(0, 4);
      try {
        localStorage.setItem('techzone_recently_viewed', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 1. Live Flash Sale in-memory stock via SSE / polling
  const { data: stockData } = useQuery({
    queryKey: ['stock', DEFAULT_FLASH_SALE_ID],
    queryFn: () => apiClient.getStock(DEFAULT_FLASH_SALE_ID),
    refetchInterval: 2500,
  });

  // High Concurrency Flash Sale Hook for Flagship Flash Deal (iPhone 16 Pro)
  const {
    triggerCheckout: triggerFlashSaleCheckout,
    isSubmitting: isFlashSaleSubmitting,
    isThrottled: isFlashSaleThrottled,
    trackingId: flashSaleTrackingId,
    error: flashSaleError,
    isModalOpen: isFlashSaleModalOpen,
    closeModal: closeFlashSaleModal,
  } = useFlashSaleCheckout(DEFAULT_FLASH_SALE_ID, DEFAULT_PRODUCT_ID, DEFAULT_USER_ID);

  // 2. Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });

  // 3. Fetch Admin Dynamic Attributes Configuration (Synchronized Real-time)
  const { data: attributeGroups = [] } = useQuery({
    queryKey: ['active-attributes-filters'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/v1/admin/attributes');
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 4000,
  });

  // Filter Active Attributes Configured by Admin (Only attributes with isFilter === true)
  const activeAttributeGroups = useMemo(() => {
    let targetIndustry = selectedIndustry;
    if (selectedIndustry === 'ALL') {
      const selectedCatObj = categories.find((c: any) => c.id === selectedCategory);
      if (selectedCatObj?.slug?.includes('fashion') || selectedCatObj?.slug?.includes('sport')) {
        targetIndustry = 'FASHION';
      } else if (selectedCategory) {
        targetIndustry = 'ELECTRONICS';
      } else {
        targetIndustry = attributeIndustryTab;
      }
    }

    return attributeGroups
      .filter((group: any) => {
        if (targetIndustry === 'ELECTRONICS') return group.categoryType?.includes('Điện Tử');
        if (targetIndustry === 'FASHION') return group.categoryType?.includes('Thời Trang');
        return true;
      })
      .map((group: any) => ({
        ...group,
        attributes: (group.attributes || []).filter((attr: any) => attr.isFilter === true),
      }))
      .filter((group: any) => group.attributes.length > 0);
  }, [attributeGroups, selectedIndustry, selectedCategory, categories, attributeIndustryTab]);

  // 4. Fetch Catalog Products
  const { data: rawCatalogProducts = [] } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, sortBy],
    queryFn: () =>
      apiClient.getProducts({
        categoryId: selectedCategory || undefined,
        search: searchQuery || undefined,
        sort: sortBy === 'rating' ? undefined : sortBy,
      }),
  });

  // 5. Commercial Filtering Engine (Industry + Category + Price + Stock + Attributes)
  const catalogProducts = useMemo(() => {
    let filtered = rawCatalogProducts.filter((prod: any) => {
      // Industry filter
      const isFashionProd =
        prod.categoryType?.includes('Thời Trang') ||
        prod.category?.slug === 'fashion-men' ||
        prod.category?.slug === 'sportswear';
      if (selectedIndustry === 'ELECTRONICS' && isFashionProd) return false;
      if (selectedIndustry === 'FASHION' && !isFashionProd) return false;

      // Category filter
      if (selectedCategory) {
        if (
          prod.categoryId !== selectedCategory &&
          prod.category?.id !== selectedCategory &&
          prod.category?.slug !== selectedCategory
        ) {
          return false;
        }
      }

      // In stock only
      if (inStockOnly && prod.stock <= 0) return false;

      // Price range
      const price = Number(prod.price);
      if (priceRange === 'UNDER_50' && price >= 50) return false;
      if (priceRange === '50_200' && (price < 50 || price > 200)) return false;
      if (priceRange === '200_1000' && (price < 200 || price > 1000)) return false;
      if (priceRange === 'OVER_1000' && price <= 1000) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name?.toLowerCase().includes(q);
        const matchesDesc = prod.description?.toLowerCase().includes(q);
        const matchesBrand = prod.brand?.name?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }

      // Dynamic Attribute Multi-select Matching
      for (const [attrName, selectedValues] of Object.entries(selectedAttributes)) {
        if (!selectedValues || selectedValues.length === 0) continue;

        const prodAttr = prod.attributes?.find(
          (a: any) =>
            a.name.toLowerCase() === attrName.toLowerCase() ||
            a.name.toLowerCase().includes(attrName.toLowerCase()) ||
            attrName.toLowerCase().includes(a.name.toLowerCase())
        );

        if (!prodAttr) return false;

        const matchesOption = selectedValues.some(
          (v) =>
            prodAttr.value.toLowerCase().includes(v.toLowerCase()) ||
            v.toLowerCase().includes(prodAttr.value.toLowerCase())
        );

        if (!matchesOption) return false;
      }

      return true;
    });

    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a: any, b: any) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return filtered;
  }, [
    rawCatalogProducts,
    selectedIndustry,
    selectedCategory,
    inStockOnly,
    priceRange,
    searchQuery,
    selectedAttributes,
    sortBy,
  ]);

  // Flash Sale Flagship Product Config
  const flashSaleProduct = {
    id: DEFAULT_PRODUCT_ID,
    name: 'iPhone 16 Pro 256GB - Titanium Natural',
    description:
      'Thiết kế Titan Grade 5 chuẩn hàng không vũ trụ cùng chip Apple A18 Pro 3nm đột phá. Phân phối chính hãng Apple VN/A.',
    price: 999.0,
    flashSalePrice: 499.0,
    stock: stockData ? stockData.stock : 100,
    flashSaleId: DEFAULT_FLASH_SALE_ID,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
  };

  const handleQuickAdd = (prod: any) => {
    addItem({
      productId: prod.id,
      name: prod.name,
      price: Number(prod.price),
      quantity: 1,
      imageUrl: prod.imageUrl,
      categoryName: prod.category?.name || 'Chính hãng',
    });
    setAddedItemToast(prod.name);
    setTimeout(() => setAddedItemToast(null), 2500);
  };

  const handleBuyNowDirect = (prod: any) => {
    addItem({
      productId: prod.id,
      name: prod.name,
      price: Number(prod.price),
      quantity: 1,
      imageUrl: prod.imageUrl,
      categoryName: prod.category?.name || 'Chính hãng',
    });
    setIsCheckoutOpen(true);
  };

  const handleToggleCompare = (prod: any) => {
    const exists = compareProducts.some((p) => p.id === prod.id);
    if (exists) {
      setCompareProducts((prev) => prev.filter((p) => p.id !== prod.id));
    } else {
      if (compareProducts.length >= 4) {
        alert('Tối đa so sánh cùng lúc 4 sản phẩm.');
        return;
      }
      setCompareProducts((prev) => [...prev, prod]);
    }
  };

  const handleOpenDetail = (prod: any) => {
    setDetailProduct(prod);
    addToRecentlyViewed(prod);
  };

  const handleToggleAttributeOption = (attrName: string, optionValue: string) => {
    setSelectedAttributes((prev) => {
      const existing = prev[attrName] || [];
      const updated = existing.includes(optionValue)
        ? existing.filter((v) => v !== optionValue)
        : [...existing, optionValue];
      return {
        ...prev,
        [attrName]: updated,
      };
    });
  };

  const removeAttributeFilter = (attrName: string, optionValue: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrName]: (prev[attrName] || []).filter((v) => v !== optionValue),
    }));
  };

  const clearSingleAttribute = (attrName: string) => {
    setSelectedAttributes((prev) => {
      const updated = { ...prev };
      delete updated[attrName];
      return updated;
    });
  };

  const handleSelectCategory = (catId: string | null) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catId);
      const cat = categories.find((c: any) => c.id === catId);
      if (cat?.slug?.includes('fashion') || cat?.slug?.includes('sport')) {
        setAttributeIndustryTab('FASHION');
      } else if (cat) {
        setAttributeIndustryTab('ELECTRONICS');
      }
    }
  };

  const toggleAttributeAccordion = (name: string) => {
    setOpenAttributeAccordions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleAllAccordions = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    activeAttributeGroups.forEach((g: any) => {
      g.attributes?.forEach((a: any) => {
        newState[a.name] = expand;
      });
    });
    setOpenAttributeAccordions(newState);
  };

  const clearAllFilters = () => {
    setSelectedIndustry('ALL');
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange('ALL');
    setInStockOnly(false);
    setSelectedAttributes({});
  };

  const totalActiveFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedIndustry !== 'ALL') count++;
    if (priceRange !== 'ALL') count++;
    if (inStockOnly) count++;
    Object.values(selectedAttributes).forEach((vals) => {
      count += vals.length;
    });
    return count;
  }, [selectedCategory, selectedIndustry, priceRange, inStockOnly, selectedAttributes]);

  return (
    <div className="w-full flex flex-col items-center bg-[#fafafa] text-[#111827] min-h-screen">
      {/* 1. Header Navigation */}
      <Navbar searchQuery={searchQuery} onSearchChange={(q) => setSearchQuery(q)} />

      {/* Toast Notification */}
      {addedItemToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-white border border-gray-200 rounded-2xl shadow-xl text-[#111827] text-xs font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[#111827] font-bold">Đã thêm vào giỏ hàng thành công</p>
            <p className="text-[#6b7280] text-[11px] line-clamp-1">{addedItemToast}</p>
          </div>
        </div>
      )}

      {/* Floating Comparison Bar when items are selected */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 z-40 px-5 py-3 bg-white/95 border border-gray-200 rounded-full shadow-xl backdrop-blur-xl flex items-center gap-4 text-xs animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[#111827] font-semibold">
              Đang so sánh ({compareProducts.length}/4) sản phẩm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-1.5 bg-[#111827] hover:bg-black text-white font-medium rounded-full transition-colors cursor-pointer"
            >
              Xem Bảng Đối Chiếu
            </button>
            <button
              onClick={() => setCompareProducts([])}
              className="text-[#6b7280] hover:text-[#111827] text-[11px] px-2 font-medium cursor-pointer"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* FLUID FULL-WIDTH CONTAINER (Fills wide screens naturally without empty side margins) */}
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-6 space-y-8">
        {/* =================================================================== */}
        {/* 1. MINIMALIST EDITORIAL HERO (CLEAN WHITE / ZERO GAUDY GRADIENTS)   */}
        {/* =================================================================== */}
        <section className="w-full">
          <div className="rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-12 lg:p-14 shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Headline & Action (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>TECHZONE 2026 • ĐẠI LÝ ỦY QUYỀN APPLE VN/A &amp; THỂ THAO CAO CẤP</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#111827]">
                  Đỉnh Cao Thiết Bị &amp; Phong Cách Đột Phá.
                </h1>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                  Trải nghiệm hệ sinh thái Apple M3 Max / A18 Pro chính hãng VN/A kết hợp dải trang phục
                  thể thao Dry-Tech cao cấp. Tận hưởng ưu đãi độc quyền, trả góp 0% lãi suất và giao hàng
                  hỏa tốc 2H toàn quốc.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#catalog-section"
                    className="px-6 py-3 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-full shadow-xs transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <span>Khám Phá Kệ Hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#flash-sale-hub"
                    className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-full transition-colors flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4 fill-red-600 text-red-600" />
                    <span>Săn Flash Sale -50%</span>
                  </a>
                </div>

                {/* 3 Quick Confidence Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Bảo hành 12 tháng Apple AASP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Giao hỏa tốc 2H toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>1 đổi 1 trong 30 ngày nếu lỗi</span>
                  </div>
                </div>
              </div>

              {/* Right Showcase Visual (5 cols) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-md bg-[#f9fafb] border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center space-y-4">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center p-2">
                    <img
                      src={flashSaleProduct.imageUrl}
                      alt="iPhone 16 Pro Flagship"
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider">
                      Flagship Deal Hôm Nay
                    </span>
                    <h3 className="font-bold text-base text-[#111827]">{flashSaleProduct.name}</h3>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="text-xl font-bold font-mono text-red-600">
                        ${flashSaleProduct.flashSalePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through font-mono">
                        ${flashSaleProduct.price.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white">
                        -50%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Trust Guarantee Pillars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-50 text-[#111827]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">100% Chính Hãng</h4>
                <p className="text-[11px] text-[#6b7280]">Bảo hành 12 tháng Apple AASP</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-50 text-[#111827]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Giao Hỏa Tốc 2H</h4>
                <p className="text-[11px] text-[#6b7280]">Miễn phí toàn quốc từ $50</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-50 text-[#111827]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Đổi Trả 30 Ngày</h4>
                <p className="text-[11px] text-[#6b7280]">1 đổi 1 tận nơi nếu lỗi NSX</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-50 text-[#111827]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Trả Góp 0% Lãi Suất</h4>
                <p className="text-[11px] text-[#6b7280]">Hỗ trợ Apple Pay &amp; Thẻ tín dụng</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. MINIMALIST FLASH SALE HUB (HARMONIOUS CRISP WHITE + RED ACCENTS) */}
        {/* =================================================================== */}
        <section
          id="flash-sale-hub"
          className="w-full bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-xs">
                <Flame className="w-5 h-5 fill-red-600 text-red-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight uppercase">
                    Giờ Vàng Giá Sốc
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 font-mono font-bold text-[10px] uppercase border border-red-200">
                    Flash Deals
                  </span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Ưu đãi số lượng có hạn • Xử lý đơn hàng đồng thời 10.000 req/s
                </p>
              </div>
            </div>

            {/* Countdown Component */}
            <div className="flex items-center gap-3">
              <FlashSaleCountdown />
            </div>
          </div>

          {/* 4-Column Multi-Product Flash Sale Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
            {/* Deal 1: Flagship iPhone 16 Pro (High Concurrency SSE Engine) */}
            <div className="bg-[#f9fafb] rounded-2xl p-4 border border-gray-200/70 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden p-3 flex items-center justify-center mb-3 border border-gray-100">
                  <img
                    src={flashSaleProduct.imageUrl}
                    alt={flashSaleProduct.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px]">
                      -50%
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#111827] text-white font-bold text-[9px]">
                      APPLE VN/A
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-xs text-[#111827] line-clamp-2 min-h-[32px]">
                  {flashSaleProduct.name}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-red-600 font-mono">
                    ${flashSaleProduct.flashSalePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 line-through font-mono">
                    ${flashSaleProduct.price.toFixed(2)}
                  </span>
                </div>

                {/* Live Stock Progress */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                    <span>Đã bán {Math.max(0, 100 - flashSaleProduct.stock)}/100</span>
                    <span className="font-bold text-red-600">Còn {flashSaleProduct.stock} máy</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(15, 100 - flashSaleProduct.stock))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Buy Button with High-Concurrency Token */}
              <button
                onClick={() => triggerFlashSaleCheckout(1)}
                disabled={isFlashSaleSubmitting || isFlashSaleThrottled}
                className="w-full mt-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>
                  {isFlashSaleSubmitting
                    ? 'Đang xếp hàng...'
                    : `Săn Ngay ($${flashSaleProduct.flashSalePrice})`}
                </span>
              </button>
            </div>

            {/* Deal 2: AirPods Pro 2 USB-C */}
            <div className="bg-[#f9fafb] rounded-2xl p-4 border border-gray-200/70 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden p-3 flex items-center justify-center mb-3 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80"
                    alt="AirPods Pro 2"
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px]">
                      -24%
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#111827] text-white font-bold text-[9px]">
                      CHÍNH HÃNG
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-xs text-[#111827] line-clamp-2 min-h-[32px]">
                  AirPods Pro 2 USB-C MagSafe (H2 Chip ANC 2X)
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-red-600 font-mono">$189.00</span>
                  <span className="text-xs text-gray-400 line-through font-mono">$249.00</span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                    <span>Đã bán 60/80</span>
                    <span className="font-bold text-gray-700">Còn 20 bộ</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full w-[75%]" />
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleBuyNowDirect({
                    id: '22222222-2222-2222-2222-000000000003',
                    name: 'AirPods Pro 2 USB-C MagSafe',
                    price: 189.0,
                    imageUrl:
                      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
                    category: { name: 'Audio & Wearables' },
                  })
                }
                className="w-full mt-4 py-2.5 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mua Ngay ($189)</span>
              </button>
            </div>

            {/* Deal 3: Sạc Nhanh MagSafe 25W */}
            <div className="bg-[#f9fafb] rounded-2xl p-4 border border-gray-200/70 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden p-3 flex items-center justify-center mb-3 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1622445268045-8c01062b1442?w=800&auto=format&fit=crop&q=80"
                    alt="MagSafe Charger"
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px]">
                      -26%
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#111827] text-white font-bold text-[9px]">
                      BELKIN
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-xs text-[#111827] line-clamp-2 min-h-[32px]">
                  Củ Sạc Không Dây MagSafe 25W Fast Wireless
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-red-600 font-mono">$29.00</span>
                  <span className="text-xs text-gray-400 line-through font-mono">$39.00</span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                    <span>Đã bán 45/50</span>
                    <span className="font-bold text-red-600">Sắp hết hàng</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full w-[90%]" />
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleBuyNowDirect({
                    id: '22222222-2222-2222-2222-000000000005',
                    name: 'Củ Sạc Không Dây MagSafe 25W',
                    price: 29.0,
                    imageUrl:
                      'https://images.unsplash.com/photo-1622445268045-8c01062b1442?w=800&auto=format&fit=crop&q=80',
                    category: { name: 'Accessories' },
                  })
                }
                className="w-full mt-4 py-2.5 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mua Ngay ($29)</span>
              </button>
            </div>

            {/* Deal 4: Áo Polo Thể Thao Dry-Tech */}
            <div className="bg-[#f9fafb] rounded-2xl p-4 border border-gray-200/70 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden p-3 flex items-center justify-center mb-3 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80"
                    alt="Polo Shirt"
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px]">
                      -35%
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#111827] text-white font-bold text-[9px]">
                      POLO TECH
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-xs text-[#111827] line-clamp-2 min-h-[32px]">
                  Áo Thun Polo Thể Thao Nam Dry-Tech Pro Co Giãn
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-red-600 font-mono">$29.00</span>
                  <span className="text-xs text-gray-400 line-through font-mono">$45.00</span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                    <span>Đã bán 38/50</span>
                    <span className="font-bold text-gray-700">Còn 12 cái</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full w-[76%]" />
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleBuyNowDirect({
                    id: '22222222-2222-2222-2222-000000000006',
                    name: 'Áo Polo Thể Thao Nam Dry-Tech Pro',
                    price: 29.0,
                    imageUrl:
                      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
                    category: { name: 'Fashion Men' },
                  })
                }
                className="w-full mt-4 py-2.5 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mua Ngay ($29)</span>
              </button>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. MAIN CATALOG WORKSPACE (CLEAN 2-COLUMN SPLIT, NO DUPLICATION)    */}
        {/* =================================================================== */}
        <section id="catalog-section" className="w-full space-y-6">
          {/* Top Industry Segment Filter Header */}
          <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#111827]" />
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    KỆ HÀNG CHÍNH THỨC
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                  Danh Mục Sản Phẩm &amp; Bộ Lọc Thuộc Tính
                </h2>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Lọc sâu theo từng tiêu chí chất liệu, dung lượng, xuất xứ, bảo hành từ Kênh Quản Trị
                </p>
              </div>

              {/* Segmented Industry Switcher (Clean minimalist buttons) */}
              <div className="flex items-center bg-[#f3f4f6] p-1.5 rounded-2xl border border-gray-200 self-start sm:self-auto">
                {[
                  { id: 'ALL', label: 'Tất Cả Sản Phẩm' },
                  { id: 'ELECTRONICS', label: 'Thiết Bị Điện Tử' },
                  { id: 'FASHION', label: 'Thời Trang & Thể Thao' },
                ].map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => {
                      setSelectedIndustry(ind.id as any);
                      setSelectedCategory(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedIndustry === ind.id
                        ? 'bg-white text-[#111827] shadow-xs'
                        : 'text-[#6b7280] hover:text-[#111827]'
                    }`}
                  >
                    <span>{ind.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Workspace: Left Sidebar + Right Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ============================================================= */}
            {/* DESKTOP FILTER SIDEBAR (SINGLE CLEAN SOURCE OF FILTERS)       */}
            {/* ============================================================= */}
            <aside className="hidden lg:block lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-5 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#111827]" />
                  <h3 className="font-bold text-sm text-[#111827]">Bộ Lọc Sản Phẩm</h3>
                </div>
                {totalActiveFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa tất cả ({totalActiveFilterCount})
                  </button>
                )}
              </div>

              {/* 1. Category Tree Filter */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
                  Danh Mục Ngành Hàng
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => handleSelectCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === null
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>Tất cả ngành hàng</span>
                    <span className="text-[10px] opacity-80">({rawCatalogProducts.length})</span>
                  </button>
                  {categories.map((cat: any) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#111827] text-white font-semibold shadow-xs'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] opacity-80">
                          ({cat._count?.products || 0})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. In-Stock Switch */}
              <div className="p-3 bg-[#f9fafb] rounded-2xl flex items-center justify-between border border-gray-100">
                <span className="text-xs font-semibold text-[#111827]">Chỉ hiện còn hàng</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111827]"></div>
                </label>
              </div>

              {/* 3. Price Range Selector */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
                  Khoảng Giá
                </span>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'ALL', label: 'Tất cả mức giá' },
                    { id: 'UNDER_50', label: 'Dưới $50' },
                    { id: '50_200', label: '$50 - $200' },
                    { id: '200_1000', label: '$200 - $1,000' },
                    { id: 'OVER_1000', label: 'Trên $1,000' },
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setPriceRange(pr.id as any)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        priceRange === pr.id
                          ? 'bg-[#111827] text-white font-semibold'
                          : 'text-[#6b7280] hover:bg-gray-100 hover:text-[#111827]'
                      }`}
                    >
                      <span>{pr.label}</span>
                      {priceRange === pr.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Dynamic Attributes Filter Sections (Synced from Admin) */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                {/* Header & Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">
                      Thuộc Tính Chi Tiết
                    </span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                      Live
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      onClick={() => toggleAllAccordions(true)}
                      className="text-gray-500 hover:text-black cursor-pointer font-medium"
                    >
                      Mở hết
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={() => toggleAllAccordions(false)}
                      className="text-gray-500 hover:text-black cursor-pointer font-medium"
                    >
                      Thu gọn
                    </button>
                  </div>
                </div>

                {/* Segmented Industry Tab (Only when browsing ALL and no category is locked) */}
                {selectedIndustry === 'ALL' && !selectedCategory && (
                  <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setAttributeIndustryTab('ELECTRONICS')}
                      className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                        attributeIndustryTab === 'ELECTRONICS'
                          ? 'bg-white text-[#111827] shadow-xs font-bold'
                          : 'text-gray-500 hover:text-[#111827]'
                      }`}
                    >
                      Điện Tử
                    </button>
                    <button
                      onClick={() => setAttributeIndustryTab('FASHION')}
                      className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                        attributeIndustryTab === 'FASHION'
                          ? 'bg-white text-[#111827] shadow-xs font-bold'
                          : 'text-gray-500 hover:text-[#111827]'
                      }`}
                    >
                      Thời Trang
                    </button>
                  </div>
                )}

                {/* Accordion List */}
                {activeAttributeGroups.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2 text-center">
                    Chưa có thuộc tính lọc cho danh mục này.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeAttributeGroups.map((group: any) =>
                      group.attributes.map((attr: any) => {
                        const selectedOptions = selectedAttributes[attr.name] || [];
                        const hasSelected = selectedOptions.length > 0;
                        const isOpen = hasSelected || !!openAttributeAccordions[attr.name];

                        return (
                          <div
                            key={attr.name}
                            className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                              hasSelected
                                ? 'border-gray-900/40 bg-gray-50/50 shadow-2xs'
                                : 'border-gray-200/80 bg-white'
                            }`}
                          >
                            {/* Accordion Header */}
                            <button
                              type="button"
                              onClick={() => toggleAttributeAccordion(attr.name)}
                              className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#111827]">
                                  {attr.name}
                                </span>
                                {hasSelected && (
                                  <span className="px-1.5 py-0.2 bg-[#111827] text-white text-[10px] font-bold rounded-full">
                                    {selectedOptions.length}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                {hasSelected && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearSingleAttribute(attr.name);
                                    }}
                                    className="text-[10px] text-red-600 hover:text-red-700 font-medium px-1 hover:underline cursor-pointer"
                                  >
                                    Xóa
                                  </span>
                                )}
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>

                            {/* Accordion Options Body */}
                            {isOpen && (
                              <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-[#fafafa]">
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {attr.options.map((opt: string) => {
                                    const isSelected = selectedOptions.includes(opt);
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => handleToggleAttributeOption(attr.name, opt)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer border flex items-center gap-1 ${
                                          isSelected
                                            ? 'bg-[#111827] text-white border-[#111827] font-semibold shadow-xs'
                                            : 'bg-white text-gray-700 hover:text-[#111827] hover:bg-gray-100 border-gray-200 font-medium shadow-2xs'
                                        }`}
                                      >
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                        <span>{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </aside>

            {/* ============================================================= */}
            {/* RIGHT PRODUCT GRID & SORT CONTROLS                            */}
            {/* ============================================================= */}
            <div className="lg:col-span-9 space-y-4">
              {/* Top Toolbar: Search + Sort + Active Filter Badges */}
              <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111827]">
                    Tìm thấy {catalogProducts.length} sản phẩm
                  </span>
                  {totalActiveFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[#111827] font-bold text-[11px]">
                      ({totalActiveFilterCount} tiêu chí đang lọc)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Trigger Button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden px-3 py-1.5 bg-[#f3f4f6] border border-gray-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5 text-[#111827]" />
                    <span>Bộ lọc</span>
                  </button>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6b7280]">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#f3f4f6] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#111827] cursor-pointer focus:outline-none focus:border-[#111827]"
                    >
                      <option value="newest">Mới nhất 2026</option>
                      <option value="price_asc">Giá: Thấp đến Cao</option>
                      <option value="price_desc">Giá: Cao đến Thấp</option>
                      <option value="rating">Đánh giá cao nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Chips Ribbon (Removable with X) */}
              {totalActiveFilterCount > 0 && (
                <div className="p-3 bg-white border border-gray-200/80 rounded-2xl flex flex-wrap items-center gap-2 text-xs animate-in fade-in">
                  <span className="text-[11px] font-semibold text-[#6b7280] mr-1">Đang lọc:</span>
                  {selectedCategory && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[#111827] font-medium flex items-center gap-1.5">
                      <span>
                        Danh mục:{' '}
                        {categories.find((c: any) => c.id === selectedCategory)?.name ||
                          selectedCategory}
                      </span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="cursor-pointer hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {priceRange !== 'ALL' && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[#111827] font-medium flex items-center gap-1.5">
                      <span>Giá: {priceRange}</span>
                      <button
                        onClick={() => setPriceRange('ALL')}
                        className="cursor-pointer hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1.5">
                      <span>Chỉ còn hàng</span>
                      <button
                        onClick={() => setInStockOnly(false)}
                        className="cursor-pointer hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {Object.entries(selectedAttributes).map(([attrName, vals]) =>
                    vals.map((v) => (
                      <span
                        key={`${attrName}-${v}`}
                        className="px-2.5 py-1 rounded-full bg-gray-100 text-[#111827] font-medium flex items-center gap-1.5 border border-gray-200"
                      >
                        <span>
                          {attrName}: {v}
                        </span>
                        <button
                          onClick={() => removeAttributeFilter(attrName, v)}
                          className="cursor-pointer hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-rose-600 hover:underline px-2 cursor-pointer ml-auto"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}

              {/* Empty State */}
              {catalogProducts.length === 0 ? (
                <div className="p-16 text-center text-[#6b7280] bg-white rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-base font-bold text-[#111827]">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                  <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
                    Không có sản phẩm nào thỏa mãn tổ hợp bộ lọc bạn đã chọn. Vui lòng bấm xóa bộ
                    lọc để xem toàn bộ danh mục.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-full shadow-xs cursor-pointer"
                  >
                    Khôi Phục Bộ Lọc
                  </button>
                </div>
              ) : (
                /* Product Grid (Expands to 4 cols on large/wide monitors!) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {catalogProducts.map((prod: any) => {
                    const hasFlashSale = prod.flashSales && prod.flashSales.length > 0;
                    const displayPrice = hasFlashSale
                      ? Number(prod.flashSales[0].flashPrice)
                      : Number(prod.price);
                    const isCompared = compareProducts.some((p) => p.id === prod.id);

                    // Extract specs preview chips from attributes
                    const topSpecs = (prod.attributes || []).slice(0, 3).map((a: any) => a.value);

                    return (
                      <div
                        key={prod.id}
                        className="group relative bg-white border border-gray-200/80 hover:border-gray-300 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          {/* Thumbnail Pedestal */}
                          <div className="relative w-full aspect-square bg-[#f9fafb] overflow-hidden flex items-center justify-center p-6 border-b border-gray-100">
                            {prod.imageUrl ? (
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <ShoppingBag className="w-12 h-12 text-gray-400" />
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                              {hasFlashSale && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white shadow-xs">
                                  -50% GIỜ VÀNG
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/90 backdrop-blur-xs text-[#111827] shadow-xs border border-gray-200">
                                {prod.brand?.name || 'Chính Hãng VN/A'}
                              </span>
                            </div>

                            {/* Wishlist Heart Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist({
                                  productId: prod.id,
                                  name: prod.name,
                                  price: displayPrice,
                                  imageUrl: prod.imageUrl,
                                  categoryName: prod.category?.name,
                                });
                              }}
                              className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-xs transition-all cursor-pointer ${
                                isInWishlist(prod.id)
                                  ? 'bg-rose-50 text-rose-500 border border-rose-200'
                                  : 'bg-white text-gray-400 hover:text-rose-500 border border-gray-200 opacity-0 group-hover:opacity-100'
                              }`}
                              title={isInWishlist(prod.id) ? 'Bỏ lưu yêu thích' : 'Lưu yêu thích'}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${isInWishlist(prod.id) ? 'fill-rose-500' : ''}`}
                              />
                            </button>

                            {/* Quick Actions Hover Overlay */}
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                              <button
                                onClick={() => handleOpenDetail(prod)}
                                className="p-3 rounded-full bg-white text-[#111827] hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
                                title="Xem chi tiết & thông số"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleQuickAdd(prod)}
                                className="p-3 rounded-full bg-[#111827] hover:bg-black text-white transition-colors shadow-lg cursor-pointer"
                                title="Thêm nhanh vào giỏ"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 space-y-2.5">
                            {/* Rating & Stock */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span className="font-bold text-[#111827] text-[11px]">
                                  {prod.rating || 4.9}
                                </span>
                                <span className="text-[#6b7280] text-[10px]">
                                  ({prod.reviewCount || 120})
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Còn {prod.stock} sp
                              </span>
                            </div>

                            {/* Product Title */}
                            <h3
                              onClick={() => handleOpenDetail(prod)}
                              className="font-bold text-sm text-[#111827] group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                            >
                              {prod.name}
                            </h3>

                            {/* Specs Attribute Pills Preview */}
                            {topSpecs.length > 0 && (
                              <div className="flex items-center gap-1 overflow-hidden text-[10px] text-[#6b7280]">
                                {topSpecs.map((spec: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-[#f3f4f6] rounded-md font-medium truncate max-w-[120px]"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                              {prod.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Pricing & CTAs */}
                        <div className="p-5 pt-0">
                          <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
                            <div>
                              <span className="text-[10px] text-[#6b7280] block font-medium">
                                Giá phân phối
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-[#111827] font-mono">
                                  ${displayPrice.toFixed(2)}
                                </span>
                                {hasFlashSale && (
                                  <span className="text-xs text-[#6b7280] line-through font-mono">
                                    ${Number(prod.price).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleCompare(prod)}
                                className={`p-2 rounded-full border text-[10px] transition-all cursor-pointer ${
                                  isCompared
                                    ? 'bg-[#111827] text-white border-[#111827]'
                                    : 'bg-white text-gray-500 hover:text-[#111827] border-gray-200'
                                }`}
                                title="So sánh thông số"
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleBuyNowDirect(prod)}
                                className="px-3.5 py-1.5 bg-[#111827] hover:bg-black text-white text-[11px] font-semibold rounded-full transition-all shadow-xs cursor-pointer active:scale-95"
                              >
                                Mua ngay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. BRAND PARTNERSHIP SHOWCASE (CLEAN, MINIMALIST HORIZONTAL BAR)     */}
        {/* =================================================================== */}
        <section className="w-full p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#111827]">
                Đối Tác Phân Phối Ủy Quyền Toàn Cầu
              </h3>
              <p className="text-xs text-[#6b7280]">
                100% sản phẩm có chứng nhận xuất xứ, hóa đơn VAT và bảo hành chính thức tại Việt Nam
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              Chính Hãng 100%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-[#f9fafb] border border-gray-200/60 flex items-center justify-center gap-3">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <h5 className="font-bold text-xs text-[#111827]">Apple Authorised</h5>
                <p className="text-[10px] text-gray-500">Reseller VN/A</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f9fafb] border border-gray-200/60 flex items-center justify-center gap-3">
              <span className="text-2xl">⚡</span>
              <div className="text-left">
                <h5 className="font-bold text-xs text-[#111827]">Belkin Official</h5>
                <p className="text-[10px] text-gray-500">Phụ kiện &amp; MagSafe</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f9fafb] border border-gray-200/60 flex items-center justify-center gap-3">
              <span className="text-2xl">👟</span>
              <div className="text-left">
                <h5 className="font-bold text-xs text-[#111827]">Nike Sport</h5>
                <p className="text-[10px] text-gray-500">Đồ tập &amp; Phụ kiện</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f9fafb] border border-gray-200/60 flex items-center justify-center gap-3">
              <span className="text-2xl">🔋</span>
              <div className="text-left">
                <h5 className="font-bold text-xs text-[#111827]">Anker Prime</h5>
                <p className="text-[10px] text-gray-500">Sạc nhanh GaN</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. RECENTLY VIEWED PRODUCTS (CLEAN MINIMAL ROW)                     */}
        {/* =================================================================== */}
        {recentlyViewed.length > 0 && (
          <section className="w-full space-y-3">
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#111827]" />
              <span>Sản phẩm bạn vừa xem gần đây</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((rv) => (
                <div
                  key={rv.id}
                  onClick={() => setDetailProduct(rv)}
                  className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-gray-300 shadow-xs transition-all"
                >
                  <div className="w-12 h-12 bg-[#f9fafb] rounded-xl overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                    <img src={rv.imageUrl} alt={rv.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#111827] truncate">{rv.name}</p>
                    <p className="text-xs font-semibold text-[#111827] font-mono mt-0.5">
                      ${Number(rv.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#111827]">Bộ Lọc Sản Phẩm</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mobile Filters Body */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#111827] block mb-2">Khoảng Giá</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ALL', label: 'Tất cả' },
                    { id: 'UNDER_50', label: 'Dưới $50' },
                    { id: '50_200', label: '$50 - $200' },
                    { id: '200_1000', label: '$200 - $1,000' },
                    { id: 'OVER_1000', label: 'Trên $1,000' },
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setPriceRange(pr.id as any)}
                      className={`p-2 rounded-xl text-center font-medium border ${
                        priceRange === pr.id
                          ? 'bg-[#111827] text-white border-[#111827]'
                          : 'bg-[#f3f4f6] border-gray-200 text-[#6b7280]'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Attributes in Mobile */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] block">Thuộc Tính Chi Tiết</span>
                  {selectedIndustry === 'ALL' && !selectedCategory && (
                    <div className="flex p-0.5 bg-gray-100 rounded-lg text-[11px] font-semibold">
                      <button
                        onClick={() => setAttributeIndustryTab('ELECTRONICS')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          attributeIndustryTab === 'ELECTRONICS'
                            ? 'bg-white text-[#111827] shadow-xs'
                            : 'text-gray-500'
                        }`}
                      >
                        Điện Tử
                      </button>
                      <button
                        onClick={() => setAttributeIndustryTab('FASHION')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          attributeIndustryTab === 'FASHION'
                            ? 'bg-white text-[#111827] shadow-xs'
                            : 'text-gray-500'
                        }`}
                      >
                        Thời Trang
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {activeAttributeGroups.map((group: any) =>
                    group.attributes.map((attr: any) => {
                      const selectedOptions = selectedAttributes[attr.name] || [];
                      const hasSelected = selectedOptions.length > 0;
                      const isOpen = hasSelected || !!openAttributeAccordions[attr.name];

                      return (
                        <div
                          key={attr.name}
                          className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                            hasSelected
                              ? 'border-gray-900/40 bg-gray-50/50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleAttributeAccordion(attr.name)}
                            className="w-full px-3 py-2 flex items-center justify-between text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-[#111827]">{attr.name}</span>
                              {hasSelected && (
                                <span className="px-1.5 py-0.2 bg-[#111827] text-white text-[10px] font-bold rounded-full">
                                  {selectedOptions.length}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasSelected && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearSingleAttribute(attr.name);
                                  }}
                                  className="text-[10px] text-red-600 font-medium px-1"
                                >
                                  Xóa
                                </span>
                              )}
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-[#fafafa]">
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {attr.options.map((opt: string) => {
                                  const isSelected = selectedOptions.includes(opt);
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => handleToggleAttributeOption(attr.name, opt)}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                                        isSelected
                                          ? 'bg-[#111827] text-white border-[#111827]'
                                          : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                      <span>{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 bg-gray-100 text-[#111827] font-semibold text-xs rounded-xl"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#111827] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Xem {catalogProducts.length} kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
      />

      <ProductCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={compareProducts}
        onRemoveProduct={(id) => setCompareProducts((prev) => prev.filter((p) => p.id !== id))}
      />

      {/* High-Concurrency Queue Status Modal for Flash Sale Events */}
      <QueueStatusModal
        isOpen={isFlashSaleModalOpen}
        onClose={closeFlashSaleModal}
        trackingId={flashSaleTrackingId}
        errorMessage={flashSaleError}
        onSuccessPay={() => queryClient.invalidateQueries({ queryKey: ['stock'] })}
      />
    </div>
  );
}
