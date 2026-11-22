import React from 'react';
import { MapPin } from 'lucide-react';
import { PRESET_ADDRESSES } from './types';

interface AddressSectionProps {
  selectedAddressId: string;
  onSelectPresetAddress: (id: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  selectedAddressId,
  onSelectPresetAddress,
  fullName,
  setFullName,
  phone,
  setPhone,
  address,
  setAddress,
  city,
  setCity,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0071e3]" />
          <span>1. Địa chỉ nhận hàng</span>
        </h3>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {PRESET_ADDRESSES.map((addr) => (
          <button
            key={addr.id}
            type="button"
            onClick={() => onSelectPresetAddress(addr.id)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedAddressId === addr.id
                ? 'bg-blue-50 border-[#0071e3] text-[#1d1d1f]'
                : 'bg-[#f5f5f7] border-gray-200 text-[#6e6e73] hover:border-gray-300'
            }`}
          >
            <p className="font-semibold text-[#1d1d1f] text-[11px]">{addr.label}</p>
            <p className="text-[10px] text-[#6e6e73] truncate mt-0.5">{addr.address}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Họ và tên người nhận</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3]"
          />
        </div>

        <div>
          <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Số điện thoại liên hệ</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">
            Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã)
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3]"
          />
        </div>

        <div>
          <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Tỉnh / Thành phố</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-gray-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] outline-none focus:border-[#0071e3]"
          >
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Cần Thơ">Cần Thơ</option>
            <option value="Hải Phòng">Hải Phòng</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] text-[#6e6e73] font-medium block mb-1">Thời gian nhận hàng</label>
          <div className="px-3.5 py-2 rounded-xl bg-[#f5f5f7] border border-gray-200 text-xs text-[#1d1d1f] font-medium">
            Tất cả các ngày trong tuần
          </div>
        </div>
      </div>
    </div>
  );
};
