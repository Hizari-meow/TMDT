'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  CheckCircle,
  Zap,
  BarChart3,
  Boxes,
  Tag,
  Shield,
  Plus,
  Send,
  Layers,
  Globe,
  X,
  Award,
  History,
  ShieldAlert,
  Mail,
  Share2,
  Monitor,
  Video,
  Server,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminMarketingTab: React.FC = () => {
  const {
    orders,
    coupons,
    setIsCouponModalOpen,
    marketingSubTab,
    setMarketingSubTab,
    marketingData,
    setIsFlashSaleModalOpen,
    setIsComboModalOpen,
    setIsCrossSellModalOpen,
    setIsLoyaltyAdjustModalOpen,
    setIsMarketingCampaignModalOpen,
    setIsBannerModalOpen,
    setIsLandingPageModalOpen,
    handleToggleCoupon,
    handleDeleteCoupon,
    handlePayoutAffiliate,
    handleSyncAdProductFeed
  } = useAdminContext();

          const mData = marketingData || {};
          const couponsList = mData.coupons || coupons || [];
          const flashSlots = mData.flashSaleSlots || [];
          const combos = mData.combos || [];
          const crossSells = mData.crossSellRules || [];
          const loyalty = mData.loyalty || { rules: {}, history: [], stats: {} };
          const campaignsList = mData.campaigns || [];
          const banners = mData.banners || [];
          const landingPages = mData.landingPages || [];
          const adTracking = mData.adTracking || { google: {}, meta: {}, tiktok: {}, utmCampaigns: [] };
          const affiliate = mData.affiliate || { partners: [], referral: {}, antiFraudLogs: [] };

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
                    <span>4.5. Marketing &amp; Khuyến Mãi (Growth Engine)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Doanh Thu &amp; Khách Hàng
                    </span>
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    Kéo khách vào, tăng giá trị đơn hàng (AOV), thúc đẩy mua lặp lại qua Mã giảm giá, Flash Sale chịu tải cao, Tích điểm, Chiến dịch đa kênh, Quảng cáo Pixel &amp; Affiliate.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsCouponModalOpen(true)}
                    className="px-3.5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Mã Coupon</span>
                  </button>
                  <button
                    onClick={() => setIsFlashSaleModalOpen(true)}
                    className="px-3.5 py-2 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Thêm Flash Sale</span>
                  </button>
                  <button
                    onClick={() => setIsMarketingCampaignModalOpen(true)}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1d1d1f] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>Soạn Chiến Dịch</span>
                  </button>
                </div>
              </div>

              {/* Marketing 6 Sub-Tabs Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 text-xs">
                <button
                  onClick={() => setMarketingSubTab('coupons_deals')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    marketingSubTab === 'coupons_deals'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>4.5.1. Mã Giảm Giá &amp; Flash Sale Deal</span>
                </button>
                <button
                  onClick={() => setMarketingSubTab('loyalty')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    marketingSubTab === 'loyalty'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>4.5.2. Tích Điểm &amp; Thành Viên</span>
                </button>
                <button
                  onClick={() => setMarketingSubTab('campaigns')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    marketingSubTab === 'campaigns'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>4.5.3. Chiến Dịch Email, SMS &amp; Push</span>
                </button>
                <button
                  onClick={() => setMarketingSubTab('banners_landing')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    marketingSubTab === 'banners_landing'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>4.5.4. Banner &amp; Landing Page A/B</span>
                </button>
                <button
                  onClick={() => setMarketingSubTab('ad_tracking')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    marketingSubTab === 'ad_tracking'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>4.5.5. Tích Hợp Quảng Cáo Pixel</span>
                </button>
                <button
                  onClick={() => setMarketingSubTab('affiliate_referral')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    marketingSubTab === 'affiliate_referral'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>4.5.6. Affiliate &amp; Giới Thiệu Bạn Bè</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 1: MÃ GIẢM GIÁ, FLASH SALE, COMBO & MUA KÈM            */}
              {/* ------------------------------------------------------------- */}
              {marketingSubTab === 'coupons_deals' && (
                <div className="space-y-6">
                  {/* Top Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Mã Coupon Đang Chạy</p>
                      <p className="text-xl font-bold text-[#1d1d1f] mt-1">{couponsList.length} mã hoạt động</p>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">Đã dùng: {couponsList.reduce((s: number, c: any) => s + (c.usedCount || 0), 0)} lượt</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Khung Giờ Flash Sale</p>
                      <p className="text-xl font-bold text-amber-600 mt-1">{flashSlots.length} khung giờ</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Sức chịu tải: 12,500 RPS</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Combo Bundle Deals</p>
                      <p className="text-xl font-bold text-[#0071e3] mt-1">{combos.length} gói ưu đãi</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Tiết kiệm trung bình: $180/gói</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Quy Tắc Mua Kèm (Cross-sell)</p>
                      <p className="text-xl font-bold text-purple-600 mt-1">{crossSells.length} quy tắc</p>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">Tỷ lệ mua kèm: 34.2%</p>
                    </div>
                  </div>

                  {/* Section 1: Coupons Table */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#0071e3]" />
                          <span>Trung Tâm Quản Lý Mã Giảm Giá (Coupon Hub)</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">
                          Cấu hình giảm %, giảm tiền mặt, miễn phí ship kèm điều kiện đơn tối thiểu, nhóm khách, giới hạn và quy tắc cộng dồn.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCouponModalOpen(true)}
                        className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tạo Mã Coupon</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="py-3 px-3">Mã Coupon</th>
                            <th className="py-3 px-3">Loại &amp; Mức Giảm</th>
                            <th className="py-3 px-3">Đơn Tối Thiểu</th>
                            <th className="py-3 px-3">Lượt Dùng</th>
                            <th className="py-3 px-3">Thời Hạn</th>
                            <th className="py-3 px-3">Cộng Dồn Flash Sale</th>
                            <th className="py-3 px-3">Trạng Thái</th>
                            <th className="py-3 px-3 text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {couponsList.map((cp: any) => (
                            <tr key={cp.code} className="hover:bg-gray-50/80">
                              <td className="py-3 px-3 font-mono font-bold text-rose-600">
                                {cp.code}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-semibold text-[#1d1d1f]">
                                  {cp.type === 'PERCENTAGE' ? `Giảm ${cp.discountValue}%` : cp.type === 'FREESHIP' ? 'Freeship hỏa tốc' : `Giảm $${cp.discountValue}`}
                                </span>
                                <p className="text-[10px] text-[#6e6e73] truncate max-w-xs">{cp.description}</p>
                              </td>
                              <td className="py-3 px-3 font-mono">
                                ${cp.minOrderAmount || 0}
                              </td>
                              <td className="py-3 px-3 font-mono">
                                <span className="text-[#1d1d1f] font-bold">{cp.usedCount || 0}</span>
                                <span className="text-[#86868b]"> / {cp.totalUsageLimit || 500}</span>
                              </td>
                              <td className="py-3 px-3 text-[#6e6e73]">
                                {cp.endDate}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  cp.allowFlashSaleStack
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {cp.allowFlashSaleStack ? 'Có cộng dồn' : 'Không cộng dồn'}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  cp.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {cp.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleToggleCoupon(cp.code)}
                                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold text-[#1d1d1f]"
                                  >
                                    {cp.status === 'ACTIVE' ? 'Tạm Dừng' : 'Kích Hoạt'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCoupon(cp.code)}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-semibold"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: Flash Sale Engine & High Concurrency Infrastructure */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Hạ Tầng Flash Sale &amp; Chống Quá Tải Đột Biến (High-Concurrency Engine)</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">
                          Quản lý khung giờ mở bán giờ vàng, giá sốc, giới hạn kho và kiểm soát đặt hàng đồng thời qua Redis + BullMQ.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsFlashSaleModalOpen(true)}
                        className="px-3 py-1.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Khung Giờ Mới</span>
                      </button>
                    </div>

                    {/* Infrastructure Live Monitor Bar */}
                    <div className="p-4 bg-linear-to-r from-emerald-50/80 via-teal-50/80 to-blue-50/80 border border-emerald-200 rounded-xl">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-[10px] font-semibold text-[#86868b] uppercase">Tỷ Lệ Cache Hit Redis</p>
                          <p className="text-base font-bold text-emerald-700 font-mono mt-0.5">99.7%</p>
                          <p className="text-[10px] text-[#6e6e73]">Giảm 99% tải cho PostgreSQL</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-[#86868b] uppercase">Độ Trễ Hàng Đợi BullMQ</p>
                          <p className="text-base font-bold text-[#0071e3] font-mono mt-0.5">8 - 12 ms</p>
                          <p className="text-[10px] text-[#6e6e73]">50 worker xử lý song song</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-[#86868b] uppercase">Khóa Giữ Hàng (TTL Locks)</p>
                          <p className="text-base font-bold text-purple-700 font-mono mt-0.5">14 Khóa Active</p>
                          <p className="text-[10px] text-[#6e6e73]">Tự động nhả sau 5 phút</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-[#86868b] uppercase">Sức Chịu Tải Đỉnh Điểm</p>
                          <p className="text-base font-bold text-[#1d1d1f] font-mono mt-0.5">15,000 RPS</p>
                          <p className="text-[10px] text-emerald-700 font-bold">🟢 HẠ TẦNG VỮNG CHẮC</p>
                        </div>
                      </div>
                    </div>

                    {/* Flash Sale Slots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flashSlots.map((slot: any) => (
                        <div key={slot.id} className="p-4 bg-[#f5f5f7] border border-gray-200 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-bold text-sm text-[#1d1d1f]">{slot.title}</h5>
                              <p className="text-xs text-[#6e6e73] font-medium">{slot.slotTime}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              slot.status === 'RUNNING'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {slot.status === 'RUNNING' ? '⚡ ĐANG DIỄN RA' : 'SẮP MỞ BÁN'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {(slot.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="p-2.5 bg-white rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold text-[#1d1d1f]">{item.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-bold text-rose-600 font-mono">${item.salePrice}</span>
                                    <span className="text-[#86868b] line-through font-mono text-[10px]">${item.originalPrice}</span>
                                    <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 text-[9px] font-bold rounded">-{item.discountPercent}%</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[11px] font-mono text-[#6e6e73]">Đã bán: <strong>{item.sold}/{item.stock}</strong></p>
                                  <div className="w-20 bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div
                                      className="bg-rose-500 h-full rounded-full"
                                      style={{ width: `${Math.round((item.sold / item.stock) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Combos & Bundles */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-purple-600" />
                          <span>Gói Combo / Bundle Deal Tiết Kiệm</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">Gói nhiều sản phẩm với mức giá hấp dẫn để kích thích tăng kích thước giỏ hàng.</p>
                      </div>
                      <button
                        onClick={() => setIsComboModalOpen(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tạo Combo Mới</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {combos.map((cmb: any) => (
                        <div key={cmb.id} className="p-4 bg-white border border-purple-200 rounded-xl space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-[#1d1d1f]">{cmb.name}</h5>
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">Tiết kiệm ${cmb.savings}</span>
                          </div>
                          <p className="text-[11px] text-[#6e6e73]">{cmb.description}</p>
                          <div className="space-y-1 py-1 border-t border-b border-gray-100 text-[11px]">
                            {(cmb.items || []).map((it: string, i: number) => (
                              <p key={i} className="text-[#1d1d1f] flex items-center gap-1.5">
                                <CheckCircle className="w-3 h-3 text-purple-600 shrink-0" />
                                <span>{it}</span>
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="text-base font-bold text-emerald-700 font-mono">${cmb.bundlePrice}</span>
                              <span className="text-xs text-[#86868b] line-through font-mono ml-1.5">${cmb.originalPrice}</span>
                            </div>
                            <span className="text-[10px] text-[#6e6e73]">Đã bán: <strong>{cmb.soldCount}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Cross-sell & Upsell & Auto Promo */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span>Mua Kèm Giảm Giá (Cross-Sell / Upsell) &amp; Khuyến Mãi Tự Động</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">Tự động gợi ý mua kèm phụ kiện, nâng cấp phiên bản và mua 2 tặng 1.</p>
                      </div>
                      <button
                        onClick={() => setIsCrossSellModalOpen(true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Quy Tắc Mua Kèm</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {crossSells.map((rule: any) => (
                        <div key={rule.id} className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                              {rule.type === 'CROSS_SELL' ? 'MUA KÈM (CROSS-SELL)' : rule.type === 'UPSELL' ? 'NÂNG CẤP (UPSELL)' : rule.type === 'AUTO_PROMO' ? 'MUA 2 TẶNG 1' : 'QUÀ TẶNG KÈM'}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold">Chuyển đổi: {rule.conversionRate}</span>
                          </div>
                          <p className="font-bold text-[#1d1d1f]">Khi khách mua: {rule.triggerProduct}</p>
                          <p className="text-[#6e6e73]">Gợi ý thêm: <strong>{rule.suggestedProduct}</strong></p>
                          <p className="text-emerald-900 font-semibold p-2 bg-white rounded-lg border border-emerald-200">
                            Ưu đãi: {rule.discountOffer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 2: TÍCH ĐIỂM & THÀNH VIÊN                              */}
              {/* ------------------------------------------------------------- */}
              {marketingSubTab === 'loyalty' && (
                <div className="space-y-6">
                  {/* Loyalty Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Điểm Thưởng Đang Lưu Hành</p>
                      <p className="text-xl font-bold text-amber-600 mt-1">{(loyalty.stats?.activePoints || 558400).toLocaleString()} pts</p>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">Tương đương: ${(loyalty.stats?.activePoints ? loyalty.stats.activePoints / 100 : 5584).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Điểm Đã Được Khách Tiêu</p>
                      <p className="text-xl font-bold text-[#1d1d1f] mt-1">{(loyalty.stats?.redeemedPoints || 924100).toLocaleString()} pts</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Đã chiết khấu cho khách: $9,241</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Hội Viên Tích Điểm</p>
                      <p className="text-xl font-bold text-[#0071e3] mt-1">{loyalty.stats?.loyaltyMembersCount || 842} hội viên</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Tỷ lệ tham gia: 87.5%</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Hạn Dùng Điểm Thưởng</p>
                      <p className="text-xl font-bold text-purple-600 mt-1">365 Ngày</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Kể từ ngày cộng điểm</p>
                    </div>
                  </div>

                  {/* Loyalty Rules & Tier Multipliers */}
                  <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Quy Tắc Quy Đổi Điểm Thưởng &amp; Hệ Số Nhân Theo Hạng</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">Chi tiêu $1 = tích 1 điểm (1% hoàn tiền). 100 điểm quy đổi thành $1 trừ trực tiếp khi thanh toán.</p>
                      </div>
                      <button
                        onClick={() => setIsLoyaltyAdjustModalOpen(true)}
                        className="px-3 py-1.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Điều Chỉnh Điểm Thủ Công</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-orange-50/50 border border-orange-200 rounded-xl space-y-1">
                        <span className="font-bold text-orange-900">🥉 Hạng Đồng (Bronze)</span>
                        <p className="text-[11px] text-orange-800">Hoàn tiền 1% (1.0x)</p>
                        <p className="text-[10px] text-[#6e6e73]">Chi tiêu: &lt; $300</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1">
                        <span className="font-bold text-slate-900">🥈 Hạng Bạc (Silver)</span>
                        <p className="text-[11px] text-slate-800">Hoàn tiền 2% (2.0x)</p>
                        <p className="text-[10px] text-[#6e6e73]">Chi tiêu: $300 - $999</p>
                      </div>
                      <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                        <span className="font-bold text-amber-900">🥇 Hạng Vàng (Gold)</span>
                        <p className="text-[11px] text-amber-800">Hoàn tiền 3% (3.0x)</p>
                        <p className="text-[10px] text-[#6e6e73]">Chi tiêu: $1,000 - $2,999</p>
                      </div>
                      <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-1">
                        <span className="font-bold text-purple-900">💎 Hạng Kim Cương</span>
                        <p className="text-[11px] text-purple-800">Hoàn tiền 5% (5.0x)</p>
                        <p className="text-[10px] text-[#6e6e73]">Chi tiêu: &ge; $3,000</p>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty Points History Ledger */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <History className="w-4 h-4 text-[#0071e3]" />
                      <span>Nhật Ký Tích Lũy &amp; Trừ Điểm Khách Hàng (Loyalty Ledger)</span>
                    </h4>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="py-3 px-3">Thời Gian</th>
                            <th className="py-3 px-3">Khách Hàng</th>
                            <th className="py-3 px-3">Biến Động Điểm</th>
                            <th className="py-3 px-3">Số Dư Sau Đó</th>
                            <th className="py-3 px-3">Lý Do Nghiệp Vụ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(loyalty.history || []).map((h: any) => (
                            <tr key={h.id} className="hover:bg-gray-50/80">
                              <td className="py-3 px-3 text-[#6e6e73]">
                                {new Date(h.createdAt).toLocaleString('vi-VN')}
                              </td>
                              <td className="py-3 px-3 font-semibold text-[#1d1d1f]">
                                {h.customerName}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold">
                                <span className={h.deltaPoints > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                                  {h.deltaPoints > 0 ? `+${h.deltaPoints}` : h.deltaPoints} pts
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#1d1d1f]">
                                {h.balanceAfter} pts
                              </td>
                              <td className="py-3 px-3 text-[#6e6e73]">
                                {h.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 3: CHIẾN DỊCH EMAIL, SMS & PUSH                        */}
              {/* ------------------------------------------------------------- */}
              {marketingSubTab === 'campaigns' && (
                <div className="space-y-6">
                  {/* Channels Status */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="p-3 bg-white border border-gray-200/80 rounded-xl space-y-1 shadow-2xs">
                      <p className="text-[10px] text-[#86868b] uppercase font-semibold">Email SendGrid</p>
                      <p className="font-bold text-xs text-emerald-700">98.9% Vào Inbox</p>
                      <p className="text-[10px] text-[#6e6e73]">Domain DKIM/SPF OK</p>
                    </div>
                    <div className="p-3 bg-white border border-gray-200/80 rounded-xl space-y-1 shadow-2xs">
                      <p className="text-[10px] text-[#86868b] uppercase font-semibold">SMS Brandname</p>
                      <p className="font-bold text-xs text-[#0071e3]">500 SMS/giây</p>
                      <p className="text-[10px] text-[#6e6e73]">Telco Viettel/VNPT</p>
                    </div>
                    <div className="p-3 bg-white border border-gray-200/80 rounded-xl space-y-1 shadow-2xs">
                      <p className="text-[10px] text-[#86868b] uppercase font-semibold">Firebase FCM</p>
                      <p className="font-bold text-xs text-purple-700">18,450 Thiết Bị</p>
                      <p className="text-[10px] text-[#6e6e73]">Tỷ lệ gửi: 99.2%</p>
                    </div>
                    <div className="p-3 bg-white border border-gray-200/80 rounded-xl space-y-1 shadow-2xs">
                      <p className="text-[10px] text-[#86868b] uppercase font-semibold">Zalo OA Official</p>
                      <p className="font-bold text-xs text-blue-700">12,300 Follower</p>
                      <p className="text-[10px] text-[#6e6e73]">ZNS API xác thực</p>
                    </div>
                    <div className="p-3 bg-white border border-gray-200/80 rounded-xl space-y-1 shadow-2xs">
                      <p className="text-[10px] text-[#86868b] uppercase font-semibold">Messenger API</p>
                      <p className="font-bold text-xs text-[#1d1d1f]">99% Phản Hồi</p>
                      <p className="text-[10px] text-[#6e6e73]">Chatbot tự động 24/7</p>
                    </div>
                  </div>

                  {/* Campaigns Table */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Send className="w-4 h-4 text-[#0071e3]" />
                          <span>Chiến Dịch Tiếp Thị Đa Kênh (Omnichannel Campaigns)</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">Soạn thảo template, chèn tên khách hàng, hẹn giờ gửi và đo lường tỷ lệ mở, click, chuyển đổi, doanh thu.</p>
                      </div>
                      <button
                        onClick={() => setIsMarketingCampaignModalOpen(true)}
                        className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tạo Chiến Dịch Mới</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="py-3 px-3">Chiến Dịch &amp; Kênh</th>
                            <th className="py-3 px-3">Tệp Nhận</th>
                            <th className="py-3 px-3">Tiêu Đề / Nội Dung</th>
                            <th className="py-3 px-3">Lịch Gửi</th>
                            <th className="py-3 px-3">Tỷ Lệ Mở</th>
                            <th className="py-3 px-3">Click (CTR)</th>
                            <th className="py-3 px-3">Chuyển Đổi</th>
                            <th className="py-3 px-3">Doanh Thu</th>
                            <th className="py-3 px-3">Tuân Thủ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {campaignsList.map((cmp: any) => (
                            <tr key={cmp.id} className="hover:bg-gray-50/80">
                              <td className="py-3 px-3">
                                <p className="font-bold text-[#1d1d1f]">{cmp.name}</p>
                                <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  cmp.channel === 'EMAIL' ? 'bg-blue-50 text-blue-700' : cmp.channel === 'SMS' ? 'bg-purple-50 text-purple-700' : cmp.channel === 'PUSH' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
                                }`}>
                                  Kênh: {cmp.channel}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[#6e6e73]">
                                {cmp.targetSegment}
                              </td>
                              <td className="py-3 px-3 max-w-xs truncate text-[#1d1d1f]">
                                {cmp.subject}
                              </td>
                              <td className="py-3 px-3 text-[#6e6e73] text-[11px]">
                                {cmp.schedule}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                                {cmp.openRate}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">
                                {cmp.clickRate}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-purple-700">
                                {cmp.conversionRate}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                                ${(cmp.revenueGenerated || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded">
                                  ✓ Opt-in
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 4: BANNER & LANDING PAGE                               */}
              {/* ------------------------------------------------------------- */}
              {marketingSubTab === 'banners_landing' && (
                <div className="space-y-6">
                  {/* Banners Manager */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#0071e3]" />
                          <span>Quản Lý Banner Quảng Cáo &amp; Popup</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">Vị trí slider trang chủ, banner giữa trang, popup đăng ký nhận voucher.</p>
                      </div>
                      <button
                        onClick={() => setIsBannerModalOpen(true)}
                        className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Banner Mới</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {banners.map((bnr: any) => (
                        <div key={bnr.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-2xs">
                          <div className="w-full h-32 rounded-lg bg-gray-100 overflow-hidden relative">
                            <img src={bnr.imageUrl} alt={bnr.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
                              {bnr.placement}
                            </span>
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-[#1d1d1f] truncate">{bnr.title}</h5>
                            <p className="text-[10px] text-[#6e6e73]">Thiết bị: {bnr.device} • Link: {bnr.targetUrl}</p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-mono">
                            <span>Lượt xem: <strong>{(bnr.impressions || 0).toLocaleString()}</strong></span>
                            <span className="text-[#0071e3] font-bold">CTR: {bnr.ctr}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Landing Pages & A/B Testing */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-600" />
                          <span>Landing Page Chiến Dịch &amp; Công Cụ A/B Testing</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-0.5">Trang đích mở bán đặc biệt kèm đồng hồ đếm ngược, form lead và đo lường A/B testing.</p>
                      </div>
                      <button
                        onClick={() => setIsLandingPageModalOpen(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tạo Landing Page Mới</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {landingPages.map((lp: any) => (
                        <div key={lp.id} className="p-5 bg-[#f5f5f7] border border-gray-200 rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-bold text-sm text-[#1d1d1f]">{lp.title}</h5>
                              <p className="text-xs text-[#6e6e73] font-mono">{lp.slug} • Khách đăng ký sớm: <strong>{lp.leadsCaptured} leads</strong></p>
                            </div>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                              ĐÃ XUẤT BẢN
                            </span>
                          </div>

                          {/* A/B Testing Box */}
                          {lp.abTesting && (
                            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#1d1d1f]">🧪 Kết Quả Thử Nghiệm A/B Testing (Headline Copywriting Test)</span>
                                <span className="text-[10px] font-bold text-emerald-700">Tăng trưởng: +52% Chuyển Đổi</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                                  <p className="font-bold text-gray-700">{lp.abTesting.variantA.name}</p>
                                  <p className="text-[#6e6e73]">Lượt xem: {lp.abTesting.variantA.visitors.toLocaleString()} • Chuyển đổi: {lp.abTesting.variantA.conversions}</p>
                                  <p className="font-mono font-bold text-xs text-[#1d1d1f]">CVR: {lp.abTesting.variantA.cvr}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 space-y-1 relative">
                                  <span className="absolute top-2 right-2 px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-bold rounded">
                                    CHIẾN THẮNG
                                  </span>
                                  <p className="font-bold text-emerald-950">{lp.abTesting.variantB.name}</p>
                                  <p className="text-emerald-800">Lượt xem: {lp.abTesting.variantB.visitors.toLocaleString()} • Chuyển đổi: {lp.abTesting.variantB.conversions}</p>
                                  <p className="font-mono font-bold text-xs text-emerald-700">CVR: {lp.abTesting.variantB.cvr}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 5: TÍCH HỢP QUẢNG CÁO & PIXEL                          */}
              {/* ------------------------------------------------------------- */}
              {marketingSubTab === 'ad_tracking' && (
                <div className="space-y-6">
                  {/* Ad Platforms Sync */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Google */}
                    <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-[#1d1d1f]">Google Ads &amp; Merchant Center</h5>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">ĐÃ KẾT NỐI</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-[#6e6e73]">GA4 ID: <strong className="font-mono text-[#1d1d1f]">{adTracking.google.ga4MeasurementId}</strong></p>
                        <p className="text-[#6e6e73]">Enhanced Conversions: <strong>Đang bật</strong></p>
                        <p className="text-[#6e6e73]">Đã đồng bộ: <strong>{adTracking.google.syncedProducts} sản phẩm Shopping</strong></p>
                      </div>
                      <button
                        onClick={() => handleSyncAdProductFeed('GOOGLE')}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl text-xs transition-colors"
                      >
                        Đồng Bộ Feed Google Shopping
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-[#1d1d1f]">Meta Pixel &amp; CAPI</h5>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">ĐÃ KẾT NỐI</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-[#6e6e73]">Pixel ID: <strong className="font-mono text-[#1d1d1f]">{adTracking.meta.pixelId}</strong></p>
                        <p className="text-[#6e6e73]">Event Match Quality: <strong className="text-emerald-700">{adTracking.meta.eventMatchQuality}</strong></p>
                        <p className="text-[#6e6e73]">Server Events 24h: <strong>{adTracking.meta.serverEventsSent24h?.toLocaleString()} events</strong></p>
                      </div>
                      <button
                        onClick={() => handleSyncAdProductFeed('META')}
                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs transition-colors"
                      >
                        Đồng Bộ Catalog Facebook Ads
                      </button>
                    </div>

                    {/* TikTok */}
                    <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-[#1d1d1f]">TikTok Pixel &amp; TikTok Shop</h5>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">ĐÃ KẾT NỐI</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-[#6e6e73]">Pixel ID: <strong className="font-mono text-[#1d1d1f]">{adTracking.tiktok.pixelId}</strong></p>
                        <p className="text-[#6e6e73]">TikTok Shop Sync: <strong>Kích hoạt</strong></p>
                        <p className="text-[#6e6e73]">Video Ads Tracking: <strong>Sẵn sàng</strong></p>
                      </div>
                      <button
                        onClick={() => handleSyncAdProductFeed('TIKTOK')}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl text-xs transition-colors"
                      >
                        Đồng Bộ Catalog TikTok Shop
                      </button>
                    </div>
                  </div>

                  {/* UTM Campaigns Tracking Table */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#0071e3]" />
                      <span>Theo Dõi Hiệu Quả Quảng Cáo Theo UTM Campaign Tracking</span>
                    </h4>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="py-3 px-3">Chiến Dịch UTM</th>
                            <th className="py-3 px-3">Kênh (Medium)</th>
                            <th className="py-3 px-3">Lượt Nhấp (Clicks)</th>
                            <th className="py-3 px-3">Đơn Hàng</th>
                            <th className="py-3 px-3">Doanh Thu</th>
                            <th className="py-3 px-3 font-bold">Chỉ Số ROAS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(adTracking.utmCampaigns || []).map((utm: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50/80">
                              <td className="py-3 px-3 font-mono font-bold text-[#1d1d1f]">
                                {utm.utmCampaign} ({utm.utmSource})
                              </td>
                              <td className="py-3 px-3 text-[#6e6e73]">
                                {utm.utmMedium}
                              </td>
                              <td className="py-3 px-3 font-mono">
                                {utm.clicks.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">
                                {utm.orders} đơn
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                                ${(utm.revenue || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-purple-700">
                                {utm.roas}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 6: TIẾP THỊ LIÊN KẾT (AFFILIATE) & GIỚI THIỆU BẠN BÈ     */}
              {/* ------------------------------------------------------------- */}
              {marketingSubTab === 'affiliate_referral' && (
                <div className="space-y-6">
                  {/* Referral 2-Way Box */}
                  <div className="p-5 bg-linear-to-r from-blue-50/80 to-purple-50/80 border border-blue-200 rounded-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#0071e3]" />
                          <span>Chương Trình Giới Thiệu Bạn Bè (Customer Referral)</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-1">
                          Cơ chế thưởng 2 chiều: <strong>{affiliate.referral?.referrerReward}</strong> và <strong>{affiliate.referral?.refereeReward}</strong>.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-emerald-700 font-mono">
                          {affiliate.referral?.totalReferralsCount} Lượt Thành Công
                        </p>
                        <p className="text-xs text-[#6e6e73]">Doanh thu: ${(affiliate.referral?.totalReferralRevenue || 148200).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Partners Table */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#0071e3]" />
                      <span>Đối Tác Tiếp Thị Liên Kết (KOL / KOC Affiliate Network)</span>
                    </h4>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="py-3 px-3">Đối Tác</th>
                            <th className="py-3 px-3">Mã &amp; Link Giới Thiệu</th>
                            <th className="py-3 px-3">Hoa Hồng (%)</th>
                            <th className="py-3 px-3">Đơn Đã Tạo</th>
                            <th className="py-3 px-3">Doanh Thu Mang Lại</th>
                            <th className="py-3 px-3">Hoa Hồng Chờ Trả</th>
                            <th className="py-3 px-3 text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(affiliate.partners || []).map((pt: any) => (
                            <tr key={pt.id} className="hover:bg-gray-50/80">
                              <td className="py-3 px-3">
                                <p className="font-bold text-[#1d1d1f]">{pt.name}</p>
                                <p className="text-[10px] text-[#86868b]">{pt.bankInfo}</p>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                                  {pt.code}
                                </span>
                                <p className="text-[10px] text-[#86868b] font-mono mt-0.5 truncate max-w-xs">{pt.link}</p>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#1d1d1f]">
                                {pt.commissionRate}%
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#0071e3]">
                                {pt.totalOrders} đơn
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                                ${(pt.totalRevenue || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-amber-700">
                                ${(pt.unpaidCommission || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handlePayoutAffiliate(pt.id)}
                                  disabled={pt.unpaidCommission <= 0}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-[10px] font-semibold transition-colors"
                                >
                                  {pt.unpaidCommission > 0 ? 'Thanh Toán' : 'Đã Quyết Toán'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Anti-Fraud Shield Box */}
                  <div className="p-5 bg-white border border-rose-200 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Lá Chắn Chống Gian Lận Giới Thiệu (Anti-Fraud Shield)</span>
                      </h4>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded">
                        BẢO VỆ THỜI GIAN THỰC
                      </span>
                    </div>
                    <p className="text-xs text-[#6e6e73]">
                      Tự động phát hiện và chặn đứng các hành vi tự giới thiệu chính mình (Self-referral qua trùng IP/Device Fingerprint) hoặc dùng bot tạo tài khoản ảo.
                    </p>

                    <div className="space-y-2 pt-1">
                      {(affiliate.antiFraudLogs || []).map((log: any) => (
                        <div key={log.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-rose-900">⛔ {log.type}</span>
                            <p className="text-[#6e6e73] text-[11px] mt-0.5">{log.reason}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">
                              {log.actionTaken}
                            </span>
                            <p className="text-[10px] text-[#86868b] mt-0.5">
                              {new Date(log.detectedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
};
