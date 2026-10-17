import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Star, 
  TrendingUp, 
  PackageSearch,
  Laptop,
  Shirt,
  UtensilsCrossed,
  Sparkle,
  BookOpen,
  Dumbbell,
  Watch
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { productCategories } from '../data/mockProducts';
import type { Product, ProductCategory } from '../types';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToDeals: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Electronics': <Laptop className="w-5 h-5" />,
  'Clothing': <Shirt className="w-5 h-5" />,
  'Home and Kitchen': <UtensilsCrossed className="w-5 h-5" />,
  'Beauty and Personal Care': <Sparkle className="w-5 h-5" />,
  'Books': <BookOpen className="w-5 h-5" />,
  'Sports and Fitness': <Dumbbell className="w-5 h-5" />,
  'Accessories': <Watch className="w-5 h-5" />
};

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct }) => {
  const { products, filteredProducts, filters, updateFilter, resetFilters } = useStore();

  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const trendingDeals = products.filter((p) => p.discountPercentage >= 20).slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Promotional Banner */}
      <section className="relative overflow-hidden bg-[#173D30] text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl mt-6 border border-[#235544]">
        {/* Subtle background ambient forest motif */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#235544]/40 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-64 h-64 rounded-full bg-[#E8EFE7]/5 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8EFE7]/15 border border-[#E8EFE7]/20 text-[#E8EFE7] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F27A36]" />
              <span>Spring Forest Collection 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Sustainably Crafted Essentials for Mindful Living.
            </h1>

            <p className="text-sm sm:text-base text-[#E8EFE7]/85 max-w-xl leading-relaxed">
              Explore artisanal kitchenware, organic apparel, sustainable acoustic audio, and wilderness field gear — engineered with zero compromises.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  updateFilter('category', 'Electronics');
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#F27A36] hover:bg-[#df6621] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Shop Featured Audio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  updateFilter('sortBy', 'price-low');
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                View 20% Off Deals
              </button>
            </div>
          </div>

          {/* Hero Highlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/30 text-[#252A27] shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#173D30]">
                <span className="bg-[#E8EFE7] px-2.5 py-1 rounded-md">Editor's Spotlight</span>
                <span className="text-[#28734D] flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              </div>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-[#F7F4ED] border border-[#E5DED1]">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="TimberAcoustics Bamboo Headphones"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#173D30]">
                  TimberAcoustics Bamboo ANC Headphones
                </h4>
                <p className="text-xs text-[#6F766F] mt-1 line-clamp-2">
                  Sustainable bamboo earcups with 45-hour playback and custom bio-cellulose drivers.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#252A27]">$189.99</span>
                    <span className="text-xs text-[#6F766F] line-through">$249.99</span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(products[0])}
                    className="bg-[#173D30] hover:bg-[#112d23] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Chips Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#173D30] flex items-center gap-2">
            <span>Browse by Category</span>
          </h2>
          <span className="text-xs text-[#6F766F]">7 Sustainable Departments</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {productCategories.filter(c => c !== 'All').map((category) => {
            const isSelected = filters.category === category;
            return (
              <button
                key={category}
                onClick={() => {
                  updateFilter('category', category as ProductCategory);
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-28 group ${
                  isSelected
                    ? 'bg-[#173D30] text-white border-[#173D30] shadow-md scale-102'
                    : 'bg-white hover:bg-[#E8EFE7] border-[#E5DED1] text-[#252A27] hover:border-[#173D30]/40 shadow-xs'
                }`}
              >
                <div className={`p-2 rounded-xl w-fit ${
                  isSelected ? 'bg-white/10 text-[#F27A36]' : 'bg-[#E8EFE7] text-[#173D30] group-hover:bg-white'
                }`}>
                  {CATEGORY_ICONS[category] || <Sparkles className="w-5 h-5" />}
                </div>
                <span className="font-bold text-xs line-clamp-1">{category}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Trending Deals Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8EFE7] rounded-3xl p-6 sm:p-8 border border-[#E5DED1] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B83D32]">
                <TrendingUp className="w-4 h-4" />
                <span>Limited-Time Offers</span>
              </div>
              <h3 className="text-2xl font-black text-[#173D30] mt-1">Trending Deals & Discounts</h3>
            </div>
            <button
              onClick={() => {
                updateFilter('sortBy', 'price-low');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#173D30] hover:text-[#F27A36] flex items-center gap-1 transition-colors"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingDeals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Full Catalog with Sidebar Filters */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5DED1]">
          <div>
            <h2 className="text-2xl font-extrabold text-[#173D30]">
              {filters.category && filters.category !== 'All' ? filters.category : 'Complete Product Catalog'}
            </h2>
            <p className="text-xs text-[#6F766F] mt-1">
              Showing {filteredProducts.length} verified eco-certified products
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6F766F] font-semibold hidden sm:inline">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="bg-white border border-[#E5DED1] rounded-xl px-3 py-2 font-semibold text-[#252A27] focus:outline-hidden focus:border-[#173D30]"
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Catalog Body: Filters + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DED1] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#173D30] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#F27A36]" />
                  <span>Filters</span>
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#6F766F] hover:text-[#B83D32] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Department Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#252A27] block mb-2">
                  Department
                </label>
                <div className="space-y-1">
                  {productCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat as ProductCategory)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        (filters.category || 'All') === cat
                          ? 'bg-[#E8EFE7] text-[#173D30] font-bold'
                          : 'text-[#6F766F] hover:text-[#252A27]'
                      }`}
                    >
                      <span>{cat}</span>
                      {(filters.category || 'All') === cat && (
                        <Check className="w-3.5 h-3.5 text-[#173D30]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#252A27] block mb-2">
                  Brand
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('brand', undefined)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !filters.brand ? 'bg-[#E8EFE7] text-[#173D30] font-bold' : 'text-[#6F766F] hover:text-[#252A27]'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => updateFilter('brand', brand)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        filters.brand === brand
                          ? 'bg-[#E8EFE7] text-[#173D30] font-bold'
                          : 'text-[#6F766F] hover:text-[#252A27]'
                      }`}
                    >
                      <span>{brand}</span>
                      {filters.brand === brand && <Check className="w-3.5 h-3.5 text-[#173D30]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="pt-2 border-t border-[#E5DED1]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#252A27]">
                  <input
                    type="checkbox"
                    checked={!!filters.inStockOnly}
                    onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
                    className="w-4 h-4 rounded-sm border-[#E5DED1] text-[#173D30] focus:ring-[#173D30]"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>

              {/* Minimum Customer Rating */}
              <div className="pt-2 border-t border-[#E5DED1]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#252A27] block mb-2">
                  Customer Rating
                </label>
                <div className="space-y-1">
                  {[4.5, 4.0, 3.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('minRating', filters.minRating === rating ? undefined : rating)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        filters.minRating === rating
                          ? 'bg-[#E8EFE7] text-[#173D30] font-bold'
                          : 'text-[#6F766F] hover:text-[#252A27]'
                      }`}
                    >
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span>{rating} & up</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E5DED1] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8EFE7] text-[#173D30] flex items-center justify-center mx-auto">
                  <PackageSearch className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-bold text-lg text-[#252A27]">No products match your criteria</h3>
                <p className="text-xs text-[#6F766F] max-w-sm mx-auto">
                  Try adjusting your keywords, selecting a different department, or resetting the filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#173D30] hover:bg-[#112d23] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
