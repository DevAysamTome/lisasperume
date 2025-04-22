'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/services/firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { FiEdit2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import OrderStats from '@/components/admin/OrderStats';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AdminOrdersPage() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to fetch orders' 
          : 'فشل في جلب الطلبات'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(
        language === 'en' 
          ? 'Order status updated successfully' 
          : 'تم تحديث حالة الطلب بنجاح'
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to update order status' 
          : 'فشل في تحديث حالة الطلب'
      );
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    if (language === 'en') {
      switch (status) {
        case 'pending':
          return 'Pending';
        case 'processing':
          return 'Processing';
        case 'completed':
          return 'Completed';
        case 'cancelled':
          return 'Cancelled';
        default:
          return status;
      }
    } else {
      switch (status) {
        case 'pending':
          return 'قيد الانتظار';
        case 'processing':
          return 'قيد المعالجة';
        case 'completed':
          return 'مكتمل';
        case 'cancelled':
          return 'ملغي';
        default:
          return status;
      }
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-amber-900 font-arabic">
          {language === 'en' ? 'Orders Management' : 'إدارة الطلبات'}
        </h1>

        <div className="mb-8">
          <OrderStats />
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider font-arabic">
                    {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider font-arabic">
                    {language === 'en' ? 'Customer' : 'العميل'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider font-arabic">
                    {language === 'en' ? 'Date' : 'التاريخ'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider font-arabic">
                    {language === 'en' ? 'Total' : 'المجموع'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider font-arabic">
                    {language === 'en' ? 'Status' : 'الحالة'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider font-arabic">
                    {language === 'en' ? 'Actions' : 'الإجراءات'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 font-arabic">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 font-arabic">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 font-arabic">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 font-arabic">
                      ₪{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">{getStatusText('pending')}</option>
                        <option value="processing">{getStatusText('processing')}</option>
                        <option value="completed">{getStatusText('completed')}</option>
                        <option value="cancelled">{getStatusText('cancelled')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-amber-600 hover:text-amber-700 transition-colors"
                          title={language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                        >
                          <FiEye size={18} />
                        </Link>
                        <button
                          onClick={() => handleStatusChange(order.id, 'processing')}
                          className="p-2 text-amber-600 hover:text-amber-700 transition-colors"
                          title={language === 'en' ? 'Edit Order' : 'تعديل الطلب'}
                        >
                          <FiEdit2 size={18} />
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