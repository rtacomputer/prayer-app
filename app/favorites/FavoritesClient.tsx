'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chant } from '@/lib/types';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ChantCard } from '@/components/ChantCard';
import { Heart, Sparkles, Compass } from 'lucide-react';

interface FavoritesClientProps {
  allChants: Chant[];
}

export function FavoritesClient({ allChants }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState<Chant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
      if (Array.isArray(savedIds)) {
        const favChants = allChants.filter((ch) => savedIds.includes(ch.id));
        setFavorites(favChants);
      }
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favorites-updated', loadFavorites);
    window.addEventListener('storage', loadFavorites);

    return () => {
      window.removeEventListener('favorites-updated', loadFavorites);
      window.removeEventListener('storage', loadFavorites);
    };
  }, [allChants]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="รายการโปรด" showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Header Intro Card */}
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-1 text-[#B8862D] dark:text-[#E5B85C] text-xs font-semibold mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>บทสวดมนต์ที่คุณบันทึกไว้</span>
          </div>
          <p className="text-xs text-[#8B7D6B] dark:text-[#A39686]">
            เข้าถึงบทสวดที่สวดเป็นประจำได้อย่างสะดวกรวดเร็ว
          </p>
        </div>

        {/* Favorites List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="text-center py-12 text-xs text-[#8B7D6B] dark:text-[#A39686]">
              กำลังโหลดรายการโปรด...
            </div>
          ) : favorites.length > 0 ? (
            favorites.map((chant) => (
              <ChantCard
                key={chant.id}
                chant={chant}
                showCategory={true}
                onFavoriteToggle={() => loadFavorites()}
              />
            ))
          ) : (
            <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-6 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading">
                ยังไม่มีบทสวดในรายการโปรด
              </h4>
              <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-1.5 max-w-[220px] mx-auto leading-relaxed">
                กดรูปดาว ⭐ ที่บทสวดมนต์ที่คุณต้องการ เพื่อบันทึกไว้สวดเป็นประจำ
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 mt-4 py-2.5 px-5 rounded-full bg-[#B8862D] hover:bg-[#9E7122] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                เลือกดูบทสวดมนต์
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
