'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  price: number;
  category: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery) return;

      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where(language === 'en' ? 'name_en' : 'name_ar', '>=', searchQuery),
          where(language === 'en' ? 'name_en' : 'name_ar', '<=', searchQuery + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        const results: Product[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as Product);
        });

        setProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [searchQuery, language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' 
          ? `Search results for "${searchQuery}"` 
          : `نتائج البحث عن "${searchQuery}"`}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600">
          {language === 'en' 
            ? 'No products found matching your search.' 
            : 'لم يتم العثور على منتجات تطابق بحثك.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={language === 'en' ? product.name_en : product.name_ar}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'en' ? product.name_en : product.name_ar}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {language === 'en' ? product.description_en : product.description_ar}
                  </p>
                  <p className="text-indigo-600 font-bold">
                    ${product.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 