"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useReplyToReview, useDeleteReviewReply } from "@/hooks/useReview";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Edit2, Trash2, Check, X } from "lucide-react";

export default function ReviewReply({ review, reply, onReplyUpdate }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.replyText);

  const replyMutation = useReplyToReview();
  const deleteReplyMutation = useDeleteReviewReply();

  const canEdit = user && (user.role === "admin" || reply.user._id === user._id || reply.user.email === user.email);
  const canDelete = canEdit;

  const handleUpdateReply = async () => {
    if (!editText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        reviewId: review._id,
        replyText: editText.trim()
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

  return (
    <div className="ml-8 mt-3 p-4 bg-gray-50 rounded-lg border-l-2 border-gray-200">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {reply.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Reply Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">
              {reply.user?.name || "Anonymous"}
            </span>
            <Badge variant="secondary" className="text-xs px-1 py-0">
              Admin
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </span>
            {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Update your reply..."
                className="min-h-[80px] text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdateReply}
                  disabled={!editText.trim() || updateReplyMutation.isPending}
                  className="h-8 px-3"
                >
                  {updateReplyMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEdit}
                  className="h-8 px-3"
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {reply.replyText}
              </p>

              {/* Action Buttons */}
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteReply}
                      disabled={deleteReplyMutation.isPending}
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
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
