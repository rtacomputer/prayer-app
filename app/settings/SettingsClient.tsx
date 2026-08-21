'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useTheme } from '@/components/ThemeProvider';
import { LotusLogo } from '@/components/CategoryIcons';
import { 
  Type, Moon, Sun, Monitor, HardDrive, Trash2, 
  Info, Shield, Sparkles, Check, ChevronRight 
} from 'lucide-react';

export function SettingsClient() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('prayer_reader_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
    setFontSize(size);
    try {
      const saved = JSON.parse(localStorage.getItem('prayer_reader_settings') || '{}');
      saved.fontSize = size;
      localStorage.setItem('prayer_reader_settings', JSON.stringify(saved));
    } catch {
      // ignore
    }
  };

  const handleClearCache = () => {
    if (confirm('คุณต้องการล้างประวัติการอ่านและรายการโปรดทั้งหมดใช่หรือไม่?')) {
      localStorage.removeItem('prayer_favorites');
      localStorage.removeItem('prayer_reader_settings');
      window.dispatchEvent(new Event('favorites-updated'));
      alert('ล้างข้อมูลเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="การตั้งค่า" showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Settings Group: การแสดงผล & ฟอนต์ */}
        <div className="rounded-3xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-4 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EDE1CF]/60 dark:border-[#2D251C]">
            <Type className="w-4 h-4 text-[#B8862D] dark:text-[#E5B85C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B7D6B] dark:text-[#A39686]">
              การอ่านและการแสดงผล
            </h3>
          </div>

          {/* ขนาดตัวอักษร */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#3E332A] dark:text-[#F5EBE1]">
                ขนาดตัวอักษรบทสวด
              </div>
              <div className="text-[11px] text-[#8B7D6B] dark:text-[#A39686]">
                ปรับขนาดให้เหมาะกับสายตา
              </div>
            </div>

            <div className="flex items-center space-x-1 bg-[#FBF4E6] dark:bg-[#282015] p-1 rounded-2xl border border-[#EDE1CF] dark:border-[#382F24]">
              {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                    fontSize === size
                      ? 'bg-[#B8862D] text-white shadow-xs'
                      : 'text-[#3E332A] dark:text-[#F5EBE1] hover:bg-white dark:hover:bg-[#342B1E]'
                  }`}
                >
                  {size === 'small' && 'ก-'}
                  {size === 'medium' && 'ก'}
                  {size === 'large' && 'ก+'}
                  {size === 'xlarge' && 'ก++'}
                </button>
              ))}
            </div>
          </div>

          {/* โหมดกลางคืน */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-bold text-[#3E332A] dark:text-[#F5EBE1]">
                โหมดกลางคืน (Dark Mode)
              </div>
              <div className="text-[11px] text-[#8B7D6B] dark:text-[#A39686]">
                ถนอมสายตาสำหรับการสวดมนต์ตอนค่ำ
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                theme === 'dark'
                  ? 'bg-[#B8862D] border-[#B8862D]'
                  : 'bg-[#EDE1CF] border-[#DCCBB4]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-6 text-[#14110D]' : 'translate-x-0 text-amber-500'
                }`}
              >
                {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </div>

        {/* Settings Group: ข้อมูลและการสำรอง */}
        <div className="rounded-3xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EDE1CF]/60 dark:border-[#2D251C]">
            <HardDrive className="w-4 h-4 text-[#B8862D] dark:text-[#E5B85C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B7D6B] dark:text-[#A39686]">
              ข้อมูลในเครื่อง
            </h3>
          </div>

          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-colors text-left"
          >
            <div className="flex items-center space-x-2.5">
              <Trash2 className="w-4 h-4" />
              <div>
                <div className="text-xs font-semibold">ล้างข้อมูลรายการโปรดทั้งหมด</div>
                <div className="text-[10px] text-[#8B7D6B] dark:text-[#A39686]">
                  รีเซ็ตข้อมูลที่บันทึกไว้ในเบราว์เซอร์
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8B7D6B]" />
          </button>
        </div>

        {/* Settings Group: เกี่ยวกับแอป */}
        <div className="rounded-3xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-5 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] shadow-xs">
            <LotusLogo className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading">
              บทสวดมนต์ดิจิทัล
            </h4>
            <p className="text-[11px] text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
              เวอร์ชัน 1.0.0 (Mobile-First Edition)
            </p>
          </div>

          <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] leading-relaxed max-w-xs mx-auto">
            สร้างขึ้นเพื่อเป็นธรรมทานและอำนวยความสะดวกแก่พุทธศาสนิกชนในการสวดมนต์เจริญภาวนาทุกที่ทุกเวลา
          </p>

          <div className="pt-2 border-t border-[#EDE1CF]/60 dark:border-[#2D251C] text-[10px] text-[#8B7D6B] dark:text-[#A39686]">
            © 2026 บทสวดมนต์ดิจิทัล • ใช้งานฟรี ไม่มีโฆษณา
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
