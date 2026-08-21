import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ChantCard } from '@/components/ChantCard';
import { CategoryIcon } from '@/components/CategoryIcons';
import { getAllCategories, getCategoryBySlug, getChantsByCategory } from '@/lib/db';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const chants = getChantsByCategory(category.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={category.name} showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Category Header Card */}
        <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-gradient-to-r from-[#FBF4E6] to-[#FFF5E4] dark:from-[#201A12] dark:to-[#17130E] border border-[#EDE1CF] dark:border-[#382F24]">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] shadow-xs shrink-0">
            <CategoryIcon name={category.icon} className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading">
              {category.name}
            </h2>
            <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-0.5 leading-relaxed">
              {category.description || `รวมบทสวดมนต์ในหมวด${category.name}`}
            </p>
          </div>
        </div>

        {/* Chants List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#8B7D6B] dark:text-[#A39686]">
              รายการบทสวดทั้งหมด ({chants.length})
            </span>
          </div>

          {chants.length > 0 ? (
            chants.map((chant) => (
              <ChantCard key={chant.id} chant={chant} showCategory={false} />
            ))
          ) : (
            <div className="text-center py-12 text-xs text-[#8B7D6B] dark:text-[#A39686]">
              ยังไม่มีบทสวดในหมวดหมู่นี้
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
