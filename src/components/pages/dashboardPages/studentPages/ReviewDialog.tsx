"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

const MAX_COMMENT = 500;

function getRatingConfig(rating: number) {
  if (rating === 5)
    return {
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconFill: "#10b981",
      numColor: "text-emerald-600 dark:text-emerald-400",
      starColor: "#fbbf24",
      label: "Excellent!",
      labelColor: "text-emerald-600 dark:text-emerald-400",
      feedbackBg: "",
      feedbackBorder: "",
      feedbackText: "",
      btnBg: "bg-emerald-600 hover:bg-emerald-500",
      showFeedback: false,
    };
  if (rating === 4)
    return {
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconFill: "#fbbf24",
      numColor: "text-amber-500 dark:text-amber-400",
      starColor: "#fbbf24",
      label: "Very good",
      labelColor: "text-amber-600 dark:text-amber-400",
      feedbackBg: "",
      feedbackBorder: "",
      feedbackText: "",
      btnBg: "bg-emerald-600 hover:bg-emerald-500",
      showFeedback: false,
    };
  if (rating === 3)
    return {
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconFill: "#f59e0b",
      numColor: "text-amber-500 dark:text-amber-400",
      starColor: "#f59e0b",
      label: "Average",
      labelColor: "text-amber-700 dark:text-amber-300",
      feedbackBg: "bg-amber-50 dark:bg-amber-950/40",
      feedbackBorder: "border-amber-200 dark:border-amber-900",
      feedbackText: "text-amber-800 dark:text-amber-200",
      feedbackMsg:
        "What could have been better? Your feedback helps tutors improve.",
      btnBg: "bg-amber-500 hover:bg-amber-400",
      showFeedback: true,
    };
  if (rating === 2)
    return {
      iconBg: "bg-red-50 dark:bg-red-950/40",
      iconFill: "#ef4444",
      numColor: "text-red-500",
      starColor: "#ef4444",
      label: "Poor",
      labelColor: "text-red-600 dark:text-red-400",
      feedbackBg: "bg-red-50 dark:bg-red-950/40",
      feedbackBorder: "border-red-200 dark:border-red-900",
      feedbackText: "text-red-800 dark:text-red-200",
      feedbackMsg:
        "We're sorry to hear that. Please describe the issue so we can follow up.",
      btnBg: "bg-red-500 hover:bg-red-400",
      showFeedback: true,
    };
  return {
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconFill: "#ef4444",
    numColor: "text-red-500",
    starColor: "#ef4444",
    label: "Very poor",
    labelColor: "text-red-600 dark:text-red-400",
    feedbackBg: "bg-red-50 dark:bg-red-950/40",
    feedbackBorder: "border-red-200 dark:border-red-900",
    feedbackText: "text-red-800 dark:text-red-200",
    feedbackMsg:
      "We're really sorry. Please describe what went wrong — your feedback matters.",
    btnBg: "bg-red-500 hover:bg-red-400",
    showFeedback: true,
  };
}

function TutorAvatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";
  return (
    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold flex items-center justify-center shrink-0">
      {initials}
    </div>
  );
}

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
  const cfg = getRatingConfig(rating);
  const commentLen = comment.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border border-border">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 shrink-0 ${cfg.iconBg}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <polygon
                points="8,1 10,6 15,6 11,9.5 12.5,14.5 8,11.5 3.5,14.5 5,9.5 1,6 6,6"
                fill={cfg.iconFill}
              />
            </svg>
          </div>

          <DialogTitle className="text-base font-extrabold tracking-tight text-foreground">
            {mode === "create" ? "Write a review" : "Edit review"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1 font-normal">
            Share your experience to help other students.
          </p>
          <div className="h-px bg-border mt-4" />
        </DialogHeader>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-2.5 bg-muted/50 border border-border rounded-xl px-3 py-2.5">
            <TutorAvatar name={tutorName} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {tutorName}
              </p>
              <p className="text-xs text-muted-foreground">
                {mode === "create" ? "Reviewing session" : "Editing review"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
              Your rating
            </p>
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`text-3xl font-extrabold leading-none tabular-nums ${cfg.numColor}`}
              >
                {rating}.0
              </span>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onRatingChange(n)}
                      className="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none"
                      style={{ color: rating >= n ? cfg.starColor : "var(--muted)" }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className={`text-xs font-semibold mt-0.5 ${cfg.labelColor}`}>
                  {cfg.label}
                </p>
              </div>
            </div>
          </div>

          {cfg.showFeedback && (
            <div
              className={`rounded-xl border px-3 py-2.5 text-xs leading-relaxed ${cfg.feedbackBg} ${cfg.feedbackBorder} ${cfg.feedbackText}`}
            >
              {cfg.feedbackMsg}
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
              Comment
            </p>
            <Textarea
              placeholder={
                rating <= 2
                  ? "Please describe what went wrong..."
                  : rating === 3
                    ? "Tell us what could be improved..."
                    : "Share your experience with this tutor..."
              }
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              maxLength={MAX_COMMENT}
              rows={3}
              className="rounded-xl border-border text-sm resize-none focus-visible:ring-emerald-500 focus-visible:border-emerald-400"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-[11px] font-medium tabular-nums ${commentLen > MAX_COMMENT * 0.9
                    ? "text-amber-500"
                    : "text-muted-foreground/50"
                  }`}
              >
                {commentLen} / {MAX_COMMENT}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-muted/50 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl text-sm font-semibold"
          >
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            disabled={!comment.trim() || isSubmitting}
            className={`rounded-xl text-sm font-semibold px-5 flex items-center gap-2 shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed ${cfg.btnBg}`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5 shrink-0"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeDasharray="20"
                    strokeDashoffset="10"
                    strokeLinecap="round"
                  />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l2.5 2.5 5.5-5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {mode === "create" ? "Submit review" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
