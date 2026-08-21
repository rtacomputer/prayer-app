'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Chant } from '@/lib/types';
import { Star, Volume2, ChevronRight, BookOpen } from 'lucide-react';

interface ChantCardProps {
  chant: Chant;
  showCategory?: boolean;
  onFavoriteToggle?: (isFav: boolean) => void;
}

export function ChantCard({ chant, showCategory = true, onFavoriteToggle }: ChantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
      setIsFavorite(favs.includes(chant.id));
    } catch {
      setIsFavorite(false);
    }
  }, [chant.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const favs = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
      let updated: number[] = [];
      if (favs.includes(chant.id)) {
        updated = favs.filter((id: number) => id !== chant.id);
        setIsFavorite(false);
        onFavoriteToggle?.(false);
      } else {
        updated = [...favs, chant.id];
        setIsFavorite(true);
        onFavoriteToggle?.(true);
      }
      localStorage.setItem('prayer_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      href={`/chant/${chant.slug}`}
      className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] hover:border-[#B8862D]/50 hover:shadow-md transition-all"
    >
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        {/* Lotus Thumbnail / Icon */}
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] group-hover:scale-105 transition-transform">
          <BookOpen className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm font-semibold text-[#3E332A] dark:text-[#F5EBE1] truncate group-hover:text-[#B8862D] dark:group-hover:text-[#E5B85C] transition-colors">
              {chant.title}
            </h4>
            {Boolean(chant.isFeatured) && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#B8862D]/15 text-[#B8862D] dark:text-[#E5B85C] font-medium">
                ยอดนิยม
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
            {showCategory && chant.categoryName && (
              <span className="text-[11px] font-medium text-[#B8862D] dark:text-[#E5B85C]/80">
                {chant.categoryName}
              </span>
            )}
            {chant.shortDescription && (
              <span className="text-[11px] truncate max-w-[200px]">
                {chant.shortDescription}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`p-2 rounded-full transition-colors ${
            isFavorite
              ? 'text-[#D7A844] dark:text-[#E5B85C] hover:bg-[#FBF4E6] dark:hover:bg-[#282015]'
              : 'text-[#8B7D6B]/50 dark:text-[#A39686]/40 hover:text-[#D7A844] hover:bg-[#FBF4E6] dark:hover:bg-[#282015]'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <ChevronRight className="w-4 h-4 text-[#8B7D6B] dark:text-[#A39686] group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
