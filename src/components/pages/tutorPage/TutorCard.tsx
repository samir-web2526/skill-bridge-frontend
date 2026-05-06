"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { TutorProfile } from "@/services/tutors.service";

export interface FormattedTutor {
  id: string;
  bio: string;
  hourlyRate: number;
  experience: number;

  totalBookings: number;
  averageRating: number;
  totalReview:number;

  availablity: boolean;
  availableFrom: string;
  availableTo: string;

  category: {
    id: string;
    name: string;
  } | null;

  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    status: string;
  };
}

export const formatTutor = (tutor: TutorProfile): FormattedTutor => ({
  id: tutor.id,
  bio: tutor.bio,
  hourlyRate: Number(tutor.hourlyRate),
  experience: Number(tutor.experience),

  totalBookings: tutor.totalBookings ?? 0,
  averageRating: tutor.averageRating ?? 0,
  totalReview: tutor.totalReview ?? 0,
  availablity: tutor.availability,
  availableFrom: tutor.availableFrom ?? "",
  availableTo: tutor.availableTo ?? "",

  category: tutor.category
    ? {
        id: tutor.category.id,
        name: tutor.category.name,
      }
    : null,

  user: tutor.user,
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
  const color = getCategoryColor(tutor.category?.name ?? "default");
  const initials = getInitials(tutor?.user?.name);

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
            <p className="font-semibold">{tutor?.user?.name}</p>
            <p className={`text-sm ${color.text}`}>{tutor?.category?.name}</p>

            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {tutor.bio}
            </p>

            <div className="mt-3 flex justify-between text-sm">
              <span>৳{tutor.hourlyRate}/hr</span>
              <span>⭐ {tutor.averageRating}</span>
              <span>👥 {tutor.totalBookings}</span>
              <span>💬 {tutor.totalReview}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}