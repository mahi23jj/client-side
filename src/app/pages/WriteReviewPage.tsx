"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { StarRating } from "../components/StarRating";
import { submitReview } from "../services/reviewApi";
import { ReviewRequestBody } from "../../types/api";

interface WriteReviewPageProps {
  productId: string;
  shopId: string;
  productName?: string;
  onBack: () => void;
}

export function WriteReviewPage({ productId, shopId, productName, onBack }: WriteReviewPageProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating");

    setIsSubmitting(true);
    const body: ReviewRequestBody = { rating, comment };

    try {
      await submitReview(shopId, productId, body);
      alert("Review submitted! Thank you for your feedback.");
      onBack();
    } catch (err: any) {
      alert(`Failed to submit review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-blue-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-blue-900" />
        </button>
        <h1 className="text-lg font-medium text-blue-900">Write a Review</h1>
      </div>

      {/* Product Info */}
      <div className="bg-white/50 backdrop-blur-sm p-4 border-b border-gray-200 mt-2 rounded-2xl mx-3 shadow-sm">
        <p className="text-sm text-blue-900 mb-1">Reviewing</p>
        <h3 className="text-blue-900 font-semibold">{productName}</h3>
      </div>

      {/* Review Form */}
      <div className="bg-white/50 backdrop-blur-sm mt-4 p-4 rounded-2xl mx-3 shadow-sm">
        {/* Rating */}
        <div className="mb-6">
          <label className="block mb-3 text-sm text-gray-950">Your Rating *</label>
          <div className="flex justify-center">
            <StarRating rating={rating} interactive onRatingChange={setRating} size={23} />
          </div>
          {rating > 0 && (
            <p className="text-center mt-2 text-sm text-blue-900">
              {["Poor", "Below Average", "Average", "Good", "Excellent"][rating - 1]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-950">
            Your Review <span className="text-gray-500 ml-1">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            placeholder="Share your experience with this product..."
            className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white/60 backdrop-blur-sm text-blue-900 placeholder-gray-500"
            maxLength={300}
          />
          <p className="text-xs text-blue-500 mt-1 text-right">{comment.length}/300</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full bg-blue-900 text-white rounded-lg py-3 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-950 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Your review will be visible to all users
        </p>
      </div>
    </div>
  );
}