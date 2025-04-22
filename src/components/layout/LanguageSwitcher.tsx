'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      switchTo: 'عربي',
      current: 'English',
      flag: '🇺🇸',
    },
    ar: {
      switchTo: 'English',
      current: 'عربي',
      flag: '🇸🇦',
    },
  };

  const t = content[language];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl"
      >
        {t.flag}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="font-medium"
      >
        {t.switchTo}
      </motion.span>
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
      />
    </motion.button>
  );
} 