import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Bookmark, 
  ShoppingBag, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToCartPage: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToCartPage
}) => {
  const {
    items,
    itemCount,
    subtotal,
    savings,
    shippingFee,
    freeShippingThreshold,
    freeShippingProgress,
    tax,
    total,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    saveForLater,
    clearCart
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside 
          aria-label="Shopping Cart Drawer"
          className="w-screen max-w-md bg-white border-l border-[#E5DED1] shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="bg-[#173D30] text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F27A36]" />
              <h2 className="font-extrabold text-lg">Your Shopping Cart ({itemCount})</h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#E8EFE7] px-5 py-3 border-b border-[#E5DED1] shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-[#173D30] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#F27A36]" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-[#28734D] font-bold">You unlocked Free Standard Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#F27A36]">${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E5DED1] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#173D30] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E5DED1]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8EFE7] flex items-center justify-center text-[#173D30]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#252A27]">Your cart is currently empty</h3>
                  <p className="text-xs text-[#6F766F] mt-1 max-w-xs">
                    Explore our collection of sustainably sourced goods and forest-inspired essentials.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-[#173D30] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#112d23]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-[#E5DED1] shrink-0 bg-[#F7F4ED]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-[#252A27] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#6F766F] hover:text-[#B83D32] p-1 ml-1"
                          title="Remove item"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#6F766F]">{item.product.brand}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-extrabold text-sm text-[#252A27]">
                          ${(item.product.currentPrice * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-[#6F766F]">
                            (${item.product.currentPrice.toFixed(2)} each)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector & Save for Later */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-[#E5DED1] rounded-lg overflow-hidden bg-[#F7F4ED]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-white text-[#252A27]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#252A27]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-white text-[#252A27]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => saveForLater(item.productId)}
                        className="text-xs font-semibold text-[#173D30] hover:underline flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#F27A36]" />
                        <span>Save for later</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="bg-[#F7F4ED] border-t border-[#E5DED1] p-5 space-y-4 shrink-0">
              {/* Order Math Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6F766F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#252A27]">${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#B83D32]">
                    <span>Promotional Savings</span>
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
                  <span>Estimated Tax (7.5%)</span>
                  <span className="font-semibold text-[#252A27]">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#E5DED1] flex justify-between text-base font-extrabold text-[#252A27]">
                  <span>Total</span>
                  <span className="text-xl text-[#173D30]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full bg-[#F27A36] hover:bg-[#df6621] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      onNavigateToCartPage();
                    }}
                    className="font-semibold text-[#173D30] hover:underline"
                  >
                    View & Edit Cart Page
                  </button>

                  <button
                    onClick={clearCart}
                    className="text-[#6F766F] hover:text-[#B83D32] hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6F766F] text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#28734D]" />
                <span>Simulated Checkout • 100% Secure Sandbox</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
