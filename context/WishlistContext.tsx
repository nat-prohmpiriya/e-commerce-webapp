'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wishlist, WishlistItem } from '@/types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  loading: boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'ecommerce_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage for guest users
  const loadWishlistFromLocalStorage = () => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        return JSON.parse(savedWishlist) as string[];
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
    return [];
  };

  // Save wishlist to localStorage for guest users
  const saveWishlistToLocalStorage = (productIds: string[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  // Load wishlist from Firestore for logged-in users
  const loadWishlistFromFirestore = async (userId: string) => {
    try {
      const wishlistRef = doc(db, 'wishlists', userId);
      const wishlistSnap = await getDoc(wishlistRef);

      if (wishlistSnap.exists()) {
        const wishlistData = wishlistSnap.data() as Wishlist;
        return wishlistData.items.map((item) => item.productId);
      }
    } catch (error) {
      console.error('Error loading wishlist from Firestore:', error);
    }
    return [];
  };

  // Save wishlist to Firestore for logged-in users
  const saveWishlistToFirestore = async (userId: string, productIds: string[]) => {
    try {
      const wishlistRef = doc(db, 'wishlists', userId);
      const items: WishlistItem[] = productIds.map((productId) => ({
        productId,
        addedAt: new Date() as any,
      }));

      const wishlistData: Wishlist = {
        userId,
        items,
        updatedAt: new Date() as any,
      };

      await setDoc(wishlistRef, wishlistData);
    } catch (error) {
      console.error('Error saving wishlist to Firestore:', error);
    }
  };

  // Sync wishlist when user logs in
  const syncWishlist = async (userId: string, localWishlist: string[]) => {
    try {
      const firestoreWishlist = await loadWishlistFromFirestore(userId);

      // Merge local wishlist with Firestore wishlist (remove duplicates)
      const mergedWishlist = [...new Set([...firestoreWishlist, ...localWishlist])];

      // Save merged wishlist to Firestore
      await saveWishlistToFirestore(userId, mergedWishlist);

      // Clear localStorage
      localStorage.removeItem(WISHLIST_STORAGE_KEY);

      return mergedWishlist;
    } catch (error) {
      console.error('Error syncing wishlist:', error);
      return localWishlist;
    }
  };

  // Initialize wishlist
  useEffect(() => {
    const initWishlist = async () => {
      setLoading(true);

      if (user) {
        // User is logged in
        const localWishlist = loadWishlistFromLocalStorage();

        if (localWishlist.length > 0) {
          // Sync local wishlist with Firestore
          const syncedWishlist = await syncWishlist(user.id, localWishlist);
          setWishlist(syncedWishlist);
        } else {
          // Load wishlist from Firestore
          const firestoreWishlist = await loadWishlistFromFirestore(user.id);
          setWishlist(firestoreWishlist);
        }
      } else {
        // User is not logged in, load from localStorage
        const localWishlist = loadWishlistFromLocalStorage();
        setWishlist(localWishlist);
      }

      setLoading(false);
    };

    initWishlist();
  }, [user]);

  // Save wishlist whenever it changes (with debouncing)
  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        if (user) {
          saveWishlistToFirestore(user.id, wishlist);
        } else {
          saveWishlistToLocalStorage(wishlist);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [wishlist, user, loading]);

  // Add product to wishlist
  const addToWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev;
      }
      return [...prev, productId];
    });
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value: WishlistContextType = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
