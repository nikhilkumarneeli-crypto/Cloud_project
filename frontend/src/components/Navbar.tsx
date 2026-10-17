import React, { useState, useRef, useEffect } from 'react';
import { 
  Trees, 
  MapPin, 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  ShieldAlert, 
  ChevronDown, 
  X, 
  Package, 
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useStore } from '../contexts/StoreContext';
import { productCategories } from '../data/mockProducts';
import type { ProductCategory } from '../types';

interface NavbarProps {
  onOpenDeliveryModal: () => void;
  deliveryLocation: string;
  activeView: 'home' | 'cart' | 'checkout' | 'account' | 'admin';
  setActiveView: (view: 'home' | 'cart' | 'checkout' | 'account' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDeliveryModal,
  deliveryLocation,
  activeView,
  setActiveView
}) => {
  const { user, isAdmin, openAuthModal, logout, switchRole } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { filters, updateFilter, resetFilters, products } = useStore();

  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('searchQuery', searchInput);
    if (selectedCategory !== 'All') {
      updateFilter('category', selectedCategory as ProductCategory);
    } else {
      updateFilter('category', 'All');
    }
    setIsSearchFocused(false);
    if (activeView !== 'home') {
      setActiveView('home');
    }
  };

  const handleAutocompleteClick = (productName: string) => {
    setSearchInput(productName);
    updateFilter('searchQuery', productName);
    setIsSearchFocused(false);
    if (activeView !== 'home') {
      setActiveView('home');
    }
  };

  const suggestions = searchInput.trim().length > 1
    ? products
        .filter((p) => p.name.toLowerCase().includes(searchInput.toLowerCase()) || p.category.toLowerCase().includes(searchInput.toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#173D30] text-white shadow-md">
      {/* Main Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 md:gap-6">
          
          {/* Logo & Delivery Location */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Brand Logo */}
            <button
              onClick={() => {
                resetFilters();
                setActiveView('home');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              aria-label="Canopy Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE7] flex items-center justify-center text-[#173D30] shadow-sm group-hover:scale-105 transition-transform">
                <Trees className="w-6 h-6 text-[#173D30]" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-xl lg:text-2xl tracking-wider text-white">
                  CANOPY
                </span>
                <span className="block text-[10px] tracking-widest text-[#E8EFE7]/80 uppercase font-medium">
                  Forest Retail
                </span>
              </div>
            </button>

            {/* Delivery Location Selector */}
            <button
              onClick={onOpenDeliveryModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/20 hover:bg-white/5 text-left text-xs transition-colors"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-[#F27A36] shrink-0" />
              <div>
                <span className="block text-[11px] text-[#E8EFE7]/80">Deliver to</span>
                <span className="font-semibold text-white truncate max-w-[120px] block">
                  {deliveryLocation}
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar with Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex h-11 w-full rounded-xl overflow-hidden shadow-sm bg-white ring-2 ring-transparent focus-within:ring-[#F27A36]">
              {/* Category Select inside Search */}
              <div className="relative hidden md:flex items-center bg-[#E8EFE7] border-r border-[#E5DED1] text-[#252A27]">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value === 'All') {
                      updateFilter('category', 'All');
                    } else {
                      updateFilter('category', e.target.value as ProductCategory);
                    }
                  }}
                  className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-semibold cursor-pointer focus:outline-hidden text-[#173D30]"
                >
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#173D30] absolute right-2 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Search 20+ eco-friendly products, audio, apparel, kitchen..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full h-full px-4 text-sm text-[#252A27] bg-white placeholder-[#6F766F] focus:outline-hidden"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      updateFilter('searchQuery', '');
                    }}
                    className="p-1 mr-2 text-[#6F766F] hover:text-[#252A27]"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="bg-[#F27A36] hover:bg-[#df6621] text-white px-5 flex items-center justify-center transition-colors shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Autocomplete Suggestions Box */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-[#E5DED1] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-[#E5DED1] text-[11px] font-semibold uppercase tracking-wider text-[#6F766F] flex justify-between">
                  <span>Suggested Products</span>
                  <span className="text-[#173D30] font-normal">{suggestions.length} results</span>
                </div>
                <div className="divide-y divide-[#E5DED1]">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAutocompleteClick(item.name)}
                      className="p-3 hover:bg-[#E8EFE7] cursor-pointer flex items-center justify-between text-[#252A27] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-[#E5DED1]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#173D30] line-clamp-1">{item.name}</p>
                          <p className="text-xs text-[#6F766F]">{item.category} • {item.brand}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-[#252A27]">${item.currentPrice.toFixed(2)}</span>
                        {item.stockQuantity <= 15 && (
                          <span className="block text-[10px] text-[#B83D32] font-medium">Only {item.stockQuantity} left</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Account & Role Switcher */}
            <div ref={accountMenuRef} className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent hover:border-white/20 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8EFE7] text-[#173D30] flex items-center justify-center font-bold text-sm">
                  {user ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden xl:block leading-tight">
                  <span className="block text-[11px] text-[#E8EFE7]/80">
                    Hello, {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                  <span className="font-semibold text-xs flex items-center gap-1">
                    {user?.role === 'admin' ? (
                      <span className="text-[#F27A36] font-bold">Admin Portal</span>
                    ) : (
                      <span>Account & Lists</span>
                    )}
                    <ChevronDown className="w-3 h-3 text-[#E8EFE7]/80" />
                  </span>
                </div>
              </button>

              {/* Account Dropdown */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-[#252A27] rounded-xl shadow-xl border border-[#E5DED1] overflow-hidden z-50 animate-in fade-in duration-100">
                  <div className="p-4 bg-[#E8EFE7] border-b border-[#E5DED1]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#6F766F]">
                        Current Profile
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        user?.role === 'admin' ? 'bg-[#173D30] text-white' : 'bg-[#28734D] text-white'
                      }`}>
                        {user?.role || 'Guest'}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-[#173D30] truncate">{user ? user.name : 'Guest Shopper'}</p>
                    <p className="text-xs text-[#6F766F] truncate">{user?.email || 'Not signed in'}</p>
                  </div>

                  {/* Switch Role Fast Toggle */}
                  <div className="p-3 bg-[#F7F4ED] border-b border-[#E5DED1]">
                    <span className="text-[11px] font-semibold text-[#6F766F] block mb-2">
                      Demonstration Role Switcher
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          switchRole('customer');
                          setIsAccountMenuOpen(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          user?.role !== 'admin'
                            ? 'bg-[#173D30] text-white border-[#173D30]'
                            : 'bg-white text-[#252A27] border-[#E5DED1] hover:border-[#173D30]'
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() => {
                          switchRole('admin');
                          setActiveView('admin');
                          setIsAccountMenuOpen(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          user?.role === 'admin'
                            ? 'bg-[#173D30] text-white border-[#173D30]'
                            : 'bg-white text-[#252A27] border-[#E5DED1] hover:border-[#173D30]'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-2 space-y-1 text-sm font-medium">
                    <button
                      onClick={() => {
                        setActiveView('account');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#E8EFE7] text-left text-[#173D30]"
                    >
                      <UserIcon className="w-4 h-4 text-[#6F766F]" />
                      <span>My Account & Addresses</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('account');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#E8EFE7] text-left text-[#173D30]"
                    >
                      <Package className="w-4 h-4 text-[#6F766F]" />
                      <span>Orders & Tracking</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveView('admin');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#E8EFE7] text-left text-[#F27A36] font-bold"
                      >
                        <ShieldAlert className="w-4 h-4 text-[#F27A36]" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>

                  {/* Sign In / Sign Out */}
                  <div className="p-2 border-t border-[#E5DED1]">
                    {user ? (
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#B83D32] hover:bg-red-50 rounded-lg text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full bg-[#F27A36] hover:bg-[#df6621] text-white py-2 rounded-lg text-xs font-bold text-center"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => setActiveView('account')}
              className="relative p-2.5 rounded-xl border border-transparent hover:border-white/20 hover:bg-white/5 transition-colors"
              title="Saved Items / Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6 text-white" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F27A36] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F27A36] hover:bg-[#df6621] text-white font-bold text-sm shadow-md transition-all hover:scale-105"
              aria-label="Open Cart Drawer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#173D30] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

          </div>
        </div>
      </div>

      {/* Category Navigation Sub-Bar */}
      <nav aria-label="Product Categories" className="bg-[#112d23] border-t border-[#235544] px-4 sm:px-6 lg:px-8 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => {
              resetFilters();
              setActiveView('home');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filters.category === 'All' && !filters.searchQuery
                ? 'bg-[#E8EFE7] text-[#173D30] font-bold'
                : 'text-[#E8EFE7] hover:bg-white/10 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Products</span>
          </button>

          {productCategories.filter(c => c !== 'All').map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  updateFilter('category', cat as ProductCategory);
                  if (activeView !== 'home') setActiveView('home');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#E8EFE7] text-[#173D30] font-bold'
                    : 'text-[#E8EFE7] hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-[#235544] mx-2 shrink-0" />

          {/* Special Quick Filters */}
          <button
            onClick={() => {
              resetFilters();
              updateFilter('sortBy', 'price-low');
              if (activeView !== 'home') setActiveView('home');
            }}
            className="px-3 py-1.5 rounded-lg whitespace-nowrap text-[#F27A36] hover:bg-white/10 font-bold"
          >
            Trending Deals
          </button>
          
          <button
            onClick={() => {
              resetFilters();
              updateFilter('sortBy', 'rating');
              if (activeView !== 'home') setActiveView('home');
            }}
            className="px-3 py-1.5 rounded-lg whitespace-nowrap text-[#E8EFE7] hover:bg-white/10"
          >
            Top Rated
          </button>
        </div>
      </nav>
    </header>
  );
};
