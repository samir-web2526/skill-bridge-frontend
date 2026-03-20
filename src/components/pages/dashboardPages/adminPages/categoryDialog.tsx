"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  inputName: string;
  inputDescription: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

const MAX_DESC = 200;

function CategoryIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3.5 shrink-0">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#059669" />
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#6ee7b7" />
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#6ee7b7" />
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#d1fae5" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M2.5 7l3 3 6-6"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoryDialog({
  open,
  mode,
  inputName,
  inputDescription,
  isSubmitting,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
}: Props) {
  const descLen = inputDescription.length;
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border border-zinc-100">
        <DialogHeader className="px-6 pt-6 pb-0">
          <CategoryIcon />
          <DialogTitle className="text-base font-extrabold tracking-tight text-zinc-900">
            {isCreate ? "Add new category" : "Edit category"}
          </DialogTitle>
          <p className="text-sm text-zinc-400 mt-1 font-normal">
            {isCreate
              ? "Create a subject category for tutors to list under."
              : "Update the details for this category."}
          </p>
          <div className="h-px bg-zinc-100 mt-4" />
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
              Category name
            </Label>
            <Input
              placeholder="e.g. Mathematics"
              value={inputName}
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
              className="rounded-xl border-zinc-200 text-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
              Description
            </Label>
            <Textarea
              placeholder="Briefly describe this category…"
              value={inputDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              maxLength={MAX_DESC}
              rows={3}
              className="rounded-xl border-zinc-200 text-sm resize-none focus-visible:ring-emerald-500 focus-visible:border-emerald-400"
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-300">
                Keep it short and clear.
              </p>
              <p
                className={`text-[11px] font-medium tabular-nums ${
                  descLen > MAX_DESC * 0.9 ? "text-amber-500" : "text-zinc-300"
                }`}
              >
                {descLen} / {MAX_DESC}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-t border-zinc-100">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl text-sm font-semibold"
          >
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            disabled={!inputName.trim() || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold px-5 flex items-center gap-2 shadow-sm shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <CheckIcon />
                {isCreate ? "Create category" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
