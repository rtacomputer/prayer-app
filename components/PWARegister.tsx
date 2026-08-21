'use client';

import { useEffect } from 'react';

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const swPath = window.location.pathname.startsWith('/prayer-app') 
          ? '/prayer-app/sw.js' 
          : '/sw.js';
        navigator.serviceWorker.register(swPath).catch((err) => {
          console.log('SW registration error: ', err);
        });
      });
    }

    // Capture install prompt for PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as unknown as { deferredPrompt: Event }).deferredPrompt = e;
      window.dispatchEvent(new Event('pwa-installable'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
