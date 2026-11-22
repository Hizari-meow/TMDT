'use client';

import React from 'react';

import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  CheckCircle,
  Zap,
  Search,
  Filter,
  DollarSign,
  BarChart3,
  Boxes,
  Tag,
  Printer,
  Plus,
  RefreshCw,
  ExternalLink,
  Download,
  AlertCircle,
  Sparkles,
  X,
  Award,
  Play,
  ShieldCheck,
  Mail,
  Target,
  Smartphone,
  Monitor,
  MousePointer,
  PlayCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminOverviewTab: React.FC = () => {
  const {
    overview,
    analyticsData,
    analyticsTimeRange,
    setAnalyticsTimeRange,
    analyticsChannel,
    setAnalyticsChannel,
    analyticsRole,
    setAnalyticsRole,
    analyticsActiveSubTab,
    setAnalyticsActiveSubTab,
    setIsScheduleModalOpen,
    setIsSessionReplayModalOpen,
    setSelectedSessionReplay,
    orders,
    fetchEnterpriseAnalytics,
    handleExportAnalytics
  } = useAdminContext();

          const aData = analyticsData || {};
          const metrics = aData.metrics || overview?.metrics || {};
          const pulse = aData.realTimePulse || {};
          const timeSeries: any[] = aData.timeSeries || [];
          const channels: any[] = aData.channels || [];
          const categoriesShare: any[] = aData.categoriesShare || [];
          const brandsShare: any[] = aData.brandsShare || [];
          const regions: any[] = aData.regions || [];
          const salesReps: any[] = aData.salesReps || [];
          const abc = aData.abcAnalysis || {};
          const bestSellers: any[] = aData.bestSellers || [];
          const deadstockItems: any[] = aData.deadstockItems || [];
          const funnel: any[] = aData.funnel || [];
          const trafficSources: any[] = aData.trafficSources || [];
          const devices: any[] = aData.devices || [];
          const cartAb = aData.cartAbandonment || {};
          const searchInt = aData.searchIntelligence || {};
          const heatmap = aData.heatmapAndReplay || {};
          const cohort: any[] = aData.cohortMatrix || [];
          const retention = aData.customerRetention || {};
          const emailSchedules: any[] = aData.emailSchedules || [];

          // Tính toán max revenue cho biểu đồ SVG
          const maxRev = timeSeries.length > 0 ? Math.max(...timeSeries.map((t: any) => Math.max(t.current || 0, t.previous || 0)), 1000) : 1000000;

          return (
            <div className="space-y-6">
              {/* =================================================================== */}
              {/* 4.8 HEADER: TIÊU ĐỀ, PULSE THỜI GIAN THỰC & BỘ LỌC ĐIỀU HÀNH         */}
              {/* =================================================================== */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0071e3] shadow-xs">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                          4.8. Báo Cáo &amp; Phân Tích Doanh Nghiệp (Enterprise BI &amp; Analytics)
                        </h2>
                        <p className="text-xs text-[#6e6e73]">
                          Biến dữ liệu lớn thành quyết định: Nhập gì, chạy quảng cáo nào, tối ưu dòng tiền và xả hàng tồn.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Realtime Live Pulse */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>{pulse.activeVisitorsNow || 142} đang online</span>
                    </div>

                    <div className="px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full text-blue-800 text-xs font-semibold">
                      ⚡ {pulse.ordersLastHour || 18} đơn/giờ qua
                    </div>

                    <div className="px-3 py-1.5 bg-purple-50 border border-purple-200/80 rounded-full text-purple-800 text-xs font-semibold">
                      ⏱ {pulse.speedPerOrder || '1.8 phút/đơn'}
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchEnterpriseAnalytics()}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors"
                      title="Làm mới dữ liệu"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Toolbar: Role Persona, TimeRange, Channel, Actions */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  {/* Role-based Personas */}
                  <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-2xl text-xs font-semibold">
                    {[
                      { id: 'ceo', label: 'CEO / Tổng Giám Đốc', icon: Award },
                      { id: 'cmo', label: 'CMO / Marketing', icon: Target },
                      { id: 'cpo', label: 'CPO / Kho & Thu Mua', icon: Boxes },
                    ].map((role) => {
                      const Icon = role.icon;
                      const active = analyticsRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            setAnalyticsRole(role.id as any);
                            fetchEnterpriseAnalytics(analyticsTimeRange, analyticsChannel, role.id);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                            active
                              ? 'bg-white text-[#0071e3] shadow-xs font-bold'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{role.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Range Selector & Channel */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Time Range */}
                    <div className="flex items-center gap-1 bg-gray-50 p-1 border border-gray-200/80 rounded-xl font-medium">
                      {[
                        { id: 'today', label: 'Hôm nay' },
                        { id: '7days', label: '7 ngày' },
                        { id: '30days', label: '30 ngày' },
                        { id: 'quarter', label: 'Quý này' },
                        { id: 'year', label: 'Năm 2026' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setAnalyticsTimeRange(t.id as any);
                            fetchEnterpriseAnalytics(t.id, analyticsChannel, analyticsRole);
                          }}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            analyticsTimeRange === t.id
                              ? 'bg-[#0071e3] text-white font-bold shadow-xs'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Channel Selector */}
                    <select
                      value={analyticsChannel}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setAnalyticsChannel(val);
                        fetchEnterpriseAnalytics(analyticsTimeRange, val, analyticsRole);
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-200/80 rounded-xl text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="ALL">🌐 Tất Cả Kênh Bán</option>
                      <option value="website">💻 Website TechZone</option>
                      <option value="shopee">🛍️ Shopee Mall</option>
                      <option value="tiktok">📹 TikTok Shop Live</option>
                      <option value="pos">🏬 Cửa Hàng POS</option>
                    </select>

                    {/* Export Actions */}
                    <button
                      type="button"
                      onClick={() => handleExportAnalytics('excel')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold transition-colors"
                      title="Xuất file Excel (.csv)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất Excel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportAnalytics('pdf')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl transition-colors"
                      title="In / Xuất PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-600" />
                      <span>In / PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 rounded-xl font-semibold transition-colors"
                      title="Lập lịch gửi email báo cáo định kỳ"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Gửi Định Kỳ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* 6 THẺ CHỈ SỐ KPI CHÍNH (EXECUTIVE CARDS)                            */}
              {/* =================================================================== */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {/* 1. GMV */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">GMV Bán Ra</span>
                    <DollarSign className="w-4 h-4 text-[#0071e3]" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-[#1d1d1f]">
                      {(metrics.gmv || 2845000).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>{metrics.growthGmv || '+18.4%'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Thuần: {(metrics.netRevenue || 2617400).toLocaleString('vi-VN')} ₫
                  </div>
                </div>

                {/* 2. Lợi Nhuận Gộp */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Lợi Nhuận Gộp</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-[#1d1d1f]">
                      {(metrics.grossProfit || 1095325).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <span>Biên: {metrics.grossProfitMargin || '38.5%'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Ròng: {metrics.netProfitMargin || '22.8%'}
                  </div>
                </div>

                {/* 3. AOV */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">AOV (TB/Đơn)</span>
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-[#1d1d1f]">
                      {(metrics.aov || 759).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>{metrics.growthAov || '+5.2%'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Tổng đơn: {metrics.totalOrders || 3748}
                  </div>
                </div>

                {/* 4. CAC */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Chi Phí CAC</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-[#1d1d1f]">
                      {(metrics.cac || 142000).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <ArrowDownRight className="w-3 h-3" />
                      <span>{metrics.growthCac || '-8.5%'} (Tối ưu)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Mục tiêu: &lt; 160.000 ₫
                  </div>
                </div>

                {/* 5. ROAS */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">ROAS Quảng Cáo</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-[#1d1d1f]">
                      {metrics.roas || 5.42}x
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>{metrics.growthRoas || '+14.2%'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Doanh thu Ads: 1,31 Tỷ ₫
                  </div>
                </div>

                {/* 6. Phễu CR */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Chuyển Đổi (CR)</span>
                    <Target className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-[#1d1d1f]">5.39%</div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                      <span>Chuẩn ngành: 3.5%</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Bỏ giỏ: {cartAb.overallRate || '68.4%'}
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* SUB-TABS NAVIGATION: 6 PHÂN HỆ CHUYÊN SÂU                            */}
              {/* =================================================================== */}
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs overflow-x-auto no-scrollbar text-xs font-semibold">
                {[
                  { id: 'revenue', label: '1. Doanh Thu & Lợi Nhuận', icon: TrendingUp },
                  { id: 'products', label: '2. Sản Phẩm & Ma Trận ABC', icon: Package },
                  { id: 'funnel', label: '3. Phễu Chuyển Đổi (Funnel)', icon: Target },
                  { id: 'behavior', label: '4. Hành Vi & Bỏ Giỏ Hàng', icon: MousePointer },
                  { id: 'cohort', label: '5. Phân Tích Cohort & Giữ Chân', icon: Users },
                  { id: 'schedules', label: '6. Lập Lịch & Kết Nối BI', icon: Mail },
                ].map((st) => {
                  const Icon = st.icon;
                  const active = analyticsActiveSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setAnalyticsActiveSubTab(st.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                        active
                          ? 'bg-[#0071e3] text-white shadow-xs font-bold'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* =================================================================== */}
              {/* SUB-TAB 1: DOANH THU, LỢI NHUẬN & PHÂN BỔ ĐA CHIỀU                  */}
              {/* =================================================================== */}
              {analyticsActiveSubTab === 'revenue' && (
                <div className="space-y-6">
                  {/* Biểu đồ chuỗi thời gian Time-Series Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Biểu Đồ Doanh Thu &amp; Xu Hướng Theo Thời Gian ({aData.periodLabel || '30 ngày qua'})
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          So sánh doanh thu thực tế kỳ hiện tại với kỳ trước / cùng kỳ năm trước.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#0071e3]"></span>
                          <span>Kỳ Này ({(metrics.gmv || 0).toLocaleString('vi-VN')} ₫)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                          <span className="text-gray-500">Kỳ Trước</span>
                        </div>
                      </div>
                    </div>

                    {/* SVG Chart Container */}
                    <div className="w-full h-64 relative pt-4">
                      {timeSeries.length > 0 ? (
                        <div className="w-full h-full flex items-end gap-1 sm:gap-2">
                          {timeSeries.map((item, idx) => {
                            const curHeight = Math.max(6, Math.round(((item.current || 0) / maxRev) * 100));
                            const prevHeight = Math.max(4, Math.round(((item.previous || 0) / maxRev) * 100));
                            return (
                              <div
                                key={idx}
                                className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                              >
                                {/* Tooltip hover */}
                                <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none bg-black/90 text-white text-[10px] p-2 rounded-xl shadow-xl whitespace-nowrap flex flex-col gap-0.5">
                                  <div className="font-bold text-blue-300">{item.label}</div>
                                  <div>Kỳ này: {(item.current || 0).toLocaleString('vi-VN')} ₫</div>
                                  <div className="text-gray-300">Kỳ trước: {(item.previous || 0).toLocaleString('vi-VN')} ₫</div>
                                  <div className="text-emerald-300">Đơn hàng: {item.orders || 0} đơn</div>
                                </div>

                                {/* Bars */}
                                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full pb-6">
                                  {/* Previous period bar */}
                                  <div
                                    style={{ height: `${prevHeight}%` }}
                                    className="w-1/2 sm:w-2.5 bg-gray-200 rounded-t-sm group-hover:bg-gray-300 transition-all"
                                  />
                                  {/* Current period bar */}
                                  <div
                                    style={{ height: `${curHeight}%` }}
                                    className="w-1/2 sm:w-2.5 bg-gradient-to-t from-blue-600 to-[#0071e3] rounded-t-sm group-hover:brightness-110 transition-all"
                                  />
                                </div>

                                {/* X-axis label */}
                                <span className="absolute bottom-0 text-[10px] text-gray-500 truncate w-full text-center">
                                  {item.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Đang tải dữ liệu chuỗi thời gian...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kênh Bán Hàng (Omnichannel Breakdown) */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Phân Bổ Doanh Thu Theo Kênh Bán Hàng (Omnichannel)
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          Hiệu quả kinh doanh và chỉ số ROAS trên từng kênh phân phối.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                        Đồng Bộ Trực Tiếp
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {channels.map((ch) => (
                        <div
                          key={ch.id}
                          className="p-4 rounded-2xl border border-gray-200/80 hover:border-blue-300 transition-all space-y-3 bg-gray-50/50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1d1d1f]">{ch.name}</span>
                            <span className="text-xs font-extrabold text-[#0071e3]">{ch.sharePercent}%</span>
                          </div>

                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#0071e3] h-full rounded-full"
                              style={{ width: `${ch.sharePercent}%` }}
                            />
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between text-gray-600">
                              <span>GMV:</span>
                              <strong className="text-[#1d1d1f]">{(ch.gmv || 0).toLocaleString('vi-VN')} ₫</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Số đơn:</span>
                              <strong>{ch.orders} đơn</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>AOV:</span>
                              <strong>{(ch.aov || 0).toLocaleString('vi-VN')} ₫</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>ROAS:</span>
                              <strong className="text-purple-600">{ch.roas ? `${ch.roas}x` : 'N/A'}</strong>
                            </div>
                            <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-200">
                              <span>Tăng trưởng:</span>
                              <strong className="text-emerald-600">{ch.growth}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danh Mục, Thương Hiệu, Địa Lý & Nhân Viên */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Danh mục & Thương hiệu */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Theo Danh Mục &amp; Thương Hiệu</h4>
                        <p className="text-xs text-[#6e6e73]">Tỷ trọng đóng góp vào tổng giá trị doanh thu.</p>
                      </div>

                      {/* Danh mục */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Danh Mục Sản Phẩm</div>
                        {categoriesShare.map((cat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{cat.name}</span>
                              <span>{cat.share}% ({(cat.revenue || 0).toLocaleString('vi-VN')} ₫)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${cat.share}%`, backgroundColor: cat.color || '#0071e3' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Thương hiệu */}
                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Thương Hiệu Hàng Đầu</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {brandsShare.map((b, idx) => (
                            <div key={idx} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between">
                              <span className="font-semibold text-gray-800">{b.name}</span>
                              <span className="font-bold text-[#0071e3]">{b.share}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Địa lý & Nhân viên bán hàng */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Theo Khu Vực Địa Lý &amp; Nhân Viên</h4>
                        <p className="text-xs text-[#6e6e73]">Độ phủ thị trường và hiệu suất đội ngũ kinh doanh.</p>
                      </div>

                      {/* Địa lý */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Khu Vực Giao Nhận Hàng Đầu</div>
                        <div className="space-y-1.5">
                          {regions.map((reg, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 text-xs">
                              <div>
                                <span className="font-bold text-[#1d1d1f]">{reg.region}</span>
                                <span className="text-[10px] text-gray-500 block">{reg.topDistrict}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#0071e3]">{reg.share}%</span>
                                <span className="text-[10px] text-gray-500 block">{(reg.revenue || 0).toLocaleString('vi-VN')} ₫</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top nhân viên */}
                      <div className="space-y-2 pt-3 border-t border-gray-100">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Top Nhân Viên Xuất Sắc</div>
                        <div className="space-y-1.5">
                          {salesReps.map((rep, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-xl border border-gray-200/80 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0071e3] font-bold flex items-center justify-center text-[10px]">
                                  #{idx + 1}
                                </span>
                                <div>
                                  <span className="font-bold text-[#1d1d1f]">{rep.name}</span>
                                  <span className="text-[10px] text-emerald-600 block">CSAT: {rep.csat}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#1d1d1f]">{(rep.revenue || 0).toLocaleString('vi-VN')} ₫</span>
                                <span className="text-[10px] text-gray-500 block">{rep.orders} đơn</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* SUB-TAB 2: SẢN PHẨM, MA TRẬN PARETO ABC & PHÂN TÍCH TỒN KHO          */}
              {/* =================================================================== */}
              {analyticsActiveSubTab === 'products' && (
                <div className="space-y-6">
                  {/* Thẻ tóm tắt Ma Trận ABC */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Nhóm A */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-extrabold">
                          NHÓM A (VITAL FEW)
                        </span>
                        <span className="text-sm font-extrabold text-emerald-800">
                          {abc.groupA?.share || '80.2%'} Doanh Thu
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        Gồm <strong>{abc.groupA?.count || 3} sản phẩm cốt lõi</strong> mang lại 80% doanh thu TechZone.
                      </p>
                      <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{abc.groupA?.strategy || 'Ưu tiên tồn kho an toàn, cảnh báo khẩn khi tồn < 10 ngày'}</span>
                      </div>
                    </div>

                    {/* Nhóm B */}
                    <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-extrabold">
                          NHÓM B (STABLE)
                        </span>
                        <span className="text-sm font-extrabold text-blue-800">
                          {abc.groupB?.share || '14.8%'} Doanh Thu
                        </span>
                      </div>
                      <p className="text-xs text-blue-950 font-medium leading-relaxed">
                        Gồm <strong>{abc.groupB?.count || 4} sản phẩm duy trì</strong> ổn định doanh số phụ trợ.
                      </p>
                      <div className="pt-2 border-t border-blue-200/80 text-[11px] text-blue-900 font-semibold flex items-center gap-1.5">
                        <Boxes className="w-4 h-4 text-[#0071e3] shrink-0" />
                        <span>{abc.groupB?.strategy || 'Duy trì nhập tuần hoàn ổn định Just-in-Time'}</span>
                      </div>
                    </div>

                    {/* Nhóm C */}
                    <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-amber-600 text-white rounded-full text-xs font-extrabold">
                          NHÓM C (LONG TAIL)
                        </span>
                        <span className="text-sm font-extrabold text-amber-800">
                          {abc.groupC?.share || '5.0%'} Doanh Thu
                        </span>
                      </div>
                      <p className="text-xs text-amber-950 font-medium leading-relaxed">
                        Gồm <strong>{abc.groupC?.count || 8} sản phẩm biên</strong> (phụ kiện, cáp sạc, linh kiện nhỏ).
                      </p>
                      <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{abc.groupC?.strategy || 'Giảm tồn đọng, tạo combo xả hàng để giải phóng vốn'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bảng Top Bán Chạy Nhất (Best Sellers) */}
                  <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Top 5 Sản Phẩm Bán Chạy Nhất (Best Sellers)</h4>
                        <p className="text-xs text-[#6e6e73]">Tốc độ xuất kho và đóng góp doanh thu lớn nhất hệ thống.</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-[#0071e3] font-bold text-xs rounded-full">
                        🔥 Vận Tốc Xuất Kho Cao
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200/80">
                          <tr>
                            <th className="py-3 px-4">Hạng</th>
                            <th className="py-3 px-4">Tên Sản Phẩm</th>
                            <th className="py-3 px-4">Danh Mục</th>
                            <th className="py-3 px-4 text-right">Đơn Giá</th>
                            <th className="py-3 px-4 text-right">Đã Bán</th>
                            <th className="py-3 px-4 text-right">Doanh Thu Đóng Góp</th>
                            <th className="py-3 px-4">Vận Tốc Bán</th>
                            <th className="py-3 px-4">Tình Trạng Tồn Kho</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                          {bestSellers.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-[#0071e3]">#{item.rank}</td>
                              <td className="py-3.5 px-4 font-bold text-[#1d1d1f]">{item.name}</td>
                              <td className="py-3.5 px-4 text-gray-600">{item.category}</td>
                              <td className="py-3.5 px-4 text-right font-semibold">{(item.price || 0).toLocaleString('vi-VN')} ₫</td>
                              <td className="py-3.5 px-4 text-right font-bold text-[#0071e3]">{item.soldUnits} cái</td>
                              <td className="py-3.5 px-4 text-right font-extrabold text-[#1d1d1f]">
                                {(item.revenue || 0).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[11px]">
                                  {item.velocity}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`text-[11px] font-bold ${item.stockStatus.includes('Sắp hết') ? 'text-rose-600' : 'text-gray-600'}`}>
                                  {item.stockStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bảng Cảnh Báo Hàng Bán Chậm / Tồn Lâu Ngày (>60 Ngày) */}
                  <div className="bg-white rounded-3xl border border-rose-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-rose-100 bg-rose-50/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <div>
                          <h4 className="text-sm font-bold text-rose-950">
                            Cảnh Báo Hàng Tồn Kho Lâu Ngày (&gt; 60 - 90 Ngày) Cần Giải Phóng Vốn
                          </h4>
                          <p className="text-xs text-rose-800">
                            Đề xuất tự động giải phóng vốn lưu động và chống trượt giá công nghệ.
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-xs">
                        ⚠️ Cần Xử Lý Ngay
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200/80">
                          <tr>
                            <th className="py-3 px-4">Mã SKU</th>
                            <th className="py-3 px-4">Sản Phẩm Đọng Vốn</th>
                            <th className="py-3 px-4 text-center">Tồn Kho</th>
                            <th className="py-3 px-4 text-right">Vốn Đọng (₫)</th>
                            <th className="py-3 px-4 text-center">Lưu Kho</th>
                            <th className="py-3 px-4">Hành Động Khuyến Nghị Khẩn</th>
                            <th className="py-3 px-4 text-center">Mức Rủi Ro</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                          {deadstockItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                              <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">{item.sku}</td>
                              <td className="py-3.5 px-4 font-bold text-[#1d1d1f]">{item.name}</td>
                              <td className="py-3.5 px-4 text-center font-bold text-rose-600">{item.stock} chiếc</td>
                              <td className="py-3.5 px-4 text-right font-extrabold text-[#1d1d1f]">
                                {(item.capitalLocked || 0).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md text-[11px]">
                                  {item.daysInStock} ngày
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-blue-700">
                                💡 {item.recommendation}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                    item.riskLevel === 'HIGH'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {item.riskLevel === 'HIGH' ? 'RỦI RO CAO' : 'TRUNG BÌNH'}
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

              {/* =================================================================== */}
              {/* SUB-TAB 3: PHỄU CHUYỂN ĐỔI (5-STEP FUNNEL) & NGUỒN LƯU LƯỢNG        */}
              {/* =================================================================== */}
              {analyticsActiveSubTab === 'funnel' && (
                <div className="space-y-6">
                  {/* Sơ đồ Phễu 5 Bước Trực Quan */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Phễu Chuyển Đổi Thương Mại Điện Tử 5 Bước (E-commerce Conversion Funnel)
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          Nhận diện chính xác điểm rơi (Drop-off rate) và nút thắt cổ chai trong hành trình mua sắm.
                        </p>
                      </div>
                      <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-xs">
                        Tỷ Lệ Chuyển Đổi Tổng Thể: 5.39%
                      </div>
                    </div>

                    {/* Funnel Visual Bars */}
                    <div className="space-y-4">
                      {funnel.map((step, idx) => {
                        const barWidth = Math.max(10, step.percent);
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#1d1d1f]">{step.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-[#0071e3]">{step.count.toLocaleString('vi-VN')} người</span>
                                <span className="font-bold text-gray-700 w-16 text-right">{step.percent}%</span>
                                {step.dropRate > 0 && (
                                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-md text-[10px]">
                                    - {step.dropRate}% rớt
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bar */}
                            <div className="w-full bg-gray-100 h-7 rounded-xl overflow-hidden relative">
                              <div
                                style={{ width: `${barWidth}%` }}
                                className="h-full bg-gradient-to-r from-blue-600 to-[#0071e3] rounded-xl flex items-center px-3 text-white text-[11px] font-bold shadow-xs transition-all"
                              >
                                {step.percent}%
                              </div>
                            </div>

                            <p className="text-[11px] text-gray-500 italic pl-1">
                              👉 {step.insight}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Funnel Bottleneck Diagnostics */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="font-bold text-amber-900 block">
                          Phân Tích Điểm Nghẽn Lớn Nhất (Main Drop-off Bottleneck):
                        </strong>
                        <p>
                          Điểm rơi lớn nhất xảy ra giữa bước <strong>"Xem Sản Phẩm"</strong> sang <strong>"Thêm Vào Giỏ" (rớt 62.6%)</strong> và từ <strong>"Thêm Giỏ"</strong> sang <strong>"Checkout" (rớt 53.4%)</strong>.
                        </p>
                        <p className="font-semibold text-blue-700">
                          Khuyến nghị: Áp dụng miễn phí ship đơn hàng từ 500.000 ₫ và kích hoạt nút Thanh toán 1-Chạm Apple Pay / VNPay QR để giảm 28% tỷ lệ thoát.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nguồn Lưu Lượng (Traffic Acquisition) & Thiết Bị (Devices) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bảng Nguồn Lưu Lượng */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#1d1d1f]">Hiệu Quả Kênh Thu Hút (Traffic Acquisition)</h4>
                          <p className="text-xs text-[#6e6e73]">Khách truy cập, tỷ lệ chuyển đổi và chi phí quảng cáo.</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200/80">
                            <tr>
                              <th className="py-2.5 px-3">Nguồn Lưu Lượng</th>
                              <th className="py-2.5 px-3 text-right">Lượt Truy Cập</th>
                              <th className="py-2.5 px-3 text-center">Tỷ Lệ CR</th>
                              <th className="py-2.5 px-3 text-right">Doanh Thu (₫)</th>
                              <th className="py-2.5 px-3 text-right">CAC (₫)</th>
                              <th className="py-2.5 px-3 text-center">ROAS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-800">
                            {trafficSources.map((src, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                                <td className="py-3 px-3 font-bold text-[#1d1d1f]">{src.source}</td>
                                <td className="py-3 px-3 text-right font-semibold">{src.visitors.toLocaleString('vi-VN')}</td>
                                <td className="py-3 px-3 text-center">
                                  <span className="px-2 py-0.5 bg-blue-50 text-[#0071e3] font-bold rounded-md text-[11px]">
                                    {src.cr}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right font-extrabold text-[#1d1d1f]">
                                  {(src.gmv || 0).toLocaleString('vi-VN')} ₫
                                </td>
                                <td className="py-3 px-3 text-right font-semibold text-gray-600">
                                  {src.cac > 0 ? `${src.cac.toLocaleString('vi-VN')} ₫` : '0 ₫ (Free)'}
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-emerald-600">
                                  {src.roas}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Phân Bổ Theo Thiết Bị */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Phân Bổ Theo Thiết Bị</h4>
                        <p className="text-xs text-[#6e6e73]">Trải nghiệm người dùng trên Mobile và Desktop.</p>
                      </div>

                      <div className="space-y-3">
                        {devices.map((dev, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                                {dev.device.includes('iOS') || dev.device.includes('Android') ? (
                                  <Smartphone className="w-3.5 h-3.5 text-[#0071e3]" />
                                ) : (
                                  <Monitor className="w-3.5 h-3.5 text-purple-600" />
                                )}
                                <span>{dev.device}</span>
                              </span>
                              <span className="font-extrabold text-[#0071e3]">{dev.share}%</span>
                            </div>

                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#0071e3] h-full rounded-full" style={{ width: `${dev.share}%` }} />
                            </div>

                            <div className="flex justify-between text-[11px] text-gray-600">
                              <span>CR: <strong className="text-emerald-600">{dev.cr}</strong></span>
                              <span>Thời lượng: <strong>{dev.avgDuration}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* SUB-TAB 4: HÀNH VI NGƯỜI DÙNG, BỎ GIỎ HÀNG & HEATMAP/REPLAY         */}
              {/* =================================================================== */}
              {analyticsActiveSubTab === 'behavior' && (
                <div className="space-y-6">
                  {/* Phân Tích Bỏ Giỏ Hàng & Lý Do Thường Gặp */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Phân Tích Tỷ Lệ Bỏ Giỏ Hàng (Cart Abandonment Rate: {cartAb.overallRate || '68.4%'})
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          Khảo sát nguyên nhân khách hàng bỏ rơi giỏ hàng và giải pháp tự động cứu vãn.
                        </p>
                      </div>
                      <span className="px-3.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs rounded-full">
                        Thất thoát tiềm năng: ~{(cartAb.lostRevenuePotential || 0).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(cartAb.topReasons || []).map((r: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#1d1d1f]">
                              #{idx + 1}. {r.reason}
                            </span>
                            <span className="font-extrabold text-rose-600 text-sm">{r.percent}%</span>
                          </div>

                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full"
                              style={{ width: `${r.percent * 2}%` }}
                            />
                          </div>

                          <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Giải pháp tự động: {r.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phân Tích Tìm Kiếm: Từ Khóa Phổ Biến & Từ Khóa Chưa Có Hàng (Gợi Ý Nhập Hàng) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top từ khóa tìm kiếm */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#1d1d1f]">Từ Khóa Tìm Kiếm Phổ Biến Nhất</h4>
                          <p className="text-xs text-[#6e6e73]">Nhu cầu sản phẩm đang được khách săn đón.</p>
                        </div>
                        <Search className="w-4 h-4 text-[#0071e3]" />
                      </div>

                      <div className="space-y-2">
                        {(searchInt.topSearches || []).map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0071e3] font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-[#1d1d1f]">{s.keyword}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-[#0071e3]">{s.searchCount} lượt</span>
                              <span className="text-[10px] text-emerald-600 block">CR: {s.conversionRate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Từ khóa KHÔNG RA KẾT QUẢ (CƠ HỘI NHẬP HÀNG) */}
                    <div className="bg-white p-6 rounded-3xl border border-purple-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-purple-950">
                            Tìm Kiếm Không Ra Kết Quả (Zero-Result Searches)
                          </h4>
                          <p className="text-xs text-purple-700">
                            Khách tìm nhưng cửa hàng chưa có: <strong>Cơ hội nhập hàng tăng doanh thu tức thì!</strong>
                          </p>
                        </div>
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>

                      <div className="space-y-2.5">
                        {(searchInt.zeroResultSearches || []).map((zr: any, idx: number) => (
                          <div key={idx} className="p-3 bg-purple-50/50 rounded-2xl border border-purple-200/80 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#1d1d1f] text-sm">
                                🔍 &quot;{zr.keyword}&quot;
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900">
                                {zr.searchCount} lượt tìm
                              </span>
                            </div>

                            <div className="flex justify-between text-gray-600 text-[11px]">
                              <span>Doanh thu tiềm năng ước tính:</span>
                              <strong className="text-emerald-700">{(zr.opportunityRevenue || 0).toLocaleString('vi-VN')} ₫</strong>
                            </div>

                            <p className="text-[11px] text-purple-900 font-medium">
                              💡 {zr.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bản Đồ Nhiệt (Heatmap) & Danh Sách Ghi Lại Phiên (Session Replay) */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Bản Đồ Nhiệt (Heatmap) &amp; Ghi Lại Phiên (Session Replay - Microsoft Clarity / Hotjar)
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          Quan sát trực tiếp vị trí click, cuộn trang và xem video tương tác màn hình của khách.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                          Hotjar &amp; Clarity Connected
                        </span>
                      </div>
                    </div>

                    {/* Heatmap Zones */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(heatmap.clickZones || []).map((zone: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1 text-center">
                          <div className="text-lg font-black text-[#0071e3]">{zone.clicksShare}%</div>
                          <div className="text-xs font-bold text-[#1d1d1f] truncate">{zone.zone}</div>
                          <span className="inline-block text-[10px] font-semibold text-gray-500">{zone.status}</span>
                        </div>
                      ))}
                    </div>

                    {/* Session Replay Table */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Phiên Ghi Hình Tương Tác Gần Nhất (Session Recordings)
                      </div>

                      <div className="space-y-2">
                        {(heatmap.recentSessions || []).map((ses: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs gap-3 hover:bg-gray-100/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0071e3] flex items-center justify-center font-bold">
                                <PlayCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-[#1d1d1f]">{ses.id} • {ses.userType}</div>
                                <div className="text-[11px] text-gray-500">
                                  Thời lượng: {ses.duration} | {ses.pagesVisited} trang | {ses.eventsCount} sự kiện
                                  {ses.rageClicks > 0 && (
                                    <span className="text-rose-600 font-bold ml-2">⚠️ Có Rage Clicks ({ses.rageClicks})</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-semibold ${ses.outcome.includes('thành công') ? 'text-emerald-600' : 'text-amber-700'}`}>
                                {ses.outcome}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSessionReplay(ses);
                                  setIsSessionReplayModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-[#0071e3] hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Xem Replay</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* SUB-TAB 5: PHÂN TÍCH COHORT & GIỮ CHÂN KHÁCH HÀNG                   */}
              {/* =================================================================== */}
              {analyticsActiveSubTab === 'cohort' && (
                <div className="space-y-6">
                  {/* Bảng Cohort Retention Matrix Heatmap */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Ma Trận Giữ Chân Khách Hàng (Cohort Retention Analysis)
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          Theo dõi tỷ lệ khách quay lại mua sắm sau các tháng M+1, M+2, M+3...
                        </p>
                      </div>
                      <span className="px-3.5 py-1.5 bg-blue-50 text-[#0071e3] font-bold text-xs rounded-full">
                        Chu kỳ tái mua: {retention.averageRepurchaseDays || 38} ngày
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-center text-xs">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200/80">
                          <tr>
                            <th className="py-3 px-4 text-left">Đoàn Hệ Mua Lần Đầu</th>
                            <th className="py-3 px-3">Quy Mô Khách</th>
                            <th className="py-3 px-3">Tháng M (100%)</th>
                            <th className="py-3 px-3">Tháng M+1</th>
                            <th className="py-3 px-3">Tháng M+2</th>
                            <th className="py-3 px-3">Tháng M+3</th>
                            <th className="py-3 px-3">Tháng M+4</th>
                            <th className="py-3 px-3">Tháng M+5</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {cohort.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 px-4 text-left font-bold text-[#1d1d1f]">{row.cohort}</td>
                              <td className="py-3 px-3 font-semibold text-gray-600">{row.size.toLocaleString('vi-VN')}</td>
                              <td className="py-3 px-3 bg-blue-100/70 font-bold text-blue-900">100%</td>
                              {[row.m1, row.m2, row.m3, row.m4, row.m5].map((val, mIdx) => (
                                <td
                                  key={mIdx}
                                  className="py-3 px-3"
                                  style={{
                                    backgroundColor:
                                      val !== null && val !== undefined
                                        ? `rgba(0, 113, 227, ${Math.max(0.12, (val / 100) * 1.8)})`
                                        : 'transparent',
                                    color: val !== null && val !== undefined ? (val > 30 ? '#003e82' : '#1d1d1f') : '#9ca3af',
                                    fontWeight: val !== null && val !== undefined ? 'bold' : 'normal',
                                  }}
                                >
                                  {val !== null && val !== undefined ? `${val}%` : '—'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tỷ Lệ Khách Mới vs Khách Cũ & LTV */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tỷ lệ khách mới vs cũ */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                      <h4 className="text-sm font-bold text-[#1d1d1f]">Cơ Cấu Khách Hàng Mới vs Khách Quay Lại</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>Khách Hàng Mới (New)</span>
                              <span className="font-bold text-[#0071e3]">{retention.newCustomersShare || 68}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                              <div className="bg-[#0071e3] h-full rounded-full" style={{ width: `${retention.newCustomersShare || 68}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>Khách Hàng Quay Lại (Returning)</span>
                              <span className="font-bold text-emerald-600">{retention.returningCustomersShare || 32}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${retention.returningCustomersShare || 32}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-xs text-blue-900 space-y-1">
                          <strong>Insight quan trọng:</strong> 32% khách hàng cũ quay lại đóng góp tới <strong>44% tổng GMV</strong> vì giá trị đơn hàng trung bình (AOV) của khách cũ cao hơn 1.4 lần so với khách mới.
                        </div>
                      </div>
                    </div>

                    {/* Chỉ số LTV & Chu kỳ */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                      <h4 className="text-sm font-bold text-[#1d1d1f]">Giá Trị Vòng Đời Khách Hàng (Customer Lifetime Value - LTV)</h4>
                      <div className="space-y-3 text-xs">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-gray-500 text-[11px] block">LTV Trung Bình:</span>
                            <span className="text-xl font-extrabold text-[#1d1d1f]">
                              {(retention.averageLtv || 4820000).toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
                            Lợi nhuận ròng/khách: ~1.1 Triệu ₫
                          </span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-gray-500 text-[11px] block">Tỷ Lệ Tái Mua Lần 2 (Repeat Rate):</span>
                            <span className="text-xl font-extrabold text-[#0071e3]">
                              {retention.repeatPurchaseRate || '34.5%'}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600">
                            {retention.repeatRateGrowth || '+4.2%'} quý này
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* SUB-TAB 6: XUẤT BÁO CÁO & LẬP LỊCH TỰ ĐỘNG ĐỊNH KỲ                  */}
              {/* =================================================================== */}
              {analyticsActiveSubTab === 'schedules' && (
                <div className="space-y-6">
                  {/* Bảng Danh Sách Lịch Gửi Email Tự Động */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">
                          Lập Lịch Gửi Báo Cáo Tự Động Định Kỳ Qua Email (Automated Scheduled Reports)
                        </h4>
                        <p className="text-xs text-[#6e6e73]">
                          Hệ thống tự động biên soạn và gửi báo cáo PDF/Excel đúng 08:00 AM mỗi ngày hoặc đầu tuần.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tạo Lịch Gửi Mới</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200/80">
                          <tr>
                            <th className="py-3 px-4">Tên Lịch Báo Cáo</th>
                            <th className="py-3 px-3">Tần Suất</th>
                            <th className="py-3 px-3">Thời Gian Gửi</th>
                            <th className="py-3 px-4">Người Nhận (Recipients)</th>
                            <th className="py-3 px-3 text-center">Định Dạng</th>
                            <th className="py-3 px-3 text-center">Góc Nhìn</th>
                            <th className="py-3 px-3 text-center">Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                          {emailSchedules.map((sc, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-[#1d1d1f]">{sc.name}</td>
                              <td className="py-3.5 px-3">
                                <span className="px-2.5 py-1 bg-blue-50 text-[#0071e3] font-bold rounded-full text-[11px]">
                                  {sc.frequency === 'DAILY' ? 'Hàng Ngày' : sc.frequency === 'WEEKLY' ? 'Hàng Tuần' : 'Hàng Tháng'}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-medium text-gray-600">{sc.time || '08:00 AM'}</td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-gray-700">
                                {Array.isArray(sc.recipients) ? sc.recipients.join(', ') : sc.recipients}
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 font-bold rounded text-[10px]">
                                  {sc.format}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <span className="uppercase font-bold text-[10px] text-purple-700">
                                  {sc.roleView || 'CEO'}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[10px]">
                                  ĐANG BẬT
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Kết Nối Công Cụ BI Doanh Nghiệp (Enterprise BI Integrations) */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#1d1d1f]">
                        Tích Hợp &amp; Đồng Bộ Trực Tiếp Với Các Công Cụ BI Doanh Nghiệp
                      </h4>
                      <p className="text-xs text-[#6e6e73]">
                        Kết nối trực tiếp dữ liệu TechZone sang Google Looker Studio, Metabase và Microsoft Power BI.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Looker Studio */}
                      <div className="p-4 rounded-2xl border border-gray-200/80 hover:border-blue-300 transition-all bg-gray-50/50 space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0071e3] flex items-center justify-center font-bold">
                            LS
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1d1d1f]">Google Looker Studio</div>
                            <div className="text-[10px] text-emerald-600 font-semibold">Trực quan hóa thời gian thực</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Kết nối qua Google BigQuery Connector với độ trễ dưới 2 giây.
                        </p>
                        <a
                          href="https://lookerstudio.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#0071e3] font-bold hover:underline"
                        >
                          <span>Mở Looker Studio</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Metabase */}
                      <div className="p-4 rounded-2xl border border-gray-200/80 hover:border-blue-300 transition-all bg-gray-50/50 space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            MB
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1d1d1f]">Metabase BI Open-Source</div>
                            <div className="text-[10px] text-purple-600 font-semibold">Tự phục vụ phân tích SQL</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Truy vấn trực tiếp qua PostgreSQL Read-Replica bảo vệ cơ sở dữ liệu chính.
                        </p>
                        <a
                          href="https://metabase.com"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-700 font-bold hover:underline"
                        >
                          <span>Mở Metabase</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Power BI */}
                      <div className="p-4 rounded-2xl border border-gray-200/80 hover:border-blue-300 transition-all bg-gray-50/50 space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            PBI
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1d1d1f]">Microsoft Power BI</div>
                            <div className="text-[10px] text-amber-700 font-semibold">Báo cáo hợp nhất tập đoàn</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Mô hình dữ liệu DAX tính toán đa chiều tài chính, thuế VAT và chuỗi cung ứng.
                        </p>
                        <a
                          href="https://powerbi.microsoft.com"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-800 font-bold hover:underline"
                        >
                          <span>Mở Power BI</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
};
