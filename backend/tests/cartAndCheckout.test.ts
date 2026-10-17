import { describe, it, expect, beforeEach } from 'vitest';
import { productRepository } from '../src/repositories/productRepository';
import { cartService } from '../src/services/cartService';
import { checkoutService } from '../src/services/checkoutService';
import { seedProducts } from '../src/seed';
import type { CustomerAddress } from '../src/types';

describe('Phase 3: Backend Cart and Checkout Integration Tests', () => {
  const testUserId = 'test-usr-123';
  const testAddress: CustomerAddress = {
    fullName: 'Jane Forester',
    phone: '+1 (206) 555-0100',
    street: '100 Woodland Way',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States'
  };

  beforeEach(async () => {
    // Reset seed products
    for (const p of seedProducts) {
      await productRepository.save({ ...p });
    }
    await cartService.clearCart(testUserId);
  });

  it('1. should calculate authoritative cart subtotal, shipping, and tax correctly', async () => {
    // Add product 1 (TimberAcoustics Headphones: $189.99)
    await cartService.addItem(testUserId, 'prod-elec-001', 1);

    const cart = await cartService.getCart(testUserId);
    expect(cart.itemCount).toBe(1);
    expect(cart.subtotal).toBe(189.99);
    // Subtotal >= $50 qualifies for free shipping
    expect(cart.shippingFee).toBe(0.0);
    expect(cart.tax).toBe(14.25);
    expect(cart.total).toBe(204.24);
  });

  it('2. should reject adding quantities that exceed available stock', async () => {
    const product = await productRepository.getById('prod-elec-002'); // Stock is 15
    expect(product).toBeDefined();

    // Attempt to add 20 units
    await expect(
      cartService.addItem(testUserId, 'prod-elec-002', 20)
    ).rejects.toThrow(/Insufficient stock/);
  });

  it('3. should execute simulated payment, decrement inventory, and clear cart upon success', async () => {
    const prodId = 'prod-cloth-001'; // Stock is 36, price $68.00
    const initialProd = await productRepository.getById(prodId);
    const initialStock = initialProd!.stockQuantity;

    await cartService.addItem(testUserId, prodId, 2);

    const result = await checkoutService.processSimulatedPayment(testUserId, {
      idempotencyKey: 'test-idemp-key-1',
      shippingAddress: testAddress,
      shippingMethod: 'standard',
      outcome: 'SUCCESS'
    });

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(result.order?.orderStatus).toBe('CONFIRMED');
    expect(result.order?.total).toBeGreaterThan(0);

    // Verify inventory was decremented
    const updatedProd = await productRepository.getById(prodId);
    expect(updatedProd!.stockQuantity).toBe(initialStock - 2);

    // Verify customer cart was emptied
    const postCart = await cartService.getCart(testUserId);
    expect(postCart.items.length).toBe(0);
  });

  it('4. should handle simulated payment failure safely without deducting stock or creating orders', async () => {
    const prodId = 'prod-cloth-001';
    const initialProd = await productRepository.getById(prodId);
    const initialStock = initialProd!.stockQuantity;

    await cartService.addItem(testUserId, prodId, 1);

    const result = await checkoutService.processSimulatedPayment(testUserId, {
      idempotencyKey: 'test-idemp-failure-key',
      shippingAddress: testAddress,
      shippingMethod: 'standard',
      outcome: 'FAILURE'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('declined');

    // Verify stock is untouched
    const updatedProd = await productRepository.getById(prodId);
    expect(updatedProd!.stockQuantity).toBe(initialStock);

    // Cart items preserved for retry
    const postCart = await cartService.getCart(testUserId);
    expect(postCart.items.length).toBe(1);
  });

  it('5. should enforce idempotency to prevent duplicate charges or orders on retry', async () => {
    const idempKey = 'idemp-duplicate-test-key';
    await cartService.addItem(testUserId, 'prod-book-001', 1);

    // First request
    const firstAttempt = await checkoutService.processSimulatedPayment(testUserId, {
      idempotencyKey: idempKey,
      shippingAddress: testAddress,
      shippingMethod: 'standard',
      outcome: 'SUCCESS'
    });
    expect(firstAttempt.success).toBe(true);

    // Second request with identical idempotency key
    const secondAttempt = await checkoutService.processSimulatedPayment(testUserId, {
      idempotencyKey: idempKey,
      shippingAddress: testAddress,
      shippingMethod: 'standard',
      outcome: 'SUCCESS'
    });

    expect(secondAttempt.success).toBe(false);
    expect(secondAttempt.error).toContain('Duplicate request detected');
  });
});
