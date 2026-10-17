import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  itemCount: number;
  subtotal: number;
  originalSubtotal: number;
  savings: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  tax: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number) => boolean;
  removeFromCart: (productId: string) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('canopy_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('canopy_saved_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('canopy_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('canopy_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stockQuantity < 1) {
      showToast('This product is currently out of stock.', 'error');
      return false;
    }

    let success = true;
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQuantity) {
          showToast(`Cannot add more. Maximum available stock is ${product.stockQuantity}.`, 'error');
          success = false;
          return prev;
        }
        showToast(`Updated "${product.name}" quantity to ${newQty}.`, 'success');
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stockQuantity) {
          showToast(`Cannot add. Maximum stock is ${product.stockQuantity}.`, 'error');
          success = false;
          return prev;
        }
        showToast(`Added "${product.name}" to your cart.`, 'success');
        return [...prev, { productId: product.id, product, quantity }];
      }
    });

    return success;
  };

  const updateQuantity = (productId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    let success = true;
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          if (quantity > item.product.stockQuantity) {
            showToast(`Only ${item.product.stockQuantity} items in stock.`, 'error');
            success = false;
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );

    return success;
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.productId === productId);
      if (target) {
        showToast(`Removed "${target.product.name}" from cart.`, 'info');
      }
      return prev.filter((item) => item.productId !== productId);
    });
  };

  const saveForLater = (productId: string) => {
    const target = items.find((i) => i.productId === productId);
    if (!target) return;

    setItems((prev) => prev.filter((i) => i.productId !== productId));
    setSavedItems((prev) => {
      const exists = prev.find((i) => i.productId === productId);
      if (exists) return prev;
      return [...prev, target];
    });

    showToast(`Saved "${target.product.name}" for later.`, 'info');
  };

  const moveToCart = (productId: string) => {
    const target = savedItems.find((i) => i.productId === productId);
    if (!target) return;

    setSavedItems((prev) => prev.filter((i) => i.productId !== productId));
    addToCart(target.product, target.quantity);
  };

  const removeSavedItem = (productId: string) => {
    setSavedItems((prev) => prev.filter((i) => i.productId !== productId));
    showToast('Item removed from saved list.', 'info');
  };

  const clearCart = () => {
    setItems([]);
    showToast('Your shopping cart has been cleared.', 'info');
  };

  // Pricing calculations
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = items.reduce(
    (acc, curr) => acc + curr.product.currentPrice * curr.quantity,
    0
  );

  const originalSubtotal = items.reduce(
    (acc, curr) => acc + curr.product.originalPrice * curr.quantity,
    0
  );

  const savings = Math.max(0, originalSubtotal - subtotal);

  const freeShippingThreshold = 50.0;
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0.0 : 6.99;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const taxRate = 0.075; // 7.5% estimated tax
  const tax = Math.round(subtotal * taxRate * 100) / 100;

  const total = Math.round((subtotal + shippingFee + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        itemCount,
        subtotal,
        originalSubtotal,
        savings,
        shippingFee,
        freeShippingThreshold,
        freeShippingProgress,
        tax,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCart,
        removeSavedItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
