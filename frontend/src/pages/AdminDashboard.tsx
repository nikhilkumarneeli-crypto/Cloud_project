import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Boxes
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { productCategories } from '../data/mockProducts';
import type { Product, ProductCategory, Order } from '../types';

export const AdminDashboard: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isAdmin, switchRole } = useAuth();
  const { products, orders, addProduct, updateProduct, deleteProduct, updateStock, updateOrderStatus } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Electronics');
  const [prodBrand, setProdBrand] = useState('');
  const [prodPrice, setProdPrice] = useState(99.99);
  const [prodOrigPrice, setProdOrigPrice] = useState(129.99);
  const [prodStock, setProdStock] = useState(25);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
  const [prodDesc, setProdDesc] = useState('');

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'SIMULATED_SUCCESS' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter(p => p.isActive).length;
  const lowStockCount = products.filter(p => p.stockQuantity <= 15).length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Electronics');
    setProdBrand('Canopy Timber');
    setProdPrice(89.00);
    setProdOrigPrice(110.00);
    setProdStock(20);
    setProdDesc('Artisan handcrafted sustainable hardware crafted from regenerative forest timber.');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdBrand(p.brand);
    setProdPrice(p.currentPrice);
    setProdOrigPrice(p.originalPrice);
    setProdStock(p.stockQuantity);
    setProdImage(p.image);
    setProdDesc(p.description);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.max(0, Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100));

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        currentPrice: prodPrice,
        originalPrice: prodOrigPrice,
        discountPercentage: discount,
        stockQuantity: prodStock,
        image: prodImage,
        description: prodDesc
      });
    } else {
      addProduct({
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        currentPrice: prodPrice,
        originalPrice: prodOrigPrice,
        discountPercentage: discount,
        stockQuantity: prodStock,
        image: prodImage,
        description: prodDesc,
        rating: 4.8,
        reviewCount: 1,
        specifications: { 'Origin': 'Sustainable Sourcing', 'Material': 'Certified Organic' },
        isActive: true,
        badge: 'New Item'
      });
    }
    setIsAddModalOpen(false);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-[#E5DED1] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#B83D32] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#252A27]">Access Restricted: Administrator Only</h2>
        <p className="text-xs text-[#6F766F]">
          You are currently signed in as a regular customer. To preview the administrative functions, switch to the Admin Demo role.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => switchRole('admin')}
            className="bg-[#173D30] hover:bg-[#112d23] text-white py-3 rounded-xl font-bold text-xs"
          >
            Authorize as Admin Demo
          </button>
          <button
            onClick={onNavigateHome}
            className="border border-[#E5DED1] py-2.5 rounded-xl text-xs font-semibold text-[#6F766F]"
          >
            Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DED1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#173D30] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Control Center
            </span>
            <span className="text-xs text-[#28734D] font-bold">AWS Cognito Admin Group Verified</span>
          </div>
          <h1 className="text-3xl font-black text-[#173D30] mt-1">Store Administration & Operations</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#F27A36] hover:bg-[#df6621] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5DED1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6F766F]">Total Realized Revenue</span>
            <span className="block text-2xl font-black text-[#173D30] mt-1">${totalRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-[#28734D] font-bold">Simulated Sandbox Live</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE7] text-[#173D30] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5DED1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6F766F]">Processed Orders</span>
            <span className="block text-2xl font-black text-[#252A27] mt-1">{totalOrdersCount}</span>
            <span className="text-[10px] text-[#6F766F]">Across all channels</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE7] text-[#173D30] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5DED1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6F766F]">Active Catalog Items</span>
            <span className="block text-2xl font-black text-[#252A27] mt-1">{activeProductsCount}</span>
            <span className="text-[10px] text-[#28734D] font-bold">7 Departments</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE7] text-[#173D30] flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5DED1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6F766F]">Low Stock Warning</span>
            <span className="block text-2xl font-black text-[#B83D32] mt-1">{lowStockCount}</span>
            <span className="text-[10px] text-[#B83D32] font-semibold">&le; 15 units remaining</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B83D32] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5DED1] gap-6 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 border-b-2 flex items-center gap-2 ${
            activeTab === 'inventory' ? 'border-[#173D30] text-[#173D30]' : 'border-transparent text-[#6F766F]'
          }`}
        >
          <Boxes className="w-4 h-4 text-[#F27A36]" />
          <span>Product Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-[#173D30] text-[#173D30]' : 'border-transparent text-[#6F766F]'
          }`}
        >
          <Package className="w-4 h-4 text-[#F27A36]" />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* 1. Inventory Management Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-[#E5DED1] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E8EFE7] text-[#173D30] font-bold uppercase tracking-wider text-[11px] border-b border-[#E5DED1]">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Live Inventory</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DED1]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F7F4ED] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-[#E5DED1] bg-[#F7F4ED]" />
                      <div className="max-w-xs">
                        <span className="font-bold text-[#252A27] line-clamp-1 block">{prod.name}</span>
                        <span className="text-[11px] text-[#6F766F]">{prod.brand} • ID: {prod.id}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#6F766F]">{prod.category}</td>
                    <td className="p-4 font-extrabold text-[#252A27] text-sm">${prod.currentPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={prod.stockQuantity}
                          onChange={(e) => updateStock(prod.id, parseInt(e.target.value) || 0)}
                          className="w-16 bg-white border border-[#E5DED1] rounded-lg px-2 py-1 font-bold text-center text-[#252A27]"
                        />
                        {prod.stockQuantity <= 15 && (
                          <span className="text-[10px] text-[#B83D32] font-semibold">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => updateProduct(prod.id, { isActive: !prod.isActive })}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          prod.isActive ? 'bg-[#E8EFE7] text-[#28734D]' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-[#173D30] hover:bg-[#E8EFE7] rounded-lg"
                        title="Edit Product"
                        aria-label={`Edit ${prod.name}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-[#B83D32] hover:bg-red-50 rounded-lg"
                        title="Delete Product"
                        aria-label={`Delete ${prod.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E5DED1] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E8EFE7] text-[#173D30] font-bold uppercase tracking-wider text-[11px] border-b border-[#E5DED1]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DED1]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F7F4ED]">
                    <td className="p-4 font-bold text-[#173D30]">{ord.id}</td>
                    <td className="p-4">
                      <span className="font-semibold text-[#252A27] block">{ord.shippingAddress.fullName}</span>
                      <span className="text-[11px] text-[#6F766F]">{ord.shippingAddress.city}, {ord.shippingAddress.state}</span>
                    </td>
                    <td className="p-4 font-black text-[#252A27] text-sm">${ord.total.toFixed(2)}</td>
                    <td className="p-4 text-[#6F766F]">
                      {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                        className="bg-white border border-[#E5DED1] rounded-xl px-3 py-1.5 font-bold text-xs text-[#173D30]"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div 
            className="bg-white rounded-3xl max-w-xl w-full border border-[#E5DED1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-product-modal-title"
          >
            <div className="bg-[#173D30] text-white p-5 flex items-center justify-between">
              <h3 id="admin-product-modal-title" className="font-bold text-base">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
                aria-label="Close product form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 bg-[#F7F4ED] max-h-[80vh] overflow-y-auto">
              <div>
                <label htmlFor="admin-product-name" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Product Title</label>
                <input
                  id="admin-product-name"
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="admin-product-category" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Department</label>
                  <select
                    id="admin-product-category"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                  >
                    {productCategories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="admin-product-brand" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Brand</label>
                  <input
                    id="admin-product-brand"
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="admin-product-current-price" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Price ($)</label>
                  <input
                    id="admin-product-current-price"
                    type="number"
                    step="0.01"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseFloat(e.target.value))}
                    className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="admin-product-original-price" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Original ($)</label>
                  <input
                    id="admin-product-original-price"
                    type="number"
                    step="0.01"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(parseFloat(e.target.value))}
                    className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="admin-product-stock-qty" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Stock Quantity</label>
                  <input
                    id="admin-product-stock-qty"
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(parseInt(e.target.value))}
                    className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-product-image-url" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Image URL</label>
                <input
                  id="admin-product-image-url"
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-product-description" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">Description</label>
                <textarea
                  id="admin-product-description"
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-white border border-[#E5DED1] rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DED1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5DED1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#F27A36] text-white hover:bg-[#df6621]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
