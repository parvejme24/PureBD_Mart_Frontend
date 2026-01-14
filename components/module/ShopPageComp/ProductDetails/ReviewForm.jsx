"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddProductReview } from "@/hooks/useReview";
import { useAuth } from "@/hooks/useAuth";
import RatingStars from "@/components/shared/RatingStars/RatingStars";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReviewForm({ productId }) {
  const { user } = useAuth();
  const { mutate: addReview, isPending } = useAddProductReview();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to write a review");
      return;
    }

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    addReview({
      productId,
      reviewText,
      reviewRating,
    }, {
      onSuccess: () => {
        setReviewRating(0);
        setReviewText("");
        toast.success("Review submitted successfully!");
      },
      onError: (error) => {
        console.error("Review submission error:", error);

        // Log detailed error for debugging
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        if (error.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to submit reviews.");
        } else if (error.response?.status === 404) {
          toast.error("Review service is not available right now. Please try again later.");
        } else if (error.response?.status >= 500) {
          const errorMsg = error.response?.data?.error || error.response?.data?.message || "Unknown server error";
          if (errorMsg.includes("duplicate key")) {
            toast.error("Database error: Duplicate review detected. Please refresh and try again.");
          } else {
            toast.error(`Server error: ${errorMsg}. Please contact support if this persists.`);
          }
        } else {
          toast.error(error.response?.data?.message || "Failed to submit review. Please check your connection and try again.");
        }
      }
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Please{" "}
            <a href="/login" className="text-[#3BB77E] hover:underline">
              log in
            </a>{" "}
            to write a review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <RatingStars
              rating={reviewRating}
              interactive={true}
              onRatingChange={setReviewRating}
              size="w-6 h-6"
            />
            {reviewRating === 0 && (
              <p className="text-sm text-red-500 mt-1">
                Please select a rating
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={reviewRating === 0 || isPending}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
