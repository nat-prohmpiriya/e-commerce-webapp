'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cart, CartItem } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecommerce_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage for guest users
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart) as CartItem[];
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  };

  // Save cart to localStorage for guest users
  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Load cart from Firestore for logged-in users
  const loadCartFromFirestore = async (userId: string) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const cartData = cartSnap.data() as Cart;
        return cartData.items;
      }
    } catch (error) {
      console.error('Error loading cart from Firestore:', error);
    }
    return [];
  };

  // Save cart to Firestore for logged-in users
  const saveCartToFirestore = async (userId: string, items: CartItem[]) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartData: Cart = {
        userId,
        items,
        updatedAt: new Date() as any,
      };
      await setDoc(cartRef, cartData);
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  };

  // Sync cart when user logs in
  const syncCart = async (userId: string, localCart: CartItem[]) => {
    try {
      const firestoreCart = await loadCartFromFirestore(userId);

      // Merge local cart with Firestore cart
      const mergedCart = [...firestoreCart];

      localCart.forEach((localItem) => {
        const existingItemIndex = mergedCart.findIndex(
          (item) =>
            item.productId === localItem.productId &&
            item.size === localItem.size &&
            item.color === localItem.color
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          mergedCart[existingItemIndex].quantity += localItem.quantity;
        } else {
          // Add new item
          mergedCart.push(localItem);
        }
      });

      // Save merged cart to Firestore
      await saveCartToFirestore(userId, mergedCart);

      // Clear localStorage
      localStorage.removeItem(CART_STORAGE_KEY);

      return mergedCart;
    } catch (error) {
      console.error('Error syncing cart:', error);
      return localCart;
    }
  };

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      setLoading(true);

      if (user) {
        // User is logged in
        const localCart = loadCartFromLocalStorage();

        if (localCart.length > 0) {
          // Sync local cart with Firestore
          const syncedCart = await syncCart(user.id, localCart);
          setCart(syncedCart);
        } else {
          // Load cart from Firestore
          const firestoreCart = await loadCartFromFirestore(user.id);
          setCart(firestoreCart);
        }
      } else {
        // User is not logged in, load from localStorage
        const localCart = loadCartFromLocalStorage();
        setCart(localCart);
      }

      setLoading(false);
    };

    initCart();
  }, [user]);

  // Save cart whenever it changes (with debouncing)
  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        if (user) {
          saveCartToFirestore(user.id, cart);
        } else {
          saveCartToLocalStorage(cart);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [cart, user, loading]);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity || 1;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.productId === productId && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });
      return updatedCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
