"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { Star, Clock, Users } from "lucide-react";

export type FormattedTutor = {
  id: string;
  bio: string | null;
  hourlyRate: number;
  experience: number;
  isAvailable: boolean;
  category: { id: string; name: string; description: string | null };
  user: { id: string; name: string; image: string | null; email: string };
  totalBookings: number;
  totalReview: number;
  averageRating: number;
};

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Props = {
  tutor: FormattedTutor;
  onSelect: (tutor: FormattedTutor) => void;
};

export function TutorCard({ tutor, onSelect }: Props) {
  const color = getCategoryColor(tutor.category.name);
  const initials = getInitials(tutor.user.name);

  return (
    <Card
      onClick={() => onSelect(tutor)}
      className="cursor-pointer border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <CardContent className="p-5">
        <div className="flex gap-3 items-start">
          {tutor.user.image ? (
            <img
              src={tutor.user.image}
              alt={tutor.user.name}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-base ${color.bg} ${color.text}`}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {tutor.user.name}
                </p>

                <p className={`text-xs font-medium mt-0.5 ${color.text}`}>
                  {tutor.category.name}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge
                  variant={tutor.isAvailable ? "default" : "secondary"}
                  className={`text-[10px] px-2 py-0.5 ${
                    tutor.isAvailable
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {tutor.isAvailable ? "Available" : "Unavailable"}
                </Badge>

                <div className="flex items-center gap-1 bg-amber-50 rounded-md px-1.5 py-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-foreground">
                    {tutor.averageRating > 0
                      ? tutor.averageRating.toFixed(1)
                      : "New"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {tutor.bio && (
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {tutor.bio}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-border grid grid-cols-4 gap-2">
          <div>
            <p className="font-bold text-sm text-foreground">
              ৳{tutor.hourlyRate}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">per hour</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <p className="font-bold text-sm text-foreground">
                {tutor.experience}y
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">exp</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-muted-foreground" />
              <p className="font-bold text-sm text-foreground">
                {tutor.totalReview}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">reviews</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <p className="font-bold text-sm text-foreground">
                {tutor.totalBookings}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">sessions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
