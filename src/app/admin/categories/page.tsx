'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  imageUrl: string;
  order: number;
}

export default function CategoriesPage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    imageUrl: '',
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      order: category.order,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewCategory({
      name: { en: '', ar: '' },
      description: { en: '', ar: '' },
      imageUrl: '',
      order: 0,
    });
    setImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = newCategory.imageUrl;
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const categoryData = {
        ...newCategory,
        imageUrl,
      };

      if (editingCategory) {
        const categoryRef = doc(db, 'categories', editingCategory.id);
        await updateDoc(categoryRef, categoryData);
      } else {
        await addDoc(collection(db, 'categories'), categoryData);
      }

      handleCancel();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this category?' : 'هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Categories' : 'التصنيفات'}
          </h1>
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({
                name: { en: '', ar: '' },
                description: { en: '', ar: '' },
                imageUrl: '',
                order: 0,
              });
              setImageFile(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            {language === 'en' ? 'Add Category' : 'إضافة تصنيف'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCategory
                  ? language === 'en'
                    ? 'Edit Category'
                    : 'تعديل التصنيف'
                  : language === 'en'
                  ? 'Add Category'
                  : 'إضافة تصنيف'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Name (English)' : 'الاسم (بالإنجليزية)'}
                  </label>
                  <input
                    type="text"
                    value={newCategory.name.en}
                    onChange={(e) => setNewCategory({ ...newCategory, name: { ...newCategory.name, en: e.target.value } })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Name (Arabic)' : 'الاسم (بالعربية)'}
                  </label>
                  <input
                    type="text"
                    value={newCategory.name.ar}
                    onChange={(e) => setNewCategory({ ...newCategory, name: { ...newCategory.name, ar: e.target.value } })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Description (English)' : 'الوصف (بالإنجليزية)'}
                  </label>
                  <textarea
                    value={newCategory.description.en}
                    onChange={(e) => setNewCategory({ ...newCategory, description: { ...newCategory.description, en: e.target.value } })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}
                  </label>
                  <textarea
                    value={newCategory.description.ar}
                    onChange={(e) => setNewCategory({ ...newCategory, description: { ...newCategory.description, ar: e.target.value } })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Category Image' : 'صورة التصنيف'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      // Preview the image
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewCategory({
                          ...newCategory,
                          imageUrl: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required={!editingCategory}
                />
                {newCategory.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={newCategory.imageUrl}
                      alt="Category preview"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Order' : 'الترتيب'}
                </label>
                <input
                  type="number"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {uploading
                    ? language === 'en'
                      ? 'Uploading...'
                      : 'جاري الرفع...'
                    : editingCategory
                    ? language === 'en'
                      ? 'Update Category'
                      : 'تحديث التصنيف'
                    : language === 'en'
                    ? 'Save'
                    : 'حفظ'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === "en" ? "Image" : "الصورة"}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === "en" ? "Name" : "الاسم"}
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === "en" ? "Order" : "الترتيب"}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === "en" ? "Actions" : "الإجراءات"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={category.imageUrl}
                          alt={category.name[language]}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name[language]}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.order}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="group relative p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                          title={language === "en" ? "Edit" : "تعديل"}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span className="sr-only">
                            {language === "en" ? "Edit" : "تعديل"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="group relative p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50 transition-colors duration-200"
                          title={language === "en" ? "Delete" : "حذف"}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span className="sr-only">
                            {language === "en" ? "Delete" : "حذف"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 