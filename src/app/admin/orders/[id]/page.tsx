'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { use } from 'react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { language } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    fetchOrder();
  }, [resolvedParams.id]);

  const fetchOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', resolvedParams.id));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order);
      } else {
        toast.error(
          language === 'en' 
            ? 'Order not found' 
            : 'الطلب غير موجود'
        );
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to fetch order details' 
          : 'فشل في جلب تفاصيل الطلب'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-700 font-arabic">
              {language === 'en' ? 'Loading order details...' : 'جاري تحميل تفاصيل الطلب...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-amber-700 font-arabic">
              {language === 'en' ? 'Order not found' : 'الطلب غير موجود'}
            </p>
            <Link
              href="/admin/orders"
              className="mt-4 inline-block bg-amber-600 text-amber-50 px-8 py-3 rounded-xl
                font-semibold transition-all duration-200 hover:bg-amber-700
                shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30"
            >
              {language === 'en' ? 'Back to Orders' : 'العودة إلى الطلبات'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <FiArrowLeft />
            <span className="font-arabic">
              {language === 'en' ? 'Back to Orders' : 'العودة إلى الطلبات'}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-amber-900 font-arabic">
              {language === 'en' ? 'Order Items' : 'عناصر الطلب'}
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-amber-50 rounded-lg">
                  <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name[language as keyof typeof item.name]}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-amber-900 font-arabic">
                      {item.name[language as keyof typeof item.name]}
                    </h3>
                    <p className="text-amber-600 text-sm font-arabic">
                      {language === 'en' ? 'Size: ' : 'المقاس: '}{item.size}
                    </p>
                    <p className="text-amber-600 text-sm font-arabic">
                      {language === 'en' ? 'Quantity: ' : 'الكمية: '}{item.quantity}
                    </p>
                    <p className="font-semibold text-amber-900 font-arabic">
                      ₪{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-amber-900 font-arabic">
                {language === 'en' ? 'Customer Information' : 'معلومات العميل'}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-amber-600 font-arabic">
                    {language === 'en' ? 'Name' : 'الاسم'}
                  </p>
                  <p className="font-semibold text-amber-900 font-arabic">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-arabic">
                    {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  </p>
                  <p className="font-semibold text-amber-900 font-arabic">
                    {order.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-arabic">
                    {language === 'en' ? 'Phone' : 'رقم الهاتف'}
                  </p>
                  <p className="font-semibold text-amber-900 font-arabic">
                    {order.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-arabic">
                    {language === 'en' ? 'Address' : 'العنوان'}
                  </p>
                  <p className="font-semibold text-amber-900 font-arabic">
                    {order.address}, {order.city}, {order.country}
                  </p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm text-amber-600 font-arabic">
                      {language === 'en' ? 'Order Notes' : 'ملاحظات الطلب'}
                    </p>
                    <p className="font-semibold text-amber-900 font-arabic">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-amber-900 font-arabic">
                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-amber-800">
                  <span className="font-arabic">{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                  <span className="font-arabic">₪{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span className="font-arabic">{language === 'en' ? 'Shipping' : 'الشحن'}</span>
                  <span className="font-arabic">₪{order.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <div className="flex justify-between font-bold text-amber-900">
                    <span className="font-arabic">{language === 'en' ? 'Total' : 'المجموع'}</span>
                    <span className="font-arabic">₪{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 