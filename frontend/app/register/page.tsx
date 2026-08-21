'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  PenTool, 
  Mail, 
  User, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegisterPage() {
  const router = useRouter();

  // Registration step state: 'register' | 'otp' | 'success'
  const [step, setStep] = useState<'register' | 'otp' | 'success'>('register');

  // Form inputs state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'READER' | 'AUTHOR'>('READER');

  // OTP inputs state (array of 6 strings for separate boxes)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  
  // Timer for OTP resend (in seconds)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // General state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Client side validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!email) {
      errors.email = 'Email không được để trống.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không đúng định dạng.';
    }

    if (!username) {
      errors.username = 'Tên tài khoản không được để trống.';
    } else if (username.length < 3) {
      errors.username = 'Tên tài khoản phải chứa ít nhất 3 ký tự.';
    }

    if (!password) {
      errors.password = 'Mật khẩu không được để trống.';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit registration form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }

      // Success -> Go to OTP Step
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
      setOtp(Array(6).fill(''));
      setOtpError('');
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (val && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      // If current box is empty, clear previous box and focus it
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        const prevInput = (e.currentTarget.previousSibling as HTMLInputElement);
        if (prevInput) prevInput.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Submit OTP code
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccessMsg('');
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      setOtpError('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Mã OTP không hợp lệ.');
      }

      // Success -> Go to success step
      setStep('success');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setOtpError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code
  const handleResendOtp = async () => {
    if (!canResend) return;

    setOtpError('');
    setOtpSuccessMsg('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gửi lại mã OTP thất bại.');
      }

      setOtpSuccessMsg('Mã OTP mới đã được gửi đến email của bạn.');
      setCountdown(60);
      setCanResend(false);
      setOtp(Array(6).fill(''));
    } catch (err: any) {
      setOtpError(err.message || 'Không thể gửi lại mã OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-800 sm:px-6 lg:px-8 relative">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-violet-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl md:p-10 z-10">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-2xl tracking-wider text-white shadow-md shadow-indigo-600/10">
            S
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {step === 'register' && 'Đăng Ký Tài Khoản'}
            {step === 'otp' && 'Xác Thực Tài Khoản'}
            {step === 'success' && 'Đăng Ký Thành Công'}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {step === 'register' && 'Tạo tài khoản để bắt đầu trải nghiệm tại StoryVN'}
            {step === 'otp' && `Chúng tôi đã gửi mã xác thực đến ${email}`}
            {step === 'success' && 'Tài khoản của bạn đã được kích hoạt thành công!'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-655" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: REGISTRATION FORM */}
        {step === 'register' && (
          <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-650 text-zinc-700">Bạn muốn đăng ký với tư cách là?</label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* READER CARD */}
                <button
                  type="button"
                  onClick={() => setRole('READER')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-300 hover:border-zinc-350 hover:bg-zinc-50/50 ${
                    role === 'READER' 
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/10' 
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                  }`}
                >
                  <BookOpen className={`h-8 w-8 mb-2 ${role === 'READER' ? 'text-indigo-600' : 'text-zinc-400'}`} />
                  <span className="font-bold text-sm">Độc Giả</span>
                  <span className="text-[11px] text-zinc-400 mt-1">Đọc và theo dõi truyện</span>
                </button>

                {/* AUTHOR CARD */}
                <button
                  type="button"
                  onClick={() => setRole('AUTHOR')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-300 hover:border-zinc-350 hover:bg-zinc-50/50 ${
                    role === 'AUTHOR' 
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/10' 
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                  }`}
                >
                  <PenTool className={`h-8 w-8 mb-2 ${role === 'AUTHOR' ? 'text-indigo-600' : 'text-zinc-400'}`} />
                  <span className="font-bold text-sm">Tác Giả</span>
                  <span className="text-[11px] text-zinc-400 mt-1">Đăng tải và quản lý truyện</span>
                </button>

              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    className={`block w-full rounded-xl border bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600/10 ${
                      fieldErrors.email ? 'border-red-300 focus:border-red-500' : 'border-zinc-200'
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tên tài khoản</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: '' });
                    }}
                    className={`block w-full rounded-xl border bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600/10 ${
                      fieldErrors.username ? 'border-red-300 focus:border-red-500' : 'border-zinc-200'
                    }`}
                    placeholder="username123"
                  />
                </div>
                {fieldErrors.username && <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                    }}
                    className={`block w-full rounded-xl border bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600/10 ${
                      fieldErrors.password ? 'border-red-300 focus:border-red-500' : 'border-zinc-200'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                    }}
                    className={`block w-full rounded-xl border bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600/10 ${
                      fieldErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-zinc-200'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:bg-indigo-500 hover:shadow-indigo-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Tiếp Tục Đăng Ký
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-zinc-500">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-semibold text-indigo-600 hover:text-indigo-700 outline-none"
              >
                Đăng nhập ngay
              </button>
            </p>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerify}>
            
            {/* Notification triggers */}
            {otpError && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}
            {otpSuccessMsg && (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>{otpSuccessMsg}</span>
              </div>
            )}

            {/* OTP input boxes */}
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="h-12 w-12 rounded-xl border border-zinc-200 bg-zinc-50 text-center text-xl font-bold text-zinc-800 outline-none transition-all duration-200 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 sm:h-14 sm:w-14"
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              
              {/* Submit Code */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:bg-indigo-500 hover:shadow-indigo-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Xác Thực OTP & Kích Hoạt
                  </>
                )}
              </button>

              {/* Resend details */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('register');
                  }}
                  className="flex items-center gap-1.5 font-semibold text-zinc-500 hover:text-zinc-900 outline-none transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 outline-none transition-colors"
                  >
                    Gửi lại mã OTP
                  </button>
                ) : (
                  <span className="text-zinc-500">
                    Gửi lại mã sau <strong className="text-zinc-700">{countdown}s</strong>
                  </span>
                )}
              </div>

            </div>

          </form>
        )}

        {/* STEP 3: SUCCESS VIEW */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 scale-125 rounded-full bg-emerald-500/5 blur-xl"></div>
              <CheckCircle className="relative h-20 w-20 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">Tài khoản đã kích hoạt!</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Chào mừng bạn đến với <strong>StoryVN</strong>. Cửa sổ sẽ tự động chuyển hướng đến trang Đăng Nhập.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
              Đang chuyển hướng...
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
