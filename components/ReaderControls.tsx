'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Chant, ReaderSettings } from '@/lib/types';
import { 
  Type, Moon, Sun, Star, Share2, Play, Pause, 
  RotateCcw, ChevronLeft, ChevronRight, ArrowDownCircle,
  Volume2, VolumeX, Sparkles, Check
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { SadhuModal } from './SadhuModal';

interface ReaderControlsProps {
  chant: Chant;
  prevChant?: Chant;
  nextChant?: Chant;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

export function ReaderControls({
  chant,
  prevChant,
  nextChant,
  settings,
  onUpdateSettings,
}: ReaderControlsProps) {
  const { theme, toggleTheme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showSadhu, setShowSadhu] = useState(false);
  const [copied, setCopied] = useState(false);

  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Favorite status
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
      setIsFavorite(favs.includes(chant.id));
    } catch {
      setIsFavorite(false);
    }
  }, [chant.id]);

  // Handle Auto Scroll
  useEffect(() => {
    if (isAutoScrolling) {
      const speeds = [0, 1.2, 2.5, 4.0];
      const speed = speeds[settings.autoScrollSpeed || 2];
      
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy({ top: speed, behavior: 'smooth' });
        // Check if reached bottom
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
          setIsAutoScrolling(false);
          setShowSadhu(true);
        }
      }, 50);
    } else {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    }

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isAutoScrolling, settings.autoScrollSpeed]);

  // Handle Simulated Chanting Audio Player
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            setShowSadhu(true);
            return 0;
          }
          return prev + 1;
        });
      }, 600);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio]);

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

  const cycleFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    onUpdateSettings({ fontSize: sizes[nextIndex] });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: chant.title,
          text: `สวดมนต์ ${chant.title} เพื่อความเป็นสิริมงคล`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <SadhuModal
        isOpen={showSadhu}
        onClose={() => setShowSadhu(false)}
        chantTitle={chant.title}
      />

      {/* Floating Audio / Autoscroll Status Player Bar */}
      {(isPlayingAudio || isAutoScrolling) && (
        <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto rounded-2xl bg-[#1E1913]/95 text-[#F5EBE1] border border-[#B8862D]/40 p-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setIsPlayingAudio(!isPlayingAudio);
                  setIsAutoScrolling(false);
                }}
                className="w-10 h-10 rounded-full bg-[#B8862D] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div>
                <div className="text-xs font-semibold text-[#F5EBE1] flex items-center gap-1.5">
                  <span>กำลังสวด: {chant.title}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-[#A39686] flex items-center gap-2 mt-0.5">
                  <span>เสียงบทสวดสิริมงคล</span>
                  <span>•</span>
                  <span>{chant.audioDuration || '03:15'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  isAutoScrolling 
                    ? 'bg-[#B8862D] border-[#B8862D] text-white' 
                    : 'bg-[#2A2319] border-[#3E3428] text-[#D5C7B7]'
                }`}
              >
                {isAutoScrolling ? 'เลื่อนจออยู่' : 'เลื่อนจอ'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#2A2319] rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B8862D] to-[#E5B85C] h-full rounded-full transition-all duration-300"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Reader Bottom Toolbar (Mockup Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-[#EDE1CF] dark:border-[#382F24] px-4 py-2.5 pb-[max(env(safe-area-inset-bottom),12px)] shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Previous Chant */}
          {prevChant ? (
            <Link
              href={`/chant/${prevChant.slug}`}
              className="flex items-center text-xs font-medium text-[#8B7D6B] dark:text-[#A39686] hover:text-[#B8862D] dark:hover:text-[#E5B85C] py-1 px-2 rounded-lg"
              title={prevChant.title}
            >
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span className="hidden xs:inline">บทก่อนหน้า</span>
            </Link>
          ) : (
            <div className="w-16" />
          )}

          {/* Controls Center Buttons */}
          <div className="flex items-center space-x-1.5 bg-[#FBF4E6] dark:bg-[#201A13] p-1 rounded-full border border-[#EDE1CF] dark:border-[#382F24]">
            {/* Font Size Toggle */}
            <button
              onClick={cycleFontSize}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#2C241B] transition-colors"
              title={`ขนาดอักษร: ${settings.fontSize}`}
            >
              {settings.fontSize === 'small' && 'ก-'}
              {settings.fontSize === 'medium' && 'ก'}
              {settings.fontSize === 'large' && 'ก+'}
              {settings.fontSize === 'xlarge' && 'ก++'}
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#2C241B] transition-colors"
              title="สลับโหมดมืด"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E5B85C]" /> : <Moon className="w-4 h-4 text-[#B8862D]" />}
            </button>

            {/* Auto Scroll */}
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`p-1.5 rounded-full transition-colors ${
                isAutoScrolling 
                  ? 'bg-[#B8862D] text-white' 
                  : 'text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#2C241B]'
              }`}
              title="เลื่อนหน้าจออัตโนมัติ"
            >
              <ArrowDownCircle className="w-4 h-4" />
            </button>

            {/* Favorite Star */}
            <button
              onClick={toggleFavorite}
              className="p-1.5 rounded-full text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#2C241B] transition-colors"
              title="บันทึกรายการโปรด"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#D7A844] text-[#D7A844] dark:fill-[#E5B85C] dark:text-[#E5B85C]' : ''}`} />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setIsPlayingAudio(!isPlayingAudio);
                if (!isPlayingAudio) setIsAutoScrolling(true);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isPlayingAudio 
                  ? 'bg-[#B8862D] text-white' 
                  : 'text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#2C241B]'
              }`}
              title="ฟังเสียงสวดมนต์"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#2C241B] transition-colors"
              title="แชร์บทสวด"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Next Chant */}
          {nextChant ? (
            <Link
              href={`/chant/${nextChant.slug}`}
              className="flex items-center text-xs font-medium text-[#8B7D6B] dark:text-[#A39686] hover:text-[#B8862D] dark:hover:text-[#E5B85C] py-1 px-2 rounded-lg"
              title={nextChant.title}
            >
              <span className="hidden xs:inline">บทถัดไป</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>
    </>
  );
}
