import React from 'react';
import { ForgotPasswordFormProps } from './types';

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  onSubmit,
  onBackToLogin,
}) => {
  return (
    <div className="space-y-4 text-xs">
      <p className="text-[#6e6e73] text-xs leading-relaxed">
        Nhập email hoặc số điện thoại của bạn. TechZone sẽ gửi liên kết khôi phục tài khoản có hiệu lực trong 15 phút.
      </p>
      <div>
        <label className="text-[#1d1d1f] block font-medium mb-1.5 text-[11px]">
          Email hoặc Số điện thoại
        </label>
        <input
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
        />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
      >
        Gửi liên kết khôi phục
      </button>
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-center text-[#86868b] hover:text-[#1d1d1f] text-[11px]"
      >
        &larr; Quay lại đăng nhập
      </button>
    </div>
  );
};
