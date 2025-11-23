'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Address } from '@/types';
import { useAuth } from './AuthContext';

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  selectedAddressId: string | null;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  selectAddress: (addressId: string) => void;
  getDefaultAddress: () => Address | null;
  getSelectedAddress: () => Address | null;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const ADDRESSES_STORAGE_KEY = 'ecommerce_addresses';
const SELECTED_ADDRESS_KEY = 'ecommerce_selected_address';

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Load addresses from localStorage for guest users
  const loadAddressesFromLocalStorage = (): Address[] => {
    try {
      const savedAddresses = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (savedAddresses) {
        return JSON.parse(savedAddresses) as Address[];
      }
    } catch (error) {
      console.error('Error loading addresses from localStorage:', error);
    }
    return [];
  };

  // Save addresses to localStorage for guest users
  const saveAddressesToLocalStorage = (addressList: Address[]) => {
    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addressList));
    } catch (error) {
      console.error('Error saving addresses to localStorage:', error);
    }
  };

  // Load selected address ID from localStorage
  const loadSelectedAddressId = (): string | null => {
    try {
      return localStorage.getItem(SELECTED_ADDRESS_KEY);
    } catch (error) {
      console.error('Error loading selected address:', error);
      return null;
    }
  };

  // Save selected address ID to localStorage
  const saveSelectedAddressId = (addressId: string | null) => {
    try {
      if (addressId) {
        localStorage.setItem(SELECTED_ADDRESS_KEY, addressId);
      } else {
        localStorage.removeItem(SELECTED_ADDRESS_KEY);
      }
    } catch (error) {
      console.error('Error saving selected address:', error);
    }
  };

  // Load addresses from Firestore for logged-in users
  const loadAddressesFromFirestore = async (userId: string): Promise<Address[]> => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        return (userData.addresses || []) as Address[];
      }
    } catch (error) {
      console.error('Error loading addresses from Firestore:', error);
    }
    return [];
  };

  // Save addresses to Firestore for logged-in users
  const saveAddressesToFirestore = async (userId: string, addressList: Address[]) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { addresses: addressList }, { merge: true });
    } catch (error) {
      console.error('Error saving addresses to Firestore:', error);
    }
  };

  // Initialize addresses
  useEffect(() => {
    const initAddresses = async () => {
      setLoading(true);

      if (user) {
        // User is logged in, load from Firestore
        const firestoreAddresses = await loadAddressesFromFirestore(user.id);
        setAddresses(firestoreAddresses);

        // Set default address as selected if none is selected
        const savedSelectedId = loadSelectedAddressId();
        if (savedSelectedId && firestoreAddresses.some(a => a.id === savedSelectedId)) {
          setSelectedAddressId(savedSelectedId);
        } else {
          const defaultAddress = firestoreAddresses.find(a => a.isDefault);
          setSelectedAddressId(defaultAddress?.id || null);
        }
      } else {
        // User is not logged in, load from localStorage
        const localAddresses = loadAddressesFromLocalStorage();
        setAddresses(localAddresses);

        const savedSelectedId = loadSelectedAddressId();
        if (savedSelectedId && localAddresses.some(a => a.id === savedSelectedId)) {
          setSelectedAddressId(savedSelectedId);
        } else {
          const defaultAddress = localAddresses.find(a => a.isDefault);
          setSelectedAddressId(defaultAddress?.id || null);
        }
      }

      setLoading(false);
    };

    initAddresses();
  }, [user]);

  // Add new address
  const addAddress = async (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    };

    // If this is the first address, make it default
    if (addresses.length === 0) {
      newAddress.isDefault = true;
    }

    // If new address is default, unset other defaults
    const updatedAddresses = newAddress.isDefault
      ? addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress)
      : [...addresses, newAddress];

    setAddresses(updatedAddresses);

    // Auto-select if it's default or first address
    if (newAddress.isDefault || addresses.length === 0) {
      setSelectedAddressId(newAddress.id);
      saveSelectedAddressId(newAddress.id);
    }

    if (user) {
      await saveAddressesToFirestore(user.id, updatedAddresses);
    } else {
      saveAddressesToLocalStorage(updatedAddresses);
    }
  };

  // Update existing address
  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    const updatedAddresses = addresses.map(address => {
      if (address.id === addressId) {
        return { ...address, ...updates };
      }
      // If updating to default, unset other defaults
      if (updates.isDefault && address.id !== addressId) {
        return { ...address, isDefault: false };
      }
      return address;
    });

    setAddresses(updatedAddresses);

    if (user) {
      await saveAddressesToFirestore(user.id, updatedAddresses);
    } else {
      saveAddressesToLocalStorage(updatedAddresses);
    }
  };

  // Delete address
  const deleteAddress = async (addressId: string) => {
    const updatedAddresses = addresses.filter(a => a.id !== addressId);

    // If deleted address was default and there are other addresses, make first one default
    const deletedAddress = addresses.find(a => a.id === addressId);
    if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    setAddresses(updatedAddresses);

    // Update selected address if deleted
    if (selectedAddressId === addressId) {
      const newSelectedId = updatedAddresses.find(a => a.isDefault)?.id || updatedAddresses[0]?.id || null;
      setSelectedAddressId(newSelectedId);
      saveSelectedAddressId(newSelectedId);
    }

    if (user) {
      await saveAddressesToFirestore(user.id, updatedAddresses);
    } else {
      saveAddressesToLocalStorage(updatedAddresses);
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId: string) => {
    await updateAddress(addressId, { isDefault: true });
  };

  // Select address for checkout
  const selectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    saveSelectedAddressId(addressId);
  };

  // Get default address
  const getDefaultAddress = (): Address | null => {
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  };

  // Get selected address
  const getSelectedAddress = (): Address | null => {
    if (selectedAddressId) {
      return addresses.find(a => a.id === selectedAddressId) || null;
    }
    return getDefaultAddress();
  };

  const value: AddressContextType = {
    addresses,
    loading,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    getDefaultAddress,
    getSelectedAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}
