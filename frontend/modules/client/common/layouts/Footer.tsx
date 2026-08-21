import React from 'react';

export default function Footer() {
  return (
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
  );
}
