import React, { useState } from 'react';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { StoreProvider, useStore } from './contexts/StoreContext';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { DeliveryModal } from './components/DeliveryModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import type { Product } from './types';

const MainAppContent: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useStore();

  const [activeView, setActiveView] = useState<'home' | 'cart' | 'checkout' | 'account' | 'admin'>('home');
  const [deliveryLocation, setDeliveryLocation] = useState('Seattle, WA 98101');
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBuyNow = () => {
    setSelectedProduct(null);
    setActiveView('checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4ED] text-[#252A27]">
      {/* 1. Promotional Header */}
      <AnnouncementBar />

      {/* 2. Primary Navigation Bar */}
      <Navbar
        onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
        deliveryLocation={deliveryLocation}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* 3. Main Views Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onNavigateToDeals={() => setActiveView('home')}
          />
        )}

        {activeView === 'cart' && (
          <CartPage
            onNavigateToCheckout={() => setActiveView('checkout')}
            onContinueShopping={() => setActiveView('home')}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutPage
            onOrderComplete={() => {}}
            onNavigateHome={() => setActiveView('home')}
            onNavigateToAccount={() => setActiveView('account')}
          />
        )}

        {activeView === 'account' && (
          <AccountPage
            onNavigateToAdmin={() => setActiveView('admin')}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            onNavigateHome={() => setActiveView('home')}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        onNavigateToCheckout={() => setActiveView('checkout')}
        onNavigateToCartPage={() => setActiveView('cart')}
      />

      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        currentLocation={deliveryLocation}
        onSelectLocation={(loc) => setDeliveryLocation(loc)}
      />

      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <StoreProvider>
              <MainAppContent />
            </StoreProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
