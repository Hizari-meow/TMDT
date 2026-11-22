import React from 'react';
import { Printer, Clock } from 'lucide-react';
import { PlacedOrder, CarrierType } from './types';

interface OrderSuccessViewProps {
  placedOrder: PlacedOrder;
  address: string;
  city: string;
  carrier: CarrierType;
  onPrint: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  placedOrder,
  address,
  city,
  carrier,
  onPrint,
  onViewOrders,
}) => {
  return (
    <div className="p-8 text-center space-y-6 overflow-y-auto">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-md font-bold">
        ✓
      </div>
      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          ĐẶT HÀNG THÀNH CÔNG
        </span>
        <h3 className="text-xl font-bold text-[#1d1d1f]">Cảm ơn bạn đã mua hàng tại TechZone!</h3>
        <p className="text-xs text-[#6e6e73] max-w-md mx-auto">
          Hệ thống đã tự động bảo lưu tồn kho trong PostgreSQL 16 và gửi thông báo xác nhận đến email{' '}
          <strong className="text-[#1d1d1f]">buyer@flashsale.com</strong>.
        </p>
      </div>

      {/* Receipt Summary Box */}
      <div className="p-5 bg-[#f5f5f7] border border-gray-200 rounded-2xl text-left space-y-3 text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200/80 font-mono">
          <span className="text-[#6e6e73]">Mã đơn hàng:</span>
          <span className="font-bold text-[#1d1d1f] text-[11px]">{placedOrder.orderId}</span>
        </div>
        <div className="flex justify-between items-center font-mono">
          <span className="text-[#6e6e73]">Mã vận đơn (Tracking ID):</span>
          <span className="font-bold text-[#0071e3] text-[11px]">{placedOrder.trackingId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#6e6e73]">Địa chỉ giao:</span>
          <span className="font-medium text-[#1d1d1f]">{address}, {city}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#6e6e73]">Dự kiến nhận hàng:</span>
          <span className="font-bold text-emerald-600">
            {carrier === 'AHAMOVE' ? 'Trong 2 giờ (Hỏa Tốc)' : 'Ngày mai (Giao nhanh)'}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200/80 font-bold text-sm">
          <span className="text-[#1d1d1f]">Tổng thanh toán:</span>
          <span className="font-mono text-red-600 font-bold">${placedOrder.totalAmount}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onPrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-xs font-semibold text-[#1d1d1f] flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>In Hóa Đơn Điện Tử</span>
        </button>

        <button
          onClick={onViewOrders}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>Xem Tiến Trình Đơn Hàng</span>
          <Clock className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
