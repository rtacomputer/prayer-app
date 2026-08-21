'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function Banner() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFF5E4] via-[#FDF0D5] to-[#FBF4E6] dark:from-[#261E14] dark:via-[#201A12] dark:to-[#17130E] border border-[#EDE1CF] dark:border-[#382F24] p-5 shadow-sm">
      {/* Decorative Golden Ornaments */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-radial from-[#D4AF37]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-radial from-[#B8862D]/15 to-transparent rounded-full blur-xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center pt-2 pb-3">
        {/* Stylized Golden Buddha / Lotus Silhouette */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B8862D] to-[#E5B85C] flex items-center justify-center p-0.5 shadow-md mb-3 pulse-glow">
          <div className="w-full h-full rounded-full bg-[#FFF9EF] dark:bg-[#1C1711] flex items-center justify-center">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[#B8862D] dark:text-[#E5B85C]">
              {/* Meditating Buddha Silhouette */}
              <circle cx="32" cy="18" r="7" fill="currentColor" />
              <path d="M26 12C26 8 38 8 38 12Z" fill="currentColor" />
              <path d="M20 38C20 28 44 28 44 38C44 48 38 52 32 52C26 52 20 48 20 38Z" fill="currentColor" opacity="0.9" />
              <path d="M12 50C16 46 22 47 32 47C42 47 48 46 52 50C50 56 14 56 12 50Z" fill="currentColor" />
              {/* Halo Aura */}
              <circle cx="32" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#3E332A] dark:text-[#F5EBE1] tracking-tight font-heading">
          บทสวดมนต์ เสริมสิริมงคล
        </h2>
        <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-1 max-w-[260px]">
          สวดมนต์วันละนิด จิตใจผ่องใส เสริมบารมีและสร้างความสงบสุขในชีวิต
        </p>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearch} className="w-full mt-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#8B7D6B] dark:text-[#A39686]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาบทสวดมนต์, คำบาลี, คำแปล..."
              className="w-full pl-10 pr-24 py-2.5 bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#3E3428] rounded-full text-xs text-[#3E332A] dark:text-[#F5EBE1] placeholder-[#8B7D6B] dark:placeholder-[#7C6E5F] focus:outline-none focus:ring-2 focus:ring-[#B8862D]/40 shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-[#B8862D] hover:bg-[#9E7122] dark:bg-[#E5B85C] dark:hover:bg-[#D4A746] text-white dark:text-[#1E1913] text-xs font-semibold rounded-full shadow-xs transition-colors"
            >
              ค้นหา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
