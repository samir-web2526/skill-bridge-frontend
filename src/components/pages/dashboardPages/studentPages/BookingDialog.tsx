"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  mode: "create" | "cancel";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutors?: any[];
  selectedTutorId?: string;
  onTutorChange?: (id: string) => void;
  cancelTutorName?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function BookingDialog({
  open,
  mode,
  tutors = [],
  selectedTutorId = "",
  onTutorChange,
  cancelTutorName = "",
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Book a Tutor" : "Cancel Booking"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Select a tutor to book a session."
              : `Cancel your booking with ${cancelTutorName}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {mode === "create" ? (
            <div className="space-y-1.5">
              <Label>Select Tutor</Label>
              {tutors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No available tutors at the moment.
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {tutors.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onTutorChange?.(t.id)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                        selectedTutorId === t.id
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-100 hover:bg-zinc-50"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {t.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.category?.name ?? "General"} · ৳{t.hourlyRate}/hr
                        </p>
                      </div>
                      <div className="text-xs text-yellow-600 font-semibold shrink-0">
                        ★ {Number(t.averageRating).toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to cancel your booking with{" "}
                <span className="font-semibold text-foreground">
                  {cancelTutorName}
                </span>
                ?
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                ⚠️ Only PENDING bookings can be cancelled.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {mode === "create" ? "Cancel" : "Keep It"}
          </Button>
          <Button
            variant={mode === "cancel" ? "destructive" : "default"}
            onClick={onSubmit}
            disabled={isSubmitting || (mode === "create" && !selectedTutorId)}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Confirm Booking"
                : "Yes, Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
