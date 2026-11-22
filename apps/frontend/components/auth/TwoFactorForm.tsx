import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TwoFactorFormProps } from './types';

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  email,
  otpDigits,
  otpInputRefs,
  loading,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onFillTestOtp,
  on2FASubmit,
  onBackToLogin,
}) => {
  return (
    <form onSubmit={on2FASubmit} className="space-y-5 text-center text-xs">
      <div className="space-y-1.5">
        <p className="text-[#1d1d1f] font-semibold text-sm">Nhập mã xác thực 6 chữ số</p>
        <p className="text-[#6e6e73] text-xs leading-relaxed max-w-xs mx-auto">
          Mã bảo mật OTP đã được gửi đến thiết bị tin cậy của tài khoản{' '}
          <strong className="text-[#1d1d1f]">{email}</strong>.
        </p>
      </div>

      {/* 6 Discrete Apple-style PIN Boxes */}
      <div className="flex justify-center gap-2 sm:gap-2.5 pt-1" onPaste={onOtpPaste}>
        {otpDigits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              otpInputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onOtpChange(idx, e.target.value)}
            onKeyDown={(e) => onOtpKeyDown(idx, e)}
            className="w-11 h-13 sm:w-12 sm:h-14 bg-[#f5f5f7] border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-center text-xl font-mono font-bold text-[#1d1d1f] outline-none transition-all shadow-inner"
          />
        ))}
      </div>

      <div className="text-[11px] text-[#6e6e73]">
        <span>Gợi ý mã kiểm thử: </span>
        <button
          type="button"
          onClick={onFillTestOtp}
          className="font-mono font-semibold text-[#0071e3] hover:underline"
        >
          892410
        </button>
      </div>

      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang xác nhận mã...</span>
            </div>
          ) : (
            <>
              <span>Xác nhận &amp; Đăng nhập</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="text-[#86868b] hover:text-[#1d1d1f] text-[11px] block mx-auto transition-colors"
        >
          &larr; Quay lại phương thức đăng nhập khác
        </button>
      </div>
    </form>
  );
};
