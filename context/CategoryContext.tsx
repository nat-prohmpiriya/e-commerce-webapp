'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  activeCategories: Category[];
  createCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories from Firestore
  const loadCategories = async (): Promise<Category[]> => {
    try {
      const categoriesRef = collection(db, 'categories');

      const q = query(categoriesRef, orderBy('name_en', 'asc'));
      const querySnapshot = await getDocs(q);

      const firestoreCategories: Category[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        firestoreCategories.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
        } as unknown as Category);
      });

      return firestoreCategories;
    } catch (error) {
      console.error('🔴 [CategoryContext] Error loading categories:', error);
      return [];
    }
  };

  // Initialize categories
  useEffect(() => {
    const initCategories = async () => {
      console.log('🔵 [CategoryContext] useEffect: Starting initialization...');
      setLoading(true);
      const loadedCategories = await loadCategories();
      console.log('🔵 [CategoryContext] useEffect: Setting categories:', loadedCategories);
      setCategories(loadedCategories);
      setLoading(false);
      console.log('🔵 [CategoryContext] useEffect: Initialization complete');
    };

    initCategories();
  }, []);

  // Create new category
  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Promise<Category> => {
    try {
      const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Timestamp.now();

      const newCategory: Category = {
        ...categoryData,
        id: categoryId,
        productCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      const categoryRef = doc(db, 'categories', categoryId);
      await setDoc(categoryRef, newCategory);

      // Update local state
      const updatedCategories = await loadCategories();
      setCategories(updatedCategories);

      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  // Update category
  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      // Update local state
      const updatedCategories = await loadCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);

      // Update local state
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  // Refresh categories
  const refreshCategories = async () => {
    setLoading(true);
    const loadedCategories = await loadCategories();
    setCategories(loadedCategories);
    setLoading(false);
  };

  const value: CategoryContextType = {
    categories,
    loading,
    activeCategories: categories.filter(c => c.isActive),
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  };

  console.log('🔵 [CategoryContext] Render - categories:', categories.length);
  console.log('🔵 [CategoryContext] Render - activeCategories:', categories.filter(c => c.isActive).length);
  console.log('🔵 [CategoryContext] Render - loading:', loading);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
