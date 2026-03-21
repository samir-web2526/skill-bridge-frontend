/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Loader2 } from "lucide-react";
import { FormattedTutor } from "./TutorCard";
import { createBooking } from "@/services/booking.service";
import { toast } from "sonner";

type Props = {
  tutor: FormattedTutor | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function BookingModal({ tutor, onClose, onSuccess }: Props) {
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!tutor) return null;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!date) return setError("Please select a date");

    setIsLoading(true);
    setError(null);

    try {
      await createBooking({
        tutorId: tutor.id,
        date: new Date(date).toISOString(),
      });

      toast.success("Booking confirmed!", {
        description: `Session with ${tutor.user.name} booked successfully.`,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err.message || "Something went wrong";
      setError(message);
      toast.error("Booking failed!", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!tutor} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm gap-0 p-0 overflow-hidden">
        <div className="px-6 pt-5 pb-4 bg-muted/30">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Book a Session
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
              {tutor.user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {tutor.user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {tutor.category.name} · ৳{tutor.hourlyRate}/hr
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Select Date
            </Label>
            <Input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 text-sm"
            />
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-10 font-semibold"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
