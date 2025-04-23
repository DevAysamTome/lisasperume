'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/products/CategoryCard';
import BestSellers from '@/components/products/BestSellers';
import ProductCard from '@/components/products/ProductCard';

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
}

interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  imageUrl: string;
}

interface Settings {
  hero: {
    title_en: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    image: string;
    buttonText_en: string;
    buttonText_ar: string;
  };
}

export default function Home() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as Settings);
      }

      // Fetch products
      const productsRef = collection(db, 'products');
      const productsQuery = query(productsRef, orderBy('order', 'asc'));
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Product data:', data); // Debug log
        return {
          id: doc.id,
          name: data.name || { en: '', ar: '' },
          description: data.description || { en: '', ar: '' },
          imageUrl: data.imageUrl || '',
          images: data.images || [],
          categoryId: data.categoryId || '',
          sizes: data.sizes || []
        };
      }) as Product[];
      console.log('Processed products:', productsData); // Debug log
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const content = {
    en: {
      hero: {
        title: 'Discover Your Signature Scent',
        subtitle: 'Luxury Fragrances for Every Occasion',
        cta: 'Shop Now',
        imageUrl: '/images/hero.jpg'
      },
      categories: {
        title: 'Our Collections',
        viewAll: 'View All Collections',
      },
      featured: {
        title: 'Featured Products',
        viewAll: 'View All Products',
      },
    },
    ar: {
      hero: {
        title: 'اكتشف عطرك المميز',
        subtitle: 'عطور فاخرة لكل مناسبة',
        cta: 'تسوق الآن',
        imageUrl: '/images/hero.jpg'
      },
      categories: {
        title: 'مجموعاتنا',
        viewAll: 'عرض جميع المجموعات',
      },
      featured: {
        title: 'المنتجات المميزة',
        viewAll: 'عرض جميع المنتجات',
      },
    },
  };

  const t = content[language];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh]">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image
          src={settings?.hero?.image || '/images/hero.jpg'}
          alt="Luxury Perfumes"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl  mb-6 tracking-wide" 
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {settings?.hero?.[`title_${language}`] || t.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-light mb-12 max-w-2xl" 
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {settings?.hero?.[`subtitle_${language}`] || t.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/products"
              className="group relative px-8 py-4 bg-transparent text-white border-2 border-white rounded-none overflow-hidden transition-all duration-300 hover:bg-white hover:text-black"
            >
              <span className="relative z-10 font-medium tracking-wide">{t.hero.cta}</span>
            </Link>
          </motion.div>
        </div>
      </section>
     {/* Categories Section */}
     <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 sm:mb-8 lg:mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900" 
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.categories.title}
            </motion.h2>
            <Link
              href="/categories"
              className="text-sm sm:text-base text-gray-700 hover:text-amber-600 font-medium transition-colors"
            >
              {t.categories.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  language={language}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <BestSellers products={products} />

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900" 
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.featured.title}
            </motion.h2>
            <Link
              href="/products"
              className="text-sm sm:text-base text-amber-500 hover:text-amber-600 font-medium transition-colors"
            >
              {t.featured.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
