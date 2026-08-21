import React from 'react';
import { 
  Sun, Moon, Sparkles, Droplets, BookOpen, Heart, 
  Flame, Crown, Bell, Shield, Compass, Feather, Award, 
  Bookmark, Flower2
} from 'lucide-react';

export function CategoryIcon({ name, className = "w-6 h-6 text-[#B8862D] dark:text-[#E5B85C]" }: { name: string; className?: string }) {
  switch (name.toLowerCase()) {
    case 'lotus':
      return <Flower2 className={className} />;
    case 'heart-hand':
    case 'heart':
      return <Heart className={className} />;
    case 'moon':
      return <Moon className={className} />;
    case 'crown':
      return <Crown className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'droplets':
      return <Droplets className={className} />;
    case 'scroll':
    case 'book':
      return <BookOpen className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'bell':
      return <Bell className={className} />;
    default:
      return <Flower2 className={className} />;
  }
}

export function LotusLogo({ className = "w-8 h-8 text-[#B8862D] dark:text-[#E5B85C]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stylized Golden Lotus Flower */}
      <path d="M50 15C50 15 58 35 50 65C42 35 50 15 50 15Z" fill="currentColor" opacity="0.95" />
      <path d="M50 30C58 40 75 48 70 70C60 72 50 65 50 65C50 65 40 72 30 70C25 48 42 40 50 30Z" fill="currentColor" opacity="0.8" />
      <path d="M50 45C65 52 88 58 85 78C72 82 50 68 50 68C50 68 28 82 15 78C12 58 35 52 50 45Z" fill="currentColor" opacity="0.65" />
      <circle cx="50" cy="78" r="4" fill="currentColor" />
    </svg>
  );
}
