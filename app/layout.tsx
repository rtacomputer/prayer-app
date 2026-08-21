import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'บทสวดมนต์ดิจิทัล - สวดมนต์ เสริมสิริมงคล ให้ชีวิตเป็นสุข',
  description: 'เว็บแอปพลิเคชันรวบรวมบทสวดมนต์ พระคาถาชินบัญชร บทแผ่เมตตา บทสวดประจำวัน พร้อมคำอ่านและคำแปล ใช้งานง่ายบนมือถือ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'บทสวดมนต์',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#B8862D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-[#FFF9EF] dark:bg-[#14110D] text-[#3E332A] dark:text-[#F4ECE1]">
        <ThemeProvider>
          <div className="min-h-screen max-w-md mx-auto relative flex flex-col bg-[#FFF9EF] dark:bg-[#14110D] shadow-2xl border-x border-[#EDE1CF]/60 dark:border-[#2A2218]">
            <main className="flex-1 pb-20">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
