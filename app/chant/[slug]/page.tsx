import React from 'react';
import { notFound } from 'next/navigation';
import { getAllChants, getChantBySlug } from '@/lib/db';
import { ChantReaderClient } from './ChantReaderClient';
import type { Metadata } from 'next';

interface ChantPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const chants = getAllChants(200);
  return chants.map((ch) => ({
    slug: ch.slug,
  }));
}

export async function generateMetadata({ params }: ChantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getChantBySlug(slug);
  if (!result) {
    return { title: 'ไม่พบบทสวด' };
  }
  return {
    title: `${result.chant.title} - บทสวดมนต์ดิจิทัล`,
    description: result.chant.shortDescription || `บทสวดมนต์ ${result.chant.title} พร้อมคำอ่านและคำแปล`,
  };
}

export default async function ChantPage({ params }: ChantPageProps) {
  const { slug } = await params;
  const result = getChantBySlug(slug);

  if (!result) {
    notFound();
  }

  return (
    <ChantReaderClient
      chant={result.chant}
      prevChant={result.prevChant}
      nextChant={result.nextChant}
    />
  );
}
