"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddProductReview } from "@/hooks/useReview";
import { useAuth } from "@/hooks/useAuth";
import { Star, Loader2, Sparkles, Send, CheckCircle2, MessageSquarePlus, LogIn } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const RATING_LABELS = {
  1: { label: "Poor", desc: "Did not meet expectations" },
  2: { label: "Fair", desc: "Could be much better" },
  3: { label: "Average", desc: "Standard, meets basic expectations" },
  4: { label: "Good", desc: "Very satisfied with quality" },
  5: { label: "Excellent!", desc: "Exceptional quality, highly recommended!" },
};

const QUICK_TAGS = [
  "🌿 100% Fresh",
  "⚡ Fast Delivery",
  "📦 Excellent Packaging",
  "😋 Authentic Taste",
  "💯 Great Value",
];

export default function ReviewForm({ productId }) {
  const { user } = useAuth();
  const { mutate: addReview, isPending } = useAddProductReview();
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hoverRating || reviewRating;

  const handleAddTag = (tag) => {
    if (reviewText.includes(tag)) return;
    setReviewText((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to post a verified review");
      return;
    }

    if (reviewRating === 0) {
      toast.error("Please click on stars to rate this product");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please share a few words about your experience");
      return;
    }

    addReview(
      {
        productId,
        reviewText: reviewText.trim(),
        reviewRating,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setReviewText("");
          toast.success("Thank you! Your review has been published.");
          setTimeout(() => setSubmitted(false), 5000);
        },
        onError: (error) => {
          console.error("Review submission error:", error);
          toast.error(
            error.response?.data?.message ||
              "Could not submit review at this moment. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl border border-emerald-100/80 p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Share Your Experience
          </span>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Write a Customer Review
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Help other PureBD Mart shoppers by sharing honest feedback about quality and taste.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600">
          <MessageSquarePlus className="w-6 h-6" />
        </div>
      </div>

      {submitted ? (
        <div className="py-8 text-center bg-white rounded-2xl border border-emerald-200 p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="font-black text-gray-900 text-lg">Thank You for Your Review!</h4>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Your review helps local farmers, authentic producers, and fellow shoppers make informed choices.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
            className="rounded-xl text-xs font-bold mt-2"
          >
            Write Another Review
          </Button>
        </div>
      ) : !user ? (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm text-amber-900 font-semibold">
            Join the conversation! Log in to leave a verified rating and review.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" /> Sign In to Review
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interactive Star Rating */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Overall Rating <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 hover:scale-125 transition-transform duration-150 cursor-pointer focus:outline-none"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          filled
                            ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                            : "fill-gray-100 text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {activeRating > 0 && RATING_LABELS[activeRating] && (
                <div className="ml-2 pl-3 border-l border-gray-200">
                  <span className="text-sm font-black text-gray-900">
                    {RATING_LABELS[activeRating].label}
                  </span>
                  <span className="hidden sm:inline text-xs text-gray-400 ml-2">
                    — {RATING_LABELS[activeRating].desc}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick tags */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">
              Quick Tags (tap to include)
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Detailed Review <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {reviewText.length} characters
              </span>
            </div>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you like about this product? Freshness, aroma, taste, delivery speed..."
              rows={4}
              className="w-full bg-white border-gray-200 rounded-2xl p-4 text-sm focus:border-emerald-500 focus:ring-emerald-400 resize-none shadow-2xs"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
            <p className="text-xs text-gray-400">
              Posting as <span className="font-bold text-gray-700">{user.name || user.email}</span>
            </p>
            <Button
              type="submit"
              disabled={isPending || reviewRating === 0 || !reviewText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-6 py-2.5 h-11 rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing Review...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
