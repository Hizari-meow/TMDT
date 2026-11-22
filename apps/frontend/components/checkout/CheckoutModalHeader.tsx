import React from 'react';
import { Lock, X } from 'lucide-react';

interface CheckoutModalHeaderProps {
  onClose: () => void;
}

export const CheckoutModalHeader: React.FC<CheckoutModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#0071e3] flex items-center justify-center shadow-sm">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Thanh Toán &amp; Đặt Hàng</h2>
          <p className="text-xs text-[#6e6e73]">Giao dịch mã hóa chuẩn Apple Pay &amp; PCI-DSS</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
