/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import Image from 'next/image'
import { useState, useEffect, use } from 'react'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface Product {
  id: string
  name: {
    en: string
    ar: string
  }
  price: number
  description: {
    en: string
    ar: string
  }
  images: string[]
  category: string
  sizes: {
    size: number
    stock: number
    price?: number
  }[]
  specifications?: {
    material: string
    sole: string
    closure: string
  }
  reviews?: {
    rating: number
    count: number
  }
  imageUrl?: string
}

const DEFAULT_IMAGE = '/images/placeholder.jpg'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { addItem } = useCart()
  const { language } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('description')
  const selectedSizeData = selectedSize ? product?.sizes.find(s => s.size === selectedSize) : null

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const productRef = doc(db, 'products', resolvedParams.id)
      const productSnap = await getDoc(productRef)

      if (productSnap.exists()) {
        const data = productSnap.data()
        // Convert single image to array or use existing images array
        const images = Array.isArray(data.images) 
          ? data.images 
          : data.imageUrl 
            ? [data.imageUrl]
            : [DEFAULT_IMAGE]

        setProduct({ 
          id: productSnap.id, 
          ...data,
          images,
          imageUrl: images[0]
        } as Product)
      } else {
        toast.error(language === 'en' ? 'Product not found' : 'المنتج غير موجود')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error(language === 'en' ? 'Error loading product' : 'حدث خطأ أثناء تحميل المنتج')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) {
      console.error('No product available');
      return;
    }

    if (!selectedSize) {
      toast.error(language === 'en' ? 'Please select a size' : 'الرجاء اختيار المقاس');
      return;
    }

    if (!selectedSizeData || selectedSizeData.stock === 0) {
      toast.error(language === 'en' ? 'Sorry, this size is out of stock' : 'عذراً، هذا المقاس غير متوفر حالياً');
      return;
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: selectedSizeData.price || product.price,
        image: product.images[0] || product.imageUrl || DEFAULT_IMAGE,
        size: selectedSize,
        quantity: 1,
      };

      addItem(cartItem);
      toast.success(language === 'en' ? 'Product added to cart' : 'تمت إضافة المنتج إلى السلة');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(language === 'en' ? 'Error adding to cart' : 'حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4 font-arabic">{language === 'en' ? 'Product not found' : 'المنتج غير موجود'}</h2>
          <p className="text-secondary-600 font-arabic">{language === 'en' ? 'Sorry, the product you are looking for is not available.' : 'عذراً، المنتج الذي تبحث عنه غير متوفر حالياً.'}</p>
        </div>
      </div>
    )
  }

  const currentImage = product.images[selectedImage] || DEFAULT_IMAGE

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-amber-50">
          {/* Image Gallery */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-amber-100">
              <Image
                src={currentImage}
                alt={product.name[language as keyof typeof product.name]}
                fill
                className="object-contain transition-all duration-300 hover:scale-105"
                priority
              />
              {selectedSizeData?.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-amber-100 text-xl font-bold font-arabic">{language === 'en' ? 'Out of stock' : 'غير متوفر'}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-amber-100 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'ring-2 ring-amber-600 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-amber-400 hover:ring-offset-1'
                  }`}
                >
                  <Image
                    src={image || DEFAULT_IMAGE}
                    alt={`${product.name[language as keyof typeof product.name]} ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6 sm:space-y-8 bg-amber-50">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-sm text-amber-800">
                <span className="font-mono">{product.id}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-arabic tracking-tight text-amber-900">
                {product.name[language as keyof typeof product.name]}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl sm:text-3xl font-semibold text-amber-800 font-arabic">
                  ${selectedSizeData?.price || product.price}
                </span>
                {selectedSizeData?.price !== product.price && (
                  <span className="text-lg sm:text-xl text-amber-400 line-through font-arabic">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-amber max-w-none">
              <p className="text-base sm:text-lg text-amber-800 font-arabic leading-relaxed">
                {product.description[language as keyof typeof product.description]}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-arabic text-amber-900">
                  {language === 'en' ? 'Select size' : 'اختر المقاس'}
                </h3>
                {selectedSize && selectedSizeData && (
                  <span className="text-sm text-amber-600 font-arabic">
                    {language === 'en' ? 'Stock: ' : 'المخزون: '}
                    {selectedSizeData.stock}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.sizes.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                    className={`
                      px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200
                      ${selectedSize === sizeObj.size
                        ? 'bg-amber-600 text-amber-50 ring-2 ring-amber-600 ring-offset-2'
                        : sizeObj.stock === 0
                          ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }
                    `}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSizeData?.stock === 0}
              className="w-full bg-amber-600 text-amber-50 py-3 sm:py-4 px-6 rounded-xl font-semibold
                transition-all duration-200 hover:bg-amber-700 disabled:bg-amber-200 
                disabled:text-amber-400 disabled:cursor-not-allowed shadow-lg shadow-amber-600/20
                hover:shadow-xl hover:shadow-amber-600/30 active:scale-[0.98]"
            >
              {selectedSizeData?.stock === 0
                ? language === 'en'
                  ? 'Out of Stock'
                  : 'غير متوفر'
                : language === 'en'
                  ? 'Add to Cart'
                  : 'أضف إلى السلة'}
            </button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 sm:mt-16 bg-amber-50">
          <div className="border-b border-amber-200 overflow-x-auto">
            <nav className="flex gap-4 sm:gap-8 min-w-max">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 sm:py-4 px-2 border-b-2 font-arabic transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-amber-600 text-amber-800'
                      : 'border-transparent text-amber-600 hover:text-amber-700 hover:border-amber-300'
                  }`}
                >
                  {language === 'en' 
                    ? tab.charAt(0).toUpperCase() + tab.slice(1)
                    : tab === 'description' 
                      ? 'الوصف'
                      : tab === 'specifications'
                        ? 'المواصفات'
                        : 'التقييمات'
                  }
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === 'description' && (
              <div className="prose prose-amber prose-lg max-w-none">
                <p className="text-amber-800 font-arabic leading-relaxed">
                  {product.description[language as keyof typeof product.description]}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {[
                  { key: 'material', label: language === 'en' ? 'Material' : 'المادة' },
                  { key: 'sole', label: language === 'en' ? 'Sole' : 'النعل' },
                  { key: 'closure', label: language === 'en' ? 'Closure' : 'الإغلاق' }
                ].map(({ key, label }) => (
                  <div key={key} className="bg-amber-100 p-4 sm:p-6 rounded-xl">
                    <h4 className="text-lg font-semibold mb-2 font-arabic text-amber-900">{label}</h4>
                    <p className="text-amber-800 font-arabic">
                      {product.specifications && product.specifications[key as keyof typeof product.specifications]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && product.reviews && (
              <div className="bg-amber-100 p-4 sm:p-8 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 sm:w-6 h-5 sm:h-6 ${
                          i < (product.reviews?.rating || 0)
                            ? 'text-amber-500'
                            : 'text-amber-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-base sm:text-lg text-amber-800 font-arabic">
                    {product.reviews?.rating.toFixed(1)} ({product.reviews?.count} {language === 'en' ? 'reviews' : 'تقييم'})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 