'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  ShoppingBag,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronDown,
  X,
  PhoneCall,
  Heart,
  User,
  History,
  TrendingUp,
  LogOut,
  Sparkles,
  Award,
} from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAuth?: () => void;
}

const TRENDING_KEYWORDS = [
  'iPhone 16 Pro Titanium',
  'MacBook Pro 16 M3 Max',
  'Apple Watch Ultra 2',
  'AirPods Pro 2 USB-C',
  'Sạc MagSafe 25W',
];

const RECENT_SEARCHES = ['iPhone 16 Pro', 'MacBook M3 Max 36GB', 'Apple Care+'];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery = '',
  onSearchChange,
  onOpenAuth,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist, setIsWishlistOpen } = useWishlist();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close search and user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (onSearchChange) {
      onSearchChange(internalSearch);
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    setInternalSearch(keyword);
    setIsSearchFocused(false);
    if (onSearchChange) onSearchChange(keyword);
  };

  const handleTriggerAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      openAuthModal();
    }
  };

  const getUserInitial = () => {
    if (!user?.fullName) return 'U';
    const parts = user.fullName.trim().split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
      {/* Top Promotional Announcement Banner: Apple Store Clean Light Gray */}
      <div className="w-full bg-[#f5f5f7] border-b border-gray-200/60 text-[11px] text-[#6e6e73] py-2 px-4">
        <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#1d1d1f] text-white font-semibold text-[9px] uppercase tracking-wider">
              ƯU ĐÃI
            </span>
            <span className="text-[#1d1d1f] font-medium">
              TechZone Chính Hãng: Miễn phí giao hàng toàn quốc từ 1.000.000đ • Trả góp 0% lãi suất
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] text-[#6e6e73]">
            <span className="flex items-center gap-1.5 hover:text-[#0071e3] transition-colors cursor-pointer">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hotline CSKH: 1800 6868 (Miễn phí)</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#0071e3] transition-colors cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Phân phối uỷ quyền chính hãng Apple VN/A</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 h-20 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] text-white p-0.5 transition-all flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                TECHZONE
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-gray-100 text-[#1d1d1f] rounded border border-gray-200">
                STORE
              </span>
            </div>
            <p className="text-[10px] text-[#86868b]">Apple Authorised Reseller</p>
          </div>
        </Link>

        {/* Location Selector */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] border border-gray-200 text-xs text-[#1d1d1f] cursor-pointer hover:border-gray-300 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
          <div className="text-left">
            <span className="text-[9px] text-[#86868b] block leading-tight">Giao đến</span>
            <span className="font-semibold text-[#1d1d1f] text-[11px]">Quận 1, TP. Hồ Chí Minh</span>
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        <div ref={searchContainerRef} className="flex-1 max-w-lg relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalSearch}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Tìm kiếm iPhone 16 Pro, MacBook M3, Apple Watch..."
              className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-full pl-10 pr-10 py-2.5 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all"
            />
            {internalSearch && (
              <button
                type="button"
                onClick={() => {
                  setInternalSearch('');
                  if (onSearchChange) onSearchChange('');
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1d1d1f]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete & Trending Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Từ khóa thịnh hành</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_KEYWORDS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleSelectKeyword(k)}
                      className="px-3 py-1 bg-[#f5f5f7] hover:bg-gray-200/80 border border-gray-200 text-[#1d1d1f] text-xs rounded-full transition-colors font-medium"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  <History className="w-3.5 h-3.5 text-gray-400" />
                  <span>Tìm kiếm gần đây</span>
                </div>
                <div className="space-y-1">
                  {RECENT_SEARCHES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSelectKeyword(r)}
                      className="w-full flex items-center justify-between text-xs text-[#1d1d1f] hover:bg-gray-50 py-1.5 px-2.5 rounded-lg transition-colors text-left"
                    >
                      <span>{r}</span>
                      <span className="text-[10px] text-[#86868b]">Tra cứu nhanh</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Seller / Admin Portal Link */}
          <Link
            href="/admin"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] border border-gray-200 text-xs font-medium transition-all"
            title="Mở bảng điều khiển Quản trị & Người bán"
          >
            <span>👑 Kênh Quản Trị</span>
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-full text-gray-600 hover:text-[#1d1d1f] hover:bg-[#f5f5f7] border border-transparent hover:border-gray-200 transition-all"
            title="Danh sách yêu thích"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            {totalWishlist > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {totalWishlist}
              </span>
            )}
          </button>

          {/* User Account / Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-xs text-[#1d1d1f] transition-all shadow-sm group"
                title="Tài khoản cá nhân"
              >
                <div className="w-5 h-5 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[10px] font-bold">
                  {getUserInitial()}
                </div>
                <span className="font-medium max-w-[120px] truncate text-left hidden sm:inline">
                  {user.fullName || 'Tài khoản'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180 text-[#1d1d1f]' : ''
                  }`}
                />
              </button>

              {/* Apple-style Account Flyout Card */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  {/* Account Header */}
                  <div className="p-3 bg-[#f5f5f7] rounded-xl mb-1 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {getUserInitial()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1d1d1f] truncate text-sm">
                          {user.fullName}
                        </div>
                        <div className="text-[11px] text-[#86868b] truncate">{user.email}</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0071e3] font-medium border border-blue-100">
                        {user.membershipTier || 'Hội viên'}
                      </span>
                      <span className="text-[#1d1d1f] font-mono font-semibold">
                        {user.rewardPoints?.toLocaleString('vi-VN') || 0} điểm
                      </span>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-0.5 py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-[#0071e3]" />
                      <span>Hồ sơ &amp; Hạng hội viên</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors font-medium"
                    >
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Đơn hàng đã đặt</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsWishlistOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors text-left font-medium"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Sản phẩm yêu thích ({totalWishlist})</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleTriggerAuth}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 transition-all"
              title="Đăng nhập TechZone ID"
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Quick Orders Link */}
          <Link
            href="/orders"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 transition-all"
            title="Tra cứu đơn hàng"
          >
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Đơn hàng</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs transition-all active:scale-[0.98] shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden md:inline">Giỏ hàng</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#0071e3] font-mono text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

