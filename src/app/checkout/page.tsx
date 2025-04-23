'use client';

import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { saveOrder } from '@/services/firebase';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { language } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: ''
  });

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0; // Fixed shipping cost
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = {
        ...formData,
        items,
        subtotal,
        shipping,
        total
      };

      await saveOrder(order);
      clearCart();
      router.push('/success');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to place order. Please try again.' 
          : 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16 bg-amber-100 rounded-2xl">
            <h1 className="text-3xl font-bold mb-4 text-amber-900 font-arabic">
              {language === 'en' ? 'Your cart is empty' : 'سلة التسوق فارغة'}
            </h1>
            <p className="text-amber-700 mb-8 font-arabic">
              {language === 'en' 
                ? 'Add some products to your cart before checking out'
                : 'أضف بعض المنتجات إلى سلة التسوق قبل الدفع'
              }
            </p>
            <a 
              href="/"
              className="inline-block bg-amber-600 text-amber-50 px-8 py-3 rounded-xl
                font-semibold transition-all duration-200 hover:bg-amber-700
                shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30"
            >
              {language === 'en' ? 'Continue Shopping' : 'مواصلة التسوق'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 transition-colors"
        >
          <FiArrowLeft />
          <span className="font-arabic">
            {language === 'en' ? 'Back to Cart' : 'العودة إلى السلة'}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-amber-900 font-arabic">
              {language === 'en' ? 'Checkout' : 'الدفع'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                    {language === 'en' ? 'First Name' : 'الاسم الأول'}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                    {language === 'en' ? 'Last Name' : 'اسم العائلة'}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                  {language === 'en' ? 'Phone' : 'رقم الهاتف'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                  {language === 'en' ? 'Address' : 'العنوان'}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                    {language === 'en' ? 'City' : 'المدينة'}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                    {language === 'en' ? 'Country' : 'البلد'}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1 font-arabic">
                  {language === 'en' ? 'Order Notes' : 'ملاحظات الطلب'}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-amber-900 font-arabic">
                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-amber-800">
                  <span className="font-arabic">{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                  <span className="font-arabic">₪{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span className="font-arabic">{language === 'en' ? 'Shipping' : 'الشحن'}</span>
                  <span className="font-arabic">₪{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <div className="flex justify-between font-bold text-amber-900">
                    <span className="font-arabic">{language === 'en' ? 'Total' : 'المجموع'}</span>
                    <span className="font-arabic">₪{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-amber-600 text-amber-50 py-4 px-6 rounded-xl font-semibold
                  transition-all duration-200 hover:bg-amber-700 shadow-lg shadow-amber-600/20
                  hover:shadow-xl hover:shadow-amber-600/30 active:scale-[0.98] ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting 
                  ? (language === 'en' ? 'Placing Order...' : 'جاري تقديم الطلب...')
                  : (language === 'en' ? 'Place Order' : 'تقديم الطلب')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 