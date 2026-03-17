"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

type Props = {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutor: any | null;
  onClose: () => void;
};

export function TutorProfileDialog({ open, tutor, onClose }: Props) {
  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tutor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name + badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-foreground">{tutor.user?.name}</p>
              <p className="text-sm text-muted-foreground">{tutor.user?.email}</p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {tutor.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Category",      value: tutor.category?.name ?? "—" },
              { label: "Hourly Rate",   value: tutor.hourlyRate ? `৳${tutor.hourlyRate}` : "—" },
              { label: "Experience",    value: tutor.experience ? `${tutor.experience} yrs` : "—" },
              { label: "Total Sessions",value: tutor.totalBookings ?? "—" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{Number(tutor.averageRating).toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({tutor.totalReview} reviews)</span>
          </div>

          {/* Bio */}
          {tutor.bio && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">About</p>
              <p className="text-sm text-foreground leading-relaxed">{tutor.bio}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}