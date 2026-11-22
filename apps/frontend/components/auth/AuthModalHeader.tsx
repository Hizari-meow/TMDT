import React from 'react';
import { X, ShieldCheck, KeyRound } from 'lucide-react';
import { AuthModalHeaderProps } from './types';

export const AuthModalHeader: React.FC<AuthModalHeaderProps> = ({ mode, onClose }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Apple-style monochrome badge */}
        <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] border border-gray-200 flex items-center justify-center text-[#1d1d1f]">
          {mode === '2FA' ? (
            <KeyRound className="w-4 h-4 text-[#0071e3]" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
            {mode === 'LOGIN' && 'Đăng nhập TechZone ID'}
            {mode === 'REGISTER' && 'Tạo tài khoản TechZone ID'}
            {mode === 'FORGOT' && 'Đặt lại mật khẩu'}
            {mode === '2FA' && 'Xác thực hai yếu tố'}
          </h3>
          <p className="text-[11px] text-[#6e6e73]">
            {mode === '2FA'
              ? 'Bảo vệ tài khoản với 2FA'
              : 'Trải nghiệm mua sắm bảo mật chuẩn Apple'}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 flex items-center justify-center transition-colors"
        title="Đóng"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
