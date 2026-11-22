'use client';

import React from 'react';

import {
  Users,
  CheckCircle,
  Search,
  Boxes,
  Download,
  Send,
  Sparkles,
  Eye,
  Award,
  Mail,
  Target,
  Share2
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminCustomersTab: React.FC = () => {
  const {
    customers,
    crmSubTab,
    setCrmSubTab,
    customerSearch,
    setCustomerSearch,
    customerTierFilter,
    setCustomerTierFilter,
    customerLifecycleFilter,
    setCustomerLifecycleFilter,
    customerSourceFilter,
    setCustomerSourceFilter,
    customerBehaviorFilter,
    setCustomerBehaviorFilter,
    remarketingSyncLoading,
    automationWorkflows,
    handleOpenCustomer360,
    handleOpenCampaignModal,
    handleSyncRemarketing,
    handleToggleWorkflow,
    handleExportCSV
  } = useAdminContext();

          const filteredCustomers = customers.filter((c) => {
            const matchSearch =
              !customerSearch ||
              c.fullName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
              c.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
              (c.phone && c.phone.includes(customerSearch)) ||
              (c.tags && Array.isArray(c.tags) && c.tags.some((t: string) => t.toLowerCase().includes(customerSearch.toLowerCase())));
            const matchTier = customerTierFilter === 'ALL' || c.tier === customerTierFilter;
            const matchLifecycle = customerLifecycleFilter === 'ALL' || c.lifecycle === customerLifecycleFilter;
            const matchSource = customerSourceFilter === 'ALL' || c.acquisitionSource === customerSourceFilter;
            const matchBehavior = customerBehaviorFilter === 'ALL' || c.behavior === customerBehaviorFilter;
            return matchSearch && matchTier && matchLifecycle && matchSource && matchBehavior;
          });

          const totalCust = customers.length;
          const vipCust = customers.filter(c => c.tier === 'DIAMOND' || c.tier === 'GOLD').length;
          const avgLtv = totalCust > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / totalCust) : 0;
          const avgAov = totalCust > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.aov || 0), 0) / totalCust) : 0;
          const avgReturn = totalCust > 0 ? (customers.reduce((sum, c) => sum + (parseFloat(c.returnRate) || 0), 0) / totalCust).toFixed(1) : '0';

          return (
            <div className="space-y-6">
              {/* Header & Sub-navigation */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
                    <span>4.4. Quản Lý Khách Hàng (CRM) &amp; Phân Nhóm RFM</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Chăm sóc &amp; Remarketing
                    </span>
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    Thấu hiểu khách hàng là ai, mua gì để giữ chân và bán thêm qua hồ sơ 360°, ma trận RFM, kịch bản tự động hóa và đồng bộ Ads.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCampaignModal(undefined, 'VIP')}
                    className="px-3.5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tạo Chiến Dịch CSKH</span>
                  </button>
                  <button
                    onClick={() => handleExportCSV('Khach_Hang_CRM', filteredCustomers)}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1d1d1f] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#6e6e73]" />
                    <span>Xuất CSV</span>
                  </button>
                </div>
              </div>

              {/* CRM Sub-Tabs Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 text-xs">
                <button
                  onClick={() => setCrmSubTab('list')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    crmSubTab === 'list'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>4.4.1. Hồ Sơ &amp; Lịch Sử Mua Hàng ({customers.length})</span>
                </button>
                <button
                  onClick={() => setCrmSubTab('rfm_segments')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    crmSubTab === 'rfm_segments'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>4.4.2. Phân Nhóm &amp; Ma Trận RFM</span>
                </button>
                <button
                  onClick={() => setCrmSubTab('automation')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    crmSubTab === 'automation'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>4.4.3. Chăm Sóc &amp; Tự Động Hóa (Automation &amp; Remarketing)</span>
                </button>
                <button
                  onClick={() => setCrmSubTab('tiers')}
                  className={`px-4 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    crmSubTab === 'tiers'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-[#6e6e73] border border-gray-200'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>4.4.4. Chính Sách Hạng Thành Viên</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 1: HỒ SƠ & LỊCH SỬ MUA HÀNG                            */}
              {/* ------------------------------------------------------------- */}
              {crmSubTab === 'list' && (
                <div className="space-y-5">
                  {/* Top CRM Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Tổng Khách &amp; LTV Trung Bình</p>
                      <p className="text-xl font-bold text-[#1d1d1f] mt-1">{totalCust} khách</p>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">LTV TB: ${avgLtv.toLocaleString()} / khách</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Khách VIP &amp; Giữ Chân</p>
                      <p className="text-xl font-bold text-amber-600 mt-1">{vipCust} VIP</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Chiếm {totalCust > 0 ? Math.round((vipCust / totalCust) * 100) : 0}% tổng tệp</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Giá Trị Đơn Trung Bình (AOV)</p>
                      <p className="text-xl font-bold text-[#0071e3] mt-1">${avgAov.toLocaleString()}</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Tần suất mua TB: 18 - 25 ngày</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                      <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Tỷ Lệ Hoàn Trả Bình Quân</p>
                      <p className="text-xl font-bold text-emerald-600 mt-1">{avgReturn}%</p>
                      <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Mức an toàn (&lt; 5%)</p>
                    </div>
                  </div>

                  {/* Comprehensive Filters Bar */}
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                      <div className="relative lg:col-span-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#86868b]" />
                        <input
                          type="text"
                          placeholder="Tìm tên, email, sđt, tag..."
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-[#f5f5f7] border border-gray-200 rounded-xl text-[#1d1d1f] focus:outline-hidden focus:border-[#0071e3]"
                        />
                      </div>
                      <div>
                        <select
                          value={customerTierFilter}
                          onChange={(e) => setCustomerTierFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-[#f5f5f7] border border-gray-200 rounded-xl text-[#1d1d1f] font-medium focus:outline-hidden"
                        >
                          <option value="ALL">Hạng Thành Viên: Tất cả</option>
                          <option value="DIAMOND">💎 Kim Cương (Diamond)</option>
                          <option value="GOLD">🥇 Vàng (Gold)</option>
                          <option value="SILVER">🥈 Bạc (Silver)</option>
                          <option value="BRONZE">🥉 Đồng (Bronze)</option>
                        </select>
                      </div>
                      <div>
                        <select
                          value={customerLifecycleFilter}
                          onChange={(e) => setCustomerLifecycleFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-[#f5f5f7] border border-gray-200 rounded-xl text-[#1d1d1f] font-medium focus:outline-hidden"
                        >
                          <option value="ALL">Vòng Đời: Tất cả</option>
                          <option value="NEW">Khách Mới (&lt; 30 ngày)</option>
                          <option value="RETURNING">Khách Quay Lại (&ge; 2 đơn)</option>
                          <option value="HIBERNATING">Khách Ngủ Đông (Lâu không mua)</option>
                          <option value="LOST">Khách Đã Mất (&gt; 180 ngày)</option>
                        </select>
                      </div>
                      <div>
                        <select
                          value={customerSourceFilter}
                          onChange={(e) => setCustomerSourceFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-[#f5f5f7] border border-gray-200 rounded-xl text-[#1d1d1f] font-medium focus:outline-hidden"
                        >
                          <option value="ALL">Nguồn Đến: Tất cả</option>
                          <option value="FACEBOOK_ADS">Facebook Ads</option>
                          <option value="GOOGLE_SEARCH">Google Ads / Search</option>
                          <option value="REFERRAL">Giới Thiệu (Referral)</option>
                          <option value="DIRECT">Trực Tiếp (Organic)</option>
                        </select>
                      </div>
                      <div>
                        <select
                          value={customerBehaviorFilter}
                          onChange={(e) => setCustomerBehaviorFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-[#f5f5f7] border border-gray-200 rounded-xl text-[#1d1d1f] font-medium focus:outline-hidden"
                        >
                          <option value="ALL">Hành Vi: Tất cả</option>
                          <option value="FREQUENT_BUYER">Mua Thường Xuyên</option>
                          <option value="CART_ABANDONED">Bỏ Giỏ Hàng Chưa Mua</option>
                          <option value="VIEW_ONLY">Chỉ Xem Không Mua</option>
                          <option value="HIGH_RETURN">Hay Đổi Trả Hàng</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Customer Table */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Khách Hàng &amp; Nguồn Đến</th>
                            <th className="py-3 px-3">Hạng &amp; Điểm RFM</th>
                            <th className="py-3 px-3">Vòng Đời &amp; Hành Vi</th>
                            <th className="py-3 px-3">Đơn Hàng / AOV</th>
                            <th className="py-3 px-3">Chi Tiêu LTV &amp; Tần Suất</th>
                            <th className="py-3 px-3">Tỷ Lệ Hoàn</th>
                            <th className="py-3 px-3">Thẻ (Tags)</th>
                            <th className="py-3 px-4 text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredCustomers.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-10 text-center text-[#86868b]">
                                Không tìm thấy khách hàng nào phù hợp với bộ lọc hiện tại.
                              </td>
                            </tr>
                          ) : (
                            filteredCustomers.map((c) => (
                              <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                      {c.fullName ? c.fullName.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#1d1d1f] leading-snug">{c.fullName}</p>
                                      <p className="text-[11px] text-[#6e6e73] font-mono">{c.email}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-[#86868b]">{c.phone}</span>
                                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                                          c.acquisitionSource === 'FACEBOOK_ADS'
                                            ? 'bg-blue-50 text-blue-700'
                                            : c.acquisitionSource === 'GOOGLE_SEARCH'
                                            ? 'bg-red-50 text-red-700'
                                            : c.acquisitionSource === 'REFERRAL'
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                          {c.acquisitionSource === 'FACEBOOK_ADS' ? 'Facebook' : c.acquisitionSource === 'GOOGLE_SEARCH' ? 'Google' : c.acquisitionSource === 'REFERRAL' ? 'Giới thiệu' : 'Trực tiếp'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="space-y-1">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      c.tier === 'DIAMOND'
                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                        : c.tier === 'GOLD'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : c.tier === 'SILVER'
                                        ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                                    }`}>
                                      {c.tier === 'DIAMOND' ? '💎 KIM CƯƠNG' : c.tier === 'GOLD' ? '🥇 VÀNG' : c.tier === 'SILVER' ? '🥈 BẠC' : '🥉 ĐỒNG'}
                                    </span>
                                    <div className="text-[10px] font-mono text-[#0071e3] font-semibold">
                                      RFM: {c.rfmScore || '4-5-5'}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="space-y-1">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                                      c.lifecycle === 'NEW'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : c.lifecycle === 'RETURNING'
                                        ? 'bg-blue-50 text-blue-700'
                                        : c.lifecycle === 'HIBERNATING'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-rose-50 text-rose-700'
                                    }`}>
                                      {c.lifecycle === 'NEW' ? 'Khách Mới' : c.lifecycle === 'RETURNING' ? 'Quay Lại' : c.lifecycle === 'HIBERNATING' ? 'Ngủ Đông' : 'Đã Mất'}
                                    </span>
                                    <div>
                                      <span className={`inline-block text-[10px] font-medium ${
                                        c.behavior === 'CART_ABANDONED'
                                          ? 'text-amber-600'
                                          : c.behavior === 'HIGH_RETURN'
                                          ? 'text-rose-600'
                                          : c.behavior === 'FREQUENT_BUYER'
                                          ? 'text-emerald-600'
                                          : 'text-[#86868b]'
                                      }`}>
                                        {c.behavior === 'CART_ABANDONED' ? 'Bỏ giỏ hàng' : c.behavior === 'HIGH_RETURN' ? 'Hay đổi trả' : c.behavior === 'FREQUENT_BUYER' ? 'Mua thường xuyên' : 'Chỉ xem'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  <p className="font-bold text-[#1d1d1f]">{c.orderCount} đơn</p>
                                  <p className="text-[10px] text-[#6e6e73]">${c.aov || 0}/đơn</p>
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  <p className="font-bold text-emerald-700">${c.totalSpent.toLocaleString()}</p>
                                  <p className="text-[10px] text-[#86868b]">{c.purchaseFrequencyDays ? `${c.purchaseFrequencyDays} ngày/lần` : 'Chưa xác định'}</p>
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`font-mono text-xs font-semibold ${
                                    parseFloat(c.returnRate) > 10 ? 'text-rose-600 font-bold' : 'text-[#6e6e73]'
                                  }`}>
                                    {c.returnRate || '0%'}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-wrap gap-1 max-w-[140px]">
                                    {c.tags && c.tags.length > 0 ? (
                                      c.tags.slice(0, 2).map((t: string) => (
                                        <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-[#1d1d1f] rounded text-[10px] font-medium">
                                          #{t}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-[#86868b] italic">Chưa gắn thẻ</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleOpenCustomer360(c)}
                                      className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-[#1d1d1f] rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                                    >
                                      <Eye className="w-3 h-3 text-[#0071e3]" />
                                      <span>Hồ Sơ 360°</span>
                                    </button>
                                    <button
                                      onClick={() => handleOpenCampaignModal(c)}
                                      className="px-2.5 py-1 bg-[#f5f5f7] hover:bg-blue-50 text-[#0071e3] border border-blue-200 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Gửi Tin</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 2: PHÂN NHÓM & MÔ HÌNH RFM                             */}
              {/* ------------------------------------------------------------- */}
              {crmSubTab === 'rfm_segments' && (
                <div className="space-y-6">
                  {/* RFM Explanation Banner */}
                  <div className="p-5 bg-linear-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#0071e3]" />
                          <span>Mô Hình Chấm Điểm RFM (Recency - Frequency - Monetary)</span>
                        </h4>
                        <p className="text-xs text-[#6e6e73] mt-1 max-w-2xl">
                          Chấm điểm thang 1 - 5 cho 3 chỉ số then chốt: <strong>R (Mua gần đây không)</strong>, <strong>F (Mua bao nhiêu lần)</strong>, <strong>M (Chi bao nhiêu tiền)</strong>. Tự động chia tệp khách hàng để tối ưu chi phí quảng cáo và cá nhân hóa kịch bản CSKH.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleSyncRemarketing('FACEBOOK', 'VIP')}
                          disabled={remarketingSyncLoading !== null}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{remarketingSyncLoading === 'FACEBOOK_VIP' ? 'Đang đẩy...' : 'Đẩy Meta Ads'}</span>
                        </button>
                        <button
                          onClick={() => handleSyncRemarketing('GOOGLE', 'VIP')}
                          disabled={remarketingSyncLoading !== null}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{remarketingSyncLoading === 'GOOGLE_VIP' ? 'Đang đẩy...' : 'Đẩy Google Ads'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 5 RFM Strategic Segments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 1. Champions */}
                    <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h5 className="font-bold text-sm text-[#1d1d1f]">Khách Quán Quân (Champions)</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                          RFM: 5-5-5
                        </span>
                      </div>
                      <p className="text-xs text-[#6e6e73]">
                        Mua gần đây nhất, mua nhiều nhất và chi tiêu cao nhất. Trụ cột doanh thu của sàn thương mại.
                      </p>
                      <div className="p-2.5 bg-emerald-50/50 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-emerald-900">Chiến lược đề xuất:</p>
                        <p className="text-[11px] text-emerald-800">Tặng vé mời sự kiện Private Sale, ưu đãi riêng theo hạng VIP, hỗ trợ CSKH 1-1.</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b] font-medium">Quy mô: <strong>{customers.filter(c => c.rfmSegment === 'Champions' || c.tier === 'DIAMOND').length} khách</strong></span>
                        <button
                          onClick={() => handleOpenCampaignModal(undefined, 'Champions')}
                          className="text-[#0071e3] hover:underline font-semibold text-[11px]"
                        >
                          Gửi Ưu Đãi &rarr;
                        </button>
                      </div>
                    </div>

                    {/* 2. Loyal Customers */}
                    <div className="p-4 bg-white border border-blue-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <h5 className="font-bold text-sm text-[#1d1d1f]">Khách Trung Thành (Loyal)</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                          RFM: 4-4-5
                        </span>
                      </div>
                      <p className="text-xs text-[#6e6e73]">
                        Mua đều đặn, phản hồi tốt với khuyến mãi và đánh giá 5 sao. Dễ upsell sản phẩm phân khúc cao hơn.
                      </p>
                      <div className="p-2.5 bg-blue-50/50 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-blue-900">Chiến lược đề xuất:</p>
                        <p className="text-[11px] text-blue-800">Tích điểm x2 ngày sinh nhật, mời tham gia chương trình khách hàng thân thiết.</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b] font-medium">Quy mô: <strong>{customers.filter(c => c.rfmSegment === 'Loyal Customers' || c.tier === 'GOLD').length} khách</strong></span>
                        <button
                          onClick={() => handleOpenCampaignModal(undefined, 'Loyal Customers')}
                          className="text-[#0071e3] hover:underline font-semibold text-[11px]"
                        >
                          Gửi Ưu Đãi &rarr;
                        </button>
                      </div>
                    </div>

                    {/* 3. Potential Loyalists */}
                    <div className="p-4 bg-white border border-indigo-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <h5 className="font-bold text-sm text-[#1d1d1f]">Khách Tiềm Năng (Potential)</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-full">
                          RFM: 4-2-3
                        </span>
                      </div>
                      <p className="text-xs text-[#6e6e73]">
                        Khách hàng mới mua gần đây, chi tiêu khá tốt, cần kích thích mua thêm đơn thứ 2 và thứ 3.
                      </p>
                      <div className="p-2.5 bg-indigo-50/50 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-indigo-900">Chiến lược đề xuất:</p>
                        <p className="text-[11px] text-indigo-800">Voucher giảm giá cho đơn tiếp theo, gợi ý sản phẩm phụ kiện kèm theo.</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b] font-medium">Quy mô: <strong>{customers.filter(c => c.tier === 'SILVER').length} khách</strong></span>
                        <button
                          onClick={() => handleOpenCampaignModal(undefined, 'Potential Loyalists')}
                          className="text-[#0071e3] hover:underline font-semibold text-[11px]"
                        >
                          Gửi Ưu Đãi &rarr;
                        </button>
                      </div>
                    </div>

                    {/* 4. At Risk */}
                    <div className="p-4 bg-white border border-amber-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <h5 className="font-bold text-sm text-[#1d1d1f]">Nguy Cơ Rời Bỏ (At Risk)</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full">
                          RFM: 2-4-4
                        </span>
                      </div>
                      <p className="text-xs text-[#6e6e73]">
                        Từng chi tiêu nhiều nhưng đã lâu không quay lại mua sắm. Cần gửi tin nhắn tái kích hoạt gấp.
                      </p>
                      <div className="p-2.5 bg-amber-50/50 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-amber-900">Chiến lược đề xuất:</p>
                        <p className="text-[11px] text-amber-800">Gửi chiến dịch "Chúng tôi nhớ bạn", tặng mã coupon độc quyền 15% - 20%.</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b] font-medium">Quy mô: <strong>{customers.filter(c => c.lifecycle === 'HIBERNATING').length} khách</strong></span>
                        <button
                          onClick={() => handleOpenCampaignModal(undefined, 'At Risk')}
                          className="text-[#0071e3] hover:underline font-semibold text-[11px]"
                        >
                          Tái Kích Hoạt &rarr;
                        </button>
                      </div>
                    </div>

                    {/* 5. Hibernating & Lost */}
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                          <h5 className="font-bold text-sm text-[#1d1d1f]">Khách Ngủ Đông / Đã Mất</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold rounded-full">
                          RFM: 1-1-1
                        </span>
                      </div>
                      <p className="text-xs text-[#6e6e73]">
                        Đã hơn 180 ngày không có lượt truy cập hoặc đơn hàng. Giá trị vòng đời thấp.
                      </p>
                      <div className="p-2.5 bg-gray-50 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-gray-900">Chiến lược đề xuất:</p>
                        <p className="text-[11px] text-gray-700">Chạy Remarketing trên Facebook/Google với thông điệp xả kho, flash sale sốc.</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b] font-medium">Quy mô: <strong>{customers.filter(c => c.lifecycle === 'LOST').length} khách</strong></span>
                        <button
                          onClick={() => handleSyncRemarketing('FACEBOOK', 'LOST')}
                          className="text-blue-600 hover:underline font-semibold text-[11px]"
                        >
                          Đẩy Remarketing Ads &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Dynamic vs Static Management */}
                    <div className="p-4 bg-[#f5f5f7] border border-gray-200 rounded-2xl space-y-3">
                      <h5 className="font-bold text-sm text-[#1d1d1f] flex items-center gap-1.5">
                        <Boxes className="w-4 h-4 text-[#0071e3]" />
                        <span>Nhóm Động vs Nhóm Tĩnh</span>
                      </h5>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <p className="font-bold text-[#1d1d1f]">Nhóm Động (Dynamic):</p>
                          <p className="text-[11px] text-[#6e6e73]">Hệ thống tự động quét mỗi 6 giờ và cập nhật khách hàng vào tệp khi thỏa điều kiện chi tiêu/vòng đời.</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <p className="font-bold text-[#1d1d1f]">Nhóm Tĩnh (Static):</p>
                          <p className="text-[11px] text-[#6e6e73]">Do nhân viên quản trị gắn thẻ thủ công qua Hồ Sơ 360° (ví dụ: #VIP, #KOL, #KháchDoanhNghiệp).</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Core Segment Dimensions as Requested */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* By Value */}
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl space-y-3 shadow-xs">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#86868b]">1. Phân Nhóm Theo Giá Trị</h5>
                      <div className="space-y-2">
                        <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-purple-900">VIP (Chi tiêu cao &gt; $2,000)</p>
                            <p className="text-[11px] text-purple-700">Được tặng quà sinh nhật &amp; CSKH riêng</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-purple-800">{customers.filter(c => c.totalSpent >= 2000).length}</span>
                        </div>
                        <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-blue-900">Thường ($500 - $2,000)</p>
                            <p className="text-[11px] text-blue-700">Khách hàng phổ thông mua đều</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-blue-800">{customers.filter(c => c.totalSpent >= 500 && c.totalSpent < 2000).length}</span>
                        </div>
                        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-emerald-900">Tiềm Năng (&lt; $500)</p>
                            <p className="text-[11px] text-emerald-700">Khách xem nhiều, cần ưu đãi kích cầu</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-emerald-800">{customers.filter(c => c.totalSpent < 500).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* By Lifecycle */}
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl space-y-3 shadow-xs">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#86868b]">2. Phân Nhóm Theo Vòng Đời</h5>
                      <div className="space-y-2">
                        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-emerald-900">Khách Mới (&lt; 30 ngày)</p>
                            <p className="text-[11px] text-emerald-700">Kích hoạt email chào mừng</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-emerald-800">{customers.filter(c => c.lifecycle === 'NEW').length}</span>
                        </div>
                        <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-blue-900">Khách Quay Lại (&ge; 2 đơn)</p>
                            <p className="text-[11px] text-blue-700">Tỷ lệ giữ chân cao</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-blue-800">{customers.filter(c => c.lifecycle === 'RETURNING').length}</span>
                        </div>
                        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-amber-900">Khách Ngủ Đông (&gt; 60 ngày)</p>
                            <p className="text-[11px] text-amber-700">Cần gửi chiến dịch Win-Back</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-amber-800">{customers.filter(c => c.lifecycle === 'HIBERNATING').length}</span>
                        </div>
                      </div>
                    </div>

                    {/* By Behavior */}
                    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl space-y-3 shadow-xs">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#86868b]">3. Phân Nhóm Theo Hành Vi</h5>
                      <div className="space-y-2">
                        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-amber-900">Bỏ Giỏ Hàng (Abandoned)</p>
                            <p className="text-[11px] text-amber-700">Còn hàng trong giỏ chưa thanh toán</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-amber-800">{customers.filter(c => c.behavior === 'CART_ABANDONED').length}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-slate-900">Chỉ Xem Không Mua</p>
                            <p className="text-[11px] text-slate-700">Xem trên 5 sản phẩm/tuần</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-slate-800">{customers.filter(c => c.behavior === 'VIEW_ONLY').length}</span>
                        </div>
                        <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-rose-900">Hay Đổi Trả (Return &gt; 15%)</p>
                            <p className="text-[11px] text-rose-700">Cần kiểm tra lý do lỗi chất lượng</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-rose-800">{customers.filter(c => c.behavior === 'HIGH_RETURN').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 3: CHĂM SÓC & TỰ ĐỘNG HÓA (AUTOMATION & REMARKETING)    */}
              {/* ------------------------------------------------------------- */}
              {crmSubTab === 'automation' && (
                <div className="space-y-6">
                  {/* Top Remarketing Ad Sync Integration Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Facebook Sync */}
                    <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            Meta
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-[#1d1d1f]">Facebook Custom Audience API</h5>
                            <p className="text-[11px] text-[#6e6e73]">Tự động đồng bộ tệp khách VIP &amp; Giỏ hàng sang Meta Ads</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                          ĐÃ KẾT NỐI
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b]">Lần đồng bộ gần nhất: 10 phút trước</span>
                        <button
                          onClick={() => handleSyncRemarketing('FACEBOOK', 'ALL_SEGMENTS')}
                          disabled={remarketingSyncLoading !== null}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors"
                        >
                          {remarketingSyncLoading === 'FACEBOOK_ALL_SEGMENTS' ? 'Đang đẩy tệp...' : 'Đồng Bộ Ngay'}
                        </button>
                      </div>
                    </div>

                    {/* Google Sync */}
                    <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                            G
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-[#1d1d1f]">Google Customer Match API</h5>
                            <p className="text-[11px] text-[#6e6e73]">Khớp danh tính email/SĐT khách hàng trên Google Search &amp; YouTube</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                          ĐÃ KẾT NỐI
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-[#86868b]">Tỷ lệ khớp danh tính: 89.4%</span>
                        <button
                          onClick={() => handleSyncRemarketing('GOOGLE', 'ALL_SEGMENTS')}
                          disabled={remarketingSyncLoading !== null}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg text-xs transition-colors"
                        >
                          {remarketingSyncLoading === 'GOOGLE_ALL_SEGMENTS' ? 'Đang đẩy tệp...' : 'Đồng Bộ Ngay'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 5 Automation Workflows */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#0071e3]" />
                        <span>5 Kịch Bản Tự Động Hóa Chăm Sóc (Automation Workflows)</span>
                      </h4>
                      <span className="text-xs text-[#6e6e73]">Hệ thống kích hoạt thời gian thực dựa trên hành vi</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {automationWorkflows.map((wf) => (
                        <div
                          key={wf.id}
                          className={`p-5 bg-white border rounded-2xl shadow-xs transition-all ${
                            wf.active ? 'border-gray-200/90' : 'border-gray-200/50 opacity-75'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-3">
                                <h5 className="font-bold text-sm text-[#1d1d1f]">{wf.name}</h5>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  wf.channel === 'EMAIL'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : wf.channel === 'SMS'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  Kênh: {wf.channel}
                                </span>
                                {wf.voucher && (
                                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px] font-bold rounded">
                                    Mã: {wf.voucher}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#6e6e73]">{wf.action}</p>
                              <div className="flex items-center gap-4 text-[11px] text-[#86868b] pt-1">
                                <span>Điều kiện: <strong className="text-[#1d1d1f]">{wf.trigger}</strong></span>
                                <span>• Tỷ lệ mở: <strong className="text-emerald-700 font-mono">{wf.openRate}</strong></span>
                                <span>• Chuyển đổi: <strong className="text-[#0071e3] font-mono">{wf.conversionRate}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                onClick={() => handleOpenCampaignModal(undefined, wf.name)}
                                className="px-3 py-1.5 bg-[#f5f5f7] hover:bg-gray-100 text-[#1d1d1f] text-xs font-semibold rounded-xl border border-gray-200 transition-colors"
                              >
                                Gửi Thử
                              </button>
                              <button
                                onClick={() => handleToggleWorkflow(wf.id)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                                  wf.active
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                              >
                                {wf.active ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBTAB 4: CHÍNH SÁCH HẠNG THÀNH VIÊN                          */}
              {/* ------------------------------------------------------------- */}
              {crmSubTab === 'tiers' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-3">
                    <h4 className="text-sm font-bold text-[#1d1d1f]">Chính Sách &amp; Ưu Đãi Độc Quyền Theo Hạng Thành Viên</h4>
                    <p className="text-xs text-[#6e6e73] mt-0.5">Hệ thống tự động xét hạng dựa trên tổng chi tiêu tích lũy (LTV) trong 365 ngày.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Diamond */}
                    <div className="p-5 bg-white border-2 border-purple-300 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-0 opacity-50" />
                      <div className="relative z-10 space-y-1">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                          💎 KIM CƯƠNG (DIAMOND)
                        </span>
                        <h5 className="text-xl font-bold text-[#1d1d1f] pt-2">Chi tiêu &ge; $3,000</h5>
                        <p className="text-xs text-[#6e6e73]">Hạng hội viên danh giá nhất</p>
                      </div>
                      <div className="space-y-2 text-xs text-[#1d1d1f] relative z-10">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          <span><strong>Giảm 20% trọn đời</strong> mọi sản phẩm</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>Tích điểm hoàn tiền <strong>5% mỗi đơn</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>Freeship hỏa tốc không giới hạn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>Quà sinh nhật voucher $50 VIP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>Chuyên viên CSKH 1-1 riêng biệt</span>
                        </div>
                      </div>
                    </div>

                    {/* Gold */}
                    <div className="p-5 bg-white border border-amber-300 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                      <div className="space-y-1">
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                          🥇 VÀNG (GOLD)
                        </span>
                        <h5 className="text-xl font-bold text-[#1d1d1f] pt-2">$1,000 - $2,999</h5>
                        <p className="text-xs text-[#6e6e73]">Hội viên thân thiết</p>
                      </div>
                      <div className="space-y-2 text-xs text-[#1d1d1f]">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span><strong>Giảm 12% trọn đời</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Tích điểm hoàn tiền <strong>3% mỗi đơn</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Freeship cho đơn hàng từ $50</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Quà sinh nhật voucher $25</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Ưu tiên xử lý đổi trả trong 1 giờ</span>
                        </div>
                      </div>
                    </div>

                    {/* Silver */}
                    <div className="p-5 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-sm">
                      <div className="space-y-1">
                        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">
                          🥈 BẠC (SILVER)
                        </span>
                        <h5 className="text-xl font-bold text-[#1d1d1f] pt-2">$300 - $999</h5>
                        <p className="text-xs text-[#6e6e73]">Hội viên tiêu chuẩn</p>
                      </div>
                      <div className="space-y-2 text-xs text-[#1d1d1f]">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                          <span><strong>Giảm 7% trọn đời</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Tích điểm hoàn tiền <strong>2% mỗi đơn</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Freeship cho đơn từ $100</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Quà sinh nhật voucher 10%</span>
                        </div>
                      </div>
                    </div>

                    {/* Bronze */}
                    <div className="p-5 bg-white border border-orange-200 rounded-3xl space-y-4 shadow-sm">
                      <div className="space-y-1">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                          🥉 ĐỒNG (BRONZE)
                        </span>
                        <h5 className="text-xl font-bold text-[#1d1d1f] pt-2">&lt; $300</h5>
                        <p className="text-xs text-[#6e6e73]">Hội viên mới gia nhập</p>
                      </div>
                      <div className="space-y-2 text-xs text-[#1d1d1f]">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                          <span><strong>Giảm 3% trọn đời</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                          <span>Tích điểm hoàn tiền <strong>1% mỗi đơn</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                          <span>Voucher chào mừng thành viên mới</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
};
