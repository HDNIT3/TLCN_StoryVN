'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, ArrowLeft, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { apiLogin, apiVerifyOtp, apiResendOtp } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  
  // Login step: 'login' | 'otp'
  const [step, setStep] = useState<'login' | 'otp'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP states
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer for OTP resend
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

  // Primary Login Submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin({ email, password });

      // Login Successful! Save state to localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));

      // Redirect depending on user role
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      if (err.requiresOtp) {
        setStep('otp');
        setCountdown(60);
        setCanResend(false);
        setOtp(Array(6).fill(''));
        setOtpError('');
        setError(err.message || 'Tài khoản chưa kích hoạt. Vui lòng nhập OTP.');
      } else {
        setError(err.message || 'Đăng nhập thất bại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs key events
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    if (val && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
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

  // Verify OTP submission from login screen
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
      await apiVerifyOtp({ email, otp: otpCode });
      setOtpSuccessMsg('Kích hoạt tài khoản thành công! Đang tự động đăng nhập...');
      
      // Auto-submit login payload now that account is activated!
      setTimeout(async () => {
        try {
          const loginData = await apiLogin({ email, password });
          localStorage.setItem('accessToken', loginData.accessToken);
          localStorage.setItem('refreshToken', loginData.refreshToken);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          window.dispatchEvent(new Event('storage'));
          
          if (loginData.user.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/profile');
          }
        } catch {
          setStep('login');
          setError('Kích hoạt thành công. Vui lòng nhập lại mật khẩu để đăng nhập.');
        } finally {
          setLoading(false);
        }
      }, 1500);

    } catch (err: any) {
      setOtpError(err.message || 'Xác thực OTP thất bại.');
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setOtpError('');
    setOtpSuccessMsg('');
    setLoading(true);
    try {
      await apiResendOtp({ email });
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
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-800 sm:px-6 lg:px-8 relative">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-amber-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-700/5 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl md:p-10 z-10">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-700 font-bold text-2xl tracking-wider text-white shadow-md shadow-amber-700/10">
            S
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {step === 'login' ? 'Đăng Nhập' : 'Xác Thực OTP'}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {step === 'login' 
              ? 'Chào mừng quay trở lại với StoryVN' 
              : `Nhập mã kích hoạt gửi tới ${email}`
            }
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: LOGIN VIEW */}
        {step === 'login' && (
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600/10"
                    placeholder="email@example.com"
                  />
                </div>
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-700/10 transition-all duration-300 hover:bg-amber-600 hover:shadow-amber-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Đăng Nhập
                </>
              )}
            </button>

            {/* Go to Register Link */}
            <p className="text-center text-sm text-zinc-500">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 outline-none"
              >
                Đăng ký tài khoản mới
                <ArrowRight className="h-4 w-4" />
              </button>
            </p>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION (FOR UNVERIFIED LOGIN ATTEMPT) */}
        {step === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerify}>
            
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
                    className="h-12 w-12 rounded-xl border border-zinc-200 bg-zinc-50 text-center text-xl font-bold text-zinc-800 outline-none transition-all duration-200 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-600/10 sm:h-14 sm:w-14"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-700/10 transition-all duration-300 hover:bg-amber-600 hover:shadow-amber-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Kích Hoạt Tài Khoản
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('login');
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
                    className="font-semibold text-amber-700 hover:text-amber-800 outline-none transition-colors"
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

      </div>
    </div>
  );
}
