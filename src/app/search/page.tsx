'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { useDebounce } from '@/hooks/useDebounce';

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

// Helper function to normalize Arabic text (remove diacritics and special characters)
const normalizeArabic = (text: string) => {
  return text
    .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics
    .replace(/[إأآا]/g, 'ا') // Normalize Alef variations
    .replace(/ى/g, 'ي') // Normalize Ya variations
    .replace(/ة/g, 'ه') // Normalize Ta variations
    .toLowerCase();
};

// Helper function to normalize English text
const normalizeEnglish = (text: string) => {
  return text.toLowerCase();
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('q');
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery || '');
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedSearch) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const results: Product[] = [];
        
        const searchTerm = language === 'ar' 
          ? normalizeArabic(debouncedSearch)
          : normalizeEnglish(debouncedSearch);
        
        querySnapshot.forEach((doc) => {
          const product = doc.data() as Product;
          const name = language === 'ar' 
            ? normalizeArabic(product.name['ar'])
            : normalizeEnglish(product.name['en']);
            
          const description = language === 'ar'
            ? normalizeArabic(product.description['ar'])
            : normalizeEnglish(product.description['en']);
          
          const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
          const matches = searchWords.every(word => 
            name.includes(word) || description.includes(word)
          );
          
          if (matches) {
            results.push({ ...product, id: doc.id });
          }
        });

        results.sort((a, b) => {
          const aName = language === 'ar' ? a.name['ar'] : a.name['en'];
          const bName = language === 'ar' ? b.name['ar'] : b.name['en'];
          const aExactMatch = aName.toLowerCase() === debouncedSearch.toLowerCase();
          const bExactMatch = bName.toLowerCase() === debouncedSearch.toLowerCase();
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          return 0;
        });

        setProducts(results);
        
        // Generate suggestions from product names
        const uniqueNames = new Set<string>();
        results.forEach(product => {
          const name = language === 'ar' ? product.name['ar'] : product.name['en'];
          uniqueNames.add(name);
        });
        setSuggestions(Array.from(uniqueNames).slice(0, 5));
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearch, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={language === 'en' ? 'Search products...' : 'ابحث عن المنتجات...'}
                className="w-full pl-12 pr-10 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                style={{ 
                  backgroundColor: 'white',
                  cursor: 'text',
                  direction: language === 'ar' ? 'rtl' : 'ltr'
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setShowSuggestions(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <ul className="py-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FiLoader className="h-8 w-8 text-amber-600 animate-spin" />
            <p className="mt-4 text-gray-600">
              {language === 'en' ? 'Searching products...' : 'جاري البحث عن المنتجات...'}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'en' 
                ? 'No products found' 
                : 'لم يتم العثور على منتجات'}
            </h2>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Try adjusting your search or browse our products' 
                : 'حاول تعديل البحث أو تصفح منتجاتنا'}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {language === 'en' 
                ? `Found ${products.length} products` 
                : `تم العثور على ${products.length} منتج`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-48">
                      <Image
                        src={product.imageUrl || product.images?.[0] || ''}
                        alt={language === 'en' ? product.name['en'] : product.name['ar']}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg text-center text-gray-900 font-semibold mb-2 line-clamp-2">
                        {language === 'en' ? product.name['en'] : product.name['ar']}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {language === 'en' ? product.description['en'] : product.description['ar']}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-amber-600 font-bold">
                          {product.sizes[0].price}
                        </p>
                        {product.sizes[0].stock > 0 ? (
                          <span className="text-xs text-green-600">
                            {language === 'en' ? 'In Stock' : 'متوفر'}
                          </span>
                        ) : (
                          <span className="text-xs text-red-600">
                            {language === 'en' ? 'Out of Stock' : 'غير متوفر'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
} 