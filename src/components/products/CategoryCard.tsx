'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  imageUrl: string;
}

interface CategoryCardProps {
  category: Category;
  language: 'en' | 'ar';
}

export default function CategoryCard({ category, language }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative aspect-square w-full max-w-sm mx-auto group"
    >
      <Link href={`/categories/${category.id}`}>
        <div className="absolute inset-0 rounded-full bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="absolute inset-[10%] rounded-full bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
          <Image
            src={category.imageUrl}
            alt={category.name[language]}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center relative z-10 transform translate-y-4 sm:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl text-white tracking-wide mb-2 sm:mb-4 drop-shadow-lg">
              {category.name[language]}
            </h3>
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '60%' }}
              viewport={{ once: true }}
              className="h-0.5 bg-white/80 mx-auto group-hover:w-24 sm:group-hover:w-32 transition-all duration-500"
            />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 group-hover:border-amber-400/50 transition-colors duration-500" />
        <div className="absolute -inset-2 sm:-inset-4 rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
    </motion.div>
  );
} 