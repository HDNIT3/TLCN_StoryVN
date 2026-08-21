import { api } from './client';

export async function apiLogin(payload: Record<string, any>) {
  const res = await api.post('/auth/login', payload);
  const data = await res.json();
  if (!res.ok) {
    throw { message: data.message || 'Đăng nhập thất bại.', requiresOtp: data.requiresOtp };
  }
  return data;
}

export async function apiRegister(payload: Record<string, any>) {
  const res = await api.post('/auth/register', payload);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Đăng ký thất bại.');
  }
  return data;
}

export async function apiVerifyOtp(payload: Record<string, any>) {
  const res = await api.post('/auth/verify', payload);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Mã OTP không hợp lệ.');
  }
  return data;
}

export async function apiResendOtp(payload: Record<string, any>) {
  const res = await api.post('/auth/resend', payload);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gửi lại mã OTP thất bại.');
  }
  return data;
}

export async function apiGetCurrentUser() {
  const res = await api.get('/auth/me');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Không thể tải thông tin cá nhân.');
  }
  return data;
}
