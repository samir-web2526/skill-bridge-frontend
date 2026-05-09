"use client";

import { Star, Users, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const isAvailable = tutor.availablity;

  return (
    <Card
      onClick={() => onSelect(tutor)}
      className="group cursor-pointer border border-border hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col hover:shadow-lg"
    >
      <CardHeader className="p-0 relative h-40 shrink-0 overflow-hidden rounded-t-xl bg-muted">
        <Image
          src={tutor.user.image || `https://i.pravatar.cc/256?u=${tutor.id}`}
          alt={tutor.user.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md ${
                isAvailable
                  ? "bg-primary text-primary-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}
          >
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            {isAvailable ? "Available" : "Busy"}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 dark:bg-zinc-900/90 text-foreground border-none text-[10px] font-bold shadow-sm backdrop-blur-sm">
            {tutor?.category?.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <p className="font-bold text-base leading-tight group-hover:text-primary transition-colors truncate">
            {tutor?.user?.name}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={12} className="fill-current" />
              <span className="text-xs font-bold">{tutor.averageRating > 0 ? tutor.averageRating.toFixed(1) : "New"}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">({tutor.totalReview} reviews)</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
          {tutor.bio || `Expert tutor specialized in ${tutor.category?.name ?? "education"} with ${tutor.experience} years of teaching experience.`}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-border">
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Experience</p>
            <p className="text-xs font-bold">{tutor.experience} Years</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Bookings</p>
            <p className="text-xs font-bold">{tutor.totalBookings} Students</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rate</p>
            <p className="text-lg font-extrabold text-foreground leading-none">
              ৳{tutor.hourlyRate}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">/hr</span>
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold h-9 px-4"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}