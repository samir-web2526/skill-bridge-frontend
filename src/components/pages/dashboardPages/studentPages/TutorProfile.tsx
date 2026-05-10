/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

type Props = {
  open: boolean;
  tutor: any | null;
  onClose: () => void;
  onBook?: () => void;
};

function TutorAvatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";
  return (
    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 text-sm font-extrabold flex items-center justify-center shrink-0">
      {initials}
    </div>
  );
}
function MiniStat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) {
  return (
    <div className="bg-zinc-50 border border-border rounded-xl px-3 py-2.5 text-center">
      <p className={`text-sm font-extrabold ${valueClass ?? "text-foreground"}`}>
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
export function TutorProfileDialog({ open, tutor, onClose, onBook }: Props) {
  if (!tutor) return null;

  const isAvailable = tutor.isAvailable;
  const rounded = Math.round(tutor.averageRating);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border border-border">
        <DialogHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center gap-3 mb-3">
            <TutorAvatar name={tutor.user?.name ?? "?"} />
            <div className="min-w-0">
              <DialogTitle className="text-base font-extrabold tracking-tight text-foreground">
                {tutor.user?.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground truncate">
                {tutor.user?.email}
              </p>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isAvailable
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-zinc-100 text-muted-foreground border-border"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                    }`}
                />
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
          <div className="h-px bg-zinc-100" />
        </DialogHeader>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <div>
              <p className="text-3xl font-extrabold text-emerald-600 leading-none">
                {Number(tutor.averageRating).toFixed(1)}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">
                Overall rating
              </p>
            </div>
            <div className="text-right">
              <div className="flex gap-0.5 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 12 12">
                    <polygon
                      points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,9 2.5,11 3.5,7 1,4.5 4.5,4.5"
                      fill={i < rounded ? "#fbbf24" : "#d1fae5"}
                    />
                  </svg>
                ))}
              </div>
              <p className="text-[11px] text-emerald-600 mt-1">
                Based on {tutor.totalReview} reviews
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Category" value={tutor.category?.name ?? "—"} />
            <MiniStat
              label="Per hour"
              value={tutor.hourlyRate ? `৳${tutor.hourlyRate}` : "—"}
              valueClass="text-emerald-700"
            />
            <MiniStat
              label="Experience"
              value={tutor.experience ? `${tutor.experience} yrs` : "—"}
            />
          </div>

          {tutor.totalBookings !== undefined && (
            <div className="flex items-center justify-between bg-zinc-50 border border-border rounded-xl px-4 py-2.5">
              <span className="text-xs text-muted-foreground font-medium">
                Total sessions completed
              </span>
              <span className="text-sm font-extrabold text-zinc-700">
                {tutor.totalBookings}
              </span>
            </div>
          )}

          {tutor.bio && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1.5">
                About
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tutor.bio}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 bg-zinc-50 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-zinc-600 hover:bg-zinc-100 rounded-xl text-sm font-semibold"
          >
            Close
          </Button>

          {isAvailable && (
            <Button
              onClick={onBook}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold px-5 flex items-center gap-2 shadow-sm shadow-emerald-100"
            >
              <BookOpen size={13} />
              Book session
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
