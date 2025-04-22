'use client';

import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { language } = useLanguage();
  const router = useRouter();

  const handleQuantityChange = (id: string, size: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, size, newQuantity);
  };

  const handleRemoveItem = (id: string, size: number) => {
    removeItem(id, size);
    toast.success(language === 'en' ? 'Item removed from cart' : 'تم إزالة المنتج من السلة');
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0; // Fixed shipping cost
  const total = subtotal + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
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
                ? 'Add some products to your cart and they will appear here'
                : 'أضف بعض المنتجات إلى سلة التسوق وستظهر هنا'
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
        <h1 className="text-3xl font-bold mb-8 text-amber-900 font-arabic">
          {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex gap-6">
                  <div className="relative w-24 h-24 bg-amber-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name[language as keyof typeof item.name]}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-amber-900 font-arabic mb-1">
                          {item.name[language as keyof typeof item.name]}
                        </h3>
                        <p className="text-amber-600 text-sm font-arabic">
                          {language === 'en' ? 'Size: ' : 'المقاس: '}{item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        className="text-amber-400 hover:text-amber-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-amber-100 text-amber-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={18} />
                        </button>
                        <span className="w-8 text-center font-medium text-amber-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-amber-100 text-amber-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={18} />
                        </button>
                      </div>
                      <p className="font-semibold text-amber-900 font-arabic">
                      ₪{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                onClick={handleCheckout}
                className="w-full bg-amber-600 text-amber-50 py-4 px-6 rounded-xl font-semibold
                  transition-all duration-200 hover:bg-amber-700 shadow-lg shadow-amber-600/20
                  hover:shadow-xl hover:shadow-amber-600/30 active:scale-[0.98]"
              >
                {language === 'en' ? 'Proceed to Checkout' : 'المتابعة للدفع'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 