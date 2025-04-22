'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import FavoriteButton from './FavoriteButton';

interface Product {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  imageUrl?: string;
  images?: string[];
  categoryId: string;
  sizes: {
    size: string;
    price: number;
    stock: number;
  }[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();

  // Get the lowest price from available sizes
  const lowestPrice = product.sizes.reduce((min, size) => {
    return size.stock > 0 ? Math.min(min, size.price) : min;
  }, Infinity);

  // Get the first available image
  const mainImage = product.images?.[0] || product.imageUrl || '/placeholder-image.jpg';

  return (
    <div className="relative bg-white border border-gray-300 p-4">
      <FavoriteButton productId={product.id} className="absolute top-6 right-6 z-10" />

      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square mb-4">
          <Image
            src={mainImage}
            alt={product.name[language]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {product.name[language]}
          </h3>
          <p className="text-amber-500 font-medium mb-2">
            {lowestPrice !== Infinity ? `${lowestPrice.toFixed(2)} ${language === 'en' ? 'AED' : 'شيكل'}` : 'Out of Stock'}
          </p>
          <span className="text-sm text-gray-900 hover:text-amber-500 transition-colors">
            {language === 'en' ? 'Shop Now' : 'تسوق الآن'}
          </span>
        </div>
      </Link>
    </div>
  );
} 