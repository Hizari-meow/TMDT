'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { useCart } from '../../context/CartContext';
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  CreditCard,
  RefreshCw,
  Package,
  Truck,
  Check,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  Star,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

const DEFAULT_USER_ID =
  process.env.NEXT_PUBLIC_DEFAULT_USER_ID || '33333333-3333-3333-3333-333333333333';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { addItem, setIsCartOpen } = useCart();

  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [expandedTimelineOrderId, setExpandedTimelineOrderId] = useState<string | null>(null);

  // Cancel / Return modal state
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('Đổi ý không muốn mua nữa');
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  // Review modal state
  const [reviewingProduct, setReviewingProduct] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['user-orders', DEFAULT_USER_ID],
    queryFn: () => apiClient.getUserOrders(DEFAULT_USER_ID),
    refetchInterval: 3000,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const payMutation = useMutation({
    mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
      setPayingOrderId(orderId);
      return await apiClient.mockPayOrder(orderId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      setPayingOrderId(null);
      showToast('Thanh toán thành công! Giao dịch được xác nhận qua Webhook HMAC.');
    },
    onError: () => {
      setPayingOrderId(null);
      showToast('Lỗi khi thanh toán đơn hàng.');
    },
  });

  const handleReorder = (order: any) => {
    order.orderItems?.forEach((item: any) => {
      addItem({
        productId: item.productId,
        name: item.product?.name || 'Sản phẩm',
        price: Number(item.unitPrice),
        imageUrl: item.product?.imageUrl,
        quantity: item.quantity,
      });
    });
    showToast(`Đã thêm lại ${order.orderItems?.length || 1} sản phẩm vào giỏ hàng!`);
    setIsCartOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;
    setIsProcessingCancel(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/${cancellingOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) {
        showToast('Đã hủy đơn hàng thành công và tự động hoàn trả tồn kho!');
        setCancellingOrder(null);
        queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      }
    } catch {
      showToast('Không thể hủy đơn hàng');
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingProduct) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: reviewingProduct.productId,
          authorName: 'Flash Sale Demo Buyer',
          rating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        showToast('Cảm ơn bạn đã gửi đánh giá sản phẩm! Đã tặng +100 điểm TechZone Xu.');
        setReviewingProduct(null);
        setReviewComment('');
      }
    } catch {
      showToast('Lỗi khi đăng đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper to determine accurate order progression step (1 to 4)
  const getOrderProgress = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return {
          step: 1,
          isCancelled: false,
          label: 'Chờ thanh toán',
          step2Label: 'Chờ TT',
          step3Label: 'Chờ đóng gói',
          step4Label: 'Hoàn tất đơn',
          canCancel: true,
          canPay: true,
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'PENDING_CONFIRMATION':
        return {
          step: 1,
          isCancelled: false,
          label: 'Chờ xác nhận COD',
          step2Label: 'Chờ xác nhận',
          step3Label: 'Chờ đóng gói',
          step4Label: 'Hoàn tất đơn',
          canCancel: true,
          canPay: false,
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'PAID':
        return {
          step: 2,
          isCancelled: false,
          label: 'Đã thanh toán',
          step2Label: 'Đã thanh toán',
          step3Label: 'Đang chuẩn bị hàng',
          step4Label: 'Hoàn tất đơn',
          canCancel: true,
          canPay: false,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'CONFIRMED':
        return {
          step: 2,
          isCancelled: false,
          label: 'Shop đã duyệt đơn',
          step2Label: 'Đã xác nhận',
          step3Label: 'Đang đóng gói',
          step4Label: 'Hoàn tất đơn',
          canCancel: true,
          canPay: false,
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'PACKING':
        return {
          step: 2,
          isCancelled: false,
          label: 'Đang đóng gói hàng',
          step2Label: 'Đang đóng gói',
          step3Label: 'Đợi shipper lấy',
          step4Label: 'Hoàn tất đơn',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'READY_FOR_PICKUP':
        return {
          step: 3,
          isCancelled: false,
          label: 'Chờ shipper lấy',
          step2Label: 'Đã đóng gói',
          step3Label: 'Chờ lấy hàng',
          step4Label: 'Hoàn tất đơn',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'SHIPPING':
        return {
          step: 3,
          isCancelled: false,
          label: 'Đang giao hàng',
          step2Label: 'Đã xuất kho',
          step3Label: 'Đang giao hàng',
          step4Label: 'Hoàn tất đơn',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        };
      case 'DELIVERED':
        return {
          step: 4,
          isCancelled: false,
          label: 'Đã giao thành công',
          step2Label: 'Đã xuất kho',
          step3Label: 'Đã giao hàng',
          step4Label: 'Hoàn tất đơn',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        };
      case 'COMPLETED':
        return {
          step: 4,
          isCancelled: false,
          label: 'Hoàn tất đơn hàng',
          step2Label: 'Đã thanh toán',
          step3Label: 'Giao thành công',
          step4Label: 'Hoàn tất đơn',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'CANCELLED':
        return {
          step: -1,
          isCancelled: true,
          label: 'Đã hủy đơn',
          step2Label: 'Đã hủy',
          step3Label: 'Hoàn tồn kho',
          step4Label: 'Đã kết thúc',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'RETURNED':
        return {
          step: -1,
          isCancelled: true,
          label: 'Đổi trả / Hoàn tiền',
          step2Label: 'Đổi trả',
          step3Label: 'Thu hồi về kho',
          step4Label: 'Đã hoàn tiền',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      default:
        return {
          step: 1,
          isCancelled: false,
          label: status,
          step2Label: 'Đang xử lý',
          step3Label: 'Đang giao hàng',
          step4Label: 'Hoàn tất đơn',
          canCancel: false,
          canPay: false,
          badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const s = order.status;
    if (activeTab === 'PENDING') return s === 'PENDING_PAYMENT' || s === 'PENDING_CONFIRMATION';
    if (activeTab === 'PROCESSING') return s === 'PAID' || s === 'CONFIRMED' || s === 'PACKING' || s === 'READY_FOR_PICKUP';
    if (activeTab === 'SHIPPING') return s === 'SHIPPING';
    if (activeTab === 'COMPLETED') return s === 'DELIVERED' || s === 'COMPLETED';
    if (activeTab === 'CANCELLED') return s === 'CANCELLED' || s === 'RETURNED' || s === 'RETURN_REQUESTED';
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 flex flex-col gap-6 pb-20 text-[#1d1d1f]">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-white border border-emerald-300 text-[#1d1d1f] shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700">Thông báo đơn hàng</p>
            <p className="text-[11px] text-[#6e6e73]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/"
              className="text-xs text-[#6e6e73] hover:text-[#0071e3] flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Cửa hàng TechZone</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight flex items-center gap-3">
            <span>Đơn hàng của tôi</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0071e3]">
              {orders.length} đơn hàng
            </span>
          </h1>
          <p className="text-xs text-[#6e6e73] mt-1">
            Tra cứu hành trình vận chuyển thời gian thực và quản lý hậu mãi
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#1d1d1f] hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Cập nhật trực tiếp</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-3 overflow-x-auto no-scrollbar">
        {[
          { key: 'ALL', label: 'Tất cả đơn hàng' },
          { key: 'PENDING', label: 'Chờ xử lý / Chờ TT' },
          { key: 'PROCESSING', label: 'Đang đóng gói' },
          { key: 'SHIPPING', label: 'Đang giao hàng' },
          { key: 'COMPLETED', label: 'Đã hoàn tất' },
          { key: 'CANCELLED', label: 'Đã hủy' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 text-[#86868b] gap-3">
          <RefreshCw className="w-7 h-7 animate-spin text-[#0071e3]" />
          <p className="text-xs font-medium">Đang đồng bộ dữ liệu đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white border border-gray-200/80 rounded-3xl text-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] border border-gray-200 flex items-center justify-center text-gray-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f]">Chưa có đơn hàng nào trong mục này</h3>
            <p className="text-xs text-[#6e6e73] max-w-sm mt-1 leading-relaxed">
              Bạn có thể săn các deal giảm 50% trong khung giờ Flash Sale hoặc mua sắm trực tiếp từ danh mục TechZone!
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order: any) => {
            const progress = getOrderProgress(order.status);
            const isPaying = payingOrderId === order.id;
            const isTimelineExpanded = expandedTimelineOrderId === order.id;

            return (
              <div
                key={order.id}
                className="p-6 bg-white border border-gray-200/80 hover:border-gray-300 rounded-3xl transition-all shadow-sm flex flex-col gap-5"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#6e6e73] font-medium">
                      Mã đơn: <strong className="text-[#1d1d1f]">{order.id}</strong>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0071e3] border border-blue-200">
                      {order.orderType === 'FLASH_SALE' ? '⚡ FLASH DEAL' : '📦 ĐƠN TIÊU CHUẨN'}
                    </span>
                    {order.carrier && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-gray-100 text-[#1d1d1f]">
                        {order.carrier}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[#86868b] font-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="text-gray-400 hover:text-[#1d1d1f] p-1"
                      title="In hóa đơn"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-[#f5f5f7] border border-gray-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#1d1d1f] text-sm">
                            {item.product?.name || 'iPhone 16 Pro 256GB'}
                          </p>
                          <p className="text-[#6e6e73] text-[11px] font-mono mt-0.5">
                            Số lượng: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono font-bold text-sm text-[#1d1d1f]">
                          ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                        </div>

                        {/* Review button if completed or paid */}
                        {(progress.step >= 4 || order.status === 'PAID') && (
                          <button
                            onClick={() => setReviewingProduct(item)}
                            className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>Đánh giá</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stepper Status Progress */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#f5f5f7] border border-gray-200/80 space-y-4">
                  {progress.isCancelled ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-700">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-semibold">
                          Đơn hàng đã được đánh dấu {progress.label.toUpperCase()}. Tồn kho đã tự động hoàn trả an toàn.
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-rose-500">Mã: {order.id.slice(0, 8)}</span>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Connecting Progress Line */}
                      <div className="absolute top-3 left-[12%] right-[12%] h-1 bg-gray-200 rounded-full z-0 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width:
                              progress.step >= 4
                                ? '100%'
                                : progress.step >= 3
                                ? '66%'
                                : progress.step >= 2
                                ? '33%'
                                : '0%',
                          }}
                        />
                      </div>

                      {/* 4 Steps */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] relative z-10">
                        {/* Step 1: Đã đặt hàng */}
                        <div className="flex flex-col items-center gap-1.5 text-emerald-600 font-semibold">
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span>Đã đặt hàng</span>
                        </div>

                        {/* Step 2: Xác nhận & Đóng gói */}
                        <div
                          className={`flex flex-col items-center gap-1.5 font-semibold ${
                            progress.step >= 2
                              ? 'text-emerald-600'
                              : progress.step === 1
                              ? 'text-amber-600'
                              : 'text-gray-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-xs ${
                              progress.step >= 2
                                ? 'border-emerald-500'
                                : progress.step === 1
                                ? 'border-amber-500 animate-pulse'
                                : 'border-gray-300'
                            }`}
                          >
                            {progress.step >= 2 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : progress.step === 1 ? (
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <span>{progress.step2Label}</span>
                        </div>

                        {/* Step 3: Vận chuyển */}
                        <div
                          className={`flex flex-col items-center gap-1.5 font-semibold ${
                            progress.step >= 4
                              ? 'text-emerald-600'
                              : progress.step === 3
                              ? 'text-[#0071e3]'
                              : 'text-gray-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-xs ${
                              progress.step >= 4
                                ? 'border-emerald-500'
                                : progress.step === 3
                                ? 'border-[#0071e3] shadow-sm'
                                : 'border-gray-300'
                            }`}
                          >
                            {progress.step >= 4 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : progress.step === 3 ? (
                              <Truck className="w-3.5 h-3.5 text-[#0071e3] animate-pulse" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <span>{progress.step3Label}</span>
                        </div>

                        {/* Step 4: Hoàn tất đơn */}
                        <div
                          className={`flex flex-col items-center gap-1.5 font-semibold ${
                            progress.step >= 4 ? 'text-emerald-600' : 'text-gray-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-xs ${
                              progress.step >= 4 ? 'border-emerald-500' : 'border-gray-300'
                            }`}
                          >
                            {progress.step >= 4 ? (
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <span>{progress.step4Label}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Detailed Hourly Timeline */}
                  <div className="pt-2 border-t border-gray-200/80 flex justify-center">
                    <button
                      onClick={() =>
                        setExpandedTimelineOrderId(isTimelineExpanded ? null : order.id)
                      }
                      className="text-[11px] text-[#6e6e73] hover:text-[#0071e3] flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>{isTimelineExpanded ? 'Thu gọn hành trình' : 'Xem chi tiết mốc thời gian giao nhận'}</span>
                      {isTimelineExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {isTimelineExpanded && (
                    <div className="pt-3 space-y-2 text-xs border-t border-gray-200/80 text-[#1d1d1f]">
                      <div className="p-3.5 bg-white border border-gray-200 rounded-2xl space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between text-[11px] pb-2 border-b border-gray-100 font-mono">
                          <span className="text-[#6e6e73]">Đơn vị giao vận:</span>
                          <strong className="text-[#0071e3]">{order.carrier || 'Giao Hàng Nhanh (GHN)'}</strong>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex flex-wrap items-center justify-between text-[11px] pb-2 border-b border-gray-100">
                            <span className="text-[#6e6e73]">Địa chỉ nhận hàng:</span>
                            <span className="font-medium text-[#1d1d1f]">
                              {order.shippingAddress.address}, {order.shippingAddress.city || 'TP. Hồ Chí Minh'}
                            </span>
                          </div>
                        )}
                        <div className="space-y-2 pt-1">
                          {order.timeline && order.timeline.length > 0 ? (
                            order.timeline.map((evt: any, i: number) => (
                              <div key={i} className="flex items-start gap-2.5 text-[11px]">
                                <span className="text-emerald-600 font-bold shrink-0 font-mono">
                                  • {new Date(evt.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div>
                                  <strong className="text-[#1d1d1f]">{evt.title}</strong>
                                  {evt.actor && <span className="text-[#6e6e73]"> ({evt.actor})</span>}
                                  {evt.note && <p className="text-[10px] text-[#6e6e73] mt-0.5">{evt.note}</p>}
                                </div>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex items-start gap-2.5 text-[11px]">
                                <span className="text-emerald-600 font-bold shrink-0 font-mono">
                                  • {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div>
                                  <strong className="text-[#1d1d1f]">Đặt hàng thành công</strong>
                                  <p className="text-[10px] text-[#6e6e73]">Hệ thống bảo lưu tồn kho trong PostgreSQL 16</p>
                                </div>
                              </div>
                              {progress.step >= 2 && (
                                <div className="flex items-start gap-2.5 text-[11px]">
                                  <span className="text-emerald-600 font-bold shrink-0 font-mono">• Đã duyệt</span>
                                  <div>
                                    <strong className="text-[#1d1d1f]">Đơn hàng được xác nhận &amp; đóng gói</strong>
                                    <p className="text-[10px] text-[#6e6e73]">Bộ phận kho chuẩn bị kiện hàng và dán tem vận đơn</p>
                                  </div>
                                </div>
                              )}
                              {progress.step >= 3 && (
                                <div className="flex items-start gap-2.5 text-[11px]">
                                  <span className="text-[#0071e3] font-bold shrink-0 font-mono">• Đang giao</span>
                                  <div>
                                    <strong className="text-[#1d1d1f]">Bàn giao cho tài xế {order.carrier || 'vận chuyển'}</strong>
                                    <p className="text-[10px] text-[#6e6e73]">Kiện hàng đang được chuyển phát đến địa chỉ nhận</p>
                                  </div>
                                </div>
                              )}
                              {progress.step >= 4 && (
                                <div className="flex items-start gap-2.5 text-[11px]">
                                  <span className="text-emerald-600 font-bold shrink-0 font-mono">• Hoàn tất</span>
                                  <div>
                                    <strong className="text-[#1d1d1f]">Giao hàng thành công &amp; Hoàn tất đơn</strong>
                                    <p className="text-[10px] text-[#6e6e73]">Cảm ơn bạn đã tin tưởng mua sắm tại TechZone</p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls & Amount */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] font-medium flex items-center gap-1.5 transition-colors border border-gray-200"
                      title="Thêm các sản phẩm cũ vào giỏ"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mua lại đơn này</span>
                    </button>

                    {progress.canCancel && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="text-xs text-[#86868b] hover:text-rose-600 transition-colors font-medium"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[#86868b] block uppercase font-mono">
                        Tổng thanh toán
                      </span>
                      <span className="text-lg font-bold text-red-600 font-mono">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${progress.badgeColor}`}
                    >
                      {progress.step >= 4 ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ) : progress.step === 3 ? (
                        <Truck className="w-4 h-4 text-cyan-600 animate-pulse" />
                      ) : progress.step === 2 ? (
                        <Package className="w-4 h-4 text-purple-600" />
                      ) : progress.isCancelled ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      )}
                      <span>{progress.label.toUpperCase()}</span>
                    </div>

                    {progress.canPay && (
                      <button
                        onClick={() =>
                          payMutation.mutate({
                            orderId: order.id,
                            amount: Number(order.totalAmount),
                          })
                        }
                        disabled={isPaying}
                        className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {isPaying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Đang xử lý Webhook...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Thanh toán ngay</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancellingOrder(null)} />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-xs text-[#1d1d1f]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Xác Nhận Hủy Đơn Hàng</span>
              </h3>
              <button onClick={() => setCancellingOrder(null)} className="text-gray-400 hover:text-[#1d1d1f]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#6e6e73] leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng mã <strong className="text-[#1d1d1f] font-mono">{cancellingOrder.id.slice(0, 8)}...</strong>? Hệ thống sẽ tự động hoàn trả số lượng hàng về kho sản phẩm.
            </p>

            <div>
              <label className="text-[#1d1d1f] block mb-1 font-semibold">Lý do hủy đơn</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
              >
                <option value="Đổi ý không muốn mua nữa">Đổi ý không muốn mua nữa</option>
                <option value="Muốn đổi màu sắc/dung lượng khác">Muốn đổi màu sắc / dung lượng khác</option>
                <option value="Thời gian giao hàng lâu hơn dự kiến">Thời gian giao hàng lâu hơn dự kiến</option>
                <option value="Tìm thấy mức giá tốt hơn ở nơi khác">Tìm thấy mức giá tốt hơn ở nơi khác</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] rounded-full font-medium"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={isProcessingCancel}
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full shadow-sm"
              >
                {isProcessingCancel ? 'Đang hủy...' : 'Xác Nhận Hủy Đơn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewingProduct(null)} />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-xs text-[#1d1d1f]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Đánh Giá Chất Lượng Sản Phẩm</span>
              </h3>
              <button onClick={() => setReviewingProduct(null)} className="text-gray-400 hover:text-[#1d1d1f]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#1d1d1f] font-semibold">{reviewingProduct.product?.name}</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-[#6e6e73] block mb-1">Mức độ hài lòng</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#6e6e73] block mb-1">Nhận xét chi tiết</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chất lượng sản phẩm, tốc độ giao hàng, đóng gói..."
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingProduct(null)}
                  className="px-4 py-2 bg-[#f5f5f7] text-[#6e6e73] rounded-full font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold rounded-full shadow-sm"
                >
                  {isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
