'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AboutContent {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  image: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AboutPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent({
          title_en: data.about?.title_en || '',
          title_ar: data.about?.title_ar || '',
          content_en: data.about?.content_en || '',
          content_ar: data.about?.content_ar || '',
          image: data.about?.image || '',
        });
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white text-center"
          >
            {language === 'en' ? content?.title_en : content?.title_ar}
          </motion.h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-black-600 leading-relaxed">
                {language === 'en' ? content?.content_en : content?.content_ar}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
          >
            {content?.image && (
              <Image
                src={content.image}
                alt={language === 'en' ? content.title_en : content.title_ar}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mt-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold text-black text-center mb-12"
          >
            {language === 'en' ? 'Our Values' : 'قيمنا'}
          </motion.h2>

          <div className="grid grid-cols-1 text-black md:grid-cols-3 gap-8">
            {[
              {
                title_en: 'Quality',
                title_ar: 'الجودة',
                description_en: 'We are committed to providing the highest quality products and services.',
                description_ar: 'نحن ملتزمون بتقديم أعلى جودة من المنتجات والخدمات.',
                icon: (
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title_en: 'Innovation',
                title_ar: 'الابتكار',
                description_en: 'We constantly innovate to bring you the latest trends and technologies.',
                description_ar: 'نحن نبتكر باستمرار لنقدم لك أحدث الاتجاهات والتقنيات.',
                icon: (
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title_en: 'Customer Satisfaction',
                title_ar: 'رضا العملاء',
                description_en: 'Your satisfaction is our top priority and we strive to exceed your expectations.',
                description_ar: 'رضاك هو أولويتنا القصوى ونسعى جاهدين لتجاوز توقعاتك.',
                icon: (
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="bg-white p-8 text-black rounded-lg shadow-lg text-center"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'en' ? value.title_en : value.title_ar}
                </h3>
                <p className="text-black-600">
                  {language === 'en' ? value.description_en : value.description_ar}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 