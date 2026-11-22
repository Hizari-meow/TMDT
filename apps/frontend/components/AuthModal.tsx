'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccessLogin?: (user: { fullName: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSuccessLogin,
}) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    verify2FA,
    register,
    socialLogin,
  } = useAuth();

  // Resolved open/close states
  const isOpen = propIsOpen !== undefined ? propIsOpen : isAuthModalOpen;
  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      closeAuthModal();
    }
  };

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | '2FA'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('buyer@flashsale.com');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // 6-digit OTP code states
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '9', '2', '4', '1', '0']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset notifications on mode change
  useEffect(() => {
    setErrorMsg(null);
    setSuccessToast(null);
  }, [mode]);

  if (!isOpen) return null;

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Yếu', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Trung bình', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Khá mạnh', color: 'bg-blue-500' };
    return { score: 100, label: 'Rất mạnh', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otpDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpDigits(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  // Submit Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.requires2FA) {
        setMode('2FA');
        setLoading(false);
        return;
      }

      setSuccessToast(`Đăng nhập thành công! Chào mừng ${result.user?.fullName || ''}`);
      if (onSuccessLogin && result.user) {
        onSuccessLogin({ fullName: result.user.fullName, email: result.user.email });
      }
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const user = await verify2FA(email, fullCode);
      setSuccessToast(`Xác thực hoàn tất! Chào mừng ${user.fullName}`);
      if (onSuccessLogin) {
        onSuccessLogin({ fullName: user.fullName, email: user.email });
      }
      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mã xác thực không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength.score < 50) {
      setErrorMsg('Vui lòng chọn mật khẩu mạnh hơn (tối thiểu 8 ký tự, gồm chữ hoa và số).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const user = await register({
        fullName,
        email,
        password,
        phone,
      });
      setSuccessToast(`Đăng ký thành công! Chào mừng ${user.fullName}`);
      if (onSuccessLogin) {
        onSuccessLogin({ fullName: user.fullName, email: user.email });
      }
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng ký không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (provider: 'Google' | 'Apple' | 'Facebook') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await socialLogin(provider);
      setSuccessToast(`Đăng nhập qua ${provider} thành công!`);
      if (onSuccessLogin) {
        onSuccessLogin({ fullName: user.fullName, email: user.email });
      }
      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập liên kết thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Apple-style Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Container: Apple Minimalist Aesthetic */}
      <div className="relative w-full max-w-[420px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-7 sm:p-8 z-10 space-y-6 text-[#1d1d1f] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
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
            onClick={handleClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE: LOGIN                                                    */}
        {/* ============================================================== */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
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
                  onClick={() => setMode('FORGOT')}
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
                  onClick={() => setShowPassword(!showPassword)}
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
                onClick={() => handleSocialClick('Apple')}
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
                onClick={() => handleSocialClick('Google')}
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
                onClick={() => handleSocialClick('Facebook')}
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
                  onClick={() => setMode('REGISTER')}
                  className="text-[#0071e3] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="text-[#86868b] hover:text-[#1d1d1f] text-[11px] block mx-auto transition-colors"
              >
                Mua sắm với tư cách Khách Vãng Lai &rarr;
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* MODE: 2FA VERIFICATION                                         */}
        {/* ============================================================== */}
        {mode === '2FA' && (
          <form onSubmit={handle2FASubmit} className="space-y-5 text-center text-xs">
            <div className="space-y-1.5">
              <p className="text-[#1d1d1f] font-semibold text-sm">Nhập mã xác thực 6 chữ số</p>
              <p className="text-[#6e6e73] text-xs leading-relaxed max-w-xs mx-auto">
                Mã bảo mật OTP đã được gửi đến thiết bị tin cậy của tài khoản{' '}
                <strong className="text-[#1d1d1f]">{email}</strong>.
              </p>
            </div>

            {/* 6 Discrete Apple-style PIN Boxes */}
            <div className="flex justify-center gap-2 sm:gap-2.5 pt-1" onPaste={handleOtpPaste}>
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
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 bg-[#f5f5f7] border border-gray-200 focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-center text-xl font-mono font-bold text-[#1d1d1f] outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <div className="text-[11px] text-[#6e6e73]">
              <span>Gợi ý mã kiểm thử: </span>
              <button
                type="button"
                onClick={() => setOtpDigits(['8', '9', '2', '4', '1', '0'])}
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
                onClick={() => setMode('LOGIN')}
                className="text-[#86868b] hover:text-[#1d1d1f] text-[11px] block mx-auto transition-colors"
              >
                &larr; Quay lại phương thức đăng nhập khác
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* MODE: REGISTER                                                 */}
        {/* ============================================================== */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
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
                  onClick={() => setShowPassword(!showPassword)}
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
                onClick={() => setMode('LOGIN')}
                className="text-[#6e6e73] hover:text-[#1d1d1f] text-[11px]"
              >
                Đã có tài khoản? <strong className="text-[#0071e3] font-semibold">Đăng nhập</strong>
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* MODE: FORGOT PASSWORD                                          */}
        {/* ============================================================== */}
        {mode === 'FORGOT' && (
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
              onClick={() => {
                setSuccessToast('Đã gửi mã khôi phục mật khẩu vào hòm thư!');
                setTimeout(() => setMode('LOGIN'), 1200);
              }}
              className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              Gửi liên kết khôi phục
            </button>
            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className="w-full text-center text-[#86868b] hover:text-[#1d1d1f] text-[11px]"
            >
              &larr; Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
