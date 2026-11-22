import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { CarrierType } from './types';

interface CarrierSectionProps {
  carrier: CarrierType;
  setCarrier: (val: CarrierType) => void;
}

export const CarrierSection: React.FC<CarrierSectionProps> = ({ carrier, setCarrier }) => {
  return (
    <div className="space-y-3 pt-3 border-t border-gray-100">
      <h3 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
        <Truck className="w-4 h-4 text-[#0071e3]" />
        <span>2. Đơn vị vận chuyển đối tác</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setCarrier('AHAMOVE')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            carrier === 'AHAMOVE'
              ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
              : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#0071e3]">
              HỎA TỐC 2H
            </span>
            {carrier === 'AHAMOVE' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
          </div>
          <p className="text-xs font-semibold text-[#1d1d1f] mt-2">AhaMove / GrabExpress</p>
          <p className="text-[10px] text-[#6e6e73]">Giao ngay trong 2 giờ</p>
        </div>

        <div
          onClick={() => setCarrier('GHN')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            carrier === 'GHN'
              ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
              : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-[#1d1d1f]">
              TIÊU CHUẨN
            </span>
            {carrier === 'GHN' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
          </div>
          <p className="text-xs font-semibold text-[#1d1d1f] mt-2">Giao Hàng Nhanh (GHN)</p>
          <p className="text-[10px] text-[#6e6e73]">Giao trong 24h - 48h</p>
        </div>

        <div
          onClick={() => setCarrier('GHTK')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            carrier === 'GHTK'
              ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
              : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-[#1d1d1f]">
              TIẾT KIỆM
            </span>
            {carrier === 'GHTK' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />}
          </div>
          <p className="text-xs font-semibold text-[#1d1d1f] mt-2">GHTK Express</p>
          <p className="text-[10px] text-[#6e6e73]">Giao tiết kiệm 2 - 3 ngày</p>
        </div>
      </div>
    </div>
  );
};
