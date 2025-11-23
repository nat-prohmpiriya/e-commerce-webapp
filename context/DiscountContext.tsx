'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DiscountCode } from '@/types';

interface DiscountContextType {
  discounts: DiscountCode[];
  loading: boolean;
  activeDiscounts: DiscountCode[];
  getDiscountById: (id: string) => DiscountCode | null;
  getDiscountByCode: (code: string) => Promise<DiscountCode | null>;
  createDiscount: (discount: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<DiscountCode>;
  updateDiscount: (id: string, data: Partial<DiscountCode>) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  validateDiscount: (code: string, subtotal: number) => Promise<{ valid: boolean; discount?: DiscountCode; error?: string }>;
  applyDiscount: (code: string) => Promise<void>;
  refreshDiscounts: () => Promise<void>;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const discountsRef = collection(db, 'discounts');
      const q = query(discountsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const discountsData: DiscountCode[] = [];
      querySnapshot.forEach((doc) => {
        discountsData.push({
          id: doc.id,
          ...doc.data(),
        } as DiscountCode);
      });

      setDiscounts(discountsData);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDiscounts = discounts.filter((discount) => {
    const now = new Date();
    const validFrom = discount.validFrom.toDate();
    const validUntil = discount.validUntil.toDate();
    return (
      discount.isActive &&
      now >= validFrom &&
      now <= validUntil &&
      (!discount.usageLimit || discount.usageCount < discount.usageLimit)
    );
  });

  const getDiscountById = (id: string): DiscountCode | null => {
    return discounts.find((d) => d.id === id) || null;
  };

  const getDiscountByCode = async (code: string): Promise<DiscountCode | null> => {
    try {
      const discountsRef = collection(db, 'discounts');
      const querySnapshot = await getDocs(discountsRef);

      let foundDiscount: DiscountCode | null = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.code.toUpperCase() === code.toUpperCase()) {
          foundDiscount = {
            id: doc.id,
            ...data,
          } as DiscountCode;
        }
      });

      return foundDiscount;
    } catch (error) {
      console.error('Error getting discount by code:', error);
      return null;
    }
  };

  const createDiscount = async (
    discount: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
  ): Promise<DiscountCode> => {
    try {
      const discountsRef = collection(db, 'discounts');
      const now = Timestamp.now();

      const newDiscount = {
        ...discount,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(discountsRef, newDiscount);

      const createdDiscount: DiscountCode = {
        id: docRef.id,
        ...newDiscount,
      };

      setDiscounts([createdDiscount, ...discounts]);
      return createdDiscount;
    } catch (error) {
      console.error('Error creating discount:', error);
      throw error;
    }
  };

  const updateDiscount = async (id: string, data: Partial<DiscountCode>): Promise<void> => {
    try {
      const discountRef = doc(db, 'discounts', id);
      await updateDoc(discountRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      setDiscounts(
        discounts.map((d) =>
          d.id === id ? { ...d, ...data, updatedAt: Timestamp.now() } : d
        )
      );
    } catch (error) {
      console.error('Error updating discount:', error);
      throw error;
    }
  };

  const deleteDiscount = async (id: string): Promise<void> => {
    try {
      const discountRef = doc(db, 'discounts', id);
      await deleteDoc(discountRef);

      setDiscounts(discounts.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Error deleting discount:', error);
      throw error;
    }
  };

  const validateDiscount = async (
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; discount?: DiscountCode; error?: string }> => {
    try {
      const discount = await getDiscountByCode(code);

      if (!discount) {
        return { valid: false, error: 'Discount code not found' };
      }

      if (!discount.isActive) {
        return { valid: false, error: 'This discount code is inactive' };
      }

      const now = new Date();
      const validFrom = discount.validFrom.toDate();
      const validUntil = discount.validUntil.toDate();

      if (now < validFrom) {
        return { valid: false, error: 'This discount code is not yet valid' };
      }

      if (now > validUntil) {
        return { valid: false, error: 'This discount code has expired' };
      }

      if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
        return { valid: false, error: 'This discount code has reached its usage limit' };
      }

      if (discount.minPurchaseAmount && subtotal < discount.minPurchaseAmount) {
        return {
          valid: false,
          error: `Minimum purchase of $${discount.minPurchaseAmount.toFixed(2)} required`,
        };
      }

      return { valid: true, discount };
    } catch (error) {
      console.error('Error validating discount:', error);
      return { valid: false, error: 'Error validating discount code' };
    }
  };

  const applyDiscount = async (code: string): Promise<void> => {
    try {
      const discount = await getDiscountByCode(code);
      if (discount) {
        await updateDiscount(discount.id, {
          usageCount: discount.usageCount + 1,
        });
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    }
  };

  const refreshDiscounts = async () => {
    await fetchDiscounts();
  };

  const value: DiscountContextType = {
    discounts,
    loading,
    activeDiscounts,
    getDiscountById,
    getDiscountByCode,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    validateDiscount,
    applyDiscount,
    refreshDiscounts,
  };

  return <DiscountContext.Provider value={value}>{children}</DiscountContext.Provider>;
}

export function useDiscount() {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}
