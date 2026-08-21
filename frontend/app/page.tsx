'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  TrendingUp, 
  Star, 
  ChevronDown, 
  Bookmark, 
  PenTool, 
  Sparkles, 
  Bell,
  History,
  Eye
} from 'lucide-react';

// Mock list of stories/novels
const FEATURED_STORIES = [
  {
    id: 1,
    title: 'Thần Khống Thiên Quân',
    author: 'Tiêu Diêu Phong',
    genre: 'Tiên Hiệp',
    rating: 4.8,
    views: '124K',
    chapters: 420,
    status: 'Đang ra',
    description: 'Một thiếu niên bình thường nhặt được linh châu thiên giới, từ đó bước lên con đường tu chân nghịch thiên hành đạo...',
    gradient: 'from-amber-500 to-red-600'
  },
  {
    id: 2,
    title: 'Đại Đường Chi Đệ Nhất Kiêu Hùng',
    author: 'Vương Triều Đại',
    genre: 'Lịch Sử',
    rating: 4.6,
    views: '89K',
    chapters: 285,
    status: 'Hoàn thành',
    description: 'Xuyên không về thời Đường thịnh thế, mang theo kiến thức hiện đại làm đảo lộn giang sơn...',
    gradient: 'from-sky-500 to-indigo-700'
  },
  {
    id: 3,
    title: 'Kiếm Đạo Độc Tôn',
    author: 'Thanh Phong',
    genre: 'Kiếm Hiệp',
    rating: 4.9,
    views: '210K',
    chapters: 615,
    status: 'Đang ra',
    description: 'Trong thế giới kiếm giả vi tôn, kiếm ý ngập trời, một kiếm phá vạn pháp...',
    gradient: 'from-violet-500 to-fuchsia-700'
  }
];

const NEW_UPDATES = [
  { id: 4, title: 'Vạn Cổ Đệ Nhất Thần', chapter: 'Chương 1243', time: '5 phút trước', genre: 'Huyền Huyễn', author: 'Phong Thanh Dương' },
  { id: 5, title: 'Ta Có Thể Sửa Đổi Vận Mệnh', chapter: 'Chương 320', time: '15 phút trước', genre: 'Đô Thị', author: 'Thập Nhị翼' },
  { id: 6, title: 'Đỉnh Phong Hỏa Thuật', chapter: 'Chương 54', time: '30 phút trước', genre: 'Khoa Huyễn', author: 'Hỏa Quân' },
  { id: 7, title: 'Đông Phương Bất Bại Tại Đô Thị', chapter: 'Chương 112', time: '1 giờ trước', genre: 'Đô Thị', author: 'Thiên Hỏa' },
  { id: 8, title: 'Tu Tiên Từ Làm Ruộng Bắt Đầu', chapter: 'Chương 89', time: '2 giờ trước', genre: 'Điền Văn', author: 'Sơn Trà' }
];

const TOP_RANKINGS = [
  { rank: 1, title: 'Kiếm Đạo Độc Tôn', rating: 4.9, views: '210K' },
  { rank: 2, title: 'Thần Khống Thiên Quân', rating: 4.8, views: '124K' },
  { rank: 3, title: 'Đại Đường Chi Đệ Nhất Kiêu Hùng', rating: 4.6, views: '89K' },
  { rank: 4, title: 'Vạn Cổ Đệ Nhất Thần', rating: 4.7, views: '75K' },
  { rank: 5, title: 'Tu Tiên Từ Làm Ruộng Bắt Đầu', rating: 4.5, views: '52K' }
];

export default function HomePage() {
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

  // Load auth state from localStorage on component mount
  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUserStr && token) {
      setUser(JSON.parse(storedUserStr));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileDropdown(false);
    router.push('/');
  };


  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-lg tracking-wider text-white shadow-sm shadow-indigo-600/10">
                S
              </div>
              <span className="text-xl font-black text-zinc-900 tracking-tight">
                Story<span className="text-indigo-600">VN</span>
              </span>
            </Link>

            {/* Menu Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-500">
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 transition-colors">Trang Chủ</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Thể Loại</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Bảng Xếp Hạng</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
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
                  className="w-full rounded-full border border-zinc-250 bg-zinc-100/80 py-1.5 pl-9 pr-4 text-xs text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600/20"
                />
                <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-400" />
              </div>

              {isLoggedIn && user ? (
                /* LOGGED IN VIEWS */
                <div className="flex items-center gap-3">
                  {/* Notifications */}
                  <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600"></span>
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
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {user.role === 'READER' ? 'Độc giả' : user.role === 'AUTHOR' ? 'Tác giả' : 'Admin'}
                          </span>
                        </div>

                        {/* List */}
                        <div className="mt-1 space-y-0.5">
                          <Link 
                            href={user.role === 'ADMIN' ? '/admin' : '/profile'} 
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 transition-colors"
                          >
                            <User className="h-4 w-4 text-zinc-400" />
                            {user.role === 'ADMIN' ? 'Bảng quản trị' : 'Hồ sơ cá nhân'}
                          </Link>
                          {user.role !== 'ADMIN' && (
                            <>
                              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 transition-colors">
                                <Bookmark className="h-4 w-4 text-zinc-400" />
                                Tủ sách của tôi
                              </Link>
                              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 transition-colors">
                                <History className="h-4 w-4 text-zinc-400" />
                                Lịch sử đọc
                              </Link>
                            </>
                          )}
                          {user.role === 'AUTHOR' && (
                            <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                              <PenTool className="h-4 w-4 text-indigo-500" />
                              Sáng tác Studio
                            </Link>
                          )}
                          <Link href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 transition-colors">
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
                    className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition-all duration-300 active:scale-[0.97]"
                  >
                    Đăng Ký
                  </Link>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-zinc-200/60 bg-gradient-to-b from-white to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Nền tảng đọc truyện trực tuyến StoryVN
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl max-w-3xl mx-auto leading-none">
            Thế Giới Truyện Chữ <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
              Đỉnh Cao
            </span>
          </h1>
          <p className="mt-6 text-base text-zinc-500 max-w-lg mx-auto leading-relaxed">
            Hàng ngàn tiểu thuyết dịch, truyện convert, tiên hiệp, huyền huyễn chất lượng cao được cập nhật mỗi ngày.
          </p>

          {/* Mobile Search */}
          <div className="mt-8 mx-auto max-w-md px-4 sm:px-0">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm tên truyện hoặc tác giả..."
                className="w-full rounded-full border border-zinc-250 bg-white py-3.5 pl-12 pr-6 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 shadow-lg shadow-zinc-100"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT/CENTER 3 COLS: FEATURED & UPDATES */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* FEATURED SECTION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                  <span className="h-5 w-1 rounded bg-indigo-600"></span>
                  Truyện Nổi Bật
                </h2>
                <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                  Xem tất cả
                </Link>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURED_STORIES.map((story) => (
                  <div 
                    key={story.id} 
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
                  >
                    <div>
                      {/* Cover Placeholder */}
                      <div className={`aspect-[14/9] w-full rounded-xl bg-gradient-to-br ${story.gradient} flex items-center justify-center p-4 text-center shadow-md group-hover:scale-[1.02] transition-transform duration-300`}>
                        <span className="font-extrabold text-base tracking-tight text-white drop-shadow-md">{story.title}</span>
                      </div>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-4">
                        <span className="font-medium text-zinc-400">{story.genre}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span className="font-bold">{story.rating}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="font-bold text-sm text-zinc-950 mt-1 group-hover:text-indigo-600 transition-colors">{story.title}</h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Tác giả: {story.author}</p>
                      <p className="text-xs text-zinc-500 mt-3 line-clamp-2 leading-relaxed">{story.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 mt-6 pt-4 border-t border-zinc-100">
                      <span>{story.chapters} chương</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">{story.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT UPDATES SECTION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                  <span className="h-5 w-1 rounded bg-indigo-600"></span>
                  Mới Cập Nhật
                </h2>
                <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                  Xem lịch sử
                </Link>
              </div>

              {/* Table list */}
              <div className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
                {NEW_UPDATES.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold text-zinc-500 px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200 mt-0.5">
                        {item.genre}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 hover:text-indigo-600 transition-colors cursor-pointer">{item.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Tác giả: {item.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 text-xs mt-2 sm:mt-0">
                      <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{item.chapter}</span>
                      <span className="text-zinc-400 font-medium">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 1 COL: RANKING CHART */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Bảng Xếp Hạng
            </h2>

            {/* List */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-4 shadow-xs">
              {TOP_RANKINGS.map((novel) => (
                <div key={novel.rank} className="flex items-center justify-between gap-3 p-2 hover:bg-zinc-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 truncate">
                    {/* Rank Badge */}
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-extrabold ${
                      novel.rank === 1 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                      novel.rank === 2 ? 'bg-zinc-400/20 text-zinc-600 border border-zinc-300' :
                      novel.rank === 3 ? 'bg-amber-800/10 text-amber-700 border border-amber-850/20' :
                      'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}>
                      {novel.rank}
                    </span>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-zinc-900 truncate hover:text-indigo-400 transition-colors cursor-pointer">{novel.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5 font-medium">
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star className="h-2.5 w-2.5 fill-amber-500" />
                          {novel.rating}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="h-2.5 w-2.5" />
                          {novel.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats banner */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-zinc-50 p-5 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm text-indigo-700 flex items-center gap-1.5">
                <Bookmark className="h-4 w-4" />
                Đang đọc gần đây
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {isLoggedIn 
                  ? 'Bạn có 3 truyện chưa đọc xong trong tủ sách của mình.' 
                  : 'Hãy đăng nhập để đồng bộ lịch sử đọc truyện trên mọi thiết bị.'
                }
              </p>
              {!isLoggedIn && (
                <Link 
                  href="/login" 
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2 text-center text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Đăng Nhập
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-zinc-200 bg-zinc-100/50 py-12 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="font-bold text-zinc-700">StoryVN - Bản quyền thuộc về những người yêu chữ</p>
          <p className="max-w-md mx-auto leading-relaxed text-zinc-400">
            StoryVN là nền tảng đọc và sáng tác tiểu thuyết chữ trực tuyến. Toàn bộ nội dung được biên tập và đăng tải bởi người dùng.
          </p>
          <hr className="border-zinc-200 max-w-xs mx-auto" />
          <p>© 2026 StoryVN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
