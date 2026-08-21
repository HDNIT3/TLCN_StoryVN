'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown, 
  Bookmark, 
  PenTool, 
  Sparkles, 
  Bell,
  History
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
    email: string;
    role: string;
    avatarUrl?: string;
  } | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUserStr = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (storedUserStr && token) {
        setUser(JSON.parse(storedUserStr));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileDropdown(false);
    router.push('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-700 font-bold text-lg tracking-wider text-white shadow-sm shadow-amber-700/10">
              S
            </div>
            <span className="text-xl font-black text-zinc-900 tracking-tight">
              Story<span className="text-amber-700">VN</span>
            </span>
          </Link>

          {/* Menu Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-500">
            <Link href="/" className="text-amber-700 hover:text-amber-800 transition-colors">Trang Chủ</Link>
            <Link href="#" className="hover:text-amber-700 transition-colors">Thể Loại</Link>
            <Link href="#" className="hover:text-amber-700 transition-colors">Bảng Xếp Hạng</Link>
            <Link href="#" className="hover:text-amber-700 transition-colors flex items-center gap-1 text-amber-700 hover:text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Đọc Nhiều
            </Link>
          </nav>

          {/* Right Header Side */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <input 
                type="text" 
                placeholder="Tìm truyện, tác giả..."
                className="w-full rounded-full border border-zinc-250 bg-zinc-100/80 py-1.5 pl-9 pr-4 text-xs text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600/20"
              />
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-400" />
            </div>

            {isLoggedIn && user ? (
              /* LOGGED IN VIEWS */
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-955 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-700"></span>
                </button>

                {/* Profile Dropdown Container */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 rounded-full p-0.5 border border-zinc-200 hover:border-zinc-350 transition-colors focus:outline-none"
                  >
                    <img 
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
                      alt="Avatar" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <ChevronDown className="h-4 w-4 pr-1 text-zinc-500" />
                  </button>

                  {/* Dropdown Options */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-zinc-200 bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                      
                      {/* Profile Summary */}
                      <div className="px-3 py-2 border-b border-zinc-100 text-left">
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.displayName}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-100">
                          {user.role === 'READER' ? 'Độc giả' : user.role === 'AUTHOR' ? 'Tác giả' : 'Admin'}
                        </span>
                      </div>

                      {/* List */}
                      <div className="mt-1 space-y-0.5">
                        <Link 
                          href={user.role === 'ADMIN' ? '/admin' : '/profile'} 
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-amber-700 transition-colors"
                        >
                          <User className="h-4 w-4 text-zinc-400" />
                          {user.role === 'ADMIN' ? 'Bảng quản trị' : 'Hồ sơ cá nhân'}
                        </Link>
                        {user.role !== 'ADMIN' && (
                          <>
                            <Link 
                              href="/profile" 
                              onClick={() => setShowProfileDropdown(false)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-amber-700 transition-colors"
                            >
                              <Bookmark className="h-4 w-4 text-zinc-400" />
                              Tủ sách của tôi
                            </Link>
                            <Link 
                              href="/profile" 
                              onClick={() => setShowProfileDropdown(false)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-amber-700 transition-colors"
                            >
                              <History className="h-4 w-4 text-zinc-400" />
                              Lịch sử đọc
                            </Link>
                          </>
                        )}
                        {user.role === 'AUTHOR' && (
                          <Link 
                            href="/profile" 
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 hover:text-amber-850 transition-colors"
                          >
                            <PenTool className="h-4 w-4 text-amber-600" />
                            Sáng tác Studio
                          </Link>
                        )}
                        <Link 
                          href="#" 
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-amber-750 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-zinc-400" />
                          Cài đặt tài khoản
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* GUEST VIEWS */
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="rounded-full px-4 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
                >
                  Đăng Nhập
                </Link>
                <Link 
                  href="/register" 
                  className="rounded-full bg-amber-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-700/10 hover:bg-amber-650 hover:shadow-amber-600/20 transition-all duration-300 active:scale-[0.97]"
                >
                  Đăng Ký
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
