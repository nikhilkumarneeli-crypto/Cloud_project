import { cartRepository } from '../repositories/cartRepository';
import { productRepository } from '../repositories/productRepository';
import type { ProductItem } from '../types';

export interface HydratedCartItem {
  productId: string;
  quantity: number;
  product: ProductItem;
  itemSubtotal: number;
}

export interface CartCalculationResult {
  items: HydratedCartItem[];
  itemCount: number;
  subtotal: number;
  savings: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export class CartService {
  async getCart(userId: string): Promise<CartCalculationResult> {
    const records = await cartRepository.getCart(userId);
    const hydrated: HydratedCartItem[] = [];

    let subtotal = 0;
    let originalSubtotal = 0;
    let itemCount = 0;

    for (const rec of records) {
      const product = await productRepository.getById(rec.productId);
      if (product && product.isActive) {
        // Enforce stock ceiling
        const safeQuantity = Math.min(rec.quantity, product.stockQuantity);
        if (safeQuantity > 0) {
          const itemSubtotal = product.currentPrice * safeQuantity;
          hydrated.push({
            productId: product.id,
            quantity: safeQuantity,
            product,
            itemSubtotal
          });
          subtotal += itemSubtotal;
          originalSubtotal += product.originalPrice * safeQuantity;
          itemCount += safeQuantity;
        }
      }
    }

    const savings = Math.max(0, originalSubtotal - subtotal);
    const freeShippingThreshold = 50.0;
    const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0.0 : 6.99;
    const taxRate = 0.075;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + shippingFee + tax) * 100) / 100;

    return {
      items: hydrated,
      itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      shippingFee,
      tax,
      total
    };
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<CartCalculationResult> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }
    const product = await productRepository.getById(productId);
    if (!product || !product.isActive) {
      throw new Error('Product not found or inactive.');
    }
    if (product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock. Only ${product.stockQuantity} available.`);
    }

    const currentRecords = await cartRepository.getCart(userId);
    const existing = currentRecords.find((r) => r.productId === productId);
    const totalQuantity = (existing?.quantity || 0) + quantity;

    if (totalQuantity > product.stockQuantity) {
      throw new Error(`Cannot add more items than available stock (${product.stockQuantity}).`);
    }

    await cartRepository.setItem(userId, productId, totalQuantity);
    return await this.getCart(userId);
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<CartCalculationResult> {
    if (quantity <= 0) {
      await cartRepository.removeItem(userId, productId);
      return await this.getCart(userId);
    }

    const product = await productRepository.getById(productId);
    if (!product) {
      throw new Error('Product not found.');
    }
    if (quantity > product.stockQuantity) {
      throw new Error(`Requested quantity exceeds available stock (${product.stockQuantity}).`);
    }

    await cartRepository.setItem(userId, productId, quantity);
    return await this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartCalculationResult> {
    await cartRepository.removeItem(userId, productId);
    return await this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await cartRepository.clearCart(userId);
  }
}

export const cartService = new CartService();
