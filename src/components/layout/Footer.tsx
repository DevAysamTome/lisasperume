'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Settings {
  storeName_en: string;
  storeName_ar: string;
  storeDescription_en: string;
  storeDescription_ar: string;
  contactEmail: string;
  contactPhone: string;
  address_en: string;
  address_ar: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export default function Footer() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className={`col-span-2 sm:col-span-2 lg:col-span-1 text-center ${language === 'ar' ? 'sm:text-right' : 'sm:text-left'} space-y-2 sm:space-y-3`}>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold">
              {language === 'ar' ? settings?.storeName_ar : settings?.storeName_en}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {language === 'en' ? settings?.storeDescription_en : settings?.storeDescription_ar}
            </p>
          </div>

          {/* Quick Links */}
          <div className={`text-center ${language === 'ar' ? 'sm:text-right' : 'sm:text-left'} space-y-2 sm:space-y-3`}>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold">
              {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm inline-block">
                  {language === 'en' ? 'Home' : 'الرئيسية'}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm inline-block">
                  {language === 'en' ? 'Products' : 'المنتجات'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm inline-block">
                  {language === 'en' ? 'About' : 'من نحن'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm inline-block">
                  {language === 'en' ? 'Contact' : 'اتصل بنا'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`text-center ${language === 'ar' ? 'sm:text-right' : 'sm:text-left'} space-y-2 sm:space-y-3`}>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold">
              {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
            </h3>
            <ul className="space-y-1.5">
              <li className="text-gray-400 text-xs sm:text-sm ">
                {language === 'en' ? settings?.address_en : settings?.address_ar}
              </li>
              <li className="text-gray-400 text-xs sm:text-sm ">
                {settings?.contactPhone}
              </li>
              <li className="text-gray-400 text-xs sm:text-sm">
                {settings?.contactEmail}
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className={`text-center align-middle ${language === 'ar' ? 'sm:text-center' : 'sm:text-center'} space-y-2 sm:space-y-3`}>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold">
              {language === 'en' ? 'Follow Us' : 'تابعنا'}
            </h3>
            <div className={`flex justify-center align-middle ${language === 'ar' ? 'sm:justify-end space-x-reverse' : 'sm:justify-start space-x-3'} sm:space-x-4`}>
              {settings?.socialMedia.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {settings?.socialMedia.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              )}
              {settings?.socialMedia.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800 text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} {language === 'ar' ? settings?.storeName_ar : settings?.storeName_en}.{' '}
            {language === 'en' ? 'All rights reserved to TechnoCore , LLC.' : 'جميع الحقوق محفوظة لدى شركة تكنو كور'}
          </p>
        </div>
      </div>
    </footer>
  );
} 