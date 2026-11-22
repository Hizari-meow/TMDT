import React from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { LoginFormProps } from './types';

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  loading,
  onLoginSubmit,
  onSocialClick,
  onSwitchMode,
  onClose,
}) => {
  return (
    <form onSubmit={onLoginSubmit} className="space-y-4 text-xs">
      <div>
        <label className="text-[#1d1d1f] block font-medium mb-1.5 text-[11px]">
          Email hoặc Số điện thoại
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-3.5 py-3 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[#1d1d1f] font-medium text-[11px]">Mật khẩu</label>
          <button
            type="button"
            onClick={() => onSwitchMode('FORGOT')}
            className="text-[11px] text-[#0071e3] hover:underline transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-10 py-3 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1d1d1f] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#0071e3] focus:ring-0 cursor-pointer"
          />
          <span className="text-[#6e6e73] text-[11px]">Ghi nhớ đăng nhập trên thiết bị này</span>
        </label>
      </div>

      {/* Apple signature primary button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          <>
            <span>Đăng nhập</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Quick Demo Buyer Fill */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            setEmail('buyer@flashsale.com');
            setPassword('Password123!');
          }}
          className="w-full py-1.5 px-3 bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 rounded-xl text-[10px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors flex items-center justify-between"
        >
          <span>⚡ Tài khoản thử nghiệm (Demo Buyer):</span>
          <span className="font-mono text-[#0071e3] font-medium">buyer@flashsale.com</span>
        </button>
      </div>

      {/* Social Logins */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white px-3 text-[#86868b] font-medium">Hoặc tiếp tục với</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Apple */}
        <button
          type="button"
          onClick={() => onSocialClick('Apple')}
          className="py-2.5 px-3 bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 rounded-xl text-[#1d1d1f] font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          title="Đăng nhập bằng Apple ID"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.42-6.19-9.52-11.05-20.2-14.58-32.06-3.53-11.85-5.3-23.07-5.3-33.65 0-14.65 3.8-26.69 11.41-36.14 7.6-9.44 17.2-14.28 28.79-14.52 4.48 0 9.77 1.25 15.86 3.76 6.09 2.5 10.05 3.81 11.88 3.92 1.34-.11 5.37-1.42 12.09-3.92 6.72-2.51 12.24-3.65 16.55-3.44 12.63.63 22.86 5.56 30.68 14.79-11.06 6.74-16.48 16.14-16.27 28.2.22 9.57 3.92 17.58 11.11 24.02 7.18 6.44 15.65 10.15 25.4 11.11-2.42 7.42-5.77 15.07-10.05 22.95zM119.22 33.15c0-7.39 2.65-14.29 7.94-20.7 5.29-6.42 11.94-10.57 19.95-12.45.22 1.16.33 2.22.33 3.17 0 7.39-2.76 14.4-8.29 21.03-5.52 6.64-12.2 10.66-20.03 12.07-.11-1.06-.17-2.12-.17-3.12z" />
          </svg>
          <span>Apple</span>
        </button>

        {/* Google */}
        <button
          type="button"
          onClick={() => onSocialClick('Google')}
          className="py-2.5 px-3 bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 rounded-xl text-[#1d1d1f] font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          title="Đăng nhập bằng Google"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => onSocialClick('Facebook')}
          className="py-2.5 px-3 bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 rounded-xl text-[#1d1d1f] font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          title="Đăng nhập bằng Facebook"
        >
          <span className="font-black text-blue-600 text-sm leading-none">f</span>
          <span>Facebook</span>
        </button>
      </div>

      {/* Switch to Register */}
      <div className="pt-2 text-center space-y-2">
        <p className="text-[#6e6e73] text-[11px]">
          Chưa có tài khoản TechZone ID?{' '}
          <button
            type="button"
            onClick={() => onSwitchMode('REGISTER')}
            className="text-[#0071e3] font-semibold hover:underline"
          >
            Đăng ký ngay
          </button>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-[#86868b] hover:text-[#1d1d1f] text-[11px] block mx-auto transition-colors"
        >
          Mua sắm với tư cách Khách Vãng Lai &rarr;
        </button>
      </div>
    </form>
  );
};
