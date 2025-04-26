'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from '@/components/SearchBar';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const content = {
  en: {
    menu: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      about: 'About',
      contact: 'Contact',
    },
    actions: {
      cart: 'Cart',
      search: 'Search',
      menu: 'Menu',
    },
  },
  ar: {
    menu: {
      home: 'الرئيسية',
      products: 'المنتجات',
      categories: 'الفئات',
      about: 'عن المتجر',
      contact: 'اتصل بنا',
    },
    actions: {
      cart: 'السلة',
      search: 'بحث',
      menu: 'القائمة',
    },
  },
};

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    // Get favorite count from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteCount(favorites.length);

    // Listen for changes in favorites
    const handleStorageChange = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(updatedFavorites.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-amber-600">
              {language === 'en' ? 'Lisa Perfume' : 'Lisa Perfume 48'}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              {content[language].menu.home}
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              {content[language].menu.products}
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              {content[language].menu.categories}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              {content[language].menu.about}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              {content[language].menu.contact}
            </Link>
            <Link href="/favorites" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              {language === 'en' ? 'Favorites' : 'المفضلة'}
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar />
            <button
              onClick={toggleLanguage}
              className="group relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300"
            >
              <div className="relative w-6 h-6 overflow-hidden rounded-full">
                <div className={`absolute inset-0 transition-transform duration-300 ${language === 'en' ? 'translate-x-0' : '-translate-x-full'}`}>
                  <img src="/flags/gb.svg" alt="English" className="w-6 h-6 rounded-full" />
                </div>
                <div className={`absolute inset-0 transition-transform duration-300 ${language === 'ar' ? 'translate-x-0' : 'translate-x-full'}`}>
                  <img src="/flags/sa.svg" alt="Arabic" className="w-6 h-6 rounded-full" />
                </div>
              </div>

              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full" />
            </button>
            <Link href="/favorites" className="relative">
              <Heart className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <FaShoppingBag className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/favorites" className="relative">
              <Heart className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <FaShoppingBag className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg z-50"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {content[language].menu.home}
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {content[language].menu.products}
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {content[language].menu.categories}
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {content[language].menu.about}
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {content[language].menu.contact}
              </Link>
              <Link
                href="/favorites"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {language === 'en' ? 'Favorites' : 'المفضلة'}
              </Link>
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={toggleLanguage}
                  className="group flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="relative w-6 h-6 overflow-hidden rounded-full">
                    <div className={`absolute inset-0 transition-transform duration-300 ${language === 'en' ? 'translate-x-0' : '-translate-x-full'}`}>
                      <img src="/flags/gb.svg" alt="English" className="w-6 h-6 rounded-full" />
                    </div>
                    <div className={`absolute inset-0 transition-transform duration-300 ${language === 'ar' ? 'translate-x-0' : 'translate-x-full'}`}>
                      <img src="/flags/sa.svg" alt="Arabic" className="w-6 h-6 rounded-full" />
                    </div>
                  </div>
                  <span className="transition-all duration-300 group-hover:scale-105">
                    {language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 