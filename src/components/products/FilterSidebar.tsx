'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/types';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterSidebarProps) {
  const { language } = useLanguage();

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseFloat(e.target.value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = newValue;
    onPriceRangeChange(newRange);
  };

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg  text-amber-900 font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {language === 'en' ? 'Filters' : 'التصفية'}
      </h2>

      {/* Categories Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {language === 'en' ? 'Categories' : 'الفئات'}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selectedCategory === 'all'
                ? 'bg-amber-100 text-amber-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {language === 'en' ? 'All Categories' : 'جميع الفئات'}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedCategory === category.id
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {category.name[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {language === 'en' ? 'Price Range' : 'نطاق السعر'}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(e, 0)}
              className="w-24 px-2 py-1 border rounded-md text-sm"
              dir="ltr"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min="0"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(e, 1)}
              className="w-24 px-2 py-1 border rounded-md text-sm"
              dir="ltr"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{language === 'en' ? 'Min' : 'الحد الأدنى'}</span>
            <span>{language === 'en' ? 'Max' : 'الحد الأقصى'}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 