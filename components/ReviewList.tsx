'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { useReview } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import ReviewForm from './ReviewForm';

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const { user } = useAuth();
  const { getReviewsByProductId, deleteReview, voteHelpful, loading } = useReview();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Load reviews
  useEffect(() => {
    loadReviews();
  }, [productId, sortBy]);

  const loadReviews = async () => {
    const reviewList = await getReviewsByProductId(productId, sortBy);
    setReviews(reviewList);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await deleteReview(reviewId);
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      await voteHelpful(reviewId);
      await loadReviews();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleEditSuccess = async () => {
    setEditingReviewId(null);
    await loadReviews();
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews ({reviews.length})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'helpful')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isEditing = editingReviewId === review.id;
          const isOwner = user?.id === review.userId;
          const isAdmin = user?.role === 'admin';
          const canEdit = isOwner;
          const canDelete = isOwner || isAdmin;

          if (isEditing) {
            return (
              <div key={review.id}>
                <ReviewForm
                  productId={productId}
                  existingReview={review}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingReviewId(null)}
                />
              </div>
            );
          }

          return (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {review.userPhotoURL ? (
                      <Image
                        src={review.userPhotoURL}
                        alt={review.userName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      {/* Rating Stars */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <button
                        onClick={() => setEditingReviewId(review.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit review"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingReviewId === review.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete review"
                      >
                        {deletingReviewId === review.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.comment}</p>

              {/* Review Images (if any) */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((imageUrl, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleVoteHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                  disabled={!user}
                  title={!user ? 'Login to vote' : 'Mark as helpful'}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>

                {review.updatedAt.toMillis() !== review.createdAt.toMillis() && (
                  <span className="text-xs text-gray-400">(Edited)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
