'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  getProductById: (id: string) => Product | null;
  getAllProducts: () => Promise<Product[]>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all products from Firestore
  const loadProducts = async (): Promise<Product[]> => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const firestoreProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        firestoreProducts.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
        } as Product);
      });

      return firestoreProducts;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  };

  // Initialize products
  useEffect(() => {
    const initProducts = async () => {
      setLoading(true);
      const loadedProducts = await loadProducts();
      setProducts(loadedProducts);
      setLoading(false);
    };

    initProducts();
  }, []);

  // Get all products
  const getAllProducts = async (): Promise<Product[]> => {
    return await loadProducts();
  };

  // Get product by ID
  const getProductById = (id: string): Product | null => {
    return products.find(product => product.id === id) || null;
  };

  // Create new product
  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Timestamp.now();

      const newProduct: Product = {
        ...productData,
        id: productId,
        createdAt: now,
        updatedAt: now,
      };

      const productRef = doc(db, 'products', productId);
      await setDoc(productRef, newProduct);

      // Update local state
      const updatedProducts = await loadProducts();
      setProducts(updatedProducts);

      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  // Update product
  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      // Update local state
      const updatedProducts = await loadProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);

      // Update local state
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Refresh products
  const refreshProducts = async () => {
    setLoading(true);
    const loadedProducts = await loadProducts();
    setProducts(loadedProducts);
    setLoading(false);
  };

  const value: ProductContextType = {
    products,
    loading,
    getProductById,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
