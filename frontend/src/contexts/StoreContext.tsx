import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Product, ProductFilters, Order, CustomerAddress, ShippingMethod } from '../types';
import { mockProducts } from '../data/mockProducts';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface StoreContextType {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  updateFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  resetFilters: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  orders: Order[];
  placeOrder: (
    items: { productId: string; name: string; price: number; quantity: number; image: string; brand: string }[],
    shippingAddress: CustomerAddress,
    shippingMethod: ShippingMethod,
    subtotal: number,
    shippingFee: number,
    tax: number,
    total: number,
    simulatedStatus?: 'SIMULATED_SUCCESS' | 'SIMULATED_FAILED'
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  // Admin Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
}

const DEFAULT_FILTERS: ProductFilters = {
  searchQuery: '',
  category: 'All',
  sortBy: 'featured',
  inStockOnly: false
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('canopy_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockProducts;
      }
    }
    return mockProducts;
  });

  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('canopy_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Seed initial demo order
    return [
      {
        id: 'ORD-78912-US',
        userId: 'usr-customer-01',
        items: [
          {
            productId: 'prod-elec-001',
            name: 'TimberAcoustics Bamboo Active Noise Cancelling Headphones',
            price: 189.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            brand: 'TimberSound'
          }
        ],
        subtotal: 189.99,
        discount: 60.00,
        shippingFee: 0.00,
        tax: 14.25,
        total: 204.24,
        shippingAddress: {
          id: 'addr-1',
          fullName: 'Alex Woods',
          phone: '+1 (206) 555-0192',
          street: '742 Evergreen Terrace',
          apartment: 'Apt 4B',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States'
        },
        shippingMethod: 'standard',
        paymentStatus: 'SIMULATED_SUCCESS',
        orderStatus: 'DELIVERED',
        trackingNumber: 'CNP-992140-WA',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  // Load live products from backend on mount
  React.useEffect(() => {
    let isMounted = true;
    api.getProducts().then((liveProds) => {
      if (isMounted && liveProds && liveProds.length > 0) {
        setProducts(liveProds);
        localStorage.setItem('canopy_products', JSON.stringify(liveProds));
      }
    }).catch(() => {
      // Offline fallback already in state
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (filters.category && filters.category !== 'All' && p.category !== filters.category) {
        return false;
      }
      if (filters.searchQuery.trim()) {
        const words = filters.searchQuery.toLowerCase().trim().split(/\s+/);
        const matchesAll = words.every(
          (w) =>
            p.name.toLowerCase().includes(w) ||
            p.description.toLowerCase().includes(w) ||
            p.brand.toLowerCase().includes(w) ||
            p.category.toLowerCase().includes(w) ||
            (p.badge && p.badge.toLowerCase().includes(w))
        );
        if (!matchesAll) return false;
      }
      if (filters.brand && p.brand !== filters.brand) {
        return false;
      }
      if (filters.minPrice !== undefined && p.currentPrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && p.currentPrice > filters.maxPrice) {
        return false;
      }
      if (filters.minRating !== undefined && p.rating < filters.minRating) {
        return false;
      }
      if (filters.inStockOnly && p.stockQuantity < 1) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'featured':
        default:
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Place order with inventory safety
  const placeOrder = async (
    items: { productId: string; name: string; price: number; quantity: number; image: string; brand: string }[],
    shippingAddress: CustomerAddress,
    shippingMethod: ShippingMethod,
    subtotal: number,
    shippingFee: number,
    tax: number,
    total: number,
    simulatedStatus: 'SIMULATED_SUCCESS' | 'SIMULATED_FAILED' = 'SIMULATED_SUCCESS'
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    // 1. Attempt Real Backend API (API Gateway / Lambda)
    try {
      const apiResult = await api.simulatePayment({
        idempotencyKey: `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        shippingAddress,
        shippingMethod,
        outcome: simulatedStatus === 'SIMULATED_FAILED' ? 'FAILURE' : 'SUCCESS',
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      if (!apiResult.success) {
        return { success: false, error: apiResult.error };
      }

      if (apiResult.order) {
        const orderId = apiResult.order.id;
        const updatedOrders = [apiResult.order, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('canopy_orders', JSON.stringify(updatedOrders));

        // Decrement local inventory cache to match database
        const updatedProducts = products.map((prod) => {
          const purchased = items.find((i) => i.productId === prod.id);
          if (purchased) {
            return {
              ...prod,
              stockQuantity: Math.max(0, prod.stockQuantity - purchased.quantity),
              updatedAt: new Date().toISOString()
            };
          }
          return prod;
        });
        setProducts(updatedProducts);
        localStorage.setItem('canopy_products', JSON.stringify(updatedProducts));

        return { success: true, orderId };
      }
    } catch {
      // Fallback to client transactional simulation if backend offline
    }

    // 2. Validate simulated payment failure case
    if (simulatedStatus === 'SIMULATED_FAILED') {
      return {
        success: false,
        error: 'Simulated payment was declined by issuing bank (Demo Failure Path). Your card was not charged.'
      };
    }

    // 3. Validate inventory availability
    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `Product ${item.name} not found in catalog.` };
      }
      if (prod.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Available: ${prod.stockQuantity}, Requested: ${item.quantity}.`
        };
      }
    }

    // 4. Decrement inventory (Serverless transactional logic simulation)
    const updatedProducts = products.map((prod) => {
      const purchased = items.find((i) => i.productId === prod.id);
      if (purchased) {
        return {
          ...prod,
          stockQuantity: Math.max(0, prod.stockQuantity - purchased.quantity),
          updatedAt: new Date().toISOString()
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    localStorage.setItem('canopy_products', JSON.stringify(updatedProducts));

    // 5. Generate Order Record
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}-US`;
    const newOrder: Order = {
      id: orderId,
      userId: 'usr-customer-01',
      items,
      subtotal,
      discount: 0,
      shippingFee,
      tax,
      total,
      shippingAddress,
      shippingMethod,
      paymentStatus: 'SIMULATED_SUCCESS',
      orderStatus: 'CONFIRMED',
      trackingNumber: `CNP-${Math.floor(100000 + Math.random() * 900000)}-US`,
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('canopy_orders', JSON.stringify(updatedOrders));

    return { success: true, orderId };
  };

  // Admin Actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${newProdData.category.toLowerCase().slice(0, 4)}-${Date.now().toString(36)}`;
    const product: Product = {
      ...newProdData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem('canopy_products', JSON.stringify(updated));
    showToast(`Product "${product.name}" created successfully.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    setProducts(updated);
    localStorage.setItem('canopy_products', JSON.stringify(updated));
    showToast('Product updated successfully.', 'success');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('canopy_products', JSON.stringify(updated));
    showToast('Product removed from catalog.', 'info');
  };

  const updateStock = (id: string, newStock: number) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, stockQuantity: Math.max(0, newStock), updatedAt: new Date().toISOString() } : p
    );
    setProducts(updated);
    localStorage.setItem('canopy_products', JSON.stringify(updated));
    showToast('Stock quantity updated.', 'success');
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
    setOrders(updated);
    localStorage.setItem('canopy_orders', JSON.stringify(updated));
    showToast(`Order ${orderId} status set to ${status}.`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        selectedProduct,
        setSelectedProduct,
        orders,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updateOrderStatus
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
