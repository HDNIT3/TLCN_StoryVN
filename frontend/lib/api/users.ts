import { api } from './client';

export async function apiGetAllUsers() {
  const res = await api.get('/users');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Không thể tải danh sách người dùng.');
  }
  return data;
}

export async function apiToggleUserStatus(userId: string, newStatus: string) {
  const res = await api.patch(`/users/${userId}/status`, { status: newStatus });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Thay đổi trạng thái thất bại.');
  }
  return data;
}
