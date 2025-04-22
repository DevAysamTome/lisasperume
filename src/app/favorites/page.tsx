'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import { Loader2, Heart, AlertCircle } from 'lucide-react';
import { Product } from '@/types';
import Image from 'next/image';

export default function FavoritesPage() {
  const { language } = useLanguage();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get favorite product IDs from localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
        
        if (favorites.length === 0) {
          setFavoriteProducts([]);
          return;
        }

        // Fetch products from Firebase
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where('__name__', 'in', favorites));
        const productsSnapshot = await getDocs(productsQuery);
        
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setFavoriteProducts(productsData);

      } catch (err) {
        console.error('Error fetching favorite products:', err);
        setError(language === 'en' ? 'Failed to load favorite products' : 'فشل في تحميل المنتجات المفضلة');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [language]);

  const removeFromFavorites = (productId: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
    const updatedFavorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-gray-600">
            {language === 'en' ? 'Loading favorites...' : 'جاري تحميل المفضلة...'}
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="relative h-64 bg-amber-50">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/20 to-amber-100/60" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-amber-600" fill="currentColor" />
            <h1 className="text-4xl font-bold text-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {language === 'en' ? 'My Favorites' : 'المفضلة'}
            </h1>
          </div>
          <p className="mt-4 text-gray-600 max-w-2xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {language === 'en' 
              ? 'Your favorite products are saved here. They will be available even after you close the browser.' 
              : 'منتجاتك المفضلة محفوظة هنا. ستكون متاحة حتى بعد إغلاق المتصفح.'}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {language === 'en' ? 'Favorite Products' : 'المنتجات المفضلة'}
          </h2>
          <p className="text-gray-600" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {favoriteProducts.length} {language === 'en' ? 'items' : 'منتج'}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'No favorite products yet' : 'لا توجد منتجات مفضلة بعد'}
            </h3>
            <p className="mt-2 text-gray-600">
              {language === 'en' 
                ? 'Start adding products to your favorites by clicking the heart icon' 
                : 'ابدأ بإضافة المنتجات إلى المفضلة بالنقر على أيقونة القلب'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className="w-5 h-5 text-amber-600" fill="currentColor" />
                </button>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 