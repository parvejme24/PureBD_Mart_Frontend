"use client";

import { Star } from "lucide-react";

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  size = "w-5 h-5",
  interactive = false,
  onRatingChange,
  showValue = false,
  className = "",
}) {
  const handleClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }`}
          >
            <Star
              className={`${size} ${
                isFilled
                  ? "text-[#3BB77E] fill-[#3BB77E]"
                  : "text-gray-300"
              } transition-colors`}
            />
          </button>
        );
      })}

      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
