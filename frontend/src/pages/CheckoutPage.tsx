import React, { useState } from 'react';
import { 
  Check, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Package, 
  Plus
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { useToast } from '../contexts/ToastContext';
import type { ShippingMethod } from '../types';

interface CheckoutPageProps {
  onOrderComplete: (orderId: string) => void;
  onNavigateHome: () => void;
  onNavigateToAccount: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderComplete,
  onNavigateHome,
  onNavigateToAccount
}) => {
  const { items, subtotal, shippingFee, tax, total, clearCart } = useCart();
  const { user, saveAddress } = useAuth();
  const { placeOrder } = useStore();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.defaultAddressId || user?.addresses[0]?.id || ''
  );
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // New Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  const currentAddress = user?.addresses.find((a) => a.id === selectedAddressId) || user?.addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newCity || !newZip) {
      showToast('Please fill all required address fields.', 'error');
      return;
    }
    saveAddress({
      fullName: newFullName,
      phone: newPhone || '+1 (555) 019-2831',
      street: newStreet,
      city: newCity,
      state: newState || 'WA',
      postalCode: newZip,
      country: 'United States',
      isDefault: true
    });
    setIsAddingAddress(false);
    showToast('Delivery address saved.', 'success');
  };

  const handleSimulatedPayment = async (status: 'SIMULATED_SUCCESS' | 'SIMULATED_FAILED') => {
    if (!currentAddress) {
      showToast('Please select a delivery address.', 'error');
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // Realistic network round-trip simulation
    await new Promise((r) => setTimeout(r, 1200));

    const orderItems = items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      price: i.product.currentPrice,
      quantity: i.quantity,
      image: i.product.image,
      brand: i.product.brand
    }));

    const result = await placeOrder(
      orderItems,
      currentAddress,
      shippingMethod,
      subtotal,
      shippingFee,
      tax,
      total,
      status
    );

    setIsProcessing(false);

    if (result.success && result.orderId) {
      setConfirmedOrderId(result.orderId);
      clearCart();
      setCurrentStep(5);
      onOrderComplete(result.orderId);
      showToast('Simulated Payment Verified! Order Placed Successfully.', 'success');
    } else {
      setPaymentError(result.error || 'Payment declined by issuing bank (Simulated Failure).');
      showToast('Payment simulation failed as requested.', 'error');
    }
  };

  const steps = [
    { num: 1, title: 'Address' },
    { num: 2, title: 'Shipping' },
    { num: 3, title: 'Review' },
    { num: 4, title: 'Payment' },
    { num: 5, title: 'Confirmed' }
  ];

  if (items.length === 0 && currentStep !== 5) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E8EFE7] text-[#173D30] flex items-center justify-center mx-auto">
          <Package className="w-8 h-8 opacity-60" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#252A27]">No items to checkout</h2>
        <p className="text-xs text-[#6F766F]">Your cart is empty. Please add items before checking out.</p>
        <button
          onClick={onNavigateHome}
          className="bg-[#173D30] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Multi-Step Visual Progress Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5DED1] shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#28734D] text-white'
                        : isCurrent
                        ? 'bg-[#173D30] text-white ring-4 ring-[#E8EFE7]'
                        : 'bg-[#F7F4ED] text-[#6F766F] border border-[#E5DED1]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-semibold ${
                      isCurrent ? 'text-[#173D30]' : 'text-[#6F766F]'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > s.num ? 'bg-[#28734D]' : 'bg-[#E5DED1]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-3xl border border-[#E5DED1] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DED1]">
                <h2 className="text-xl font-bold text-[#173D30] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#F27A36]" />
                  <span>Select Delivery Address</span>
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="text-xs font-bold text-[#173D30] hover:text-[#F27A36] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddNewAddress} className="space-y-4 bg-[#F7F4ED] p-5 rounded-2xl border border-[#E5DED1]">
                  <h4 className="font-bold text-sm text-[#173D30]">Add a New Shipping Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkout-full-name" className="text-xs font-semibold text-[#252A27] block mb-1">Full Name</label>
                      <input
                        id="checkout-full-name"
                        type="text"
                        placeholder="e.g. Alex Woods"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs text-[#252A27]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-phone-number" className="text-xs font-semibold text-[#252A27] block mb-1">Phone Number</label>
                      <input
                        id="checkout-phone-number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs text-[#252A27]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="checkout-street-address" className="text-xs font-semibold text-[#252A27] block mb-1">Street Address</label>
                    <input
                      id="checkout-street-address"
                      type="text"
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs text-[#252A27]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="checkout-city" className="text-xs font-semibold text-[#252A27] block mb-1">City</label>
                      <input
                        id="checkout-city"
                        type="text"
                        placeholder="Seattle"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs text-[#252A27]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-state" className="text-xs font-semibold text-[#252A27] block mb-1">State</label>
                      <input
                        id="checkout-state"
                        type="text"
                        placeholder="WA"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs text-[#252A27]"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-zip" className="text-xs font-semibold text-[#252A27] block mb-1">ZIP</label>
                      <input
                        id="checkout-zip"
                        type="text"
                        placeholder="98101"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value)}
                        className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs text-[#252A27]"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5DED1] bg-white text-[#252A27]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-[#173D30] text-white hover:bg-[#112d23]"
                    >
                      Save & Use Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {user?.addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#173D30] bg-[#E8EFE7] ring-1 ring-[#173D30]'
                            : 'border-[#E5DED1] bg-white hover:border-[#173D30]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-sm text-[#252A27]">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="ml-2 text-[10px] bg-[#173D30] text-white px-2 py-0.5 rounded-full font-semibold">
                                Default
                              </span>
                            )}
                            <p className="text-xs text-[#6F766F] mt-1">{addr.street} {addr.apartment || ''}</p>
                            <p className="text-xs text-[#6F766F]">{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p className="text-xs text-[#6F766F] mt-0.5">Phone: {addr.phone}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#173D30] bg-[#173D30] text-white' : 'border-[#E5DED1]'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-[#E5DED1]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#F27A36] hover:bg-[#df6621] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Deliver to this Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-3xl border border-[#E5DED1] shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-[#173D30] flex items-center gap-2 pb-3 border-b border-[#E5DED1]">
                <Truck className="w-5 h-5 text-[#F27A36]" />
                <span>Choose Delivery Speed</span>
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-[#173D30] bg-[#E8EFE7] ring-1 ring-[#173D30]'
                      : 'border-[#E5DED1] bg-white hover:border-[#173D30]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#252A27]">Standard Carbon-Neutral Delivery</span>
                      <p className="text-xs text-[#6F766F] mt-0.5">Arrives in 3-5 business days via 100% EV carriers</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#173D30]">
                      {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-[#173D30] bg-[#E8EFE7] ring-1 ring-[#173D30]'
                      : 'border-[#E5DED1] bg-white hover:border-[#173D30]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#252A27]">Canopy Express Priority</span>
                      <p className="text-xs text-[#6F766F] mt-0.5">Arrives in 1-2 business days with priority packing</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#173D30]">$12.99</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E5DED1]">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5DED1] text-xs font-semibold text-[#6F766F] hover:text-[#252A27]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#F27A36] hover:bg-[#df6621] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Review */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-3xl border border-[#E5DED1] shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-[#173D30] pb-3 border-b border-[#E5DED1]">
                Review Your Order Items & Destination
              </h2>

              {/* Delivery Details Recap */}
              <div className="p-4 bg-[#F7F4ED] rounded-2xl border border-[#E5DED1] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-[#173D30] uppercase tracking-wider block mb-1">
                    Shipping Address
                  </span>
                  <p className="font-semibold text-[#252A27]">{currentAddress?.fullName}</p>
                  <p className="text-[#6F766F]">{currentAddress?.street}</p>
                  <p className="text-[#6F766F]">{currentAddress?.city}, {currentAddress?.state} {currentAddress?.postalCode}</p>
                </div>
                <div>
                  <span className="font-bold text-[#173D30] uppercase tracking-wider block mb-1">
                    Shipping Method
                  </span>
                  <p className="font-semibold text-[#252A27]">
                    {shippingMethod === 'standard' ? 'Standard Carbon-Neutral' : 'Express Priority'}
                  </p>
                  <p className="text-[#6F766F]">Estimated delivery: 2-4 business days</p>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#E5DED1]">
                {items.map((item) => (
                  <div key={item.productId} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover border border-[#E5DED1]" />
                      <div>
                        <span className="font-bold text-[#252A27] line-clamp-1">{item.product.name}</span>
                        <span className="text-[#6F766F]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-[#252A27] text-sm">
                      ${(item.product.currentPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E5DED1]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5DED1] text-xs font-semibold text-[#6F766F] hover:text-[#252A27]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#F27A36] hover:bg-[#df6621] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Simulated Payment */}
          {currentStep === 4 && (
            <div className="bg-white p-6 rounded-3xl border border-[#E5DED1] shadow-md space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DED1]">
                <h2 className="text-xl font-black text-[#173D30] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#F27A36]" />
                  <span>Simulated Payment Gateway</span>
                </h2>
                <span className="text-[10px] bg-[#E8EFE7] text-[#173D30] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Test Sandbox
                </span>
              </div>

              {/* Security Banner */}
              <div className="p-4 bg-[#F7F4ED] rounded-2xl border border-[#E5DED1] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D30]">
                  <ShieldCheck className="w-4 h-4 text-[#28734D]" />
                  <span>Demo Payment — No Real Money Charged</span>
                </div>
                <p className="text-xs text-[#6F766F] leading-relaxed">
                  In compliance with security rules, no credit cards or CVVs are collected. Test both transaction paths below to verify AWS Serverless transactional integrity and idempotency.
                </p>
              </div>

              {/* Error Alert if payment failed */}
              {paymentError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-[#B83D32]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Transaction Declined (Simulated Error Path)</span>
                    <span>{paymentError}</span>
                    <span className="block mt-1 text-[#6F766F]">
                      Your cart items and stock reservations remain unaffected. You can safely retry.
                    </span>
                  </div>
                </div>
              )}

              {/* Test Action Buttons */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#252A27] block">
                  Select Simulated Payment Outcome:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SUCCESS PATH */}
                  <button
                    onClick={() => handleSimulatedPayment('SIMULATED_SUCCESS')}
                    disabled={isProcessing}
                    className="p-5 rounded-2xl border-2 border-[#28734D] bg-[#E8EFE7] hover:bg-[#d8e6d6] text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between h-36"
                  >
                    <div>
                      <span className="font-extrabold text-sm text-[#173D30] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#28734D]" />
                        Simulate Payment Success
                      </span>
                      <p className="text-xs text-[#6F766F] mt-1.5">
                        Verifies stock, executes DynamoDB transaction, clears purchased cart, and generates confirmed order ID.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#28734D]">
                      {isProcessing ? 'Verifying with AWS...' : 'Click to Complete Purchase →'}
                    </span>
                  </button>

                  {/* FAILURE PATH */}
                  <button
                    onClick={() => handleSimulatedPayment('SIMULATED_FAILED')}
                    disabled={isProcessing}
                    className="p-5 rounded-2xl border-2 border-[#B83D32] bg-red-50/60 hover:bg-red-50 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between h-36"
                  >
                    <div>
                      <span className="font-extrabold text-sm text-[#B83D32] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#B83D32]" />
                        Simulate Payment Failure
                      </span>
                      <p className="text-xs text-[#6F766F] mt-1.5">
                        Simulates bank decline. Confirms that no order is created and inventory is protected.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#B83D32]">
                      {isProcessing ? 'Simulating decline...' : 'Test Error Handling →'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E5DED1]">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl border border-[#E5DED1] text-xs font-semibold text-[#6F766F] hover:text-[#252A27]"
                >
                  Back to Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Order Confirmation */}
          {currentStep === 5 && confirmedOrderId && (
            <div className="bg-white p-8 rounded-3xl border border-[#E5DED1] shadow-xl text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#E8EFE7] text-[#28734D] flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#28734D] bg-[#E8EFE7] px-3 py-1 rounded-full">
                  Order Successfully Placed
                </span>
                <h2 className="text-3xl font-black text-[#173D30] mt-3">
                  Thank You for Your Order!
                </h2>
                <p className="text-xs text-[#6F766F] mt-1">
                  Order reference: <strong className="text-[#252A27]">{confirmedOrderId}</strong>
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#F7F4ED] p-5 rounded-2xl border border-[#E5DED1] text-left max-w-lg mx-auto space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#E5DED1]">
                  <span className="text-[#6F766F]">Estimated Delivery:</span>
                  <span className="font-bold text-[#252A27]">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E5DED1]">
                  <span className="text-[#6F766F]">Delivery Address:</span>
                  <span className="font-bold text-[#252A27]">{currentAddress?.street}, {currentAddress?.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F766F]">Payment Method:</span>
                  <span className="font-bold text-[#28734D]">Simulated Card Sandbox (Authorized)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={onNavigateToAccount}
                  className="bg-[#173D30] hover:bg-[#112d23] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-[#F27A36]" />
                  <span>View in Order History</span>
                </button>

                <button
                  onClick={onNavigateHome}
                  className="border border-[#E5DED1] bg-white hover:bg-[#F7F4ED] text-[#252A27] px-6 py-3 rounded-xl font-semibold text-xs transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Summary Sidebar (Steps 1-4) */}
        {currentStep < 5 && (
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E5DED1] shadow-md space-y-4">
              <h3 className="font-extrabold text-base text-[#173D30]">Order Summary</h3>

              <div className="space-y-2 text-xs text-[#6F766F]">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-[#252A27]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span className="font-semibold text-[#252A27]">
                    {shippingFee === 0 ? <strong className="text-[#28734D]">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax:</span>
                  <span className="font-semibold text-[#252A27]">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-[#E5DED1] flex justify-between items-baseline font-black text-base text-[#252A27]">
                  <span>Total Due:</span>
                  <span className="text-xl text-[#173D30]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#E8EFE7] rounded-xl text-[11px] text-[#173D30] space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#28734D]" />
                  Canopy Assurance
                </span>
                <p className="text-[10px] text-[#6F766F]">
                  All prices and stock are validated directly against AWS DynamoDB server-side before debit.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
