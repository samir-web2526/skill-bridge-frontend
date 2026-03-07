"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import type { FormattedTutor } from "./TutorCard";
import { getCategoryColor } from "@/lib/category/categoryColors";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Props = {
  tutor: FormattedTutor | null;
  onClose: () => void;
  onBook: (tutor: FormattedTutor) => void;
};

export function TutorProfile({ tutor, onClose, onBook }: Props) {
  if (!tutor) return null;

  const color = getCategoryColor(tutor.category.name);
  const initials = getInitials(tutor.user.name);

  const stats = [
    {
      icon: <Star className="w-4 h-4" />,
      label: "Rating",
      value: tutor.averageRating > 0 ? tutor.averageRating.toFixed(1) : "New",
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Reviews",
      value: tutor.totalReview,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Sessions",
      value: tutor.totalBookings,
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Experience",
      value: `${tutor.experience}y`,
    },
  ];

  return (
    <Dialog open={!!tutor} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        <div className={`${color.bg} px-6 pt-6 pb-5`}>
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {tutor.user.image ? (
                  <img
                    src={tutor.user.image}
                    alt={tutor.user.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl bg-white shadow-sm ${color.text}`}
                  >
                    {initials}
                  </div>
                )}

                <div>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {tutor.user.name}
                  </DialogTitle>

                  <p className={`text-sm font-medium mt-0.5 ${color.text}`}>
                    {tutor.category.name} · {tutor.experience} yrs exp
                  </p>
                </div>
              </div>

              <Badge
                className={`shrink-0 text-xs ${
                  tutor.isAvailable
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-100 text-red-700 hover:bg-red-100"
                }`}
              >
                {tutor.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {tutor.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tutor.bio}
            </p>
          )}

          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-muted/50 rounded-xl p-3 flex flex-col items-center gap-1"
              >
                <span className="text-muted-foreground">{s.icon}</span>
                <p className="font-bold text-sm text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span className="text-sm text-muted-foreground font-medium">
              Session Rate
            </span>
            <span className="text-xl font-bold text-foreground">
              ৳{tutor.hourlyRate}
              <span className="text-sm font-normal text-muted-foreground">
                /hr
              </span>
            </span>
          </div>

          <Button
            onClick={() => tutor.isAvailable && onBook(tutor)}
            disabled={!tutor.isAvailable}
            className="w-full h-11 font-semibold text-sm"
          >
            {tutor.isAvailable
              ? `Book a Session — ৳${tutor.hourlyRate}/hr`
              : "Currently Unavailable"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
