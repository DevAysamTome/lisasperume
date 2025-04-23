'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative">
      <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <ShoppingBag className="w-6 h-6 text-gray-700" />
        <AnimatePresence>
          {itemCount > 0  && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
} 