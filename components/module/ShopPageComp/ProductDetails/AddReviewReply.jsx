"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useReplyToReview } from "@/hooks/useReview";
import { MessageCircle, Loader2, Send } from "lucide-react";

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
        replyText: replyText.trim(),
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
    <div className="mt-2.5 ml-4 sm:ml-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Reply as {user.name || "Member"}
        </button>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a helpful response..."
              className="min-h-[80px] text-sm bg-white border-gray-200 rounded-xl focus:border-emerald-500"
              required
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={cancelReply}
                className="h-8 px-3 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim() || replyMutation.isPending}
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                {replyMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Post Reply
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
