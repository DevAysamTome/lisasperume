import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface OrderItem {
  id: string;
  name: { en: string; ar: string };
  price: number;
  quantity: number;
  size: number;
  image: string;
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

export const updateProductStock = async (productId: string, size: number, quantity: number) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('Product not found');
    }

    const productData = productSnap.data();
    const sizes = productData.sizes.map((s: any) => {
      if (s.size === size) {
        return { ...s, stock: Math.max(0, s.stock - quantity) };
      }
      return s;
    });

    await updateDoc(productRef, { sizes });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

export const saveOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    const orderWithTimestamp = {
      ...order,
      status: 'pending' as const,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
    
    // Update stock for each item in the order
    await Promise.all(
      order.items.map(item => 
        updateProductStock(item.id, item.size, item.quantity)
      )
    );
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}; 