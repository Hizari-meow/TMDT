import React from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { RegisterFormProps } from './types';

export const RegisterForm: React.FC<RegisterFormProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  strength,
  loading,
  onRegisterSubmit,
  onBackToLogin,
}) => {
  return (
    <form onSubmit={onRegisterSubmit} className="space-y-3.5 text-xs">
      <div>
        <label className="text-[#1d1d1f] block font-medium mb-1 text-[11px]">Họ và tên</label>
        <div className="relative">
          <User className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-[#1d1d1f] block font-medium mb-1 text-[11px]">Email</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-[#1d1d1f] block font-medium mb-1 text-[11px]">Số điện thoại</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0908 123 456"
            className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-[#1d1d1f] block font-medium mb-1 text-[11px]">Mật khẩu</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1d1d1f] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Apple-style discreet strength bar */}
        {password && (
          <div className="mt-2 space-y-1">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#6e6e73]">
              <span>Độ mạnh mật khẩu</span>
              <span className="font-semibold text-[#1d1d1f]">{strength.label}</span>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
      >
        {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-[#6e6e73] hover:text-[#1d1d1f] text-[11px]"
        >
          Đã có tài khoản? <strong className="text-[#0071e3] font-semibold">Đăng nhập</strong>
        </button>
      </div>
    </form>
  );
};
