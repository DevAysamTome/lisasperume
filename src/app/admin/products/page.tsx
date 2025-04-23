'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductSize {
  size: string;
  price: number;
  stock: number;
}

interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
}

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
  categoryId: string;
  imageUrl: string;
  sizes: ProductSize[];
  order: number;
  isFeatured: boolean;
  soldCount: number;
}

const defaultSizes = [
  { size: '30ml', price: 0, stock: 0 },
  { size: '50ml', price: 0, stock: 0 },
  { size: '100ml', price: 0, stock: 0 },
];

export default function ProductsPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    categoryId: "",
    imageUrl: "",
    sizes: [{ size: "", price: 0, stock: 0 }],
    order: 0,
    isFeatured: false,
    soldCount: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = newProduct.imageUrl;
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const productData = {
        ...newProduct,
        imageUrl,
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }

      setNewProduct({
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        categoryId: "",
        imageUrl: "",
        sizes: [{ size: "", price: 0, stock: 0 }],
        order: 0,
        isFeatured: false,
        soldCount: 0
      });
      setEditingProduct(null);
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const addSize = () => {
    setNewProduct({
      ...newProduct,
      sizes: [...newProduct.sizes, { size: "", price: 0, stock: 0 }],
    });
  };

  const removeSize = (index: number) => {
    setNewProduct({
      ...newProduct,
      sizes: newProduct.sizes.filter((_, i) => i !== index),
    });
  };

  const updateSize = (index: number, field: string, value: string | number) => {
    const updatedSizes = [...newProduct.sizes];
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: value,
    };
    setNewProduct({
      ...newProduct,
      sizes: updatedSizes,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      sizes: product.sizes,
      order: product.order,
      isFeatured: product.isFeatured,
      soldCount: product.soldCount,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    setNewProduct({
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      categoryId: "",
      imageUrl: "",
      sizes: [{ size: "", price: 0, stock: 0 }],
      order: 0,
      isFeatured: false,
      soldCount: 0
    });
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          {language === "en" ? "Products Management" : "إدارة المنتجات"}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-2 border-2 border-indigo-500"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <svg
              className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-semibold tracking-wide">
              {language === "en" ? "Add Product" : "إضافة منتج"}
            </span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl  font-semibold text-black">
              {editingProduct
                ? language === "en"
                  ? "Edit Product"
                  : "تعديل المنتج"
                : language === "en"
                ? "Add New Product"
                : "إضافة منتج جديد"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en" ? "Name (English)" : "الاسم (بالإنجليزية)"}
                  </label>
                  <input
                    type="text"
                    value={newProduct.name.en}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: { ...newProduct.name, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en" ? "Name (Arabic)" : "الاسم (بالعربية)"}
                  </label>
                  <input
                    type="text"
                    value={newProduct.name.ar}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: { ...newProduct.name, ar: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en" ? "Category" : "التصنيف"}
                  </label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    required
                  >
                    <option value="" className='text-black'>
                      {language === "en" ? "Select Category" : "اختر التصنيف"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en"
                      ? "Description (English)"
                      : "الوصف (بالإنجليزية)"}
                  </label>
                  <textarea
                    value={newProduct.description.en}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: {
                          ...newProduct.description,
                          en: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en"
                      ? "Description (Arabic)"
                      : "الوصف (بالعربية)"}
                  </label>
                  <textarea
                    value={newProduct.description.ar}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: {
                          ...newProduct.description,
                          ar: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Product Image" : "صورة المنتج"}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProduct({
                              ...newProduct,
                              imageUrl: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      required={!editingProduct}
                    />
                  </div>
                  {newProduct.imageUrl && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={newProduct.imageUrl}
                        alt="Product preview"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Sizes" : "المقاسات"}
                </label>
                <div className="space-y-3">
                  {newProduct.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <input
                        type="text"
                        placeholder={language === "en" ? "Size" : "المقاس"}
                        value={size.size}
                        onChange={(e) => updateSize(index, "size", e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                      />
                      <input
                        type="number"
                        placeholder={language === "en" ? "Price" : "السعر"}
                        value={size.price}
                        onChange={(e) =>
                          updateSize(index, "price", parseFloat(e.target.value))
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                        min="0"
                        step="0.01"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder={language === "en" ? "Stock" : "المخزون"}
                          value={size.stock}
                          onChange={(e) =>
                            updateSize(index, "stock", parseInt(e.target.value))
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          required
                          min="0"
                        />
                        {newProduct.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="text-red-600 hover:text-red-800 p-2"
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
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSize}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>
                      {language === "en" ? "Add Size" : "إضافة مقاس"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en" ? "Featured Product" : "منتج مميز"}
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProduct.isFeatured}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {language === "en"
                        ? "Display this product in featured section"
                        : "عرض هذا المنتج في قسم المميز"}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "en" ? "Sold Count" : "عدد المبيعات"}
                  </label>
                  <input
                    type="number"
                    value={newProduct.soldCount}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        soldCount: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Order" : "الترتيب"}
                </label>
                <input
                  type="number"
                  value={newProduct.order}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
              >
                {uploading && (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <span className="text-black  hover:bg-gray-200 transition-colors duration-200 bg-amber-500 rounded-lg px-2 py-1 ">
                  {uploading
                    ? language === "en"
                      ? "Uploading..."
                      : "جاري الرفع..."
                    : editingProduct
                    ? language === "en"
                      ? "Update Product"
                      : "تحديث المنتج"
                    : language === "en"
                    ? "Add Product"
                    : "إضافة منتج"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Image" : "الصورة"}
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Name" : "الاسم"}
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Category" : "التصنيف"}
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Sizes" : "المقاسات"}
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Featured" : "مميز"}
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Sold" : "المبيعات"}
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "en" ? "Actions" : "الإجراءات"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={product.imageUrl}
                            alt={product.name[language]}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name[language]}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.categoryId && categories.find((c) => c.id === product.categoryId)?.name[language]}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.categoryId && categories.find((c) => c.id === product.categoryId)?.name[language]}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size) => (
                            <span
                              key={size.size}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {size.size}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isFeatured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isFeatured ? (
                            language === "en" ? "Featured" : "مميز"
                          ) : (
                            language === "en" ? "Not Featured" : "غير مميز"
                          )}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.soldCount || 0}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {language === "en" ? "Edit" : "تعديل"}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {language === "en" ? "Delete" : "حذف"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 