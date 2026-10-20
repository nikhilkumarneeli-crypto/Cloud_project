import { productRepository } from '../repositories/productRepository';
import type { ProductItem } from '../types';

export class CatalogService {
  async listProducts(params: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
    searchQuery?: string;
  } = {}): Promise<ProductItem[]> {
    let products: ProductItem[];
    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      products = await this.searchProducts(params.searchQuery);
    } else {
      products = await productRepository.listAll(params.category);
    }

    if (params.category && params.searchQuery) {
      products = products.filter((p) => p.category === params.category);
    }
    if (params.brand) {
      products = products.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params.minPrice !== undefined) {
      products = products.filter((p) => p.currentPrice >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      products = products.filter((p) => p.currentPrice <= params.maxPrice!);
    }
    if (params.minRating !== undefined) {
      products = products.filter((p) => p.rating >= params.minRating!);
    }

    switch (params.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        products.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Featured / Bestseller
        products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return products;
  }

  async getProducts(params: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
  }): Promise<ProductItem[]> {
    let products = await productRepository.listAll(params.category);

    if (params.brand) {
      products = products.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params.minPrice !== undefined) {
      products = products.filter((p) => p.currentPrice >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      products = products.filter((p) => p.currentPrice <= params.maxPrice!);
    }
    if (params.minRating !== undefined) {
      products = products.filter((p) => p.rating >= params.minRating!);
    }

    // Sorting
    switch (params.sort) {
      case 'price-asc':
        products.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-desc':
        products.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Featured
        products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return products;
  }

  async getProductById(id: string): Promise<ProductItem | null> {
    return await productRepository.getById(id);
  }

  async searchProducts(query: string): Promise<ProductItem[]> {
    if (!query || query.trim().length === 0) return [];
    const all = await productRepository.listAll();
    const words = query.toLowerCase().trim().split(/\s+/);
    return all.filter((p) =>
      words.every((word) =>
        p.name.toLowerCase().includes(word) ||
        p.description.toLowerCase().includes(word) ||
        p.brand.toLowerCase().includes(word) ||
        p.category.toLowerCase().includes(word) ||
        (p.badge && p.badge.toLowerCase().includes(word)) ||
        (p.specifications && Object.values(p.specifications).some((val) => typeof val === 'string' && val.toLowerCase().includes(word)))
      )
    );
  }

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const all = await productRepository.listAll();
    const map = new Map<string, number>();
    for (const p of all) {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }
}

export const catalogService = new CatalogService();
