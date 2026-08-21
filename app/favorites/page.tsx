import React from 'react';
import { getAllChants } from '@/lib/db';
import { FavoritesClient } from './FavoritesClient';

export const dynamic = 'force-dynamic';

export default function FavoritesPage() {
  const allChants = getAllChants(100);

  return <FavoritesClient allChants={allChants} />;
}
