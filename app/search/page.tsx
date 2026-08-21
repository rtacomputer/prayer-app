import React, { Suspense } from 'react';
import { getAllCategories, getAllChants } from '@/lib/db';
import { SearchClient } from './SearchClient';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const categories = getAllCategories();
  const allChants = getAllChants(100);

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#8B7D6B]">กำลังโหลดการค้นหา...</div>}>
      <SearchClient initialCategories={categories} allChants={allChants} />
    </Suspense>
  );
}
