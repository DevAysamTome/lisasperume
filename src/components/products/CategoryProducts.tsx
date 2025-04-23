import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRef } from 'react';

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

interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  imageUrl: string;
  order: number;
}

interface CategoryProductsProps {
  category: Category;
  products: Product[];
}

export default function CategoryProducts({ category, products }: CategoryProductsProps) {
  const { language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryProducts = products?.filter(product => product.categoryId === category.id).slice(0, 8) || [];

  const content = {
    en: {
      viewAll: 'VIEW ALL',
      shopNow: 'Shop Now',
      noProducts: 'No products available in this category'
    },
    ar: {
      viewAll: 'عرض الكل',
      shopNow: 'تسوق الآن',
      noProducts: 'لا توجد منتجات متاحة في هذه الفئة'
    }
  };

  if (!products || categoryProducts.length === 0) {
    return (
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {category.name[language]}
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">
              {content[language].noProducts}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {category.name[language]}
          </h2>
          <Link 
            href={`/categories/${category.id}`}
            className="text-amber-500 hover:text-amber-600 font-medium"
          >
            {content[language].viewAll}
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
              bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryProducts.map((product) => (
              <div key={product.id} className="flex-none w-[250px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
              bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
} 