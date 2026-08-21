import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { CategoryIcon } from './CategoryIcons';
import { ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  showAllLink?: boolean;
}

export function CategoryGrid({ categories, showAllLink = true }: CategoryGridProps) {
  // Show first 6 on home screen grid
  const displayCategories = showAllLink ? categories.slice(0, 6) : categories;

  return (
    <div className="w-full">
      {showAllLink && (
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-4 rounded-full bg-[#B8862D] dark:bg-[#E5B85C]" />
            <h3 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading">
              หมวดหมู่บทสวด
            </h3>
          </div>
          <Link
            href="/categories"
            className="text-xs font-medium text-[#B8862D] dark:text-[#E5B85C] hover:underline flex items-center"
          >
            ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] hover:border-[#B8862D]/50 hover:shadow-md transition-all text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CategoryIcon name={cat.icon} className="w-5 h-5 text-[#B8862D] dark:text-[#E5B85C]" />
            </div>
            <span className="text-xs font-semibold text-[#3E332A] dark:text-[#F5EBE1] line-clamp-1">
              {cat.name}
            </span>
            <span className="text-[10px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
              {cat.chantCount ?? 0} บทสวด
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
