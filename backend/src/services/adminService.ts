import { productRepository } from '../repositories/productRepository';
import { orderRepository } from '../repositories/orderRepository';
import type { ProductItem, OrderRecord } from '../types';

export class AdminService {
  async createProduct(data: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductItem> {
    const id = `prod-${data.category.toLowerCase().slice(0, 4)}-${Date.now().toString(36)}`;
    const product: ProductItem = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await productRepository.save(product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem> {
    const existing = await productRepository.getById(id);
    if (!existing) {
      throw new Error(`Product ${id} not found.`);
    }

    const updated: ProductItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await productRepository.save(updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await productRepository.delete(id);
  }

  async updateStock(id: string, newStock: number): Promise<boolean> {
    return await productRepository.updateStock(id, newStock);
  }

  async listAllOrders(): Promise<OrderRecord[]> {
    return await orderRepository.listAll();
  }

  async updateOrderStatus(orderId: string, status: OrderRecord['orderStatus']): Promise<void> {
    await orderRepository.updateStatus(orderId, status);
  }
}

export const adminService = new AdminService();
