'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthModalProps, AuthMode, PasswordStrength } from './auth/types';
import { AuthModalHeader } from './auth/AuthModalHeader';
import { LoginForm } from './auth/LoginForm';
import { TwoFactorForm } from './auth/TwoFactorForm';
import { RegisterForm } from './auth/RegisterForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';

export type { AuthModalProps };

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

  const [mode, setMode] = useState<AuthMode>('LOGIN');
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
  const getPasswordStrength = (pass: string): PasswordStrength => {
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
        <AuthModalHeader mode={mode} onClose={handleClose} />

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

        {/* MODE: LOGIN */}
        {mode === 'LOGIN' && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            onLoginSubmit={handleLoginSubmit}
            onSocialClick={handleSocialClick}
            onSwitchMode={setMode}
            onClose={handleClose}
          />
        )}

        {/* MODE: 2FA VERIFICATION */}
        {mode === '2FA' && (
          <TwoFactorForm
            email={email}
            otpDigits={otpDigits}
            otpInputRefs={otpInputRefs}
            loading={loading}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onFillTestOtp={() => setOtpDigits(['8', '9', '2', '4', '1', '0'])}
            on2FASubmit={handle2FASubmit}
            onBackToLogin={() => setMode('LOGIN')}
          />
        )}

        {/* MODE: REGISTER */}
        {mode === 'REGISTER' && (
          <RegisterForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            strength={strength}
            loading={loading}
            onRegisterSubmit={handleRegisterSubmit}
            onBackToLogin={() => setMode('LOGIN')}
          />
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === 'FORGOT' && (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            onSubmit={() => {
              setSuccessToast('Đã gửi mã khôi phục mật khẩu vào hòm thư!');
              setTimeout(() => setMode('LOGIN'), 1200);
            }}
            onBackToLogin={() => setMode('LOGIN')}
          />
        )}
      </div>
    </div>
  );
};
