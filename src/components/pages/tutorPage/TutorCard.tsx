"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { TutorProfile } from "@/services/tutors.service";

export type FormattedTutor = {
  id: string;
  name: string;
  email: string;
  bio: string;
  hourlyRate: number;
  isAvailable: boolean;
  totalBookings: number;
  rating: number;
  category: string;
  experience: number;
};

export const formatTutor = (tutor: TutorProfile): FormattedTutor => ({
  id: tutor.id,
  name: tutor.user.name,
  email: tutor.user.email,
  bio: tutor.bio,
  hourlyRate: Number(tutor.hourlyRate),
  isAvailable: tutor.isAvailable,
  totalBookings: tutor.totalReview ?? 0,
  rating: tutor.averageRating ?? 0,
  category: tutor.category?.name ?? "N/A",
  experience: Number(tutor.experience),
});

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
  const color = getCategoryColor(tutor.category);
const initials = getInitials(tutor.name);

  return (
    <Card
      onClick={() => onSelect(tutor)}
      className="cursor-pointer border border-border hover:-translate-y-0.5 transition"
    >
      <CardContent className="p-5">
        <div className="flex gap-3">
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color.bg}`}>
            {initials}
          </div>

          <div className="flex-1">
            <p className="font-semibold">{tutor.name}</p>
            <p className={`text-sm ${color.text}`}>{tutor.category}</p>

            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {tutor.bio}
            </p>

            <div className="mt-3 flex justify-between text-sm">
              <span>৳{tutor.hourlyRate}/hr</span>
              <span>⭐ {tutor.rating.toFixed(1)}</span>
              <span>👥 {tutor.totalBookings}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}