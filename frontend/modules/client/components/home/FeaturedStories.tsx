import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

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
    gradient: 'from-amber-500 to-amber-700'
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
    gradient: 'from-amber-600 to-amber-850'
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
    gradient: 'from-orange-500 to-amber-800'
  }
];

export default function FeaturedStories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <span className="h-5 w-1 rounded bg-amber-700"></span>
          Truyện Nổi Bật
        </h2>
        <Link href="#" className="text-xs font-semibold text-amber-700 hover:text-amber-800">
          Xem tất cả
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURED_STORIES.map((story) => (
          <div 
            key={story.id} 
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
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
              <h3 className="font-bold text-sm text-zinc-955 mt-1 group-hover:text-amber-700 transition-colors">{story.title}</h3>
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
  );
}
