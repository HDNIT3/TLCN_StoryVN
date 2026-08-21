'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Shield, 
  Activity, 
  LogOut, 
  BookOpen, 
  Bookmark, 
  Home, 
  RefreshCw, 
  ArrowLeft,
  AlertCircle,
  Clock,
  Edit,
  PenTool
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  status: string;
  avatarUrl?: string;
  bio?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 💡 Fetch profile from backend using JWT token
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          // Token might be expired, try to refresh
          await handleTokenRefresh();
          return;
        }

        if (!response.ok) {
          throw new Error('Không thể tải thông tin cá nhân.');
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle Token Refresh Rotation
  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh token expired');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Retry fetching profile with new token
      const retryResponse = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.accessToken}`,
        },
      });
      const profileData = await retryResponse.json();
      setUser(profileData);
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-indigo-600">
        <RefreshCw className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-zinc-900">Có lỗi xảy ra</h2>
        <p className="mt-2 text-sm text-zinc-500">{error || 'Bạn chưa đăng nhập.'}</p>
        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          Quay lại Đăng Nhập
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 font-sans relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glowing decorations */}
      <div className="absolute top-10 left-1/4 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-4xl space-y-8 relative z-10">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Trang Chủ
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-bold text-red-655 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Card Avatar & Status */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>
              <span className={`absolute bottom-0 right-2 h-4.5 w-4.5 rounded-full border-2 border-white ${
                user.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-300'
              }`}></span>
            </div>

            <div>
              <h3 className="text-lg font-black text-zinc-900">{user.displayName}</h3>
              <p className="text-xs text-zinc-400">@{user.username}</p>
            </div>

            {/* Badge role */}
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
              {user.role === 'READER' ? 'Độc giả (Reader)' : 'Tác giả (Author)'}
            </span>

            <div className="w-full border-t border-zinc-100 pt-4 text-left text-xs space-y-2.5 text-zinc-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-zinc-400" />
                <span>Quyền: {user.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-400" />
                <span className="capitalize">Trạng thái: {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span>
              </div>
            </div>
          </div>

          {/* Col 2 & 3: Info list & Profile items */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Biography */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
              <h3 className="font-extrabold text-base text-zinc-900 flex items-center gap-2">
                Giới thiệu bản thân
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {user.bio || 'Chưa có tiểu sử giới thiệu. Cập nhật tiểu sử của bạn để mọi người hiểu thêm về bạn nhé!'}
              </p>
            </div>

            {/* Dynamic Role Blocks */}
            {user.role === 'READER' ? (
              /* READER CONTENT */
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
                <h3 className="font-extrabold text-base text-zinc-900 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-indigo-600" />
                  Tủ sách cá nhân (Bookshelf)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Mock Book 1 */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                    <div className="h-12 w-9 rounded bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center p-1 text-center shadow-xs">
                      TK
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">Thần Khống</h4>
                      <p className="text-[9px] text-indigo-600 flex items-center gap-0.5 mt-0.5">
                        <Clock className="h-2.5 w-2.5" /> Chương 45
                      </p>
                    </div>
                  </div>

                  {/* Mock Book 2 */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                    <div className="h-12 w-9 rounded bg-violet-500 text-white font-bold text-[10px] flex items-center justify-center p-1 text-center shadow-xs">
                      KD
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">Kiếm Đạo Độc Tôn</h4>
                      <p className="text-[9px] text-indigo-600 flex items-center gap-0.5 mt-0.5">
                        <Clock className="h-2.5 w-2.5" /> Chương 112
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* AUTHOR CONTENT */
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-zinc-900 flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-indigo-600" />
                    Danh sách truyện sáng tác
                  </h3>
                  <button className="flex items-center gap-1 text-xs font-bold text-indigo-650 text-indigo-600 hover:text-indigo-700">
                    <Edit className="h-3 w-3" /> Đăng truyện mới
                  </button>
                </div>
                <div className="border border-dashed border-zinc-200 rounded-xl p-8 text-center text-zinc-400">
                  <BookOpen className="h-10 w-10 mx-auto text-zinc-300 mb-2" />
                  <p className="text-sm font-semibold">Bạn chưa đăng tải bộ truyện nào.</p>
                  <p className="text-xs text-zinc-500 mt-1">Hãy bắt đầu hành trình sáng tác cùng StoryVN ngay hôm nay!</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
