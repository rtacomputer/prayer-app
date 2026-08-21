'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chant, Category } from '@/lib/types';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ChantCard } from '@/components/ChantCard';
import { Search, X, Sparkles, Filter } from 'lucide-react';

interface SearchClientProps {
  initialCategories: Category[];
  allChants: Chant[];
}

export function SearchClient({ initialCategories, allChants }: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [filteredChants, setFilteredChants] = useState<Chant[]>([]);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    
    const results = allChants.filter((ch) => {
      // Category filter
      if (selectedCategory !== null && ch.categoryId !== selectedCategory) {
        return false;
      }

      // Text match
      if (!q) return true;

      return (
        ch.title.toLowerCase().includes(q) ||
        (ch.shortDescription && ch.shortDescription.toLowerCase().includes(q)) ||
        ch.contentPali.toLowerCase().includes(q) ||
        (ch.contentReading && ch.contentReading.toLowerCase().includes(q)) ||
        (ch.contentTranslation && ch.contentTranslation.toLowerCase().includes(q))
      );
    });

    setFilteredChants(results);
  }, [query, selectedCategory, allChants]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    startTransition(() => {
      if (val.trim()) {
        router.replace(`/search?q=${encodeURIComponent(val.trim())}`, { scroll: false });
      } else {
        router.replace('/search', { scroll: false });
      }
    });
  };

  const clearSearch = () => {
    setQuery('');
    router.replace('/search', { scroll: false });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="ค้นหาบทสวดมนต์" showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#8B7D6B] dark:text-[#A39686]" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="ค้นหาชื่อบทสวด, คำบาลี, คำแปล..."
            autoFocus
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#3E3428] rounded-2xl text-xs text-[#3E332A] dark:text-[#F5EBE1] placeholder-[#8B7D6B] dark:placeholder-[#7C6E5F] focus:outline-none focus:ring-2 focus:ring-[#B8862D]/40 shadow-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 rounded-full text-[#8B7D6B] hover:text-[#3E332A] dark:text-[#A39686] dark:hover:text-[#F5EBE1]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === null
                ? 'bg-[#B8862D] text-white'
                : 'bg-white dark:bg-[#1E1913] text-[#8B7D6B] dark:text-[#A39686] border border-[#EDE1CF] dark:border-[#382F24]'
            }`}
          >
            ทั้งหมด
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#B8862D] text-white'
                  : 'bg-white dark:bg-[#1E1913] text-[#8B7D6B] dark:text-[#A39686] border border-[#EDE1CF] dark:border-[#382F24]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#8B7D6B] dark:text-[#A39686]">
              ผลการค้นหา ({filteredChants.length})
            </span>
          </div>

          {filteredChants.length > 0 ? (
            filteredChants.map((chant) => (
              <ChantCard key={chant.id} chant={chant} showCategory={true} />
            ))
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FBF4E6] dark:bg-[#282015] flex items-center justify-center text-[#8B7D6B] mb-2">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1]">
                ไม่พบบทสวดที่ค้นหา
              </h4>
              <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-1">
                ลองค้นหาด้วยคำอื่นๆ เช่น &quot;เมตตา&quot;, &quot;อิติปิโส&quot;, &quot;ชินบัญชร&quot;, &quot;พาหุง&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
