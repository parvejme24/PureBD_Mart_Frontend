"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useReplyToReview, useDeleteReviewReply } from "@/hooks/useReview";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Trash2, Check, X, ShieldCheck, CornerDownRight } from "lucide-react";

export default function ReviewReply({ review, reply, onReplyUpdate }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply?.replyText || "");

  const replyMutation = useReplyToReview();
  const deleteReplyMutation = useDeleteReviewReply();

  if (!reply) return null;

  const canEdit =
    user &&
    (user.role === "admin" ||
      reply.user?._id === user._id ||
      reply.user?.email === user.email);
  const canDelete = canEdit;

  const handleUpdateReply = async () => {
    if (!editText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        reviewId: review._id,
        replyText: editText.trim(),
      });
      setIsEditing(false);
      onReplyUpdate?.();
    } catch (error) {
      console.error("Failed to update reply:", error);
    }
  };

  const handleDeleteReply = async () => {
    if (!confirm("Are you sure you want to delete this reply?")) return;

    try {
      await deleteReplyMutation.mutateAsync(review._id);
      onReplyUpdate?.();
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  const cancelEdit = () => {
    setEditText(reply.replyText);
    setIsEditing(false);
  };

  const replyDate = reply.createdAt ? new Date(reply.createdAt) : new Date();

  return (
    <div className="ml-4 sm:ml-8 mt-3 p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl relative">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-bold text-xs text-gray-900">
              {reply.user?.name || "PureBD Mart Official"}
            </span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Store Support
            </span>
            <span className="text-[11px] text-gray-400">
              {formatDistanceToNow(replyDate, { addSuffix: true })}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2 mt-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Update your reply..."
                className="min-h-[80px] text-sm bg-white rounded-xl border-emerald-200"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdateReply}
                  disabled={!editText.trim() || replyMutation.isPending}
                  className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg"
                >
                  {replyMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEdit}
                  className="h-8 px-3 text-xs rounded-lg"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {reply.replyText}
              </p>

              {canEdit && (
                <div className="flex gap-2 mt-2 pt-1 border-t border-emerald-100/60">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-gray-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  {canDelete && (
                    <button
                      onClick={handleDeleteReply}
                      disabled={deleteReplyMutation.isPending}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer ml-2"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
