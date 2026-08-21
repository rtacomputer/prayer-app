'use client';

import React, { useState, useEffect } from 'react';
import { Chant, Category } from '@/lib/types';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { 
  Plus, Edit, Trash2, Star, Eye, EyeOff, Save, 
  X, Check, Layers, BookOpen, Sparkles, ArrowLeft, RefreshCw
} from 'lucide-react';

interface AdminClientProps {
  initialCategories: Category[];
  initialChants: Chant[];
  stats: { totalCategories: number; totalChants: number; featuredChants: number };
}

export function AdminClient({ initialCategories, initialChants, stats }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<'chants' | 'categories'>('chants');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [chants, setChants] = useState<Chant[]>(initialChants);

  // Modal state for Chant form
  const [isChantModalOpen, setIsChantModalOpen] = useState(false);
  const [editingChant, setEditingChant] = useState<Partial<Chant> | null>(null);

  // Modal state for Category form
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const [saving, setSaving] = useState(false);

  // Load custom chants/categories from localStorage on mount
  useEffect(() => {
    try {
      const savedChants = localStorage.getItem('prayer_custom_chants');
      if (savedChants) {
        const parsed = JSON.parse(savedChants);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChants(parsed);
        }
      }

      const savedCategories = localStorage.getItem('prayer_custom_categories');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveChantsToStorage = (updated: Chant[]) => {
    setChants(updated);
    try {
      localStorage.setItem('prayer_custom_chants', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCategoriesToStorage = (updated: Category[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('prayer_custom_categories', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Save Chant
  const handleSaveChant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChant?.title || !editingChant?.categoryId || !editingChant?.contentPali) {
      alert('กรุณากรอกชื่อบทสวด หมวดหมู่ และบทสวดบาลี');
      return;
    }

    setSaving(true);
    const cat = categories.find((c) => c.id === Number(editingChant.categoryId));
    const slug = editingChant.slug || editingChant.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]/g, '') + '-' + Date.now();

    if (editingChant.id) {
      // Edit
      const updated = chants.map((c) =>
        c.id === editingChant.id
          ? ({
              ...c,
              ...editingChant,
              categoryName: cat?.name || c.categoryName,
            } as Chant)
          : c
      );
      saveChantsToStorage(updated);
    } else {
      // Create new
      const newChant: Chant = {
        id: Date.now(),
        categoryId: Number(editingChant.categoryId),
        categoryName: cat?.name || 'ทั่วไป',
        categorySlug: cat?.slug || 'general',
        title: editingChant.title,
        slug,
        shortDescription: editingChant.shortDescription || '',
        contentPali: editingChant.contentPali,
        contentReading: editingChant.contentReading || '',
        contentTranslation: editingChant.contentTranslation || '',
        audioDuration: editingChant.audioDuration || '03:00',
        sortOrder: chants.length + 1,
        isFeatured: Boolean(editingChant.isFeatured),
        isActive: Boolean(editingChant.isActive ?? true),
      };
      saveChantsToStorage([...chants, newChant]);
    }

    setIsChantModalOpen(false);
    setEditingChant(null);
    setSaving(false);
  };

  // Handle Delete Chant
  const handleDeleteChant = (id: number) => {
    if (!confirm('คุณต้องการลบบทสวดนี้ใช่หรือไม่?')) return;
    const updated = chants.filter((c) => c.id !== id);
    saveChantsToStorage(updated);
  };

  // Handle Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) {
      alert('กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    setSaving(true);
    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]/g, '') + '-' + Date.now();

    if (editingCategory.id) {
      // Edit
      const updated = categories.map((cat) =>
        cat.id === editingCategory.id
          ? ({ ...cat, ...editingCategory } as Category)
          : cat
      );
      saveCategoriesToStorage(updated);
    } else {
      // Create new
      const newCat: Category = {
        id: Date.now(),
        name: editingCategory.name,
        slug,
        description: editingCategory.description || '',
        icon: editingCategory.icon || 'lotus',
        sortOrder: categories.length + 1,
        isActive: Boolean(editingCategory.isActive ?? true),
        chantCount: 0,
      };
      saveCategoriesToStorage([...categories, newCat]);
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setSaving(false);
  };

  // Handle Delete Category
  const handleDeleteCategory = (id: number) => {
    if (!confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return;
    const updated = categories.filter((c) => c.id !== id);
    saveCategoriesToStorage(updated);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="ระบบจัดการหลังบ้าน" showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] text-center shadow-xs">
            <div className="text-lg font-bold text-[#B8862D] dark:text-[#E5B85C]">
              {chants.length}
            </div>
            <div className="text-[10px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
              บทสวดทั้งหมด
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] text-center shadow-xs">
            <div className="text-lg font-bold text-[#B8862D] dark:text-[#E5B85C]">
              {categories.length}
            </div>
            <div className="text-[10px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
              หมวดหมู่
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] text-center shadow-xs">
            <div className="text-lg font-bold text-[#B8862D] dark:text-[#E5B85C]">
              {chants.filter((c) => c.isFeatured).length}
            </div>
            <div className="text-[10px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
              บทสวดยอดนิยม
            </div>
          </div>
        </div>

        {/* Tab Selector & Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-[#FBF4E6] dark:bg-[#201A13] p-1 rounded-2xl border border-[#EDE1CF] dark:border-[#382F24]">
            <button
              onClick={() => setActiveTab('chants')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chants'
                  ? 'bg-white dark:bg-[#2C241B] text-[#B8862D] dark:text-[#E5B85C] shadow-xs'
                  : 'text-[#8B7D6B] dark:text-[#A39686]'
              }`}
            >
              บทสวดมนต์ ({chants.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-white dark:bg-[#2C241B] text-[#B8862D] dark:text-[#E5B85C] shadow-xs'
                  : 'text-[#8B7D6B] dark:text-[#A39686]'
              }`}
            >
              หมวดหมู่ ({categories.length})
            </button>
          </div>

          {activeTab === 'chants' ? (
            <button
              onClick={() => {
                setEditingChant({
                  title: '',
                  categoryId: categories[0]?.id || 1,
                  contentPali: '',
                  contentReading: '',
                  contentTranslation: '',
                  shortDescription: '',
                  audioDuration: '03:00',
                  sortOrder: chants.length + 1,
                  isFeatured: false,
                  isActive: true,
                });
                setIsChantModalOpen(true);
              }}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-[#B8862D] hover:bg-[#9E7122] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              เพิ่มบทสวด
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCategory({
                  name: '',
                  description: '',
                  icon: 'lotus',
                  sortOrder: categories.length + 1,
                  isActive: true,
                });
                setIsCategoryModalOpen(true);
              }}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-[#B8862D] hover:bg-[#9E7122] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              เพิ่มหมวด
            </button>
          )}
        </div>

        {/* Content List: Chants */}
        {activeTab === 'chants' && (
          <div className="space-y-2.5">
            {chants.map((chant) => (
              <div
                key={chant.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] shadow-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#3E332A] dark:text-[#F5EBE1] truncate">
                      {chant.title}
                    </h4>
                    {chant.isFeatured && (
                      <span className="text-[9px] px-1 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 font-medium">
                        แนะนำ
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
                    {chant.categoryName || 'ทั่วไป'} • {chant.audioDuration || '03:00'}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingChant(chant);
                      setIsChantModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#8B7D6B] hover:text-[#B8862D] hover:bg-[#FBF4E6] dark:hover:bg-[#282015] transition-colors"
                    title="แก้ไข"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteChant(chant.id)}
                    className="p-1.5 rounded-lg text-[#8B7D6B] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content List: Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] shadow-xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#3E332A] dark:text-[#F5EBE1]">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
                    {cat.description || `ไอคอน: ${cat.icon}`} • ลำดับ {cat.sortOrder}
                  </p>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#8B7D6B] hover:text-[#B8862D] hover:bg-[#FBF4E6] dark:hover:bg-[#282015] transition-colors"
                    title="แก้ไข"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-[#8B7D6B] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form: Add / Edit Chant */}
      {isChantModalOpen && editingChant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#FFF9EF] dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-5 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE1CF]/80 dark:border-[#2D251C]">
              <h3 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1]">
                {editingChant.id ? 'แก้ไขบทสวดมนต์' : 'เพิ่มบทสวดมนต์ใหม่'}
              </h3>
              <button
                onClick={() => setIsChantModalOpen(false)}
                className="p-1 text-[#8B7D6B] hover:text-[#3E332A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChant} className="space-y-3.5 mt-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ชื่อบทสวด *</label>
                <input
                  type="text"
                  required
                  value={editingChant.title || ''}
                  onChange={(e) => setEditingChant({ ...editingChant, title: e.target.value })}
                  placeholder="เช่น บทสวดมนต์บูชาพระรัตนตรัย"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24] focus:outline-none focus:ring-2 focus:ring-[#B8862D]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">หมวดหมู่ *</label>
                  <select
                    value={editingChant.categoryId || categories[0]?.id || 1}
                    onChange={(e) => setEditingChant({ ...editingChant, categoryId: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">ความยาวเสียง (นาที)</label>
                  <input
                    type="text"
                    value={editingChant.audioDuration || ''}
                    onChange={(e) => setEditingChant({ ...editingChant, audioDuration: e.target.value })}
                    placeholder="03:30"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">คำอธิบายสั้น</label>
                <input
                  type="text"
                  value={editingChant.shortDescription || ''}
                  onChange={(e) => setEditingChant({ ...editingChant, shortDescription: e.target.value })}
                  placeholder="เช่น สวดบูชาพระรัตนตรัย เริ่มต้นสิริมงคล"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">บทสวดบาลี *</label>
                <textarea
                  required
                  rows={4}
                  value={editingChant.contentPali || ''}
                  onChange={(e) => setEditingChant({ ...editingChant, contentPali: e.target.value })}
                  placeholder="อิมินา สักกาเรนะ..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24] font-chant"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">คำอ่าน (สัทอักษรไทย)</label>
                <textarea
                  rows={3}
                  value={editingChant.contentReading || ''}
                  onChange={(e) => setEditingChant({ ...editingChant, contentReading: e.target.value })}
                  placeholder="อิ-มิ-นา สัก-กา-เร-นะ..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">คำแปลภาษาไทย</label>
                <textarea
                  rows={3}
                  value={editingChant.contentTranslation || ''}
                  onChange={(e) => setEditingChant({ ...editingChant, contentTranslation: e.target.value })}
                  placeholder="ข้าพเจ้าขอบูชา..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingChant.isFeatured)}
                    onChange={(e) => setEditingChant({ ...editingChant, isFeatured: e.target.checked })}
                    className="accent-[#B8862D]"
                  />
                  <span>บทสวดยอดนิยม (Featured)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingChant.isActive ?? true)}
                    onChange={(e) => setEditingChant({ ...editingChant, isActive: e.target.checked })}
                    className="accent-[#B8862D]"
                  />
                  <span>เผยแพร่ (Active)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE1CF]/80 dark:border-[#2D251C]">
                <button
                  type="button"
                  onClick={() => setIsChantModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-white dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#382F24] font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2 px-5 rounded-xl bg-[#B8862D] hover:bg-[#9E7122] text-white font-bold shadow-xs transition-colors"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกบทสวด'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form: Add / Edit Category */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FFF9EF] dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE1CF]/80 dark:border-[#2D251C]">
              <h3 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1]">
                {editingCategory.id ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#8B7D6B] hover:text-[#3E332A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ชื่อหมวดหมู่ *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="เช่น บทสวดประจำวัน"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">คำอธิบาย</label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="เช่น สำหรับสวดเป็นประจำทุกวัน"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ไอคอน (lotus, moon, sun, heart, crown, sparkles, droplets, scroll)</label>
                <input
                  type="text"
                  value={editingCategory.icon || 'lotus'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#382F24]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE1CF]/80 dark:border-[#2D251C]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-white dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#382F24] font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2 px-5 rounded-xl bg-[#B8862D] hover:bg-[#9E7122] text-white font-bold shadow-xs"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกหมวด'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
