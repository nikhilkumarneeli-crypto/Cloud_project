export type ProductCategory = 
  | 'Electronics'
  | 'Clothing'
  | 'Home and Kitchen'
  | 'Beauty and Personal Care'
  | 'Books'
  | 'Sports and Fitness'
  | 'Accessories';

export interface ProductItem {
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

export interface CartRecord {
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface CustomerAddress {
  id?: string;
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

export interface OrderRecord {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    brand: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: CustomerAddress;
  shippingMethod: 'standard' | 'express' | 'free';
  paymentStatus: 'SIMULATED_SUCCESS' | 'SIMULATED_FAILED';
  orderStatus: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber: string;
  createdAt: string;
}

export interface APIGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface AuthenticatedUser {
  userId: string;
  id?: string;
  email: string;
  role: 'customer' | 'admin';
  isAdmin: boolean;
}
