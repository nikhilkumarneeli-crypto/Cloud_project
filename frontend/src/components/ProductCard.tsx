import React from 'react';
import { Star, ShoppingCart, Heart, Check, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-[#E5DED1] hover:border-[#173D30]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges & Wishlist Action */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F7F4ED]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#173D30] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F27A36]" />
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="bg-[#B83D32] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
            isFavorited
              ? 'bg-[#B83D32] text-white scale-110'
              : 'bg-white/90 hover:bg-white text-[#252A27] hover:text-[#B83D32]'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-[#6F766F] mb-1.5">
            <span>{product.category}</span>
            <span className="font-semibold text-[#173D30]">{product.brand}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-base text-[#252A27] line-clamp-2 group-hover:text-[#173D30] transition-colors leading-snug mb-2">
            {product.name}
          </h3>

          {/* Star Ratings & Review Count */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#252A27]">{product.rating}</span>
            <span className="text-xs text-[#6F766F]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Stock & Action Row */}
        <div className="pt-3 border-t border-[#E5DED1]">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-xl font-extrabold text-[#252A27] tracking-tight">
                ${product.currentPrice.toFixed(2)}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="ml-2 text-xs text-[#6F766F] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Inventory Status Indicator */}
            {product.stockQuantity > 0 ? (
              <span className="text-[11px] font-semibold text-[#28734D] flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                {product.stockQuantity <= 15 ? (
                  <span className="text-[#B83D32]">Only {product.stockQuantity} left</span>
                ) : (
                  'In Stock'
                )}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-[#B83D32]">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity < 1}
            className="w-full bg-[#F27A36] hover:bg-[#df6621] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};
