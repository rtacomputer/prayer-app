import React from 'react';
import { getAllCategories, getAllChants, getStats } from '@/lib/db';
import { AdminClient } from './AdminClient';


export default function AdminPage() {
  const categories = getAllCategories();
  const chants = getAllChants(200);
  const stats = getStats();

  return (
    <AdminClient
      initialCategories={categories}
      initialChants={chants}
      stats={stats}
    />
  );
}
