'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useReview } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types';

interface ReviewFormProps {
  productId: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const { createReview, updateReview } = useReview();

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (rating === 0) {
      return;
    }

    if (comment.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReview) {
        // Update existing review
        await updateReview(existingReview.id, {
          rating,
          comment: comment.trim(),
        });
      } else {
        // Create new review
        await createReview({
          productId,
          userId: user.id,
          userName: user.displayName || 'Anonymous',
          userPhotoURL: user.photoURL,
          rating,
          comment: comment.trim(),
        });
      }

      // Reset form
      setRating(0);
      setComment('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || '');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating === 0 && (
            <p className="text-xs text-gray-500 mt-1">Please select a rating</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            placeholder="Share your experience with this product... (minimum 10 characters)"
            required
            minLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters {comment.length < 10 && `(minimum 10 characters)`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : existingReview ? (
              'Update Review'
            ) : (
              'Submit Review'
            )}
          </button>

          {(onCancel || existingReview) && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
