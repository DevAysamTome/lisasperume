'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SearchBar from '@/components/common/SearchBar';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductCard from '@/components/products/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

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
  price: number;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  description?: {
    en: string;
    ar: string;
  };
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductsPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products
      const productsRef = collection(db, 'products');
      const productsSnapshot = await getDocs(productsRef);
      const productsData = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: {
            en: data.name?.en || '',
            ar: data.name?.ar || ''
          },
          description: {
            en: data.description?.en || '',
            ar: data.description?.ar || ''
          },
          price: data.sizes[0].price,
          categoryId: data.categoryId,
          images: data.images || data.imageUrl ? [data.imageUrl] : [],
          stock: data.sizes[0].stock,
          featured: data.featured || false,
          sizes: data.sizes || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Product;
      });
      setProducts(productsData);

      // Fetch categories
      const categoriesRef = collection(db, 'categories');
      const categoriesQuery = query(categoriesRef, orderBy('order', 'asc'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(language === 'en' ? 'Failed to load data' : 'فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        product.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description[language].toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if any size's price falls within the range
      const matchesPrice = product.sizes.some(size => 
        size.price >= priceRange[0] && size.price <= priceRange[1]
      );

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, selectedCategory, searchQuery, language, priceRange]);

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
            onClick={fetchData}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {language === 'en' ? 'Try Again' : 'حاول مرة أخرى'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
          
          <div className="flex-1">
            <div className="mb-8">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={language === 'en' ? 'Search products...' : 'ابحث عن المنتجات...'}
              />
            </div>

            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {language === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {language === 'en' ? 'Try adjusting your search or filter' : 'حاول تعديل البحث أو التصفية'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="products-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 