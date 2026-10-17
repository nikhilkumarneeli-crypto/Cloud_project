import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  const isFavorited = isInWishlist(product.id);
  const allImages = [product.image, ...(product.gallery || [])];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onBuyNow(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full border border-[#E5DED1] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        {/* Header Bar */}
        <div className="bg-[#173D30] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E8EFE7]">
            <span>{product.category}</span>
            <span>•</span>
            <span>{product.brand}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close product modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Gallery Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-[#F7F4ED] rounded-2xl overflow-hidden border border-[#E5DED1] relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-[#B83D32] text-white text-xs font-extrabold px-2.5 py-1 rounded-md shadow-md">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === img
                          ? 'border-[#173D30] ring-2 ring-[#173D30]/20'
                          : 'border-[#E5DED1] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Assurance Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-[#6F766F]">
                <div className="p-3 bg-[#E8EFE7] rounded-xl flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#173D30]" />
                  <span className="font-semibold text-[#173D30]">Carbon Neutral</span>
                  <span className="text-[10px]">Free over $50</span>
                </div>
                <div className="p-3 bg-[#E8EFE7] rounded-xl flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#173D30]" />
                  <span className="font-semibold text-[#173D30]">30-Day Return</span>
                  <span className="text-[10px]">Hassle-free</span>
                </div>
                <div className="p-3 bg-[#E8EFE7] rounded-xl flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#173D30]" />
                  <span className="font-semibold text-[#173D30]">Canopy Promise</span>
                  <span className="text-[10px]">Verified Origin</span>
                </div>
              </div>
            </div>

            {/* Right: Product Buy Box & Details */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h2 id="product-detail-title" className="text-2xl font-extrabold text-[#252A27] leading-tight mb-2">
                  {product.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#252A27]">{product.rating}</span>
                  <span className="text-sm text-[#6F766F]">({product.reviewCount} customer reviews)</span>
                </div>

                {/* Pricing Box */}
                <div className="p-4 bg-[#F7F4ED] rounded-2xl border border-[#E5DED1] mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-[#252A27]">
                      ${product.currentPrice.toFixed(2)}
                    </span>
                    {product.originalPrice > product.currentPrice && (
                      <span className="text-base text-[#6F766F] line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {product.discountPercentage > 0 && (
                      <span className="text-sm font-bold text-[#B83D32]">
                        Save ${(product.originalPrice - product.currentPrice).toFixed(2)} ({product.discountPercentage}%)
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                    {product.stockQuantity > 0 ? (
                      <span className="text-[#28734D] flex items-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                        In Stock ({product.stockQuantity} units available)
                      </span>
                    ) : (
                      <span className="text-[#B83D32] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Currently Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Wishlist */}
                {product.stockQuantity > 0 && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4">
                      <label htmlFor="modal-qty-select" className="text-sm font-bold text-[#252A27]">Quantity:</label>
                      <select
                        id="modal-qty-select"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="bg-white border border-[#E5DED1] rounded-xl px-4 py-2 text-sm font-semibold text-[#252A27] focus:outline-hidden focus:border-[#173D30]"
                      >
                        {Array.from({ length: Math.min(10, product.stockQuantity) }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                          isFavorited
                            ? 'bg-[#B83D32] text-white border-[#B83D32]'
                            : 'bg-white border-[#E5DED1] text-[#252A27] hover:border-[#173D30]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                      </button>
                    </div>

                    {/* CTAs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-[#F27A36] hover:bg-[#df6621] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="w-full bg-[#173D30] hover:bg-[#112d23] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <Zap className="w-4 h-4 text-[#F27A36]" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs for Details, Specs, Reviews */}
              <div className="pt-4 border-t border-[#E5DED1]">
                <div className="flex border-b border-[#E5DED1] mb-4 gap-6 text-sm font-bold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'details'
                        ? 'border-[#173D30] text-[#173D30]'
                        : 'border-transparent text-[#6F766F] hover:text-[#252A27]'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'specs'
                        ? 'border-[#173D30] text-[#173D30]'
                        : 'border-transparent text-[#6F766F] hover:text-[#252A27]'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-[#173D30] text-[#173D30]'
                        : 'border-transparent text-[#6F766F] hover:text-[#252A27]'
                    }`}
                  >
                    Reviews ({product.reviewCount})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' && (
                  <p className="text-sm text-[#252A27] leading-relaxed">
                    {product.description}
                  </p>
                )}

                {activeTab === 'specs' && (
                  <div className="bg-[#F7F4ED] rounded-xl border border-[#E5DED1] p-4">
                    <dl className="divide-y divide-[#E5DED1] text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="py-2 flex justify-between">
                          <dt className="font-semibold text-[#6F766F]">{key}</dt>
                          <dd className="font-medium text-[#252A27] text-right">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-[#E8EFE7] rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#173D30]">
                        <span>Marcus H. (Verified Buyer)</span>
                        <span className="text-[#6F766F]">2 days ago</span>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-[#252A27]">
                        Exceptional craftsmanship and sustainable build quality. Exactly what I was looking for.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
