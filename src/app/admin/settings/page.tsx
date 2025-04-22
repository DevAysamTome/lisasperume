'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
  shipping: {
    freeShippingThreshold: number;
    shippingCost: number;
  };
  currency: string;
  taxRate: number;
  maintenanceMode: boolean;
  hero: {
    title_en: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    image: string;
    buttonText_en: string;
    buttonText_ar: string;
  };
  about: {
    title_en: string;
    title_ar: string;
    content_en: string;
    content_ar: string;
    image: string;
  };
}

export default function SettingsPage() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Settings>({
    storeName_en: '',
    storeName_ar: '',
    storeDescription_en: '',
    storeDescription_ar: '',
    contactEmail: '',
    contactPhone: '',
    address_en: '',
    address_ar: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
    shipping: {
      freeShippingThreshold: 0,
      shippingCost: 0,
    },
    currency: 'AED',
    taxRate: 5,
    maintenanceMode: false,
    hero: {
      title_en: '',
      title_ar: '',
      subtitle_en: '',
      subtitle_ar: '',
      image: '',
      buttonText_en: '',
      buttonText_ar: '',
    },
    about: {
      title_en: '',
      title_ar: '',
      content_en: '',
      content_ar: '',
      image: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, settings as Record<string, any>, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'hero' | 'about') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `settings/${field}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setSettings(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          image: downloadURL
        }
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Settings' : 'الإعدادات'}
        </h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Store Information' : 'معلومات المتجر'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Store Name (English)' : 'اسم المتجر (بالإنجليزية)'}
                </label>
                <input
                  type="text"
                  value={settings.storeName_en}
                  onChange={(e) => setSettings({ ...settings, storeName_en: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Store Name (Arabic)' : 'اسم المتجر (بالعربية)'}
                </label>
                <input
                  type="text"
                  value={settings.storeName_ar}
                  onChange={(e) => setSettings({ ...settings, storeName_ar: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Description (English)' : 'الوصف (بالإنجليزية)'}
                </label>
                <textarea
                  value={settings.storeDescription_en}
                  onChange={(e) => setSettings({ ...settings, storeDescription_en: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}
                </label>
                <textarea
                  value={settings.storeDescription_ar}
                  onChange={(e) => setSettings({ ...settings, storeDescription_ar: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Phone' : 'الهاتف'}
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Address (English)' : 'العنوان (بالإنجليزية)'}
                </label>
                <textarea
                  value={settings.address_en}
                  onChange={(e) => setSettings({ ...settings, address_en: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Address (Arabic)' : 'العنوان (بالعربية)'}
                </label>
                <textarea
                  value={settings.address_ar}
                  onChange={(e) => setSettings({ ...settings, address_ar: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Social Media' : 'وسائل التواصل الاجتماعي'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="url"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  type="url"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  type="url"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Store Settings' : 'إعدادات المتجر'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Free Shipping Threshold' : 'حد الشحن المجاني'}
                </label>
                <input
                  type="number"
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) => setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Shipping Cost' : 'تكلفة الشحن'}
                </label>
                <input
                  type="number"
                  value={settings.shipping.shippingCost}
                  onChange={(e) => setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, shippingCost: Number(e.target.value) }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Tax Rate (%)' : 'نسبة الضريبة (%)'}
                </label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                  {language === 'en' ? 'Maintenance Mode' : 'وضع الصيانة'}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {saving
              ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...')
              : (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
          </button>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg"
          >
            {language === 'en' ? 'Settings saved successfully!' : 'تم حفظ الإعدادات بنجاح!'}
          </motion.div>
        )}
      </motion.form>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Hero Section' : 'قسم البطل'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Title (English)' : 'العنوان (بالإنجليزية)'}
            </label>
            <input
              type="text"
              value={settings.hero.title_en}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, title_en: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Title (Arabic)' : 'العنوان (بالعربية)'}
            </label>
            <input
              type="text"
              value={settings.hero.title_ar}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, title_ar: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Subtitle (English)' : 'العنوان الفرعي (بالإنجليزية)'}
            </label>
            <textarea
              value={settings.hero.subtitle_en}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, subtitle_en: e.target.value }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Subtitle (Arabic)' : 'العنوان الفرعي (بالعربية)'}
            </label>
            <textarea
              value={settings.hero.subtitle_ar}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, subtitle_ar: e.target.value }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Button Text (English)' : 'نص الزر (بالإنجليزية)'}
            </label>
            <input
              type="text"
              value={settings.hero.buttonText_en}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, buttonText_en: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Button Text (Arabic)' : 'نص الزر (بالعربية)'}
            </label>
            <input
              type="text"
              value={settings.hero.buttonText_ar}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, buttonText_ar: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Hero Image' : 'صورة البطل'}
            </label>
            <div className="mt-1 flex items-center gap-4">
              {settings.hero.image && (
                <div className="relative w-32 h-32">
                  <Image
                    src={settings.hero.image}
                    alt="Hero"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'About Section' : 'قسم من نحن'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Title (English)' : 'العنوان (بالإنجليزية)'}
            </label>
            <input
              type="text"
              value={settings.about.title_en}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, title_en: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Title (Arabic)' : 'العنوان (بالعربية)'}
            </label>
            <input
              type="text"
              value={settings.about.title_ar}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, title_ar: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Content (English)' : 'المحتوى (بالإنجليزية)'}
            </label>
            <textarea
              value={settings.about.content_en}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, content_en: e.target.value }
              })}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Content (Arabic)' : 'المحتوى (بالعربية)'}
            </label>
            <textarea
              value={settings.about.content_ar}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, content_ar: e.target.value }
              })}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'About Image' : 'صورة من نحن'}
            </label>
            <div className="mt-1 flex items-center gap-4">
              {settings.about.image && (
                <div className="relative w-32 h-32">
                  <Image
                    src={settings.about.image}
                    alt="About"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'about')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 