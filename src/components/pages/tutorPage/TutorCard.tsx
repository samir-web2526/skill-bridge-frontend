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
  const shadow = color.shadowHex;

  return (
    <Card
      onClick={() => onSelect(tutor)}
      className="cursor-pointer border border-border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: `0 1px 3px 0 ${shadow}99`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 8px 24px -4px ${shadow}, 0 2px 8px -2px ${shadow}cc`;
        (e.currentTarget as HTMLElement).style.borderColor = shadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 1px 3px 0 ${shadow}99`;
        (e.currentTarget as HTMLElement).style.borderColor = "";
      }}
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
                <p className="font-semibold text-base text-foreground truncate leading-tight">
                  {tutor.user.name}
                </p>
                <p className={`text-sm font-medium mt-0.5 ${color.text}`}>
                  {tutor.category.name}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge
                  variant={tutor.isAvailable ? "default" : "secondary"}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border-0 ${
                    tutor.isAvailable
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {tutor.isAvailable ? "Available" : "Unavailable"}
                </Badge>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-800">
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
          <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
            {tutor.bio}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-border grid grid-cols-4 gap-2">
          <div>
            <p className="font-bold text-base text-foreground">
              ৳{tutor.hourlyRate}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">per hour</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="font-semibold text-sm text-foreground">
                {tutor.experience}y
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">exp</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="font-semibold text-sm text-foreground">
                {tutor.totalReview}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">reviews</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="font-semibold text-sm text-foreground">
                {tutor.totalBookings}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">sessions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
