import React from 'react';
import { TrendingUp, Star, Eye } from 'lucide-react';

const TOP_RANKINGS = [
  { rank: 1, title: 'Kiếm Đạo Độc Tôn', rating: 4.9, views: '210K' },
  { rank: 2, title: 'Thần Khống Thiên Quân', rating: 4.8, views: '124K' },
  { rank: 3, title: 'Đại Đường Chi Đệ Nhất Kiêu Hùng', rating: 4.6, views: '89K' },
  { rank: 4, title: 'Vạn Cổ Đệ Nhất Thần', rating: 4.7, views: '75K' },
  { rank: 5, title: 'Tu Tiên Từ Làm Ruộng Bắt Đầu', rating: 4.5, views: '52K' }
];

export default function RankingChart() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-amber-750 text-amber-700" />
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
                <h4 className="font-bold text-xs text-zinc-900 truncate hover:text-amber-700 transition-colors cursor-pointer">{novel.title}</h4>
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
    </div>
  );
}
