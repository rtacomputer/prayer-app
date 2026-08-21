import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Banner } from '@/components/Banner';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ChantCard } from '@/components/ChantCard';
import { BottomNav } from '@/components/BottomNav';
import { getAllCategories, getFeaturedChants, getAllChants } from '@/lib/db';
import { ChevronRight, Sparkles, Flame, Clock } from 'lucide-react';


export default function HomePage() {
  const categories = getAllCategories();
  const featuredChants = getFeaturedChants();
  const allChants = getAllChants(10);

  // If no featured chants, fall back to first few chants
  const displayChants = featuredChants.length > 0 ? featuredChants : allChants.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 px-4 py-3 space-y-5">
        {/* Hero Banner with Buddha Artwork */}
        <Banner />

        {/* Categories Section */}
        <CategoryGrid categories={categories} showAllLink={true} />

        {/* Popular / Featured Chants Section */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-4 rounded-full bg-[#B8862D] dark:bg-[#E5B85C]" />
              <h3 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading flex items-center gap-1.5">
                บทสวดยอดนิยม
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h3>
            </div>
            <Link
              href="/category/daily-prayers"
              className="text-xs font-medium text-[#B8862D] dark:text-[#E5B85C] hover:underline flex items-center"
            >
              ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {displayChants.map((chant) => (
              <ChantCard key={chant.id} chant={chant} showCategory={true} />
            ))}
          </div>
        </div>

        {/* Daily Dhamma Quote Card */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-[#FBF4E6] to-[#FFF5E4] dark:from-[#201A12] dark:to-[#17130E] border border-[#EDE1CF] dark:border-[#382F24] text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-[#B8862D] dark:text-[#E5B85C] text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>พุทธภาษิตเตือนใจ</span>
          </div>
          <p className="text-xs text-[#3E332A] dark:text-[#E5D7C7] italic leading-relaxed">
            “จิตที่ฝึกฝนดีแล้ว ย่อมนำสุขมาให้”
          </p>
          <span className="text-[10px] text-[#8B7D6B] dark:text-[#A39686] mt-1 block">
            — ขุททกนิกาย คาถาธรรมบท
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
