import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { getAllCategories } from '@/lib/db';
import { CategoryIcon } from '@/components/CategoryIcons';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="หมวดหมู่บทสวด" showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-3">
        {/* Subtle Banner Header */}
        <div className="text-center py-2">
          <h2 className="text-sm font-semibold text-[#8B7D6B] dark:text-[#A39686]">
            เลือกหมวดหมู่บทสวดมนต์ที่ต้องการ
          </h2>
        </div>

        {/* Categories List Cards */}
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] hover:border-[#B8862D]/60 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] group-hover:scale-110 transition-transform">
                  <CategoryIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1] group-hover:text-[#B8862D] dark:group-hover:text-[#E5B85C] transition-colors font-heading">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
                    {cat.chantCount ?? 0} บทสวด
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#8B7D6B] dark:text-[#A39686] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
