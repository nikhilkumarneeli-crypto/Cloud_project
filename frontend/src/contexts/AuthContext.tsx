import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, CustomerAddress } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'signin' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'signin' | 'register';
  login: (email: string, role?: 'customer' | 'admin') => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'customer' | 'admin') => void;
  saveAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEFAULT_ADDRESSES: CustomerAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Alex Woods',
    phone: '+1 (206) 555-0192',
    street: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Alex Woods (Office)',
    phone: '+1 (206) 555-0192',
    street: '1200 Pine Street',
    apartment: 'Suite 800',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98104',
    country: 'United States',
    isDefault: false
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('canopy_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default active demo customer session for seamless review
    return {
      id: 'usr-customer-01',
      name: 'Alex Woods',
      email: 'alex.woods@canopy.shop',
      role: 'customer',
      addresses: DEFAULT_ADDRESSES,
      defaultAddressId: 'addr-1',
      token: 'mock-jwt-customer-token'
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');

  useEffect(() => {
    if (user) {
      localStorage.setItem('canopy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('canopy_user');
    }
  }, [user]);

  const openAuthModal = (mode: 'signin' | 'register' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, role: 'customer' | 'admin' = 'customer') => {
    const isAdmin = role === 'admin' || email.includes('admin');
    const newUser: User = {
      id: isAdmin ? 'usr-admin-01' : 'usr-customer-01',
      name: isAdmin ? 'Elena Vance (Administrator)' : (email.split('@')[0] || 'Customer'),
      email,
      role: isAdmin ? 'admin' : 'customer',
      addresses: DEFAULT_ADDRESSES,
      defaultAddressId: 'addr-1',
      token: `cognito-jwt-${isAdmin ? 'admin' : 'customer'}-${Date.now()}`
    };
    setUser(newUser);
    closeAuthModal();
  };

  const register = async (name: string, email: string) => {
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      role: 'customer',
      addresses: [],
      token: `cognito-jwt-customer-${Date.now()}`
    };
    setUser(newUser);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: 'customer' | 'admin') => {
    if (!user) {
      login(newRole === 'admin' ? 'admin@canopy.shop' : 'alex.woods@canopy.shop', newRole);
      return;
    }
    setUser({
      ...user,
      role: newRole,
      name: newRole === 'admin' ? 'Elena Vance (Administrator)' : 'Alex Woods',
      email: newRole === 'admin' ? 'admin@canopy.shop' : 'alex.woods@canopy.shop'
    });
  };

  const saveAddress = (addressData: Omit<CustomerAddress, 'id'>) => {
    if (!user) return;
    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    let updatedAddresses = [...user.addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);
    setUser({
      ...user,
      addresses: updatedAddresses,
      defaultAddressId: newAddress.isDefault ? newAddress.id : user.defaultAddressId
    });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.filter(a => a.id !== id);
    setUser({
      ...user,
      addresses: updated,
      defaultAddressId: user.defaultAddressId === id ? updated[0]?.id : user.defaultAddressId
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setUser({
      ...user,
      addresses: updated,
      defaultAddressId: id
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        login,
        register,
        logout,
        switchRole,
        saveAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
