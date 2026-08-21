import React from 'react';
import { Sparkles, Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-zinc-200/60 bg-gradient-to-b from-white to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-850 text-amber-800 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Nền tảng đọc truyện trực tuyến StoryVN
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl max-w-3xl mx-auto leading-none">
          Thế Giới Truyện Chữ <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-850">
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
              className="w-full rounded-full border border-zinc-250 bg-white py-3.5 pl-12 pr-6 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 shadow-lg shadow-zinc-100"
            />
            <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
