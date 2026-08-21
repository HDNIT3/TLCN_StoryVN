import React from 'react';
import Link from 'next/link';

const NEW_UPDATES = [
  { id: 4, title: 'Vạn Cổ Đệ Nhất Thần', chapter: 'Chương 1243', time: '5 phút trước', genre: 'Huyền Huyễn', author: 'Phong Thanh Dương' },
  { id: 5, title: 'Ta Có Thể Sửa Đổi Vận Mệnh', chapter: 'Chương 320', time: '15 phút trước', genre: 'Đô Thị', author: 'Thập Nhị翼' },
  { id: 6, title: 'Đỉnh Phong Hỏa Thuật', chapter: 'Chương 54', time: '30 phút trước', genre: 'Khoa Huyễn', author: 'Hỏa Quân' },
  { id: 7, title: 'Đông Phương Bất Bại Tại Đô Thị', chapter: 'Chương 112', time: '1 giờ trước', genre: 'Đô Thị', author: 'Thiên Hỏa' },
  { id: 8, title: 'Tu Tiên Từ Làm Ruộng Bắt Đầu', chapter: 'Chương 89', time: '2 giờ trước', genre: 'Điền Văn', author: 'Sơn Trà' }
];

export default function RecentUpdates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <span className="h-5 w-1 rounded bg-amber-700"></span>
          Mới Cập Nhật
        </h2>
        <Link href="#" className="text-xs font-semibold text-amber-700 hover:text-amber-800">
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
                <h4 className="font-bold text-sm text-zinc-900 hover:text-amber-700 transition-colors cursor-pointer">{item.title}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Tác giả: {item.author}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 text-xs mt-2 sm:mt-0">
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{item.chapter}</span>
              <span className="text-zinc-400 font-medium">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
