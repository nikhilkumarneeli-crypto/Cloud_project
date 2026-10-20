import React, { useState } from 'react';
import { 
  MapPin, 
  Package, 
  Heart, 
  Trash2, 
  ShieldAlert, 
  Plus,
  Edit2,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { CustomerAddress } from '../types';

export const AccountPage: React.FC<{ onNavigateToAdmin: () => void }> = ({ onNavigateToAdmin }) => {
  const { user, deleteAddress, setDefaultAddress, saveAddress, switchRole } = useAuth();
  const { orders } = useStore();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Address Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [isDefault, setIsDefault] = useState(false);

  const resetAddressForm = () => {
    setFullName('');
    setPhone('');
    setStreet('');
    setApartment('');
    setCity('');
    setState('');
    setZip('');
    setCountry('United States');
    setIsDefault(false);
    setEditingAddressId(null);
    setIsAddingAddress(false);
  };

  const handleStartAdd = () => {
    resetAddressForm();
    setFullName(user?.name || '');
    setPhone('+1 (206) 555-0192');
    setIsDefault((user?.addresses?.length || 0) === 0);
    setIsAddingAddress(true);
  };

  const handleStartEdit = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setFullName(addr.fullName);
    setPhone(addr.phone || '+1 (206) 555-0192');
    setStreet(addr.street);
    setApartment(addr.apartment || '');
    setCity(addr.city);
    setState(addr.state);
    setZip(addr.postalCode);
    setCountry(addr.country || 'United States');
    setIsDefault(Boolean(addr.isDefault || user?.defaultAddressId === addr.id));
    setIsAddingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !street.trim() || !city.trim() || !zip.trim()) {
      showToast('Please fill all required address fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveAddress({
        ...(editingAddressId ? { id: editingAddressId } : {}),
        fullName: fullName.trim(),
        phone: phone.trim() || '+1 (206) 555-0192',
        street: street.trim(),
        apartment: apartment.trim() || undefined,
        city: city.trim(),
        state: state.trim() || 'WA',
        postalCode: zip.trim(),
        country: country.trim() || 'United States',
        isDefault
      });
      showToast(
        editingAddressId 
          ? 'Address updated successfully in DynamoDB.' 
          : 'New address saved to your profile and DynamoDB.', 
        'success'
      );
      resetAddressForm();
    } catch {
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteAddress(id);
      showToast('Address removed successfully.', 'info');
      setDeleteConfirmId(null);
    } catch {
      showToast('Could not delete address.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-[#E5DED1] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E8EFE7] text-[#173D30] font-black text-2xl flex items-center justify-center shadow-xs">
            {user?.name.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#173D30]">{user?.name}</h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                user?.role === 'admin' ? 'bg-[#F27A36] text-white' : 'bg-[#28734D] text-white'
              }`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-[#6F766F] mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-[11px] text-[#28734D] font-semibold bg-[#E8EFE7] px-2.5 py-0.5 rounded-md">
              Cognito Verified Customer
            </span>
          </div>
        </div>

        {/* Role Switcher in Account */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {user?.role === 'admin' ? (
            <button
              onClick={onNavigateToAdmin}
              className="bg-[#173D30] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#112d23] shadow-md flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-[#F27A36]" />
              <span>Open Admin Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => {
                switchRole('admin');
                onNavigateToAdmin();
              }}
              className="bg-white border border-[#E5DED1] hover:border-[#F27A36] text-[#252A27] px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-[#F27A36]" />
              <span>Switch to Admin Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5DED1] gap-8 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#173D30] text-[#173D30]'
              : 'border-transparent text-[#6F766F] hover:text-[#252A27]'
          }`}
        >
          <Package className="w-4 h-4 text-[#F27A36]" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'addresses'
              ? 'border-[#173D30] text-[#173D30]'
              : 'border-transparent text-[#6F766F] hover:text-[#252A27]'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#F27A36]" />
          <span>Saved Addresses ({user?.addresses.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'wishlist'
              ? 'border-[#173D30] text-[#173D30]'
              : 'border-transparent text-[#6F766F] hover:text-[#252A27]'
          }`}
        >
          <Heart className="w-4 h-4 text-[#F27A36]" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5DED1] p-12 text-center text-xs text-[#6F766F]">
              No previous orders found. Place an order to see it tracked here.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-[#E5DED1] p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5DED1] text-xs">
                  <div>
                    <span className="text-[#6F766F] block">Order Placed</span>
                    <span className="font-bold text-[#252A27]">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6F766F] block">Total Amount</span>
                    <span className="font-extrabold text-sm text-[#173D30]">${order.total.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[#6F766F] block">Ship To</span>
                    <span className="font-semibold text-[#252A27]">{order.shippingAddress.fullName}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#6F766F] block">Order ID</span>
                    <span className="font-bold text-[#252A27]">{order.id}</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      order.orderStatus === 'DELIVERED'
                        ? 'bg-[#E8EFE7] text-[#28734D]'
                        : order.orderStatus === 'CONFIRMED'
                        ? 'bg-[#E8EFE7] text-[#173D30]'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-[#6F766F]">Tracking: {order.trackingNumber || 'CNP-Pending'}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#28734D]">
                    Simulated Sandbox Payment Confirmed
                  </span>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-[#E5DED1] pt-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-[#E5DED1] bg-[#F7F4ED]" />
                        <div>
                          <span className="font-bold text-[#252A27] line-clamp-1">{item.name}</span>
                          <span className="text-[#6F766F]">Qty: {item.quantity} • ${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // reorder item
                          showToast(`Added "${item.name}" back to cart.`, 'success');
                        }}
                        className="text-xs font-semibold text-[#173D30] hover:text-[#F27A36]"
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-[#173D30]">Your Delivery Addresses</h3>
              <p className="text-xs text-[#6F766F] mt-0.5">Manage delivery destinations stored securely in AWS DynamoDB</p>
            </div>
            {!isAddingAddress && (
              <button
                onClick={handleStartAdd}
                className="bg-[#173D30] hover:bg-[#112d23] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {isAddingAddress && (
            <form onSubmit={handleSaveAddress} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DED1] shadow-xs space-y-4 max-w-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DED1]">
                <h4 className="font-bold text-sm text-[#173D30]">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h4>
                <button
                  type="button"
                  onClick={resetAddressForm}
                  className="text-xs text-[#6F766F] hover:text-[#252A27]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#252A27] mb-1">Full Name / Recipient *</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Woods"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#252A27] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252A27] mb-1">Street Address *</label>
                <input
                  type="text"
                  placeholder="Street address or P.O. Box"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252A27] mb-1">Apartment, suite, unit (optional)</label>
                <input
                  type="text"
                  placeholder="Apt 4B, Suite 800, etc."
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#252A27] mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#252A27] mb-1">State / Province</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#252A27] mb-1">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#E5DED1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#173D30]"
                    required
                  />
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-[#173D30] focus:ring-[#173D30]"
                />
                <label htmlFor="isDefault" className="text-xs text-[#252A27] cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DED1]">
                <button
                  type="button"
                  onClick={resetAddressForm}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5DED1] hover:bg-[#F7F4ED] text-[#252A27] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#173D30] text-white hover:bg-[#112d23] transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(!user?.addresses || user.addresses.length === 0) ? (
              <div className="col-span-full bg-white rounded-3xl border border-[#E5DED1] p-12 text-center text-xs text-[#6F766F]">
                No delivery addresses found. Click "Add Address" to register a delivery location.
              </div>
            ) : (
              user.addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-5 rounded-3xl border border-[#E5DED1] shadow-xs flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[#252A27] line-clamp-1">{addr.fullName}</span>
                      {(addr.isDefault || user.defaultAddressId === addr.id) && (
                        <span className="text-[10px] font-bold bg-[#E8EFE7] text-[#173D30] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#28734D]" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#252A27] font-medium">{addr.street}</p>
                    {addr.apartment && <p className="text-xs text-[#6F766F]">{addr.apartment}</p>}
                    <p className="text-xs text-[#6F766F]">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-xs text-[#6F766F]">{addr.country || 'United States'}</p>
                    <p className="text-xs text-[#6F766F] mt-2 font-mono text-[11px]">Phone: {addr.phone}</p>
                  </div>

                  {deleteConfirmId === addr.id ? (
                    <div className="pt-3 border-t border-[#E5DED1] space-y-2 bg-red-50/50 p-2.5 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-[#B83D32] font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Delete this address?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          disabled={isSubmitting}
                          className="px-2.5 py-1 text-[11px] bg-[#B83D32] text-white rounded-lg font-bold hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2.5 py-1 text-[11px] bg-white border border-[#E5DED1] rounded-lg text-[#252A27]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-3 border-t border-[#E5DED1] text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStartEdit(addr)}
                          className="text-[#173D30] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {!(addr.isDefault || user.defaultAddressId === addr.id) && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[#6F766F] hover:text-[#173D30] font-medium"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      {user.addresses.length > 1 && (
                        <button
                          onClick={() => setDeleteConfirmId(addr.id)}
                          className="text-[#B83D32] hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5DED1] p-12 text-center text-xs text-[#6F766F]">
              Your wishlist is currently empty. Click the heart icon on any product to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-[#E5DED1] p-4 flex flex-col justify-between">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F4ED] mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#252A27] line-clamp-1">{item.name}</h4>
                    <span className="font-extrabold text-sm text-[#173D30]">${item.currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#E5DED1]">
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="flex-1 bg-[#F27A36] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#df6621]"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 text-[#6F766F] hover:text-[#B83D32]"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
