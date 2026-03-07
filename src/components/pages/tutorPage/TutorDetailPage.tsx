"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Users, Clock, BookOpen, ArrowLeft } from "lucide-react";
import { FormattedTutor } from "./TutorCard";
import { BookingModal } from "./BookingModal";
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
  tutor: FormattedTutor;
};

export default function TutorDetailPage({ tutor }: Props) {
  const router = useRouter();
  const color = getCategoryColor(tutor.category.name);
  const initials = getInitials(tutor.user.name);

  const [showBooking, setShowBooking] = useState(false);

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
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tutors
        </button>

        <div className={`${color.bg} rounded-2xl px-6 py-6 mb-4`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {tutor.user.image ? (
                <img
                  src={tutor.user.image}
                  alt={tutor.user.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl bg-white shadow-sm ${color.text}`}
                >
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {tutor.user.name}
                </h1>
                <p className={`text-sm font-medium mt-1 ${color.text}`}>
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
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-muted/40 rounded-xl p-3 flex flex-col items-center gap-1"
            >
              <span className="text-muted-foreground">{s.icon}</span>
              <p className="font-bold text-sm text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {tutor.bio && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              About
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tutor.bio}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex items-center justify-between bg-muted/40 rounded-2xl px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Session Rate
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              ৳{tutor.hourlyRate}
              <span className="text-sm font-normal text-muted-foreground">
                /hr
              </span>
            </p>
          </div>

          <Button
            onClick={() => setShowBooking(true)}
            disabled={!tutor.isAvailable}
            className="h-11 px-6 font-semibold"
          >
            {tutor.isAvailable ? "Book a Session" : "Unavailable"}
          </Button>
        </div>
      </div>

      <BookingModal
        tutor={showBooking ? tutor : null}
        onClose={() => setShowBooking(false)}
        onSuccess={() => {
          setShowBooking(false);
          router.push("/tutors");
        }}
      />
    </div>
  );
}
