'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export default function FavoriteButton({ productId, className = '' }: FavoriteButtonProps) {
  const { language } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
    setIsFavorite(favorites.includes(productId));
  }, [productId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
    const updatedFavorites = isFavorite
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
          : 'bg-white/80 text-gray-400 hover:bg-white hover:text-amber-600'
      } ${className}`}
      title={language === 'en' ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : (isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة')}
    >
      <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
} 