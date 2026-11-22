'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  MapPin,
  Package,
  Award,
  CreditCard,
  Gift,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  membershipTier: string;
  discountPrivilege: string;
  rewardPoints: number;
  totalOrders: number;
  totalSpent: number;
  savedAddresses: Array<{
    id: string;
    isDefault: boolean;
    type: string;
    recipientName: string;
    phone: string;
    fullAddress: string;
    city: string;
  }>;
  memberSince: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'warranty' | 'rewards'>('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/user/profile/33333333-3333-3333-3333-333333333333');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 space-y-8 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1d1d1f] font-semibold">Tài khoản &amp; Hội viên</span>
        </div>

        {/* User Executive Hero Card */}
        <div className="relative overflow-hidden bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#f5f5f7] border border-gray-200 p-0.5 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-bold text-2xl text-[#1d1d1f]">
                    {profile ? profile.fullName.charAt(0) : 'U'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[9px] rounded-full uppercase tracking-wider">
                  VERIFIED
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                    {profile?.fullName || 'Khách hàng Apple'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-[#1d1d1f] border border-gray-200 flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#0071e3]" />
                    <span>{profile?.membershipTier || 'Thành viên'}</span>
                  </span>
                </div>
                <p className="text-xs text-[#6e6e73] font-mono">
                  {profile?.email || 'buyer@flashsale.com'} • Tham gia từ{' '}
                  {profile?.memberSince
                    ? new Date(profile.memberSince).toLocaleDateString('vi-VN')
                    : '2026'}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đặc quyền hiện tại: {profile?.discountPrivilege || '5% mọi đơn hàng'}</span>
                </div>
              </div>
            </div>

            {/* Quick Balance / Reward points */}
            <div className="flex items-center gap-4 bg-[#f5f5f7] border border-gray-200/80 p-4 rounded-2xl">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#0071e3]">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-[#6e6e73] uppercase tracking-wider font-semibold">
                  Điểm Tích Luỹ TechZone
                </p>
                <p className="text-xl font-black text-[#1d1d1f] font-mono">
                  {(profile?.rewardPoints || 7990).toLocaleString()}{' '}
                  <span className="text-xs font-normal text-[#6e6e73]">pts</span>
                </p>
                <p className="text-[10px] text-[#86868b]">Quy đổi: ${( (profile?.rewardPoints || 7990) / 100 ).toFixed(2)} ưu đãi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200/80 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile', label: 'Hồ Sơ & Đặc Quyền', icon: User },
            { id: 'addresses', label: 'Sổ Địa Chỉ Giao Hàng', icon: MapPin },
            { id: 'warranty', label: 'Bảo Hành Điện Tử', icon: ShieldCheck },
            { id: 'rewards', label: 'Ưu Đãi & Voucher', icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#0071e3] text-white shadow-sm'
                    : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-50 border border-gray-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile & Privileges */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Member Tier Benefits */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Đặc Quyền Hội Viên TechZone Club</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#f5f5f7] border border-gray-200/80 rounded-xl space-y-1">
                    <p className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ưu tiên xếp hàng Flash Sale
                    </p>
                    <p className="text-[#6e6e73] text-[11px]">
                      Hưởng quyền ưu tiên nhận Single-use Action Token 30s với độ trễ sub-50ms.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#f5f5f7] border border-gray-200/80 rounded-xl space-y-1">
                    <p className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Miễn phí vận chuyển Hỏa Tốc
                    </p>
                    <p className="text-[#6e6e73] text-[11px]">
                      Áp dụng mã FREESHIP cho đơn hàng từ $100 giao ngay trong 2 tiếng.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#f5f5f7] border border-gray-200/80 rounded-xl space-y-1">
                    <p className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      1 Đổi 1 trong 30 ngày
                    </p>
                    <p className="text-[#6e6e73] text-[11px]">
                      Đổi mới ngay thiết bị nếu có lỗi phần cứng từ Apple Authorized Service.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#f5f5f7] border border-gray-200/80 rounded-xl space-y-1">
                    <p className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tích điểm không giới hạn
                    </p>
                    <p className="text-[#6e6e73] text-[11px]">
                      Nhận 10 điểm thưởng cho mỗi $1 chi tiêu tại chuỗi TechZone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Quick Access */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-[#1d1d1f]">Quản lý Đơn hàng &amp; Vận chuyển</h4>
                  <p className="text-xs text-[#6e6e73] mt-0.5">
                    Bạn hiện có tổng cộng {profile?.totalOrders || 2} đơn hàng đã thực hiện trên hệ thống.
                  </p>
                </div>
                <Link
                  href="/orders"
                  className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Xem đơn hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Account Info Sidebar */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-4 text-xs shadow-sm">
                <h3 className="text-sm font-bold text-[#1d1d1f]">Thông Tin Tài Khoản</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[#6e6e73] block text-[11px]">Họ và tên</span>
                    <span className="font-semibold text-[#1d1d1f]">{profile?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#6e6e73] block text-[11px]">Email đăng nhập</span>
                    <span className="font-semibold text-[#1d1d1f] font-mono">{profile?.email}</span>
                  </div>
                  <div>
                    <span className="text-[#6e6e73] block text-[11px]">Tổng chi tiêu tích luỹ</span>
                    <span className="font-bold text-emerald-700 text-sm font-mono">
                      ${profile?.totalSpent?.toLocaleString() || '799.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e6e73] block text-[11px]">Trạng thái bảo mật</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Xác thực 2 lớp (2FA Active)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">Sổ Địa Chỉ Giao Hàng</h3>
                <p className="text-xs text-[#6e6e73]">Chọn địa chỉ mặc định để tự động điền khi thanh toán giỏ hàng</p>
              </div>
              <button className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                + Thêm Địa Chỉ Mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    addr.isDefault
                      ? 'bg-blue-50/40 border-[#0071e3] shadow-sm'
                      : 'bg-white border-gray-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f5f5f7] text-[#1d1d1f] border border-gray-200">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-bold text-[#1d1d1f]">{addr.recipientName}</p>
                  <p className="text-xs text-[#6e6e73] font-mono mt-0.5">{addr.phone}</p>
                  <p className="text-xs text-[#1d1d1f] mt-2 leading-relaxed">
                    {addr.fullAddress}, {addr.city}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-3 text-xs">
                    <button className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors font-medium">
                      Chỉnh sửa
                    </button>
                    {!addr.isDefault && (
                      <button className="text-[#0071e3] hover:underline font-semibold transition-colors">
                        Thiết lập mặc định
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Electronic Warranty */}
        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Thẻ Bảo Hành Điện Tử Chính Hãng</h3>
              <p className="text-xs text-[#6e6e73]">Tự động kích hoạt khi nhận hàng và kích hoạt bảo hành AppleCare toàn cầu</p>
            </div>

            <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-gray-100 text-[#1d1d1f] border border-gray-200 font-semibold tracking-wider">
                    APPLECARE+ CHÍNH HÃNG
                  </span>
                  <h4 className="text-lg font-bold text-[#1d1d1f] mt-1.5">iPhone 16 Pro 256GB - Titanium Natural</h4>
                  <p className="text-xs text-[#6e6e73] font-mono">Serial: F2LQP9X809M1 • Model: VN/A</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đang Hiệu Lực
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-[#6e6e73] block">Thời hạn bảo hành</span>
                  <span className="font-semibold text-[#1d1d1f]">Đến 30/09/2027 (12 tháng)</span>
                </div>
                <div>
                  <span className="text-[#6e6e73] block">Trung tâm bảo hành</span>
                  <span className="font-semibold text-[#1d1d1f]">Apple Authorized Service Providers (AASP)</span>
                </div>
                <div>
                  <span className="text-[#6e6e73] block">Gói bảo hiểm rơi vỡ</span>
                  <span className="font-semibold text-[#0071e3]">Đã kích hoạt TechZone Care+</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Rewards & Vouchers */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Kho Voucher &amp; Mã Giảm Giá Của Bạn</h3>
              <p className="text-xs text-[#6e6e73]">Nhập các mã này tại bước thanh toán giỏ hàng để được khấu trừ trực tiếp</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-gray-200/80 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[10px] font-mono font-bold">
                    TECHZONE50
                  </span>
                  <span className="text-xs text-rose-600 font-bold">Giảm $50</span>
                </div>
                <h5 className="text-sm font-bold text-[#1d1d1f] mt-2">Voucher Khách Hàng Thân Thiết</h5>
                <p className="text-[11px] text-[#6e6e73] mt-1">Giảm ngay $50 cho mọi đơn hàng từ $300.</p>
                <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-[#86868b]">HSD: 31/12/2026</span>
                  <span className="text-emerald-700 font-semibold">Khả dụng</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200/80 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#0071e3] border border-blue-200 rounded text-[10px] font-mono font-bold">
                    FREESHIP
                  </span>
                  <span className="text-xs text-[#0071e3] font-bold">Free Shipping</span>
                </div>
                <h5 className="text-sm font-bold text-[#1d1d1f] mt-2">Miễn Phí Giao Hàng Hỏa Tốc</h5>
                <p className="text-[11px] text-[#6e6e73] mt-1">Miễn phí ship $15 cho đơn hàng nội thành.</p>
                <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-[#86868b]">HSD: Vô thời hạn</span>
                  <span className="text-emerald-700 font-semibold">Khả dụng</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200/80 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[10px] font-mono font-bold">
                    APPLE10
                  </span>
                  <span className="text-xs text-purple-600 font-bold">Giảm 10%</span>
                </div>
                <h5 className="text-sm font-bold text-[#1d1d1f] mt-2">Ưu Đãi Hệ Sinh Thái Apple</h5>
                <p className="text-[11px] text-[#6e6e73] mt-1">Giảm 10% trên tổng giá trị phụ kiện &amp; thiết bị.</p>
                <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-[#86868b]">HSD: 30/11/2026</span>
                  <span className="text-emerald-700 font-semibold">Khả dụng</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
