
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const favoritesRef = doc(db, 'favorites', user.uid);
    const unsubscribe = onSnapshot(favoritesRef, (doc) => {
      if (doc.exists()) {
        setFavorites(doc.data().productIds || []);
      } else {
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addToFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const favoritesRef = doc(db, 'favorites', user.uid);
      const favoritesDoc = await getDoc(favoritesRef);

      if (favoritesDoc.exists()) {
        const currentFavorites = favoritesDoc.data().productIds || [];
        if (!currentFavorites.includes(productId)) {
          await setDoc(favoritesRef, {
            productIds: [...currentFavorites, productId],
            updatedAt: new Date()
          });
        }
      } else {
        await setDoc(favoritesRef, {
          productIds: [productId],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const favoritesRef = doc(db, 'favorites', user.uid);
      const favoritesDoc = await getDoc(favoritesRef);

      if (favoritesDoc.exists()) {
        const currentFavorites = favoritesDoc.data().productIds || [];
        const updatedFavorites = currentFavorites.filter((id: string) => id !== productId);
        
        if (updatedFavorites.length === 0) {
          await deleteDoc(favoritesRef);
        } else {
          await setDoc(favoritesRef, {
            productIds: updatedFavorites,
            updatedAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 