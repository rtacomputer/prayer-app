'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Share2, X, Heart } from 'lucide-react';
import { LotusLogo } from './CategoryIcons';

interface SadhuModalProps {
  isOpen: boolean;
  onClose: () => void;
  chantTitle: string;
}

export function SadhuModal({ isOpen, onClose, chantTitle }: SadhuModalProps) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#B8862D', '#FBF4E6', '#E5B85C', '#8D641F']
        });
      } catch (e) {
        console.log('Confetti effect:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `สวดมนต์ ${chantTitle}`,
          text: `ข้าพเจ้าได้สวดมนต์ "${chantTitle}" เสริมสิริมงคล ขออนุโมทนาบุญร่วมกันครับ/ค่ะ 🙏`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('คัดลอกลิงก์เรียบร้อยแล้ว อนุโมทนาบุญครับ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#FFF9EF] dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8B7D6B] dark:text-[#A39686] hover:bg-[#EDE1CF] dark:hover:bg-[#282015] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lotus Icon Glow */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FBF4E6] dark:bg-[#2A2218] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] shadow-md mb-3 pulse-glow">
          <LotusLogo className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B8862D]/15 text-[#B8862D] dark:text-[#E5B85C] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          อนุโมทนาบุญ สาธุ 🙏
        </div>

        <h3 className="text-lg font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading">
          สวดมนต์เสร็จสิ้นบริบูรณ์
        </h3>

        <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-1 font-medium">
          บท: {chantTitle}
        </p>

        <div className="my-4 p-4 rounded-2xl bg-white dark:bg-[#17130E] border border-[#EDE1CF] dark:border-[#2D251C] text-xs text-[#3E332A] dark:text-[#E5D7C7] leading-relaxed italic">
          “ขออานิสงส์ผลบุญแห่งการสวดมนต์และเจริญจิตตภาวนานี้ จงเป็นพลวปัจจัยให้ท่านและครอบครัว ประสบแต่ความสุข ความเจริญ มีสุขภาพพลานามัยแข็งแรง และแคล้วคลาดปลอดภัยเทอญ”
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] text-[#3E332A] dark:text-[#F5EBE1] text-xs font-semibold hover:bg-[#EDE1CF] transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#B8862D] dark:text-[#E5B85C]" />
            แชร์บอกบุญ
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#B8862D] hover:bg-[#9E7122] dark:bg-[#E5B85C] dark:hover:bg-[#D4A746] text-white dark:text-[#1E1913] text-xs font-bold shadow-md transition-colors"
          >
            สาธุ รับพร
          </button>
        </div>
      </div>
    </div>
  );
}
