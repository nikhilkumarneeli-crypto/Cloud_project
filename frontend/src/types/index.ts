export type ProductCategory = 
  | 'Electronics'
  | 'Clothing'
  | 'Home and Kitchen'
  | 'Beauty and Personal Care'
  | 'Books'
  | 'Sports and Fitness'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  specifications: Record<string, string>;
  isActive: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isTrendingDeal?: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selected?: boolean;
  savedForLater?: boolean;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type ShippingMethod = 'standard' | 'express' | 'free';

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
}

export type OrderStatus = 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: CustomerAddress;
  shippingMethod: ShippingMethod;
  paymentStatus: 'SIMULATED_SUCCESS' | 'SIMULATED_FAILED';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  addresses: CustomerAddress[];
  defaultAddressId?: string;
  token?: string;
}

export interface ProductFilters {
  searchQuery: string;
  category?: ProductCategory | 'All';
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
