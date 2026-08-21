'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  LogOut, 
  RefreshCw, 
  ArrowLeft,
  AlertCircle,
  Search,
  ShieldCheck,
  UserCheck2
} from 'lucide-react';
import { apiGetAllUsers, apiToggleUserStatus } from '@/lib/api/users';

interface UserItem {
  _id: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  status: string;
  isActive: boolean;
  avatarUrl?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Tab State: 'users' | 'settings' | 'stats'
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'stats'>('users');

  // Verify Admin role & Load user list
  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const storedUserStr = localStorage.getItem('user');

      if (!accessToken || !storedUserStr) {
        router.push('/login');
        return;
      }

      const storedUser = JSON.parse(storedUserStr);
      if (storedUser.role !== 'ADMIN') {
        router.push('/');
        return;
      }

      try {
        const data = await apiGetAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối tới máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // Block / Unblock user status
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setActionLoading(userId);

    try {
      await apiToggleUserStatus(userId, newStatus);

      // Dynamic list update
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus, isActive: newStatus === 'active' } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  // Filter query users list
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats summaries
  const countRoles = (role: string) => users.filter((u) => u.role === role).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-amber-700">
        <RefreshCw className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-zinc-900">Có lỗi xảy ra</h2>
        <p className="mt-2 text-sm text-zinc-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-amber-700 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 font-sans flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-700 font-bold text-lg text-white">
                S
              </Link>
              <span className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                Admin Panel <span className="text-amber-700">StoryVN</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Về Trang Chủ
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR TABS */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold border transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-amber-700 text-white border-amber-700 shadow-md shadow-amber-700/10'
                : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <Users className="h-5 w-5" />
            Quản lý Người dùng
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold border transition-all duration-200 ${
              activeTab === 'stats'
                ? 'bg-amber-700 text-white border-amber-700 shadow-md shadow-amber-700/10'
                : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <ShieldAlert className="h-5 w-5" />
            Thống kê hệ thống
          </button>
        </aside>

        {/* TAB WORKSPACE */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Header section & metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-zinc-400">Độc giả</p>
                  <p className="text-2xl font-black text-amber-700 mt-1">{countRoles('READER')}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-zinc-400">Tác giả</p>
                  <p className="text-2xl font-black text-amber-700 mt-1">{countRoles('AUTHOR')}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-zinc-400">Quản trị viên</p>
                  <p className="text-2xl font-black text-amber-700 mt-1">{countRoles('ADMIN')}</p>
                </div>
              </div>

              {/* Search & Actions Bar */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài khoản theo email, username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-250 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-amber-600 focus:bg-white"
                  />
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Users table */}
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-600 border-collapse">
                    <thead className="bg-zinc-50 text-[10px] uppercase font-black tracking-wider text-zinc-500 border-b border-zinc-200">
                      <tr>
                        <th className="px-6 py-4">Người dùng</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Vai trò</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((item) => (
                          <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                            
                            {/* User Avatar + Nick */}
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-amber-700">
                                {item.username.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-extrabold text-zinc-950 text-xs">{item.displayName}</p>
                                <p className="text-[10px] text-zinc-400">@{item.username}</p>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-6 py-4 text-xs font-medium text-zinc-900 truncate">
                              {item.email}
                            </td>

                            {/* Role */}
                            <td className="px-6 py-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                item.role === 'ADMIN' 
                                  ? 'bg-red-50 text-red-700 border border-red-200' 
                                  : item.role === 'AUTHOR'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-100'
                              }`}>
                                {item.role}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                item.status === 'active' ? 'text-emerald-600' : 'text-red-500'
                              }`}>
                                <span className={`h-2 w-2 rounded-full ${
                                  item.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                }`}></span>
                                {item.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-right">
                              {item.role !== 'ADMIN' ? (
                                <button
                                  onClick={() => handleToggleUserStatus(item._id, item.status)}
                                  disabled={actionLoading === item._id}
                                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                                    item.status === 'active'
                                      ? 'border-red-200 text-red-650 hover:bg-red-50'
                                      : 'border-emerald-250 text-emerald-600 hover:bg-emerald-50'
                                  } disabled:opacity-50`}
                                >
                                  {actionLoading === item._id ? (
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  ) : item.status === 'active' ? (
                                    <>
                                      <UserX className="h-3.5 w-3.5" />
                                      Khóa tài khoản
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-3.5 w-3.5" />
                                      Mở khóa
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-xs text-zinc-400 font-medium">Bảo vệ hệ thống</span>
                              )}
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                            Không tìm thấy tài khoản nào phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SYSTEM STATS */}
          {activeTab === 'stats' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl text-center space-y-4">
              <ShieldCheck className="h-14 w-14 mx-auto text-amber-700" />
              <h3 className="text-lg font-black text-zinc-900">Tính năng thống kê hoạt động</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Bản xem trước thống kê cho thấy tổng số <strong>{users.length}</strong> tài khoản đã đăng ký hoạt động trong hệ thống của bạn.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4 text-left text-xs border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <UserCheck2 className="h-4 w-4 text-emerald-500" />
                  <span>Tổng số hoạt động: {users.filter(u => u.status === 'active').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-500" />
                  <span>Tổng số bị khóa: {users.filter(u => u.status === 'inactive').length}</span>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
