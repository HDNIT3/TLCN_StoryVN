'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Shield, 
  Activity, 
  LogOut, 
  BookOpen, 
  Bookmark, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Edit,
  PenTool
} from 'lucide-react';
import { apiGetCurrentUser } from '@/lib/api/auth';

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
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      try {
        const data = await apiGetCurrentUser();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-amber-700">
        <RefreshCw className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-zinc-900">Có lỗi xảy ra</h2>
        <p className="mt-2 text-sm text-zinc-500">{error || 'Bạn chưa đăng nhập.'}</p>
        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl bg-amber-700 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-colors"
        >
          Quay lại Đăng Nhập
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 relative z-10">
      
      {/* Profile Header Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-black text-zinc-900">Hồ Sơ Cá Nhân</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
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
            <div className="h-24 w-24 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-amber-700 overflow-hidden">
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
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-800 border border-amber-100">
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
                <Bookmark className="h-5 w-5 text-amber-700" />
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
                    <p className="text-[9px] text-amber-700 flex items-center gap-0.5 mt-0.5">
                      <Clock className="h-2.5 w-2.5" /> Chương 45
                    </p>
                  </div>
                </div>

                {/* Mock Book 2 */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                  <div className="h-12 w-9 rounded bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center p-1 text-center shadow-xs">
                    KD
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-zinc-900 truncate">Kiếm Đạo Độc Tôn</h4>
                    <p className="text-[9px] text-amber-700 flex items-center gap-0.5 mt-0.5">
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
                  <PenTool className="h-5 w-5 text-amber-700" />
                  Danh sách truyện sáng tác
                </h3>
                <button className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800">
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
  );
}
