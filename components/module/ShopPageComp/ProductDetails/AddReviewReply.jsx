"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useReplyToReview } from "@/hooks/useReview";
import { MessageCircle, Loader2 } from "lucide-react";

export default function AddReviewReply({ reviewId, onReplyAdded }) {
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const replyMutation = useReplyToReview();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        reviewId,
        replyText: replyText.trim()
      });

      setReplyText("");
      setShowForm(false);
      onReplyAdded?.();
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const cancelReply = () => {
    setReplyText("");
    setShowForm(false);
  };

  if (!user) return null;

  return (
    <div className="mt-2">
      {!showForm ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowForm(true)}
          className="text-gray-600 hover:text-gray-900 h-8 px-3 text-sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Reply
        </Button>
      ) : (
        <div className="space-y-3">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="min-h-[80px] text-sm"
              required
            />
            <div className="flex gap-2 mt-2">
              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim() || replyMutation.isPending}
                className="h-8 px-3"
              >
                {replyMutation.isPending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Reply"
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={cancelReply}
                className="h-8 px-3"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
