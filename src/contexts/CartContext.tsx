'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  image: string;
  quantity: number;
  size: number;
}

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: number) => void;
  updateQuantity: (id: string, size: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items, isInitialized]);

  const addItem = (newItem: CartItem) => {
    if (!newItem || typeof newItem !== 'object') {
      console.error('Invalid item provided to addItem');
      return;
    }

    setItems(currentItems => {
      if (!Array.isArray(currentItems)) {
        return [newItem];
      }

      const existingItem = currentItems.find(item => 
        item.id === newItem.id && item.size === newItem.size
      );
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeItem = (id: string, size: number) => {
    setItems(currentItems => {
      if (!Array.isArray(currentItems)) {
        return [];
      }
      return currentItems.filter(item => 
        !(item.id === id && item.size === size)
      );
    });
  };

  const updateQuantity = (id: string, size: number, quantity: number) => {
    if (quantity < 1) return;

    setItems(currentItems => {
      if (!Array.isArray(currentItems)) {
        return [];
      }
      return currentItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = Array.isArray(items) 
    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  const itemCount = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items: Array.isArray(items) ? items : [],
        cartItems: Array.isArray(items) ? items : [],
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 