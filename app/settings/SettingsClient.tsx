'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useTheme } from '@/components/ThemeProvider';
import { LotusLogo } from '@/components/CategoryIcons';
import { 
  Type, Moon, Sun, HardDrive, Trash2, 
  Share2, Download, Smartphone, Check, 
  Sparkles, ExternalLink, HelpCircle, X, ChevronRight 
} from 'lucide-react';

export function SettingsClient() {
  const { theme, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');
  const [copied, setCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('prayer_reader_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
      }
    } catch {
      // ignore
    }

    // Check if PWA prompt is ready
    const checkInstallable = () => {
      const prompt = (window as unknown as { deferredPrompt?: Event }).deferredPrompt;
      if (prompt) setIsInstallable(true);
    };

    checkInstallable();
    window.addEventListener('pwa-installable', checkInstallable);

    return () => {
      window.removeEventListener('pwa-installable', checkInstallable);
    };
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

  const handleShareApp = async () => {
    const shareData = {
      title: 'บทสวดมนต์ดิจิทัล - เสริมสิริมงคล',
      text: 'ขอเชิญชวนสวดมนต์เจริญภาวนาผ่านแอป "บทสวดมนต์ดิจิทัล" ใช้งานง่าย อ่านสบายตา พร้อมคำอ่านและคำแปล ฟรีไม่มีโฆษณา 🙏✨',
      url: window.location.origin + window.location.pathname.replace(/\/settings\/?$/, '') + '/',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(
        `${shareData.text}\nเข้าใช้งานได้ที่: ${shareData.url}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallPWA = async () => {
    const prompt = (window as unknown as { deferredPrompt?: { prompt: () => void; userChoice: Promise<{ outcome: string }> } }).deferredPrompt;
    
    if (prompt) {
      prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
      }
    } else {
      // Show iOS / Manual instructions
      setShowInstallGuide(true);
    }
  };

  const handleClearCache = () => {
    if (confirm('คุณต้องการล้างประวัติการอ่านและรายการโปรดทั้งหมดใช่หรือไม่?')) {
      localStorage.removeItem('prayer_favorites');
      localStorage.removeItem('prayer_reader_settings');
      localStorage.removeItem('prayer_custom_chants');
      localStorage.removeItem('prayer_custom_categories');
      window.dispatchEvent(new Event('favorites-updated'));
      alert('ล้างข้อมูลเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="การตั้งค่า" showBack={true} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Quick Action: Share & Add to Home Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF5E4] via-[#FDF0D5] to-[#FBF4E6] dark:from-[#261E14] dark:via-[#201A12] dark:to-[#17130E] border border-[#EDE1CF] dark:border-[#382F24] p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] shadow-xs shrink-0 pulse-glow">
              <LotusLogo className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading flex items-center gap-1.5">
                บทสวดมนต์ดิจิทัล
                <Sparkles className="w-3.5 h-3.5 text-[#B8862D]" />
              </h3>
              <p className="text-xs text-[#8B7D6B] dark:text-[#A39686] mt-0.5">
                ติดตั้งลงมือถือ & แชร์บอกบุญให้คนที่คุณรัก
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Install / Add to Home Screen Button */}
            <button
              onClick={handleInstallPWA}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] hover:border-[#B8862D] text-[#3E332A] dark:text-[#F5EBE1] text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#B8862D] dark:text-[#E5B85C]" />
              <span>{isInstallable ? 'ติดตั้งแอปลงเครื่อง' : 'เพิ่มไปยังหน้าจอ'}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareApp}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#B8862D] hover:bg-[#9E7122] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกลิงก์แล้ว!' : 'แชร์แอปบอกบุญ'}</span>
            </button>
          </div>
        </div>

        {/* Settings Group: การอ่านและการแสดงผล */}
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
                ปรับขนาดให้อ่านสบายตา
              </div>
            </div>

            <div className="flex items-center space-x-1 bg-[#FBF4E6] dark:bg-[#282015] p-1 rounded-2xl border border-[#EDE1CF] dark:border-[#382F24]">
              {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
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
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border cursor-pointer ${
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

        {/* Settings Group: ข้อมูลในเครื่อง */}
        <div className="rounded-3xl bg-white dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EDE1CF]/60 dark:border-[#2D251C]">
            <HardDrive className="w-4 h-4 text-[#B8862D] dark:text-[#E5B85C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B7D6B] dark:text-[#A39686]">
              ข้อมูลในเครื่อง
            </h3>
          </div>

          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-colors text-left cursor-pointer"
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
              เวอร์ชัน 1.0.0 (PWA Edition)
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

      {/* Modal: How to Add to Home Screen (iOS & Android Guide) */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FFF9EF] dark:bg-[#1E1913] border border-[#EDE1CF] dark:border-[#382F24] p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8B7D6B] hover:text-[#3E332A] dark:hover:text-[#F5EBE1] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FBF4E6] dark:bg-[#282015] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] mb-3">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-[#3E332A] dark:text-[#F5EBE1] font-heading">
              วิธีเพิ่มแอปลงหน้าจอมือถือ
            </h3>

            <div className="my-4 text-left space-y-3 text-xs">
              {/* iPhone Step */}
              <div className="p-3 rounded-2xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#2D251C]">
                <div className="font-bold text-[#B8862D] dark:text-[#E5B85C] mb-1 flex items-center gap-1.5">
                  <span>📱 สำหรับ iPhone (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[#4A3E34] dark:text-[#D5C7B7] leading-relaxed">
                  <li>กดปุ่ม <strong>แชร์ 📤</strong> (สี่เหลี่ยมลูกศรชี้ขึ้น) ที่แถบเมนูด้านล่าง</li>
                  <li>เลื่อนลงแล้วเลือก <strong>&quot;เพิ่มไปยังหน้าจอโฮม&quot; (Add to Home Screen)</strong></li>
                  <li>กด <strong>&quot;เพิ่ม&quot; (Add)</strong> ที่มุมบนขวา</li>
                </ol>
              </div>

              {/* Android Step */}
              <div className="p-3 rounded-2xl bg-white dark:bg-[#14110D] border border-[#EDE1CF] dark:border-[#2D251C]">
                <div className="font-bold text-[#B8862D] dark:text-[#E5B85C] mb-1 flex items-center gap-1.5">
                  <span>🤖 สำหรับ Android (Chrome):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[#4A3E34] dark:text-[#D5C7B7] leading-relaxed">
                  <li>กดปุ่ม <strong>จุด 3 จุด (⋮)</strong> ที่มุมบนขวา</li>
                  <li>เลือก <strong>&quot;ติดตั้งแอป&quot;</strong> หรือ <strong>&quot;เพิ่มลงในหน้าจอหลัก&quot;</strong></li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-3 rounded-xl bg-[#B8862D] hover:bg-[#9E7122] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
