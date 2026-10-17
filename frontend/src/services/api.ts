import type { Product, Order, CustomerAddress, ShippingMethod } from '../types';
import { mockProducts } from '../data/mockProducts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = (): Record<string, string> => {
  const savedUser = localStorage.getItem('canopy_user');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    } catch {
      // Ignored
    }
  }
  return headers;
};

export const api = {
  // 1. Public Catalog API
  async getProducts(params?: { category?: string; sort?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'All') searchParams.append('category', params.category);
      if (params?.sort) searchParams.append('sort', params.sort);
      if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

      const url = `${API_BASE_URL}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.products || [];
      }
    } catch {
      // Graceful fallback to client dataset
    }
    return mockProducts;
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.product || null;
      }
    } catch {
      // Fallback
    }
    return mockProducts.find((p) => p.id === id) || null;
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.products || [];
      }
    } catch {
      // Fallback
    }
    return mockProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  },

  async getCategories(): Promise<{ name: string; count: number }[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.categories || [];
      }
    } catch {
      // Fallback
    }
    return [];
  },

  // 2. Customer Cart API
  async getCart(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback handled by CartContext
    }
    return null;
  },

  async addToCart(productId: string, quantity = 1): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async updateCartItem(productId: string, quantity: number): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async removeFromCart(productId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async clearCart(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // 3. Checkout & Simulated Payment API
  async simulatePayment(input: {
    idempotencyKey?: string;
    shippingAddress: CustomerAddress;
    shippingMethod: ShippingMethod;
    outcome?: 'SUCCESS' | 'FAILURE';
    items?: { productId: string; quantity: number }[];
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/simulate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(input)
      });
      const data = await res.json();
      if (res.ok && data.order) {
        return { success: true, order: data.order };
      }
      return { success: false, error: data.error || 'Simulated payment was declined.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection error' };
    }
  },

  // 4. Customer Orders API
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.orders || [];
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.order || null;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // 5. Admin API
  async adminCreateProduct(productData: any): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async adminUpdateProduct(productId: string, updates: any): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async adminDeleteProduct(productId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminUpdateInventory(productId: string, stockQuantity: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/inventory/${productId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stockQuantity })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminGetOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.orders || [];
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async adminUpdateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
