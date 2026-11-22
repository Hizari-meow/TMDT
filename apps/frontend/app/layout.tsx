import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { AuthModal } from '../components/AuthModal';
import { SupportChatWidget } from '../components/SupportChatWidget';
import { ArchitectureTelemetryModal } from '../components/ArchitectureTelemetryModal';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'TECHZONE™ | Hệ Thống Bán Lẻ Công Nghệ Chính Hãng & Siêu Hội Flash Sale',
  description:
    'Hệ thống thương mại điện tử công nghệ cao cấp TechZone. Phân phối chính hãng Apple, MacBook, Audio và phụ kiện cao cấp với trải nghiệm mua sắm siêu tốc độ.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased selection:bg-[#0071e3] selection:text-white flex flex-col justify-between">
        <Providers>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {/* Global E-Commerce Overlays */}
                <CartDrawer />
                <WishlistDrawer />
                <CheckoutModal />
                <AuthModal />
                <SupportChatWidget />
                <ArchitectureTelemetryModal />

                {/* Main Content */}
                <main className="w-full flex-1 flex flex-col">
                  {children}
                </main>

                {/* Unified Real E-Commerce Footer */}
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
