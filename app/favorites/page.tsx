import React from 'react';
import { getAllChants } from '@/lib/db';
import { FavoritesClient } from './FavoritesClient';


export default function FavoritesPage() {
  const allChants = getAllChants(100);

  return <FavoritesClient allChants={allChants} />;
}
