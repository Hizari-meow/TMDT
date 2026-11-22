import React from 'react';

export type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT' | '2FA';

export interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccessLogin?: (user: { fullName: string; email: string }) => void;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export interface AuthModalHeaderProps {
  mode: AuthMode;
  onClose: () => void;
}

export interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean;
  onLoginSubmit: (e: React.FormEvent) => void;
  onSocialClick: (provider: 'Google' | 'Apple' | 'Facebook') => void;
  onSwitchMode: (mode: AuthMode) => void;
  onClose: () => void;
}

export interface TwoFactorFormProps {
  email: string;
  otpDigits: string[];
  otpInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  loading: boolean;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onFillTestOtp: () => void;
  on2FASubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export interface RegisterFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean | ((prev: boolean) => boolean)) => void;
  strength: PasswordStrength;
  loading: boolean;
  onRegisterSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: () => void;
  onBackToLogin: () => void;
}
