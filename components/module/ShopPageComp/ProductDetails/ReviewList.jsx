"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/shared/RatingStars/RatingStars";
import ReviewReply from "./ReviewReply";
import AddReviewReply from "./AddReviewReply";
import { useProductReviews } from "@/hooks/useReview";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle, ThumbsUp, Shield, Edit2, Trash2 } from "lucide-react";

export default function ReviewList({ productId }) {
  const { user } = useAuth();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const { data: reviewsData, isLoading, error, refetch } = useProductReviews(productId, {
    sortBy: sortBy === "newest" ? "createdAt" : sortBy === "oldest" ? "createdAt" : "createdAt",
    sortOrder: sortBy === "oldest" ? "asc" : "desc",
    page: 1,
    limit: showAllReviews ? 50 : 3
  });

  const handleMarkHelpful = async (reviewId) => {
    try {
      await markHelpfulMutation.mutateAsync(reviewId);
      refetch(); // Refresh reviews to update helpful count
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            Unable to load reviews at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination || {};
  const totalReviews = pagination.totalReviews || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Customer Reviews ({totalReviews})
          </CardTitle>
        </div>

        {/* Sort Controls */}
        {reviews.length > 1 && (
          <div className="flex gap-2 mt-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review._id || review.reviewId} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Review Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </span>
                        <Badge variant="secondary" className="text-xs px-2 py-0 bg-green-100 text-green-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Rating */}
                    <RatingStars rating={review.reviewRating} size="w-4 h-4" />

                    {/* Comment */}
                    {review.reviewText && (
                      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      {/* Reply Button */}
                      <AddReviewReply
                        reviewId={review._id}
                        onReplyAdded={refetch}
                      />
                    </div>

                    {/* Reply */}
                    {review.reply && (
                      <div className="space-y-2 mt-4">
                        <ReviewReply
                          key={review.reply._id}
                          review={review}
                          reply={review.reply}
                          onReplyUpdate={refetch}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Show More/Less Button */}
            {reviews.length >= 3 && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full"
                >
                  {showAllReviews ? "Show Less" : `Show All ${totalReviews} Reviews`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
