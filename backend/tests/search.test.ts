import { describe, it, expect, beforeEach } from 'vitest';
import { catalogService } from '../src/services/catalogService';
import { productRepository } from '../src/repositories/productRepository';
import { seedProducts } from '../src/seed';

describe('Issue 2: Search & Object Discovery Test Suite', () => {
  beforeEach(async () => {
    for (const p of seedProducts) {
      await productRepository.save({ ...p });
    }
  });

  it('1. should perform case-insensitive multi-word search across attributes', async () => {
    // "bamboo headphones" should match "Bamboo Noise-Cancelling Headphones"
    const results = await catalogService.listProducts({ searchQuery: 'BAMBOO HEADPHONES' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('Headphones');
  });

  it('2. should find products by brand and category in multi-word query', async () => {
    // "TimberSound electronics" should find TimberSound products in Electronics
    const results = await catalogService.listProducts({ searchQuery: 'timbersound electronics' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand).toBe('TimberSound');
  });

  it('3. should match partial substrings in descriptions and specifications', async () => {
    // "linen" should match linen throw blanket or organic linen shirts
    const results = await catalogService.listProducts({ searchQuery: 'linen' });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some(
        (p) =>
          p.name.toLowerCase().includes('linen') ||
          p.description.toLowerCase().includes('linen') ||
          JSON.stringify(p.specifications).toLowerCase().includes('linen')
      )
    ).toBe(true);
  });

  it('4. should return all active products when search query is empty or whitespace', async () => {
    const all = await catalogService.listProducts({});
    const emptySearch = await catalogService.listProducts({ searchQuery: '   ' });
    expect(emptySearch.length).toBe(all.length);
    expect(all.length).toBeGreaterThanOrEqual(20);
  });

  it('5. should sort search results accurately by price and rating', async () => {
    const lowToHigh = await catalogService.listProducts({ sortBy: 'price-low' });
    for (let i = 0; i < lowToHigh.length - 1; i++) {
      expect(lowToHigh[i].currentPrice).toBeLessThanOrEqual(lowToHigh[i + 1].currentPrice);
    }

    const highToLow = await catalogService.listProducts({ sortBy: 'price-high' });
    for (let i = 0; i < highToLow.length - 1; i++) {
      expect(highToLow[i].currentPrice).toBeGreaterThanOrEqual(highToLow[i + 1].currentPrice);
    }

    const byRating = await catalogService.listProducts({ sortBy: 'rating' });
    for (let i = 0; i < byRating.length - 1; i++) {
      expect(byRating[i].rating).toBeGreaterThanOrEqual(byRating[i + 1].rating);
    }
  });
});
