import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Bookmark, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartPageProps {
  onNavigateToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToCheckout,
  onContinueShopping
}) => {
  const {
    items,
    savedItems,
    itemCount,
    subtotal,
    savings,
    shippingFee,
    freeShippingThreshold,
    freeShippingProgress,
    tax,
    total,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    clearCart
  } = useCart();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DED1]">
        <div>
          <h1 className="text-3xl font-black text-[#173D30]">Shopping Cart</h1>
          <p className="text-xs text-[#6F766F] mt-1">
            {itemCount > 0
              ? `You have ${itemCount} item${itemCount > 1 ? 's' : ''} in your cart.`
              : 'Your shopping cart is empty.'}
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="text-xs font-semibold text-[#6F766F] hover:text-[#B83D32] flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal for Clearing Cart */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E5DED1] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-[#B83D32]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-[#252A27]">Clear All Items?</h3>
            </div>
            <p className="text-xs text-[#6F766F]">
              Are you sure you want to remove all {itemCount} items from your shopping cart? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E5DED1] text-[#252A27] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setIsClearConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#B83D32] hover:bg-red-700 text-white"
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Cart Body */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5DED1] p-12 text-center space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#E8EFE7] text-[#173D30] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 opacity-60" />
          </div>
          <h2 className="text-2xl font-black text-[#252A27]">Your Canopy Cart is Empty</h2>
          <p className="text-sm text-[#6F766F] max-w-md mx-auto">
            Explore our curated departments or check your saved for later list below.
          </p>
          <button
            onClick={onContinueShopping}
            className="bg-[#173D30] hover:bg-[#112d23] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5DED1] p-6 shadow-xs divide-y divide-[#E5DED1]">
            {items.map((item) => (
              <div key={item.productId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-28 h-28 object-cover rounded-2xl border border-[#E5DED1] bg-[#F7F4ED] shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-[#173D30] uppercase tracking-wider">
                          {item.product.category} • {item.product.brand}
                        </span>
                        <h3 className="font-extrabold text-base text-[#252A27] mt-0.5 leading-snug">
                          {item.product.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-[#252A27]">
                          ${(item.product.currentPrice * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-xs text-[#6F766F]">
                            ${item.product.currentPrice.toFixed(2)} each
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Status & Free Shipping eligibility */}
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-[#28734D] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Stock
                      </span>
                      <span className="text-[#6F766F]">|</span>
                      <span className="text-[#6F766F]">Eligible for FREE Shipping</span>
                    </div>
                  </div>

                  {/* Quantity & Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[#E5DED1]">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#E5DED1] rounded-xl overflow-hidden bg-[#F7F4ED]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-white text-[#252A27]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-bold text-[#252A27]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-white text-[#252A27]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs text-[#6F766F]">
                        (Max: {item.product.stockQuantity})
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <button
                        onClick={() => saveForLater(item.productId)}
                        className="text-[#173D30] hover:text-[#F27A36] flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save for later</span>
                      </button>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[#6F766F] hover:text-[#B83D32] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            <div className="bg-white rounded-3xl border border-[#E5DED1] p-6 shadow-md space-y-5">
              <h2 className="font-extrabold text-lg text-[#173D30]">Order Summary</h2>

              {/* Free Shipping Meter */}
              <div className="bg-[#E8EFE7] p-3.5 rounded-2xl border border-[#E5DED1]">
                <div className="flex items-center justify-between text-xs font-bold text-[#173D30] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#F27A36]" />
                    {subtotal >= freeShippingThreshold ? 'Free Shipping Unlocked!' : 'Free Shipping Goal'}
                  </span>
                  <span>{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-[#E5DED1] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#173D30] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
                {subtotal < freeShippingThreshold && (
                  <p className="text-[11px] text-[#6F766F] mt-1.5">
                    Add <strong className="text-[#F27A36]">${(freeShippingThreshold - subtotal).toFixed(2)}</strong> to qualify for free shipping.
                  </p>
                )}
              </div>

              {/* Pricing List */}
              <div className="space-y-2 text-xs text-[#6F766F]">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-bold text-[#252A27] text-sm">${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#B83D32]">
                    <span>Promotional Discount</span>
                    <span className="font-bold">-${savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#252A27]">
                    {shippingFee === 0 ? <strong className="text-[#28734D]">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (7.5%)</span>
                  <span className="font-semibold text-[#252A27]">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-[#E5DED1] flex justify-between items-baseline text-base font-black text-[#252A27]">
                  <span>Total Amount</span>
                  <span className="text-2xl text-[#173D30]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={onNavigateToCheckout}
                className="w-full bg-[#F27A36] hover:bg-[#df6621] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Proceed to Multi-Step Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-[#6F766F] space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[#28734D] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Safe Simulated Payments</span>
                </div>
                <p className="text-[10px]">No real money charged • Idempotent transactions</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. Saved For Later Section */}
      {savedItems.length > 0 && (
        <section className="bg-white rounded-3xl border border-[#E5DED1] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DED1]">
            <div>
              <h2 className="text-xl font-bold text-[#173D30]">Saved for Later ({savedItems.length})</h2>
              <p className="text-xs text-[#6F766F] mt-0.5">Items moved here can be returned to your cart anytime.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.map((item) => (
              <div key={item.productId} className="p-4 rounded-2xl border border-[#E5DED1] bg-[#F7F4ED] flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-[#E5DED1] bg-white shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#252A27] line-clamp-1">{item.product.name}</h4>
                    <span className="font-extrabold text-sm text-[#173D30]">${item.product.currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-2 text-xs font-semibold">
                    <button
                      onClick={() => moveToCart(item.productId)}
                      className="bg-[#173D30] text-white px-3 py-1.5 rounded-lg hover:bg-[#112d23]"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeSavedItem(item.productId)}
                      className="text-[#6F766F] hover:text-[#B83D32]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
