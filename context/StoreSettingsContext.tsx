'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StoreInfo {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logo?: string;
  currency: string;
  timezone: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  rate: number;
  rateType: 'flat' | 'percentage';
  minOrderAmount?: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface TaxSettings {
  enabled: boolean;
  rate: number;
  includedInPrice: boolean;
  taxName: string;
}

export interface StoreSettings {
  storeInfo: StoreInfo;
  shippingRates: ShippingRate[];
  tax: TaxSettings;
  updatedAt: Timestamp;
}

interface StoreSettingsContextType {
  settings: StoreSettings | null;
  loading: boolean;
  updateStoreInfo: (info: Partial<StoreInfo>) => Promise<void>;
  updateShippingRates: (rates: ShippingRate[]) => Promise<void>;
  updateTaxSettings: (tax: Partial<TaxSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultStoreInfo: StoreInfo = {
  name: 'My E-Commerce Store',
  description: 'Modern shopping experience for small businesses',
  email: 'contact@mystore.com',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  currency: 'USD',
  timezone: 'America/New_York',
};

const defaultShippingRates: ShippingRate[] = [
  {
    id: '1',
    name: 'Standard Shipping',
    description: 'Delivery within 5-7 business days',
    rate: 5.99,
    rateType: 'flat',
    estimatedDays: '5-7',
    isActive: true,
  },
  {
    id: '2',
    name: 'Express Shipping',
    description: 'Delivery within 2-3 business days',
    rate: 15.99,
    rateType: 'flat',
    estimatedDays: '2-3',
    isActive: true,
  },
  {
    id: '3',
    name: 'Free Shipping',
    description: 'Free delivery on orders over $100',
    rate: 0,
    rateType: 'flat',
    minOrderAmount: 100,
    estimatedDays: '5-7',
    isActive: true,
  },
];

const defaultTaxSettings: TaxSettings = {
  enabled: true,
  rate: 8.5,
  includedInPrice: false,
  taxName: 'Sales Tax',
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

const SETTINGS_DOC_ID = 'store_config';

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsRef = doc(db, 'storeSettings', SETTINGS_DOC_ID);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as StoreSettings);
      } else {
        // Initialize with default settings if not exists
        const defaultSettings: StoreSettings = {
          storeInfo: defaultStoreInfo,
          shippingRates: defaultShippingRates,
          tax: defaultTaxSettings,
          updatedAt: Timestamp.now(),
        };
        await setDoc(settingsRef, defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStoreInfo = async (info: Partial<StoreInfo>) => {
    try {
      if (!settings) return;

      const updatedSettings: StoreSettings = {
        ...settings,
        storeInfo: {
          ...settings.storeInfo,
          ...info,
          address: {
            ...settings.storeInfo.address,
            ...(info.address || {}),
          },
        },
        updatedAt: Timestamp.now(),
      };

      const settingsRef = doc(db, 'storeSettings', SETTINGS_DOC_ID);
      await setDoc(settingsRef, updatedSettings, { merge: true });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating store info:', error);
      throw error;
    }
  };

  const updateShippingRates = async (rates: ShippingRate[]) => {
    try {
      if (!settings) return;

      const updatedSettings: StoreSettings = {
        ...settings,
        shippingRates: rates,
        updatedAt: Timestamp.now(),
      };

      const settingsRef = doc(db, 'storeSettings', SETTINGS_DOC_ID);
      await setDoc(settingsRef, updatedSettings, { merge: true });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating shipping rates:', error);
      throw error;
    }
  };

  const updateTaxSettings = async (tax: Partial<TaxSettings>) => {
    try {
      if (!settings) return;

      const updatedSettings: StoreSettings = {
        ...settings,
        tax: {
          ...settings.tax,
          ...tax,
        },
        updatedAt: Timestamp.now(),
      };

      const settingsRef = doc(db, 'storeSettings', SETTINGS_DOC_ID);
      await setDoc(settingsRef, updatedSettings, { merge: true });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating tax settings:', error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const value: StoreSettingsContextType = {
    settings,
    loading,
    updateStoreInfo,
    updateShippingRates,
    updateTaxSettings,
    refreshSettings,
  };

  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
}
