"use client";

import { Star, Users, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { TutorProfile } from "@/services/tutors.service";
import Image from "next/image";

export interface FormattedTutor {
  id: string;
  bio: string;
  hourlyRate: number;
  experience: number;

  totalBookings: number;
  averageRating: number;
  totalReview: number;

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
  availablity: tutor.availability ?? (tutor as any).availablity ?? (tutor as any).isAvailable ?? (tutor as any).isAdvailable ?? false,
  availableFrom: tutor.availableFrom ?? "",
  availableTo: tutor.availableTo ?? "",

  category: tutor.category
    ? {
        id: tutor.category.id,
        name: tutor.category.name,
      }
    : null,

  user: {
    ...tutor.user,
    image: tutor.user.image === "https://example.com/avatar.png" ? null : tutor.user.image
  },
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
  const isAvailable = tutor.availablity;

  return (
    <Card
      onClick={() => onSelect(tutor)}
      className="cursor-pointer border border-border hover:-translate-y-0.5 transition-all duration-150"
    >
      <CardContent className="p-5">
        <div className="flex gap-3.5 items-start">
          {/* Avatar */}
          <div className="w-12 h-12 shrink-0">
            <Image
              src={tutor.user.image || `https://i.pravatar.cc/256?u=${tutor.id}`}
              alt={tutor.user.name}
              width={48}
              height={48}
              className="object-cover w-full h-full rounded-full border border-border"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-[15px] leading-tight">{tutor?.user?.name}</p>
                <p className={`text-xs font-medium mt-0.5 flex items-center gap-1 ${color.text}`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  {tutor?.category?.name}
                </p>
              </div>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed line-clamp-2">
              {tutor.bio || "No bio available"}
            </p>

            {/* Divider + Stats */}
            <div className="border-t border-border mt-3 pt-3 flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {tutor.averageRating > 0 ? tutor.averageRating.toFixed(1) : "New"}
                </span>
                <span>({tutor.totalReview})</span>
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} />
                {tutor.totalBookings} sessions
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {tutor.experience} yrs
              </span>
              <span className={`ml-auto text-[18px] font-medium leading-none ${color.text}`}>
                ৳{tutor.hourlyRate}
                <span className="text-xs font-normal text-muted-foreground">/hr</span>
              </span>
            </div>

            {/* Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`mt-3 w-full text-xs font-medium h-9 rounded-lg ${color.bg} ${color.text} hover:opacity-80`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(tutor);
              }}
            >
              View details
              <ArrowRight size={13} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}