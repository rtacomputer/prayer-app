import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { INITIAL_CATEGORIES, INITIAL_CHANTS } from './data-seed';
import { Category, Chant } from './types';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'prayer.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'lotus',
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    content_pali TEXT NOT NULL,
    content_reading TEXT,
    content_translation TEXT,
    description TEXT,
    image TEXT,
    audio_url TEXT,
    audio_duration TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_chants_category ON chants(category_id);
  CREATE INDEX IF NOT EXISTS idx_chants_slug ON chants(slug);
  CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
`);

// Auto-seed if empty
const countCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (countCategories.count === 0) {
  const insertCat = db.prepare(`
    INSERT INTO categories (id, name, slug, description, icon, sort_order, is_active)
    VALUES (@id, @name, @slug, @description, @icon, @sortOrder, 1)
  `);

  const insertChant = db.prepare(`
    INSERT INTO chants (
      id, category_id, title, slug, short_description,
      content_pali, content_reading, content_translation,
      audio_duration, sort_order, is_featured, is_active
    ) VALUES (
      @id, @categoryId, @title, @slug, @shortDescription,
      @contentPali, @contentReading, @contentTranslation,
      @audioDuration, @sortOrder, @isFeatured, 1
    )
  `);

  const seedTransaction = db.transaction(() => {
    for (const cat of INITIAL_CATEGORIES) {
      insertCat.run({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      });
    }

    for (const ch of INITIAL_CHANTS) {
      insertChant.run({
        id: ch.id,
        categoryId: ch.categoryId,
        title: ch.title,
        slug: ch.slug,
        shortDescription: ch.shortDescription,
        contentPali: ch.contentPali,
        contentReading: ch.contentReading,
        contentTranslation: ch.contentTranslation,
        audioDuration: ch.audioDuration,
        sortOrder: ch.sortOrder,
        isFeatured: ch.isFeatured ? 1 : 0,
      });
    }
  });

  seedTransaction();
}

export function getAllCategories(): Category[] {
  const rows = db.prepare(`
    SELECT c.*, COUNT(ch.id) as chant_count 
    FROM categories c
    LEFT JOIN chants ch ON c.id = ch.category_id AND ch.is_active = 1
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.id ASC
  `).all() as Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    image: string | null;
    sort_order: number;
    is_active: number;
    chant_count: number;
  }>;

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    icon: r.icon,
    image: r.image,
    sortOrder: r.sort_order,
    isActive: Boolean(r.is_active),
    chantCount: r.chant_count,
  }));
}

export function getCategoryBySlug(slug: string): Category | null {
  const r = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    image: string | null;
    sort_order: number;
    is_active: number;
  } | undefined;

  if (!r) return null;

  const countRow = db.prepare('SELECT COUNT(*) as count FROM chants WHERE category_id = ? AND is_active = 1').get(r.id) as { count: number };

  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    icon: r.icon,
    image: r.image,
    sortOrder: r.sort_order,
    isActive: Boolean(r.is_active),
    chantCount: countRow.count,
  };
}

export function getAllChants(limit = 100): Chant[] {
  const rows = db.prepare(`
    SELECT ch.*, c.name as category_name, c.slug as category_slug
    FROM chants ch
    JOIN categories c ON ch.category_id = c.id
    WHERE ch.is_active = 1
    ORDER BY ch.sort_order ASC, ch.id ASC
    LIMIT ?
  `).all(limit) as Array<{
    id: number;
    category_id: number;
    category_name: string;
    category_slug: string;
    title: string;
    slug: string;
    short_description: string;
    content_pali: string;
    content_reading: string;
    content_translation: string;
    description: string;
    image: string | null;
    audio_url: string | null;
    audio_duration: string;
    sort_order: number;
    is_featured: number;
    is_active: number;
  }>;

  return rows.map(r => ({
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    contentPali: r.content_pali,
    contentReading: r.content_reading,
    contentTranslation: r.content_translation,
    description: r.description,
    image: r.image,
    audioUrl: r.audio_url,
    audioDuration: r.audio_duration,
    sortOrder: r.sort_order,
    isFeatured: Boolean(r.is_featured),
    isActive: Boolean(r.is_active),
  }));
}

export function getFeaturedChants(): Chant[] {
  const rows = db.prepare(`
    SELECT ch.*, c.name as category_name, c.slug as category_slug
    FROM chants ch
    JOIN categories c ON ch.category_id = c.id
    WHERE ch.is_active = 1 AND ch.is_featured = 1
    ORDER BY ch.sort_order ASC, ch.id ASC
  `).all() as Array<{
    id: number;
    category_id: number;
    category_name: string;
    category_slug: string;
    title: string;
    slug: string;
    short_description: string;
    content_pali: string;
    content_reading: string;
    content_translation: string;
    description: string;
    image: string | null;
    audio_url: string | null;
    audio_duration: string;
    sort_order: number;
    is_featured: number;
    is_active: number;
  }>;

  return rows.map(r => ({
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    contentPali: r.content_pali,
    contentReading: r.content_reading,
    contentTranslation: r.content_translation,
    description: r.description,
    image: r.image,
    audioUrl: r.audio_url,
    audioDuration: r.audio_duration,
    sortOrder: r.sort_order,
    isFeatured: Boolean(r.is_featured),
    isActive: Boolean(r.is_active),
  }));
}

export function getChantsByCategory(categoryId: number): Chant[] {
  const rows = db.prepare(`
    SELECT ch.*, c.name as category_name, c.slug as category_slug
    FROM chants ch
    JOIN categories c ON ch.category_id = c.id
    WHERE ch.category_id = ? AND ch.is_active = 1
    ORDER BY ch.sort_order ASC, ch.id ASC
  `).all(categoryId) as Array<{
    id: number;
    category_id: number;
    category_name: string;
    category_slug: string;
    title: string;
    slug: string;
    short_description: string;
    content_pali: string;
    content_reading: string;
    content_translation: string;
    description: string;
    image: string | null;
    audio_url: string | null;
    audio_duration: string;
    sort_order: number;
    is_featured: number;
    is_active: number;
  }>;

  return rows.map(r => ({
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    contentPali: r.content_pali,
    contentReading: r.content_reading,
    contentTranslation: r.content_translation,
    description: r.description,
    image: r.image,
    audioUrl: r.audio_url,
    audioDuration: r.audio_duration,
    sortOrder: r.sort_order,
    isFeatured: Boolean(r.is_featured),
    isActive: Boolean(r.is_active),
  }));
}

export function getChantBySlug(slug: string): { chant: Chant; prevChant?: Chant; nextChant?: Chant } | null {
  const r = db.prepare(`
    SELECT ch.*, c.name as category_name, c.slug as category_slug
    FROM chants ch
    JOIN categories c ON ch.category_id = c.id
    WHERE ch.slug = ? AND ch.is_active = 1
  `).get(slug) as {
    id: number;
    category_id: number;
    category_name: string;
    category_slug: string;
    title: string;
    slug: string;
    short_description: string;
    content_pali: string;
    content_reading: string;
    content_translation: string;
    description: string;
    image: string | null;
    audio_url: string | null;
    audio_duration: string;
    sort_order: number;
    is_featured: number;
    is_active: number;
  } | undefined;

  if (!r) return null;

  const chant: Chant = {
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    contentPali: r.content_pali,
    contentReading: r.content_reading,
    contentTranslation: r.content_translation,
    description: r.description,
    image: r.image,
    audioUrl: r.audio_url,
    audioDuration: r.audio_duration,
    sortOrder: r.sort_order,
    isFeatured: Boolean(r.is_featured),
    isActive: Boolean(r.is_active),
  };

  // Get sibling chants in the same category for Prev/Next
  const siblings = getChantsByCategory(r.category_id);
  const currentIndex = siblings.findIndex(s => s.id === r.id);
  const prevChant = currentIndex > 0 ? siblings[currentIndex - 1] : undefined;
  const nextChant = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined;

  return { chant, prevChant, nextChant };
}

export function searchChants(query: string): Chant[] {
  if (!query || query.trim() === '') return [];
  const q = `%${query.trim()}%`;

  const rows = db.prepare(`
    SELECT ch.*, c.name as category_name, c.slug as category_slug
    FROM chants ch
    JOIN categories c ON ch.category_id = c.id
    WHERE ch.is_active = 1 AND (
      ch.title LIKE ? OR
      ch.short_description LIKE ? OR
      ch.content_pali LIKE ? OR
      ch.content_reading LIKE ? OR
      ch.content_translation LIKE ?
    )
    ORDER BY 
      CASE WHEN ch.title LIKE ? THEN 1 ELSE 2 END,
      ch.sort_order ASC
    LIMIT 30
  `).all(q, q, q, q, q, q) as Array<{
    id: number;
    category_id: number;
    category_name: string;
    category_slug: string;
    title: string;
    slug: string;
    short_description: string;
    content_pali: string;
    content_reading: string;
    content_translation: string;
    description: string;
    image: string | null;
    audio_url: string | null;
    audio_duration: string;
    sort_order: number;
    is_featured: number;
    is_active: number;
  }>;

  return rows.map(r => ({
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    contentPali: r.content_pali,
    contentReading: r.content_reading,
    contentTranslation: r.content_translation,
    description: r.description,
    image: r.image,
    audioUrl: r.audio_url,
    audioDuration: r.audio_duration,
    sortOrder: r.sort_order,
    isFeatured: Boolean(r.is_featured),
    isActive: Boolean(r.is_active),
  }));
}

// Admin Operations
export function adminCreateChant(data: Omit<Chant, 'id'>) {
  const insert = db.prepare(`
    INSERT INTO chants (
      category_id, title, slug, short_description,
      content_pali, content_reading, content_translation,
      description, image, audio_url, audio_duration, sort_order, is_featured, is_active
    ) VALUES (
      @categoryId, @title, @slug, @shortDescription,
      @contentPali, @contentReading, @contentTranslation,
      @description, @image, @audioUrl, @audioDuration, @sortOrder, @isFeatured, @isActive
    )
  `);

  return insert.run({
    ...data,
    isFeatured: data.isFeatured ? 1 : 0,
    isActive: data.isActive ? 1 : 0,
  });
}

export function adminUpdateChant(id: number, data: Partial<Chant>) {
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  if (data.categoryId !== undefined) { fields.push('category_id = @categoryId'); params.categoryId = data.categoryId; }
  if (data.title !== undefined) { fields.push('title = @title'); params.title = data.title; }
  if (data.slug !== undefined) { fields.push('slug = @slug'); params.slug = data.slug; }
  if (data.shortDescription !== undefined) { fields.push('short_description = @shortDescription'); params.shortDescription = data.shortDescription; }
  if (data.contentPali !== undefined) { fields.push('content_pali = @contentPali'); params.contentPali = data.contentPali; }
  if (data.contentReading !== undefined) { fields.push('content_reading = @contentReading'); params.contentReading = data.contentReading; }
  if (data.contentTranslation !== undefined) { fields.push('content_translation = @contentTranslation'); params.contentTranslation = data.contentTranslation; }
  if (data.description !== undefined) { fields.push('description = @description'); params.description = data.description; }
  if (data.image !== undefined) { fields.push('image = @image'); params.image = data.image; }
  if (data.audioUrl !== undefined) { fields.push('audio_url = @audioUrl'); params.audioUrl = data.audioUrl; }
  if (data.sortOrder !== undefined) { fields.push('sort_order = @sortOrder'); params.sortOrder = data.sortOrder; }
  if (data.isFeatured !== undefined) { fields.push('is_featured = @isFeatured'); params.isFeatured = data.isFeatured ? 1 : 0; }
  if (data.isActive !== undefined) { fields.push('is_active = @isActive'); params.isActive = data.isActive ? 1 : 0; }

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const update = db.prepare(`UPDATE chants SET ${fields.join(', ')} WHERE id = @id`);
  return update.run(params);
}

export function adminDeleteChant(id: number) {
  return db.prepare('DELETE FROM chants WHERE id = ?').run(id);
}

export function adminCreateCategory(data: Omit<Category, 'id'>) {
  const insert = db.prepare(`
    INSERT INTO categories (name, slug, description, icon, image, sort_order, is_active)
    VALUES (@name, @slug, @description, @icon, @image, @sortOrder, @isActive)
  `);

  return insert.run({
    ...data,
    isActive: data.isActive ? 1 : 0,
  });
}

export function adminUpdateCategory(id: number, data: Partial<Category>) {
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  if (data.name !== undefined) { fields.push('name = @name'); params.name = data.name; }
  if (data.slug !== undefined) { fields.push('slug = @slug'); params.slug = data.slug; }
  if (data.description !== undefined) { fields.push('description = @description'); params.description = data.description; }
  if (data.icon !== undefined) { fields.push('icon = @icon'); params.icon = data.icon; }
  if (data.image !== undefined) { fields.push('image = @image'); params.image = data.image; }
  if (data.sortOrder !== undefined) { fields.push('sort_order = @sortOrder'); params.sortOrder = data.sortOrder; }
  if (data.isActive !== undefined) { fields.push('is_active = @isActive'); params.isActive = data.isActive ? 1 : 0; }

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const update = db.prepare(`UPDATE categories SET ${fields.join(', ')} WHERE id = @id`);
  return update.run(params);
}

export function adminDeleteCategory(id: number) {
  return db.prepare('DELETE FROM categories WHERE id = ?').run(id);
}

export function getStats() {
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  const chantCount = db.prepare('SELECT COUNT(*) as count FROM chants').get() as { count: number };
  const featuredCount = db.prepare('SELECT COUNT(*) as count FROM chants WHERE is_featured = 1').get() as { count: number };

  return {
    totalCategories: catCount.count,
    totalChants: chantCount.count,
    featuredChants: featuredCount.count,
  };
}

export default db;
