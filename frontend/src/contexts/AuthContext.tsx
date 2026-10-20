import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, CustomerAddress } from '../types';
import { cognitoAuth } from '../services/cognitoAuth';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'signin' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'signin' | 'register';
  login: (email: string, password?: string, role?: 'customer' | 'admin') => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  confirmSignUp: (name: string, email: string, code: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  resendCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: 'customer' | 'admin') => void;
  saveAddress: (address: Omit<CustomerAddress, 'id'> & { id?: string }) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
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
    // Default demo customer session
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

  // Load addresses on mount or when user changes
  useEffect(() => {
    if (user?.id) {
      api.getUserAddresses().then((serverAddrs) => {
        if (serverAddrs && serverAddrs.length > 0) {
          setUser((prev) => (prev ? { ...prev, addresses: serverAddrs } : prev));
        }
      }).catch(() => {
        // Fallback to local addresses
      });
    }
  }, [user?.id]);

  const openAuthModal = (mode: 'signin' | 'register' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password?: string, role: 'customer' | 'admin' = 'customer') => {
    const res = await cognitoAuth.signIn(email, password, role);
    if (res.success && res.user) {
      // Ensure user has addresses
      const userWithAddrs: User = {
        ...res.user,
        addresses: res.user.addresses && res.user.addresses.length > 0 ? res.user.addresses : (user?.addresses || DEFAULT_ADDRESSES),
        defaultAddressId: user?.defaultAddressId || 'addr-1'
      };
      setUser(userWithAddrs);
      closeAuthModal();
      return { success: true };
    }
    return { 
      success: false, 
      error: res.error || 'Authentication failed. Please verify credentials.',
      requiresVerification: res.requiresVerification
    };
  };

  const register = async (name: string, email: string, password?: string) => {
    const res = await cognitoAuth.signUp(name, email, password);
    if (res.success) {
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed.' };
  };

  const confirmSignUp = async (name: string, email: string, code: string, password?: string) => {
    const res = await cognitoAuth.confirmSignUp(name, email, code, password);
    if (res.success && res.user) {
      setUser({
        ...res.user,
        addresses: DEFAULT_ADDRESSES,
        defaultAddressId: 'addr-1'
      });
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid confirmation code.' };
  };

  const resendCode = async (email: string) => {
    return await cognitoAuth.resendConfirmationCode(email);
  };

  const forgotPassword = async (email: string) => {
    return await cognitoAuth.forgotPassword(email);
  };

  const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
    return await cognitoAuth.confirmForgotPassword(email, code, newPassword);
  };

  const logout = () => {
    cognitoAuth.signOut();
    setUser(null);
  };

  const switchRole = (newRole: 'customer' | 'admin') => {
    if (!user) {
      login(newRole === 'admin' ? 'admin@canopy.store' : 'alex.woods@canopy.shop', undefined, newRole);
      return;
    }
    setUser({
      ...user,
      role: newRole,
      name: newRole === 'admin' ? 'Elena Vance (Administrator)' : 'Alex Woods',
      email: newRole === 'admin' ? 'admin@canopy.store' : 'alex.woods@canopy.shop'
    });
  };

  const saveAddress = async (addressData: Omit<CustomerAddress, 'id'> & { id?: string }) => {
    if (!user) return;
    const addressId = addressData.id || `addr-${Date.now()}`;
    const newAddress: CustomerAddress = {
      ...addressData,
      id: addressId
    };

    let updatedAddresses = [...user.addresses];
    const existingIndex = updatedAddresses.findIndex(a => a.id === addressId);

    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (existingIndex >= 0) {
      updatedAddresses[existingIndex] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    setUser({
      ...user,
      addresses: updatedAddresses,
      defaultAddressId: newAddress.isDefault ? newAddress.id : user.defaultAddressId
    });

    // Sync to backend DynamoDB API
    try {
      await api.saveAddress(newAddress);
    } catch {
      // Offline fallback maintained in user state
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;
    const updated = user.addresses.filter(a => a.id !== id);
    setUser({
      ...user,
      addresses: updated,
      defaultAddressId: user.defaultAddressId === id ? updated[0]?.id : user.defaultAddressId
    });

    try {
      await api.deleteAddress(id);
    } catch {
      // Local fallback
    }
  };

  const setDefaultAddress = async (id: string) => {
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

    try {
      await api.setDefaultAddress(id);
    } catch {
      // Local fallback
    }
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
        confirmSignUp,
        resendCode,
        forgotPassword,
        confirmForgotPassword,
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
