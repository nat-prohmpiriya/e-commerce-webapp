'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Review } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  getReviewsByProductId: (productId: string, sortBy?: 'newest' | 'highest' | 'helpful', limitCount?: number) => Promise<Review[]>;
  getReviewById: (id: string) => Promise<Review | null>;
  createReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>) => Promise<Review>;
  updateReview: (id: string, data: Partial<Pick<Review, 'rating' | 'comment' | 'images'>>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  getUserReview: (productId: string, userId: string) => Promise<Review | null>;
  voteHelpful: (reviewId: string) => Promise<void>;
  hasUserReviewed: (productId: string, userId: string) => Promise<boolean>;
  getProductRatingStats: (productId: string) => Promise<{ averageRating: number; totalReviews: number }>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Get reviews by product ID with sorting
  const getReviewsByProductId = async (
    productId: string,
    sortBy: 'newest' | 'highest' | 'helpful' = 'newest',
    limitCount: number = 50
  ): Promise<Review[]> => {
    try {
      setLoading(true);
      const reviewsRef = collection(db, 'reviews');
      let q;

      switch (sortBy) {
        case 'highest':
          q = query(
            reviewsRef,
            where('productId', '==', productId),
            orderBy('rating', 'desc'),
            orderBy('createdAt', 'desc'),
            firestoreLimit(limitCount)
          );
          break;
        case 'helpful':
          q = query(
            reviewsRef,
            where('productId', '==', productId),
            orderBy('helpfulCount', 'desc'),
            orderBy('createdAt', 'desc'),
            firestoreLimit(limitCount)
          );
          break;
        case 'newest':
        default:
          q = query(
            reviewsRef,
            where('productId', '==', productId),
            orderBy('createdAt', 'desc'),
            firestoreLimit(limitCount)
          );
          break;
      }

      const querySnapshot = await getDocs(q);
      const reviewList: Review[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviewList.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
        } as Review);
      });

      setReviews(reviewList);
      return reviewList;
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get review by ID
  const getReviewById = async (id: string): Promise<Review | null> => {
    try {
      const reviewDoc = await getDoc(doc(db, 'reviews', id));
      if (reviewDoc.exists()) {
        const data = reviewDoc.data();
        return {
          ...data,
          id: reviewDoc.id,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
        } as Review;
      }
      return null;
    } catch (error) {
      console.error('Error getting review:', error);
      return null;
    }
  };

  // Create new review
  const createReview = async (
    reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>
  ): Promise<Review> => {
    if (!user) {
      throw new Error('Must be logged in to create a review');
    }

    try {
      // Check if user already reviewed this product
      const existingReview = await getUserReview(reviewData.productId, user.id);
      if (existingReview) {
        throw new Error('You have already reviewed this product');
      }

      const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Timestamp.now();

      const newReview: Review = {
        ...reviewData,
        id: reviewId,
        helpfulCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'reviews', reviewId), newReview);

      // Update product rating
      await updateProductRating(reviewData.productId);

      toast.success('Review submitted successfully!');
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create review');
      }
      throw error;
    }
  };

  // Update review
  const updateReview = async (
    id: string,
    data: Partial<Pick<Review, 'rating' | 'comment' | 'images'>>
  ): Promise<void> => {
    if (!user) {
      throw new Error('Must be logged in to update a review');
    }

    try {
      const reviewRef = doc(db, 'reviews', id);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) {
        throw new Error('Review not found');
      }

      const reviewData = reviewDoc.data() as Review;

      // Check if user owns this review
      if (reviewData.userId !== user.id) {
        throw new Error('You can only edit your own reviews');
      }

      await updateDoc(reviewRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      // If rating changed, update product rating
      if (data.rating !== undefined) {
        await updateProductRating(reviewData.productId);
      }

      toast.success('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update review');
      }
      throw error;
    }
  };

  // Delete review
  const deleteReview = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('Must be logged in to delete a review');
    }

    try {
      const reviewRef = doc(db, 'reviews', id);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) {
        throw new Error('Review not found');
      }

      const reviewData = reviewDoc.data() as Review;

      // Check if user owns this review or is admin
      if (reviewData.userId !== user.id && user.role !== 'admin') {
        throw new Error('You can only delete your own reviews');
      }

      await deleteDoc(reviewRef);

      // Update product rating
      await updateProductRating(reviewData.productId);

      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete review');
      }
      throw error;
    }
  };

  // Get user's review for a product
  const getUserReview = async (productId: string, userId: string): Promise<Review | null> => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('productId', '==', productId),
        where('userId', '==', userId),
        firestoreLimit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
        } as Review;
      }
      return null;
    } catch (error) {
      console.error('Error getting user review:', error);
      return null;
    }
  };

  // Check if user has reviewed a product
  const hasUserReviewed = async (productId: string, userId: string): Promise<boolean> => {
    const review = await getUserReview(productId, userId);
    return review !== null;
  };

  // Vote review as helpful
  const voteHelpful = async (reviewId: string): Promise<void> => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        helpfulCount: increment(1),
      });
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error voting review:', error);
      toast.error('Failed to vote');
      throw error;
    }
  };

  // Get product rating statistics
  const getProductRatingStats = async (productId: string): Promise<{ averageRating: number; totalReviews: number }> => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, where('productId', '==', productId));
      const querySnapshot = await getDocs(q);

      let totalRating = 0;
      let count = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Review;
        totalRating += data.rating;
        count++;
      });

      return {
        averageRating: count > 0 ? Math.round((totalRating / count) * 10) / 10 : 0,
        totalReviews: count,
      };
    } catch (error) {
      console.error('Error getting rating stats:', error);
      return { averageRating: 0, totalReviews: 0 };
    }
  };

  // Update product rating (internal function)
  const updateProductRating = async (productId: string): Promise<void> => {
    try {
      const stats = await getProductRatingStats(productId);
      const productRef = doc(db, 'products', productId);

      await updateDoc(productRef, {
        rating: stats.averageRating,
        reviewCount: stats.totalReviews,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating product rating:', error);
    }
  };

  const value: ReviewContextType = {
    reviews,
    loading,
    getReviewsByProductId,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getUserReview,
    voteHelpful,
    hasUserReviewed,
    getProductRatingStats,
  };

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
}
