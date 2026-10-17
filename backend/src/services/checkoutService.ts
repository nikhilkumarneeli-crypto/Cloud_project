import { orderRepository } from '../repositories/orderRepository';
import { productRepository } from '../repositories/productRepository';
import { cartRepository } from '../repositories/cartRepository';
import type { CustomerAddress, OrderRecord, ShippingMethod } from '../types';

export interface SimulatePaymentInput {
  idempotencyKey?: string;
  shippingAddress: CustomerAddress;
  shippingMethod: ShippingMethod;
  outcome?: 'SUCCESS' | 'FAILURE';
  items?: { productId: string; quantity: number }[];
}

export class CheckoutService {
  async processSimulatedPayment(
    userId: string,
    input: SimulatePaymentInput
  ): Promise<{ success: boolean; order?: OrderRecord; error?: string }> {
    const { idempotencyKey, shippingAddress, shippingMethod, outcome = 'SUCCESS', items: directItems } = input;

    // 1. Idempotency Check
    if (idempotencyKey) {
      const isDuplicate = await orderRepository.checkIdempotency(idempotencyKey);
      if (isDuplicate) {
        return {
          success: false,
          error: 'Duplicate request detected (Idempotency Key already processed). No duplicate charge made.'
        };
      }
    }

    // 2. Simulated Payment Failure Path
    if (outcome === 'FAILURE') {
      return {
        success: false,
        error: 'Simulated payment was declined by issuing bank (Demo Failure Path). Zero charges made.'
      };
    }

    // 3. Resolve Items (from input or from active customer cart in DynamoDB)
    let cartItems: { productId: string; quantity: number }[] = [];
    if (directItems && directItems.length > 0) {
      cartItems = directItems;
    } else {
      const dbCart = await cartRepository.getCart(userId);
      cartItems = dbCart.map((c) => ({ productId: c.productId, quantity: c.quantity }));
    }

    if (cartItems.length === 0) {
      return { success: false, error: 'Cannot checkout with an empty cart.' };
    }

    // 4. Authoritative Server-Side Price & Stock Verification
    const verifiedOrderItems: OrderRecord['items'] = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = await productRepository.getById(item.productId);
      if (!product || !product.isActive) {
        return {
          success: false,
          error: `Item "${item.productId}" is no longer available in the catalog.`
        };
      }

      if (product.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}.`
        };
      }

      // Recomputed using database price, never browser values
      const itemTotal = product.currentPrice * item.quantity;
      subtotal += itemTotal;

      verifiedOrderItems.push({
        productId: product.id,
        name: product.name,
        price: product.currentPrice,
        quantity: item.quantity,
        image: product.image,
        brand: product.brand
      });
    }

    // 5. Fees & Total Recomputation
    const freeShippingThreshold = 50.0;
    const shippingFee =
      shippingMethod === 'express'
        ? 12.99
        : subtotal >= freeShippingThreshold
        ? 0.0
        : 6.99;
    const taxRate = 0.075;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + shippingFee + tax) * 100) / 100;

    // 6. Deduct Stock in DynamoDB (Conditional safety)
    for (const item of verifiedOrderItems) {
      const current = await productRepository.getById(item.productId);
      if (current) {
        await productRepository.updateStock(
          item.productId,
          Math.max(0, current.stockQuantity - item.quantity)
        );
      }
    }

    // 7. Create Order Record
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}-US`;
    const trackingNumber = `CNP-${Math.floor(100000 + Math.random() * 900000)}-WA`;

    const newOrder: OrderRecord = {
      id: orderId,
      userId,
      items: verifiedOrderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: 0,
      shippingFee,
      tax,
      total,
      shippingAddress,
      shippingMethod,
      paymentStatus: 'SIMULATED_SUCCESS',
      orderStatus: 'CONFIRMED',
      trackingNumber,
      createdAt: new Date().toISOString()
    };

    await orderRepository.save(newOrder, idempotencyKey);

    // 8. Empty Purchased Cart Items
    await cartRepository.clearCart(userId);

    return { success: true, order: newOrder };
  }
}

export const checkoutService = new CheckoutService();
