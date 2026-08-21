export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  chantCount?: number;
}

export interface Chant {
  id: number;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  contentPali: string;
  contentReading: string;
  contentTranslation: string;
  description?: string;
  image?: string | null;
  audioUrl?: string | null;
  audioDuration?: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReaderSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: 'serif' | 'sans';
  theme: 'light' | 'dark' | 'sepia';
  activeTab: 'pali' | 'reading' | 'translation' | 'all';
  autoScrollSpeed: number; // 0 = off, 1 = slow, 2 = normal, 3 = fast
  showPronunciation: boolean;
  keepScreenOn: boolean;
}
