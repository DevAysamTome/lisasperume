'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={language === 'en' ? 'Search products...' : 'ابحث عن المنتجات...'}
          className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          style={{ 
            backgroundColor: 'white',
            cursor: 'text',
            minWidth: '200px',
            zIndex: 1,
            color: 'black',
          }}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-indigo-500"
          style={{ zIndex: 2 }}
          aria-label={language === 'en' ? 'Search' : 'بحث'}
        >
          <FaSearch className="h-4 w-4" />
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            style={{ zIndex: 2 }}
            aria-label={language === 'en' ? 'Clear search' : 'مسح البحث'}
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
} 