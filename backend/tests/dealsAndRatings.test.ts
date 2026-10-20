import { describe, it, expect } from 'vitest';
import { seedProducts } from '../src/seed';

describe('Issue 4: Top-Rated & Trending Deals Calculations Test Suite', () => {
  it('1. should calculate discount percentage mathematically matching original and current price', () => {
    for (const p of seedProducts) {
      if (p.originalPrice > p.currentPrice) {
        const calculatedDiscount = Math.round(((p.originalPrice - p.currentPrice) / p.originalPrice) * 100);
        expect(p.discountPercentage).toBe(calculatedDiscount);
      }
    }
  });

  it('2. should correctly identify top-rated products using rating >= 4.7 and review count', () => {
    const topRated = seedProducts
      .filter((p) => p.rating >= 4.7 && p.reviewCount >= 20)
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

    expect(topRated.length).toBeGreaterThan(0);
    // Highest rated should be first
    expect(topRated[0].rating).toBeGreaterThanOrEqual(4.8);
    for (let i = 0; i < topRated.length - 1; i++) {
      expect(topRated[i].rating).toBeGreaterThanOrEqual(topRated[i + 1].rating);
    }
  });

  it('3. should correctly identify trending deals with positive discounts', () => {
    const trendingDeals = seedProducts
      .filter((p) => p.isTrendingDeal || p.discountPercentage >= 15)
      .sort((a, b) => b.discountPercentage - a.discountPercentage);

    expect(trendingDeals.length).toBeGreaterThan(0);
    for (const deal of trendingDeals) {
      expect(deal.discountPercentage).toBeGreaterThanOrEqual(10);
      expect(deal.currentPrice).toBeLessThan(deal.originalPrice);
    }
  });
});
