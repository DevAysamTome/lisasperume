'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SuccessPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center py-16 bg-amber-100 rounded-2xl">
          <div className="flex justify-center mb-6">
            <FiCheckCircle className="text-amber-600" size={64} />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-amber-900 font-arabic">
            {language === 'en' ? 'Order Placed Successfully!' : 'تم تقديم الطلب بنجاح!'}
          </h1>
          <p className="text-amber-700 mb-8 font-arabic">
            {language === 'en' 
              ? 'Thank you for your purchase. We will process your order and send you a confirmation email shortly.'
              : 'شكراً لشرائك. سنقوم بمعالجة طلبك وإرسال بريد إلكتروني للتأكيد قريباً.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-block bg-amber-600 text-amber-50 px-8 py-3 rounded-xl
                font-semibold transition-all duration-200 hover:bg-amber-700
                shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30"
            >
              {language === 'en' ? 'Continue Shopping' : 'مواصلة التسوق'}
            </Link>
            <Link 
              href="/orders"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-xl
                font-semibold transition-all duration-200 hover:bg-amber-50
                shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30"
            >
              {language === 'en' ? 'View Orders' : 'عرض الطلبات'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 