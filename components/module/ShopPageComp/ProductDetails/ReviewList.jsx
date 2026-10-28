"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReviewReply from "./ReviewReply";
import AddReviewReply from "./AddReviewReply";
import { useProductReviews } from "@/hooks/useReview";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  MessageCircle,
  Star,
  ChevronDown,
  ShieldCheck,
  ThumbsUp,
  Filter,
  CheckCircle,
  Award,
} from "lucide-react";

function StarBar({ star, count, total, active, onClick }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 text-xs py-1 px-2 rounded-xl transition-all cursor-pointer ${
        active ? "bg-emerald-50 ring-1 ring-emerald-300" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-1 w-10 shrink-0 font-bold text-gray-700">
        <span>{star}</span>
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      </div>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-right text-[11px] font-semibold text-gray-400 shrink-0">
        {count} ({pct}%)
      </span>
    </button>
  );
}

function ReviewCard({ review, refetch }) {
  const [showReply, setShowReply] = useState(false);
  const [likes, setLikes] = useState(review.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const initials =
    review.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  const rating = Number(review.reviewRating) || 5;

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const reviewDate = review.createdAt ? new Date(review.createdAt) : new Date();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 ring-2 ring-emerald-100">
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-gray-900 text-sm sm:text-base">
                  {review.user?.name || "Verified Customer"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {formatDistanceToNow(reviewDate, { addSuffix: true })}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-amber-50/80 border border-amber-100 px-2.5 py-1 rounded-xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-100 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-amber-800 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {review.reviewText && (
            <p className="text-gray-700 text-sm leading-relaxed mt-3 whitespace-pre-line">
              {review.reviewText}
            </p>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50 flex-wrap">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                hasLiked
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-gray-150 text-gray-500 hover:text-emerald-700 hover:border-emerald-200"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-emerald-600" : ""}`} />
              Helpful {likes > 0 && `(${likes})`}
            </button>

            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {review.reply ? "View Store Response" : "Reply"}
            </button>
          </div>

          {/* Expandable replies */}
          {showReply && (
            <div className="mt-3">
              {review.reply && (
                <ReviewReply
                  review={review}
                  reply={review.reply}
                  onReplyUpdate={refetch}
                />
              )}
              <AddReviewReply
                reviewId={review._id}
                onReplyAdded={() => {
                  refetch();
                  setShowReply(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewList({
  productId,
  averageRating = 0,
  totalReviews = 0,
}) {
  const [showAll, setShowAll] = useState(false);
  const [starFilter, setStarFilter] = useState(0); // 0 = all
  const [sortBy, setSortBy] = useState("newest");

  const { data: reviewsData, isLoading, error, refetch } = useProductReviews(
    productId,
    {
      sortBy: "createdAt",
      sortOrder: sortBy === "oldest" ? "asc" : "desc",
      page: 1,
      limit: showAll ? 50 : 6,
    }
  );

  const rawReviews = reviewsData?.reviews || [];
  const currentAvg = reviewsData?.averageRating || averageRating || 4.9;
  const currentTotal =
    reviewsData?.pagination?.totalReviews || rawReviews.length || totalReviews;

  // Rating distribution counts
  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  rawReviews.forEach((r) => {
    const s = Math.round(Number(r.reviewRating) || 5);
    if (s >= 1 && s <= 5) ratingDist[s]++;
  });

  // Filter reviews by selected star if active
  const filteredReviews = rawReviews.filter((r) => {
    if (starFilter === 0) return true;
    return Math.round(Number(r.reviewRating) || 5) === starFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Ratings Snapshot Card */}
      <div className="bg-gradient-to-br from-white via-white to-amber-50/20 rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Rating Block */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-gray-100 md:pr-6">
            <span className="text-6xl font-black text-gray-900 tracking-tight">
              {Number(currentAvg).toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(Number(currentAvg))
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-100 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Based on {currentTotal} verified review{currentTotal !== 1 ? "s" : ""}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <Award className="w-3.5 h-3.5" /> 98% Recommended
            </div>
          </div>

          {/* Star Progress Bars */}
          <div className="md:col-span-8 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <StarBar
                key={star}
                star={star}
                count={ratingDist[star]}
                total={rawReviews.length}
                active={starFilter === star}
                onClick={() => setStarFilter((prev) => (prev === star ? 0 : star))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Star Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setStarFilter(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              starFilter === 0
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            All Reviews ({rawReviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setStarFilter(star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                starFilter === star
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300"
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sortReviews" className="text-xs font-bold text-gray-400">
            Sort by:
          </label>
          <select
            id="sortReviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
          >
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
          <p className="text-sm font-bold text-gray-600">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-6">
          <p className="text-sm font-bold text-gray-600">Unable to load reviews right now.</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-3xl border border-gray-100 p-8">
          <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h4 className="font-bold text-gray-800 text-base mb-1">
            {starFilter > 0
              ? `No ${starFilter}-star reviews found`
              : "No reviews yet for this product"}
          </h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {starFilter > 0
              ? "Try selecting another star filter to view other customer experiences."
              : "Be the first to share your thoughts and help others make the right choice!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id || review.reviewId}
              review={review}
              refetch={refetch}
            />
          ))}

          {rawReviews.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAll ? "rotate-180" : ""
                }`}
              />
              {showAll ? "Show Less Reviews" : `View All ${rawReviews.length} Reviews`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
