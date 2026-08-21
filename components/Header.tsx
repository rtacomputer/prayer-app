'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, Search, Bell, Moon, Sun, ShieldCheck } from 'lucide-react';
import { LotusLogo } from './CategoryIcons';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isHome = pathname === '/';

  if (isHome) {
    return (
      <header className="sticky top-0 z-40 w-full glass-header px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] shadow-sm">
              <LotusLogo className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#3E332A] dark:text-[#F5EBE1] flex items-center gap-1.5 font-heading">
                บทสวดมนต์
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#B8862D]/15 text-[#B8862D] dark:text-[#E5B85C] font-semibold">
                  Digital
                </span>
              </h1>
              <p className="text-[11px] text-[#8B7D6B] dark:text-[#A39686]">เสริมสิริมงคล สงบ สบายใจ</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] hover:scale-105 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/search"
              aria-label="Search"
              className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] hover:scale-105 transition-all"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href="/admin"
              aria-label="Admin"
              className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C] hover:scale-105 transition-all"
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-header px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showBack && (
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#3E332A] dark:text-[#F5EBE1] hover:bg-[#EDE1CF] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-base font-bold text-[#3E332A] dark:text-[#F5EBE1] truncate max-w-[200px] font-heading">
            {title || 'บทสวดมนต์'}
          </h1>
        </div>

        <div className="flex items-center space-x-1.5">
          {rightAction ? (
            rightAction
          ) : (
            <>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C]"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/search"
                className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-[#2A2319] border border-[#EDE1CF] dark:border-[#3E3428] flex items-center justify-center text-[#B8862D] dark:text-[#E5B85C]"
              >
                <Search className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
