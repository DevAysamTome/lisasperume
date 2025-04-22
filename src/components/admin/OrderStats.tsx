'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { FiPackage, FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export default function OrderStats() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        
        // Get total orders and revenue
        const ordersSnapshot = await getDocs(ordersRef);
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // Get orders by status
        const pendingQuery = query(ordersRef, where('status', '==', 'pending'));
        const completedQuery = query(ordersRef, where('status', '==', 'completed'));
        const cancelledQuery = query(ordersRef, where('status', '==', 'cancelled'));
        
        const [pendingSnapshot, completedSnapshot, cancelledSnapshot] = await Promise.all([
          getDocs(pendingQuery),
          getDocs(completedQuery),
          getDocs(cancelledQuery)
        ]);

        setStats({
          totalOrders,
          totalRevenue,
          pendingOrders: pendingSnapshot.size,
          completedOrders: completedSnapshot.size,
          cancelledOrders: cancelledSnapshot.size
        });
      } catch (error) {
        console.error('Error fetching order stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: language === 'en' ? 'Total Orders' : 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: <FiPackage className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: language === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات',
      value: `₪${stats.totalRevenue.toFixed(2)}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: language === 'en' ? 'Pending Orders' : 'الطلبات المعلقة',
      value: stats.pendingOrders,
      icon: <FiClock className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      title: language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة',
      value: stats.completedOrders,
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'bg-emerald-500'
    },
    {
      title: language === 'en' ? 'Cancelled Orders' : 'الطلبات الملغية',
      value: stats.cancelledOrders,
      icon: <FiXCircle className="w-6 h-6" />,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className={`p-2 rounded-full ${stat.color} text-white`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
} 