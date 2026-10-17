import { describe, it, expect, beforeEach } from 'vitest';
import { productRepository } from '../src/repositories/productRepository';
import { cartService } from '../src/services/cartService';
import { checkoutService } from '../src/services/checkoutService';
import { orderRepository } from '../src/repositories/orderRepository';
import { seedProducts } from '../src/seed';
import type { CustomerAddress, ProductItem } from '../src/types';

describe('Phase 7: End-to-End System Flow Integration Suite', () => {
  const customerId = 'usr-e2e-shopper-456';
  const sampleAddress: CustomerAddress = {
    fullName: 'Alex River',
    phone: '+1 (415) 555-0199',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States'
  };

  beforeEach(async () => {
    // Re-seed products
    for (const p of seedProducts) {
      await productRepository.save({ ...p });
    }
    await cartService.clearCart(customerId);
  });

  it('1. Product Browsing: Should retrieve products and filter by category accurately', async () => {
    const allProducts = await productRepository.listAll();
    expect(allProducts.length).toBeGreaterThanOrEqual(20);

    const electronics = await productRepository.listByCategory('Electronics');
    expect(electronics.length).toBeGreaterThan(0);
    expect(electronics.every((p) => p.category === 'Electronics')).toBe(true);

    const clothing = await productRepository.listByCategory('Clothing');
    expect(clothing.length).toBeGreaterThan(0);
    expect(clothing.every((p) => p.category === 'Clothing')).toBe(true);
  });

  it('2. Cart Flow: Should accurately update quantity and remove items with dynamic calculations', async () => {
    // Add 1 item
    const prodId = 'prod-elec-001'; // $189.99
    await cartService.addItem(customerId, prodId, 1);
    let cart = await cartService.getCart(customerId);
    expect(cart.itemCount).toBe(1);
    expect(cart.subtotal).toBe(189.99);

    // Update quantity to 2
    await cartService.updateQuantity(customerId, prodId, 2);
    cart = await cartService.getCart(customerId);
    expect(cart.itemCount).toBe(2);
    expect(cart.subtotal).toBe(379.98);

    // Remove item
    await cartService.removeItem(customerId, prodId);
    cart = await cartService.getCart(customerId);
    expect(cart.itemCount).toBe(0);
    expect(cart.subtotal).toBe(0);
    expect(cart.total).toBe(0);
  });

  it('3. Checkout & Order Lifecycle: Complete order creation, inventory deduction, and customer order retrieval', async () => {
    const targetProduct = 'prod-home-001'; // Ceramic Pour-Over Set
    const initialProduct = await productRepository.getById(targetProduct);
    expect(initialProduct).toBeDefined();
    const startStock = initialProduct!.stockQuantity;

    // Add to cart
    await cartService.addItem(customerId, targetProduct, 2);

    // Run simulated checkout
    const idempotencyKey = `e2e-order-${Date.now()}`;
    const checkoutResult = await checkoutService.processSimulatedPayment(customerId, {
      idempotencyKey,
      shippingAddress: sampleAddress,
      shippingMethod: 'standard',
      outcome: 'SUCCESS'
    });

    expect(checkoutResult.success).toBe(true);
    expect(checkoutResult.order).toBeDefined();
    expect(checkoutResult.order?.userId).toBe(customerId);
    expect(checkoutResult.order?.items.length).toBe(1);
    expect(checkoutResult.order?.items[0].quantity).toBe(2);

    // Verify inventory decremented
    const updatedProduct = await productRepository.getById(targetProduct);
    expect(updatedProduct?.stockQuantity).toBe(startStock - 2);

    // Verify order is retrievable by customer
    const userOrders = await orderRepository.listByUser(customerId);
    expect(userOrders.some((o) => o.id === checkoutResult.order?.id)).toBe(true);

    // Verify cart is clean
    const postCart = await cartService.getCart(customerId);
    expect(postCart.itemCount).toBe(0);
  });

  it('4. Admin Management: Can create new product and adjust inventory values', async () => {
    const newProduct: ProductItem = {
      id: 'prod-custom-999',
      name: 'Forest Alpine Insulated Thermos',
      description: 'Double-walled stainless steel thermal bottle with bamboo cap.',
      category: 'Home & Kitchen',
      brand: 'Canopy Alpine',
      currentPrice: 34.99,
      originalPrice: 44.99,
      discountPercentage: 22,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
      rating: 4.9,
      reviewCount: 38,
      stockQuantity: 50,
      specifications: { Capacity: '750ml', Material: '18/8 Stainless Steel' },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await productRepository.save(newProduct);

    // Verify stored
    const retrieved = await productRepository.getById('prod-custom-999');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Forest Alpine Insulated Thermos');
    expect(retrieved?.stockQuantity).toBe(50);

    // Admin updates stock
    await productRepository.updateStock('prod-custom-999', 42);
    const updated = await productRepository.getById('prod-custom-999');
    expect(updated?.stockQuantity).toBe(42);
  });
});
