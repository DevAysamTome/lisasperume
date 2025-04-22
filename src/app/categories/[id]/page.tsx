'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ChevronRight, Home } from 'lucide-react';
import { Product, Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryProductsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category
        const categoryRef = doc(db, 'categories', id as string);
        const categoryDoc = await getDoc(categoryRef);
        
        if (!categoryDoc.exists()) {
          throw new Error('Category not found');
        }

        const categoryData = {
          id: categoryDoc.id,
          ...categoryDoc.data()
        } as Category;
        setCategory(categoryData);

        // Fetch products for this category
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where('categoryId', '==', id));
        const productsSnapshot = await getDocs(productsQuery);
        
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(language === 'en' ? 'Failed to load category products' : 'فشل في تحميل منتجات الفئة');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-gray-600">
            {language === 'en' ? 'Loading products...' : 'جاري تحميل المنتجات...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {language === 'en' ? 'Go to Home' : 'الذهاب إلى الصفحة الرئيسية'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Category Header */}
      <div className="relative h-64 bg-gray-100">
        {category?.image && (
          <Image
            src={category.image}
            alt={category.name[language]}
            fill
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white/80 mb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Link href="/" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-white transition-colors">
              {language === 'en' ? 'Categories' : 'الفئات'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category?.name[language]}</span>
          </div>
          <h1 className="text-4xl font-bold text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {category?.name[language]}
          </h1>
          {category?.description && (
            <p className="mt-4 text-white/90 max-w-2xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {category.description[language]}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {language === 'en' ? 'Products' : 'المنتجات'}
          </h2>
          <p className="text-gray-600" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {products.length} {language === 'en' ? 'items' : 'منتج'}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'No products found in this category' : 'لم يتم العثور على منتجات في هذه الفئة'}
            </h3>
            <p className="mt-2 text-gray-600">
              {language === 'en' ? 'Check back later for new products' : 'تحقق لاحقًا للحصول على منتجات جديدة'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 