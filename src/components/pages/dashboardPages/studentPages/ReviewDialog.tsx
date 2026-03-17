"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  tutorName: string;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
};

export function ReviewDialog({
  open,
  mode,
  tutorName,
  rating,
  comment,
  isSubmitting,
  onClose,
  onSubmit,
  onRatingChange,
  onCommentChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Write a Review" : "Edit Review"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="px-3 py-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <p className="text-xs text-muted-foreground">
              {mode === "create" ? "Reviewing session with" : "Reviewing"}
            </p>
            <p className="text-sm font-semibold text-foreground">{tutorName}</p>
          </div>

          <div className="space-y-1.5">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onRatingChange(n)}
                  className={`text-2xl transition-colors ${
                    rating >= n ? "text-yellow-400" : "text-zinc-200"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Comment</Label>
            <Textarea
              placeholder="Share your experience with this tutor..."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!comment.trim() || isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Submit Review"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}