import type { Metadata } from "next";
import { Poppins, Tajawal } from 'next/font/google';
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from '@/contexts/AuthContext';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lisa Perfume",
  description: "Luxury perfumes for everyone",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" style={{
      '--font-poppins': poppins.style.fontFamily,
      '--font-tajawal': tajawal.style.fontFamily,
    } as React.CSSProperties}>
      <body className="font-poppins">
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster 
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
