'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, Heart, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateFavCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('prayer_favorites') || '[]');
        setFavCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setFavCount(0);
      }
    };

    updateFavCount();
    window.addEventListener('storage', updateFavCount);
    window.addEventListener('favorites-updated', updateFavCount);

    return () => {
      window.removeEventListener('storage', updateFavCount);
      window.removeEventListener('favorites-updated', updateFavCount);
    };
  }, []);

  const navItems = [
    { label: 'หน้าแรก', href: '/', icon: Home },
    { label: 'หมวดหมู่', href: '/categories', icon: LayoutGrid },
    { label: 'ค้นหา', href: '/search', icon: Search },
    { label: 'รายการโปรด', href: '/favorites', icon: Heart, badge: favCount },
    { label: 'ตั้งค่า', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-[#EDE1CF] dark:border-[#382F24] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#B8862D] dark:text-[#E5B85C] font-semibold'
                  : 'text-[#8B7D6B] dark:text-[#A39686] hover:text-[#3E332A] dark:hover:text-[#F5EBE1]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-[#B8862D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-[#14110D]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#B8862D] dark:bg-[#E5B85C] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
