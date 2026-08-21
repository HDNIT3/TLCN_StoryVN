'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export default function QuickStats() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-zinc-50 p-5 space-y-3 shadow-xs">
      <h3 className="font-bold text-sm text-amber-700 flex items-center gap-1.5">
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
  );
}
