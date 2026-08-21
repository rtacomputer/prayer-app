'use client';

import React, { useState, useEffect } from 'react';
import { Chant, ReaderSettings } from '@/lib/types';
import { Header } from '@/components/Header';
import { ReaderControls } from '@/components/ReaderControls';
import { SadhuModal } from '@/components/SadhuModal';
import { LotusLogo } from '@/components/CategoryIcons';
import { Sparkles, Star, Share2, Volume2, CheckCircle2, Bookmark } from 'lucide-react';

interface ChantReaderClientProps {
  chant: Chant;
  prevChant?: Chant;
  nextChant?: Chant;
}

export function ChantReaderClient({ chant, prevChant, nextChant }: ChantReaderClientProps) {
  const [activeTab, setActiveTab] = useState<'pali' | 'reading' | 'translation' | 'all'>('pali');
  const [showSadhu, setShowSadhu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 'medium',
    fontFamily: 'serif',
    theme: 'light',
    activeTab: 'pali',
    autoScrollSpeed: 2,
    showPronunciation: true,
    keepScreenOn: true,
  });

  // Load user reader settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('prayer_reader_settings');
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
      const favs = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
      setIsFavorite(favs.includes(chant.id));
    } catch {
      // ignore
    }
  }, [chant.id]);

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('prayer_reader_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-base leading-loose';
      case 'large':
        return 'text-xl leading-[2.3]';
      case 'xlarge':
        return 'text-2xl leading-[2.5]';
      case 'medium':
      default:
        return 'text-lg leading-[2.1]';
    }
  };

  const toggleFavorite = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
      let updated: number[] = [];
      if (favs.includes(chant.id)) {
        updated = favs.filter((id: number) => id !== chant.id);
        setIsFavorite(false);
      } else {
        updated = [...favs, chant.id];
        setIsFavorite(true);
      }
      localStorage.setItem('prayer_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Top Header with Back & Favorite toggle */}
      <Header
        title={chant.title}
        showBack={true}
        rightAction={
          <button
            onClick={toggleFavorite}
            aria-label="Favorite"
            className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C]"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        }
      />

      {/* Main Reader View */}
      <div className="flex-1 px-4 py-3 max-w-md mx-auto w-full">
        {/* Title Header Card */}
        <div className="text-center py-3 mb-2 border-b border-[#EDE1CF]/80 dark:border-[#2D251C]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] text-[#B8862D] dark:text-[#E5B85C] text-[11px] font-semibold mb-2">
            <LotusLogo className="w-3.5 h-3.5" />
            <span>{chant.categoryName || 'บทสวดมนต์'}</span>
          </div>

          <h2 className="text-lg font-bold text-[#3E332A] dark:text-[#F5EBE1] tracking-tight font-heading">
            {chant.title}
          </h2>

          {chant.shortDescription && (
            <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-1 max-w-xs mx-auto">
              {chant.shortDescription}
            </p>
          )}
        </div>

        {/* Tab Selector (บทสวด / คำอ่าน / คำแปล / รวม) */}
        <div className="flex items-center justify-center p-1 bg-[#FBF4E6] dark:bg-[#201A13] border border-[#EDE1CF] dark:border-[#382F24] rounded-2xl mb-5 shadow-xs">
          <button
            onClick={() => setActiveTab('pali')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pali'
                ? 'bg-white dark:bg-[#2C241B] text-[#B8862D] dark:text-[#E5B85C] shadow-xs'
                : 'text-[#8B7D6B] dark:text-[#A39686] hover:text-[#3E332A] dark:hover:text-[#F5EBE1]'
            }`}
          >
            บทสวด
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reading'
                ? 'bg-white dark:bg-[#2C241B] text-[#B8862D] dark:text-[#E5B85C] shadow-xs'
                : 'text-[#8B7D6B] dark:text-[#A39686] hover:text-[#3E332A] dark:hover:text-[#F5EBE1]'
            }`}
          >
            คำอ่าน
          </button>
          <button
            onClick={() => setActiveTab('translation')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'translation'
                ? 'bg-white dark:bg-[#2C241B] text-[#B8862D] dark:text-[#E5B85C] shadow-xs'
                : 'text-[#8B7D6B] dark:text-[#A39686] hover:text-[#3E332A] dark:hover:text-[#F5EBE1]'
            }`}
          >
            คำแปล
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#2C241B] text-[#B8862D] dark:text-[#E5B85C] shadow-xs'
                : 'text-[#8B7D6B] dark:text-[#A39686] hover:text-[#3E332A] dark:hover:text-[#F5EBE1]'
            }`}
          >
            รวมทั้งหมด
          </button>
        </div>

        {/* Chanting Verses Content Container */}
        <div className="rounded-3xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-5 shadow-sm">
          {/* Decorative Top Accent */}
          <div className="flex items-center justify-center space-x-2 mb-4 text-[#B8862D]/40 dark:text-[#E5B85C]/30">
            <span className="h-[1px] w-12 bg-current" />
            <LotusLogo className="w-4 h-4 text-[#B8862D] dark:text-[#E5B85C]" />
            <span className="h-[1px] w-12 bg-current" />
          </div>

          {/* Verses by Active Tab */}
          <div className={`font-chant ${getFontSizeClass()} text-center text-[#3E332A] dark:text-[#F5EBE1] space-y-4`}>
            {activeTab === 'pali' && (
              <div className="whitespace-pre-line tracking-wide">
                {chant.contentPali}
              </div>
            )}

            {activeTab === 'reading' && (
              <div className="whitespace-pre-line text-[#8D641F] dark:text-[#E5B85C] tracking-wider">
                {chant.contentReading || chant.contentPali}
              </div>
            )}

            {activeTab === 'translation' && (
              <div className="whitespace-pre-line font-ui text-[#4A3E34] dark:text-[#E2D5C5] text-sm leading-relaxed text-left">
                {chant.contentTranslation || 'ไม่มีคำแปล'}
              </div>
            )}

            {activeTab === 'all' && (
              <div className="space-y-6 text-left">
                <div className="p-4 rounded-2xl bg-[#FFF9EF] dark:bg-[#17130E] border border-[#EDE1CF] dark:border-[#2D251C]">
                  <div className="text-xs font-bold text-[#B8862D] dark:text-[#E5B85C] uppercase tracking-wider mb-2">
                    [ บทสวดบาลี ]
                  </div>
                  <div className="whitespace-pre-line font-chant text-center">
                    {chant.contentPali}
                  </div>
                </div>

                {chant.contentReading && (
                  <div className="p-4 rounded-2xl bg-[#FBF4E6] dark:bg-[#201A12] border border-[#EDE1CF] dark:border-[#2D251C]">
                    <div className="text-xs font-bold text-[#B8862D] dark:text-[#E5B85C] uppercase tracking-wider mb-2">
                      [ คำอ่าน ]
                    </div>
                    <div className="whitespace-pre-line text-[#8D641F] dark:text-[#E5B85C] text-center">
                      {chant.contentReading}
                    </div>
                  </div>
                )}

                {chant.contentTranslation && (
                  <div className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A1611] border border-[#EDE1CF] dark:border-[#2D251C]">
                    <div className="text-xs font-bold text-[#B8862D] dark:text-[#E5B85C] uppercase tracking-wider mb-2">
                      [ คำแปล ]
                    </div>
                    <div className="whitespace-pre-line font-ui text-sm text-[#4A3E34] dark:text-[#E2D5C5] leading-relaxed">
                      {chant.contentTranslation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Decorative Bottom Accent */}
          <div className="flex items-center justify-center space-x-2 mt-6 text-[#B8862D]/40 dark:text-[#E5B85C]/30">
            <span className="h-[1px] w-12 bg-current" />
            <span className="text-xs font-serif text-[#B8862D] dark:text-[#E5B85C]">สาธุ</span>
            <span className="h-[1px] w-12 bg-current" />
          </div>

          {/* Finish Chanting Blessing Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowSadhu(true)}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#B8862D] to-[#D7A844] hover:from-[#9E7122] hover:to-[#B8862D] text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>สวดเสร็จสิ้น (สาธุ 🙏)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reader Controls Fixed Bottom Toolbar */}
      <ReaderControls
        chant={chant}
        prevChant={prevChant}
        nextChant={nextChant}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Sadhu Celebration Modal */}
      <SadhuModal
        isOpen={showSadhu}
        onClose={() => setShowSadhu(false)}
        chantTitle={chant.title}
      />
    </div>
  );
}
