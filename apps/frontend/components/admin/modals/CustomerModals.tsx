'use client';

import React from 'react';

import {
  Users,
  Search,
  Tag,
  Shield,
  RefreshCw,
  FileText,
  Send,
  X,
  Bell,
  MapPin,
  Phone,
  ShieldCheck,
  Mail,
  MessageSquare,
  Star,
  Key
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const CustomerModals: React.FC = () => {
  const {
    overview,
    orders,
    isCustomer360Open,
    setIsCustomer360Open,
    isCampaignModalOpen,
    setIsCampaignModalOpen,
    customer360Data,
    customer360Loading,
    customer360ActiveTab,
    setCustomer360ActiveTab,
    newCustomerNote,
    setNewCustomerNote,
    newCustomerTag,
    setNewCustomerTag,
    campaignTarget,
    campaignChannel,
    setCampaignChannel,
    campaignType,
    setCampaignType,
    campaignCouponCode,
    setCampaignCouponCode,
    campaignSubject,
    setCampaignSubject,
    campaignMessage,
    setCampaignMessage,
    isSubmittingCampaign,
    selectedCustomer,
    handleSaveCustomerNote,
    handleAddCustomerTag,
    handleRemoveCustomerTag,
    handleOpenCampaignModal,
    handleSendCampaignSubmit
  } = useAdminContext();

  return (
    <>
            {isCustomer360Open && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-xl uppercase shrink-0 shadow-md">
                    {selectedCustomer.fullName ? selectedCustomer.fullName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[#1d1d1f]">{selectedCustomer.fullName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedCustomer.tier === 'DIAMOND'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : selectedCustomer.tier === 'GOLD'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : selectedCustomer.tier === 'SILVER'
                          ? 'bg-slate-200 text-slate-800 border border-slate-300'
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}>
                        {selectedCustomer.tier === 'DIAMOND' ? '💎 KIM CƯƠNG' : selectedCustomer.tier === 'GOLD' ? '🥇 VÀNG' : selectedCustomer.tier === 'SILVER' ? '🥈 BẠC' : '🥉 ĐỒNG'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6e6e73] font-mono mt-0.5">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#86868b] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{selectedCustomer.address}</span>
                      </span>
                      <span className="text-[#86868b]">•</span>
                      <span className="text-[11px] text-[#86868b]">
                        Nguồn: <strong>{selectedCustomer.acquisitionSource === 'FACEBOOK_ADS' ? 'Facebook Ads' : selectedCustomer.acquisitionSource === 'GOOGLE_SEARCH' ? 'Google' : selectedCustomer.acquisitionSource === 'REFERRAL' ? 'Giới thiệu' : 'Trực tiếp'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomer360Open(false)}
                  className="p-2 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Key Metrics in 360 Header */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <p className="text-[10px] text-[#86868b] uppercase font-semibold">Tổng Chi Tiêu (LTV)</p>
                  <p className="text-base font-bold text-emerald-700 font-mono mt-0.5">
                    ${(customer360Data?.metrics?.ltv ?? selectedCustomer.totalSpent ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <p className="text-[10px] text-[#86868b] uppercase font-semibold">Giá Trị Đơn TB (AOV)</p>
                  <p className="text-base font-bold text-[#0071e3] font-mono mt-0.5">
                    ${customer360Data?.metrics?.aov ?? selectedCustomer.aov ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <p className="text-[10px] text-[#86868b] uppercase font-semibold">Tần Suất Mua</p>
                  <p className="text-base font-bold text-[#1d1d1f] font-mono mt-0.5">
                    {customer360Data?.metrics?.purchaseFrequencyDays ?? selectedCustomer.purchaseFrequencyDays ?? 21} ngày/lần
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <p className="text-[10px] text-[#86868b] uppercase font-semibold">Tỷ Lệ Hoàn Trả</p>
                  <p className="text-base font-bold text-rose-600 font-mono mt-0.5">
                    {customer360Data?.metrics?.returnRate ?? selectedCustomer.returnRate ?? '0%'}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <p className="text-[10px] text-[#86868b] uppercase font-semibold">Điểm RFM (Score)</p>
                  <p className="text-base font-bold text-purple-700 font-mono mt-0.5">
                    {customer360Data?.metrics?.rfmScore ?? selectedCustomer.rfmScore ?? '5-5-5'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-tabs within Customer 360 */}
            <div className="flex items-center gap-1 px-6 border-b border-gray-200 bg-white text-xs">
              <button
                onClick={() => setCustomer360ActiveTab('overview')}
                className={`py-3 px-4 font-semibold border-b-2 transition-all ${
                  customer360ActiveTab === 'overview'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Tổng Quan &amp; Liên Hệ
              </button>
              <button
                onClick={() => setCustomer360ActiveTab('orders')}
                className={`py-3 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  customer360ActiveTab === 'orders'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                <span>Lịch Sử Đơn Hàng</span>
                <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-[10px] font-mono">
                  {customer360Data?.orders?.length ?? selectedCustomer.orderCount ?? 0}
                </span>
              </button>
              <button
                onClick={() => setCustomer360ActiveTab('products')}
                className={`py-3 px-4 font-semibold border-b-2 transition-all ${
                  customer360ActiveTab === 'products'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Sản Phẩm Hay Mua
              </button>
              <button
                onClick={() => setCustomer360ActiveTab('interactions')}
                className={`py-3 px-4 font-semibold border-b-2 transition-all ${
                  customer360ActiveTab === 'interactions'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Lịch Sử Tương Tác
              </button>
              <button
                onClick={() => setCustomer360ActiveTab('notes')}
                className={`py-3 px-4 font-semibold border-b-2 transition-all ${
                  customer360ActiveTab === 'notes'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Ghi Chú &amp; Gắn Thẻ
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {customer360Loading ? (
                <div className="py-12 text-center text-[#86868b] text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0071e3]" />
                  <span>Đang tổng hợp dữ liệu hồ sơ 360° từ hệ thống...</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: TỔNG QUAN & LIÊN HỆ */}
                  {customer360ActiveTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                        <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#0071e3]" />
                          <span>Thông Tin Tài Khoản &amp; Nguồn Gốc</span>
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Mã Khách Hàng:</span>
                            <span className="font-mono text-[#1d1d1f] font-semibold">{selectedCustomer.id}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Họ và Tên:</span>
                            <span className="text-[#1d1d1f] font-semibold">{selectedCustomer.fullName}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Email:</span>
                            <span className="font-mono text-[#1d1d1f]">{selectedCustomer.email}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Số Điện Thoại:</span>
                            <span className="font-mono text-[#1d1d1f]">{selectedCustomer.phone}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Ngày Đăng Ký:</span>
                            <span className="text-[#1d1d1f]">
                              {selectedCustomer.registeredAt ? new Date(selectedCustomer.registeredAt).toLocaleDateString('vi-VN') : '01/01/2026'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-[#86868b]">Kênh Thu Hút:</span>
                            <span className="font-semibold text-blue-600">
                              {selectedCustomer.acquisitionSource === 'FACEBOOK_ADS' ? 'Facebook Ads Campaign 2026' : selectedCustomer.acquisitionSource === 'GOOGLE_SEARCH' ? 'Google Search Organic' : 'Giới thiệu bạn bè'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                        <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Hành Vi &amp; Địa Chỉ Giao Hàng</span>
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Địa Chỉ Mặc Định:</span>
                            <span className="text-[#1d1d1f] text-right font-medium">{selectedCustomer.address}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Trạng Thái Vòng Đời:</span>
                            <span className="font-semibold text-emerald-700">
                              {selectedCustomer.lifecycle === 'NEW' ? 'Khách Mới' : selectedCustomer.lifecycle === 'RETURNING' ? 'Khách Thân Thiết Quay Lại' : 'Khách Ngủ Đông'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Phân Nhóm Hành Vi:</span>
                            <span className="font-semibold text-amber-700">
                              {selectedCustomer.behavior === 'CART_ABANDONED' ? 'Bỏ giỏ hàng chưa mua' : selectedCustomer.behavior === 'FREQUENT_BUYER' ? 'Mua sắm thường xuyên' : 'Xem sản phẩm'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-[#86868b]">Thiết Bị Thường Dùng:</span>
                            <span className="text-[#1d1d1f]">Apple iPhone 16 Pro (iOS Safari)</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-[#86868b]">Phương Thức Thanh Toán Ưa Thích:</span>
                            <span className="text-[#1d1d1f] font-semibold">VNPAY QR &amp; Apple Pay</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LỊCH SỬ ĐƠN HÀNG */}
                  {customer360ActiveTab === 'orders' && (
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                            <tr>
                              <th className="py-2.5 px-3 font-semibold">Mã Đơn</th>
                              <th className="py-2.5 px-3 font-semibold">Thời Gian</th>
                              <th className="py-2.5 px-3 font-semibold">Tổng Tiền</th>
                              <th className="py-2.5 px-3 font-semibold">Trạng Thái Đơn</th>
                              <th className="py-2.5 px-3 font-semibold">Thanh Toán</th>
                              <th className="py-2.5 px-3 font-semibold">Phương Thức</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {customer360Data?.orders && customer360Data.orders.length > 0 ? (
                              customer360Data.orders.map((ord: any) => (
                                <tr key={ord.id} className="hover:bg-gray-50/80">
                                  <td className="py-2.5 px-3 font-mono font-bold text-[#0071e3]">
                                    #{ord.orderNumber || ord.id.slice(0, 8)}
                                  </td>
                                  <td className="py-2.5 px-3 text-[#6e6e73]">
                                    {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                                  </td>
                                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                                    ${Number(ord.totalAmount).toLocaleString()}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      {ord.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      ord.paymentStatus === 'PAID'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                      {ord.paymentStatus}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-[#6e6e73]">
                                    {ord.paymentMethod || 'VNPAY'}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-6 text-center text-[#86868b]">
                                  Chưa ghi nhận đơn hàng nào cho khách hàng này.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SẢN PHẨM HAY MUA */}
                  {customer360ActiveTab === 'products' && (
                    <div className="space-y-3">
                      <p className="text-xs text-[#6e6e73]">Danh mục sản phẩm khách hàng quan tâm và có tần suất mua cao nhất:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {customer360Data?.topProducts && customer360Data.topProducts.length > 0 ? (
                          customer360Data.topProducts.map((p: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-2xs">
                              <div>
                                <p className="font-bold text-[#1d1d1f]">{p.productName}</p>
                                <p className="text-[11px] text-[#86868b] mt-0.5">Đã mua: <strong>{p.purchaseCount} lần</strong></p>
                              </div>
                              <span className="font-mono font-bold text-emerald-700 text-sm">
                                ${(p.totalSpent || 0).toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 py-8 text-center text-[#86868b] text-xs">
                            Chưa có dữ liệu sản phẩm mua lặp lại.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: LỊCH SỬ TƯƠNG TÁC */}
                  {customer360ActiveTab === 'interactions' && (
                    <div className="space-y-4 text-xs">
                      {/* Reviews */}
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                        <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Đánh Giá &amp; Nhận Xét Của Khách Hàng</span>
                        </h5>
                        <div className="space-y-2">
                          {customer360Data?.reviews && customer360Data.reviews.length > 0 ? (
                            customer360Data.reviews.map((r: any, idx: number) => (
                              <div key={idx} className="p-3 bg-[#f5f5f7] rounded-xl space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#1d1d1f]">{r.productName}</span>
                                  <div className="flex items-center text-amber-500 text-xs">
                                    {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                                  </div>
                                </div>
                                <p className="text-[#6e6e73] italic">"{r.comment}"</p>
                                <p className="text-[10px] text-[#86868b] text-right">
                                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[#86868b] italic py-2">Khách hàng chưa để lại đánh giá nào.</p>
                          )}
                        </div>
                      </div>

                      {/* Tickets & Chat */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
                          <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span>Vé Hỗ Trợ (Tickets)</span>
                          </h5>
                          {customer360Data?.tickets && customer360Data.tickets.length > 0 ? (
                            customer360Data.tickets.map((t: any, idx: number) => (
                              <div key={idx} className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-mono font-bold text-xs">{t.code}</span>
                                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] rounded font-semibold">{t.status}</span>
                                </div>
                                <p className="text-[#1d1d1f]">{t.subject}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[#86868b] italic py-2">Không có vé khiếu nại nào.</p>
                          )}
                        </div>

                        <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
                          <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span>Nhật Ký Tin Nhắn CSKH</span>
                          </h5>
                          {customer360Data?.messages && customer360Data.messages.length > 0 ? (
                            customer360Data.messages.map((m: any, idx: number) => (
                              <div key={idx} className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                                <div className="flex justify-between text-[10px] text-[#86868b]">
                                  <span>{m.sender}</span>
                                  <span>{new Date(m.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[#1d1d1f]">{m.text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[#86868b] italic py-2">Chưa có phiên chat trực tuyến gần đây.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: GHI CHÚ NỘI BỘ & GẮN THẺ */}
                  {customer360ActiveTab === 'notes' && (
                    <div className="space-y-5 text-xs">
                      {/* Tags Manager */}
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                        <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#0071e3]" />
                          <span>Gắn Thẻ Khách Hàng (Customer Tags)</span>
                        </h5>
                        <div className="flex flex-wrap items-center gap-2">
                          {(customer360Data?.tags || selectedCustomer.tags || []).map((t: string) => (
                            <span key={t} className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-medium flex items-center gap-1.5 shadow-2xs">
                              <span>#{t}</span>
                              <button
                                onClick={() => handleRemoveCustomerTag(t)}
                                className="hover:text-rose-600 font-bold ml-1 text-xs"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Nhập tên thẻ mới (ví dụ: KOL, Săn Sale, VIP Tech...)"
                            value={newCustomerTag}
                            onChange={(e) => setNewCustomerTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomerTag()}
                            className="flex-1 bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-hidden focus:border-[#0071e3]"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomerTag}
                            className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl transition-colors shrink-0"
                          >
                            + Gắn Thẻ
                          </button>
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                        <h5 className="font-bold text-[#1d1d1f] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0071e3]" />
                          <span>Ghi Chú Nội Bộ (Chỉ nhân viên nội bộ xem được)</span>
                        </h5>
                        <div className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            placeholder="Thêm ghi chú CSKH, sở thích, tính cách khách hàng..."
                            value={newCustomerNote}
                            onChange={(e) => setNewCustomerNote(e.target.value)}
                            className="flex-1 bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-hidden focus:border-[#0071e3]"
                          />
                          <button
                            type="button"
                            onClick={handleSaveCustomerNote}
                            className="px-4 py-2.5 bg-[#1d1d1f] hover:bg-black text-white font-bold rounded-xl transition-colors shrink-0"
                          >
                            Lưu Ghi Chú
                          </button>
                        </div>

                        <div className="space-y-2 pt-2">
                          {(customer360Data?.notes || []).map((note: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[#f5f5f7] rounded-xl space-y-1">
                              <p className="text-[#1d1d1f] font-medium">{note.text}</p>
                              <div className="flex items-center justify-between text-[10px] text-[#86868b] pt-0.5">
                                <span>Tác giả: <strong>{note.author}</strong></span>
                                <span>{new Date(note.createdAt).toLocaleString('vi-VN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f5f5f7] border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-[#86868b]">Dữ liệu được cập nhật thời gian thực từ cơ sở dữ liệu CRM TechZone.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomer360Open(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-[#1d1d1f] text-xs font-semibold rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomer360Open(false);
                    handleOpenCampaignModal(selectedCustomer);
                  }}
                  className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Ưu Đãi Riêng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL PHÁT HÀNH CHIẾN DỊCH CSKH & REMARKETING                       */}
      {/* =================================================================== */}

      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-[#f5f5f7] border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">Phát Hành Chiến Dịch CSKH &amp; Remarketing</h3>
                <p className="text-xs text-[#6e6e73] mt-0.5">
                  Đối tượng: <strong className="text-[#0071e3]">{campaignTarget.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-[#6e6e73] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCampaignSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1.5">Kênh Truyền Thông (Channel)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCampaignChannel('EMAIL')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      campaignChannel === 'EMAIL'
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-white border-gray-200 text-[#6e6e73]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email HTML</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCampaignChannel('SMS')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      campaignChannel === 'SMS'
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : 'bg-white border-gray-200 text-[#6e6e73]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>SMS Brandname</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCampaignChannel('PUSH')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      campaignChannel === 'PUSH'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white border-gray-200 text-[#6e6e73]'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>App Push Noti</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Loại Kịch Bản Chăm Sóc</label>
                <select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                >
                  <option value="CHÀO_MỪNG">Chào mừng thành viên mới (Welcome)</option>
                  <option value="NHẮC_GIỎ_HÀNG">Nhắc giỏ hàng bỏ quên (Abandoned Cart Recovery)</option>
                  <option value="SINH_NHẬT">Chúc mừng sinh nhật (Birthday Greeting)</option>
                  <option value="ĐÁNH_GIÁ">Xin đánh giá sau giao hàng (Post-Delivery Review)</option>
                  <option value="WIN_BACK">Kịch bản "Nhớ bạn" cho khách ngủ đông (Win-Back)</option>
                  <option value="ƯU_ĐÃI_VIP">Private Sale đặc quyền hạng VIP</option>
                </select>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Mã Coupon Đính Kèm (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: TECHZONE50, WELCOME10, FREESHIPNOW"
                  value={campaignCouponCode}
                  onChange={(e) => setCampaignCouponCode(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-mono font-semibold"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tiêu Đề Thông Điệp</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề email/SMS..."
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Nội Dung Chi Tiết</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nội dung thông điệp gửi tới khách hàng..."
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCampaign}
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingCampaign && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingCampaign ? 'Đang gửi...' : 'Phát Hành Chiến Dịch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.5. MARKETING MODALS (8 DIALOGS)                                   */}
      {/* =================================================================== */}

      {/* MODAL 1: TẠO MÃ GIẢM GIÁ (COUPON) */}


    </>
  );
};
